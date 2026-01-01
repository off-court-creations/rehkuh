import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Matrix4, Vector3, Quaternion, Euler } from "three";
import type {
  SceneObject,
  SelectionState,
  TransformMode,
  PrimitiveType,
  MaterialProps,
} from "@/types";
import { validateSceneFile, validateParentReferences } from "@/schemas/scene";
import { showError } from "@/store/notificationStore";

type TransformModeState = TransformMode | null;

// Scene file format (what gets saved to scene/scene.json)
interface SceneFileObject {
  name: string;
  type: PrimitiveType | "group";
  parent?: string | undefined; // parent name, not id
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  material?: MaterialProps | undefined;
}

interface SceneState {
  objects: Record<string, SceneObject>;
  selection: SelectionState;
  transformMode: TransformModeState;
  isLoaded: boolean;

  // Lifecycle
  loadScene: () => Promise<void>;
  serializeScene: () => string;
  clearScene: () => void;

  // Object actions
  addObject: (
    obj: Omit<SceneObject, "id"> | { type: PrimitiveType | "group" },
  ) => string;
  removeObject: (id: string) => void;
  updateObject: (id: string, partial: Partial<SceneObject>) => void;

  // Hierarchy
  reparentObject: (id: string, newParentId: string | null) => void;
  getChildren: (parentId: string | null) => SceneObject[];
  getDescendants: (id: string) => SceneObject[];

  // Selection
  select: (id: string, additive?: boolean) => void;
  deselect: (id: string) => void;
  clearSelection: () => void;

  // Transform mode
  setTransformMode: (mode: TransformModeState) => void;
}

const defaultMaterial: MaterialProps = {
  color: "#4bd0d2",
  metalness: 0.2,
  roughness: 0.4,
};

let objectCounter = 0;

function toSceneFileObjects(
  objects: Record<string, SceneObject>,
): SceneFileObject[] {
  return Object.values(objects).map((obj) => ({
    name: obj.name,
    type: obj.type,
    parent: obj.parentId ? objects[obj.parentId]?.name : undefined,
    position: obj.position.map((n) => Math.round(n * 1000) / 1000) as [
      number,
      number,
      number,
    ],
    rotation: obj.rotation.map((n) => Math.round(n * 1000) / 1000) as [
      number,
      number,
      number,
    ],
    scale: obj.scale.map((n) => Math.round(n * 1000) / 1000) as [
      number,
      number,
      number,
    ],
    material: obj.type !== "group" ? obj.material : undefined,
  }));
}

// Helper: compute world matrix by walking up parent chain
function getWorldMatrix(
  objectId: string,
  objects: Record<string, SceneObject>,
): Matrix4 {
  const obj = objects[objectId];
  if (!obj) return new Matrix4();

  const localMatrix = new Matrix4();
  localMatrix.compose(
    new Vector3(...obj.position),
    new Quaternion().setFromEuler(new Euler(...obj.rotation)),
    new Vector3(...obj.scale),
  );

  if (obj.parentId) {
    const parentWorld = getWorldMatrix(obj.parentId, objects);
    return parentWorld.clone().multiply(localMatrix);
  }

  return localMatrix;
}

// Helper: decompose matrix to position, rotation, scale
function decomposeMatrix(matrix: Matrix4): {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
} {
  const pos = new Vector3();
  const quat = new Quaternion();
  const scl = new Vector3();
  matrix.decompose(pos, quat, scl);
  const euler = new Euler().setFromQuaternion(quat);

  return {
    position: [pos.x, pos.y, pos.z],
    rotation: [euler.x, euler.y, euler.z],
    scale: [scl.x, scl.y, scl.z],
  };
}

// Debounced save to file
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
const saveToFile = (objects: Record<string, SceneObject>) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const fileObjects = toSceneFileObjects(objects);

    fetch("/__scene", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fileObjects, null, 2),
    }).catch(() => {});
  }, 300);
};

export const useSceneStore = create<SceneState>()(
  subscribeWithSelector((set, get) => ({
    objects: {},
    selection: { selectedIds: [], primaryId: null },
    transformMode: null,
    isLoaded: false,

    loadScene: async () => {
      try {
        const res = await fetch("/__scene");
        const rawData = await res.json();

        // Validate JSON structure
        const validation = validateSceneFile(rawData);
        if (!validation.success) {
          showError(`Scene validation failed: ${validation.error}`);
          set({ isLoaded: true });
          return;
        }

        const fileObjects = validation.data;

        if (fileObjects.length === 0) {
          set({ isLoaded: true });
          return;
        }

        // Validate parent references
        const parentValidation = validateParentReferences(fileObjects);
        if (!parentValidation.success) {
          showError(`Scene validation failed: ${parentValidation.error}`);
          set({ isLoaded: true });
          return;
        }

        // First pass: create all objects without parent links
        const nameToId: Record<string, string> = {};
        const newObjects: Record<string, SceneObject> = {};

        for (const fo of fileObjects) {
          const id = crypto.randomUUID();
          objectCounter++;
          nameToId[fo.name] = id;
          newObjects[id] = {
            id,
            name: fo.name,
            type: fo.type,
            parentId: null, // Set in second pass
            position: fo.position,
            rotation: fo.rotation,
            scale: fo.scale,
            material: fo.material ?? { ...defaultMaterial },
            visible: true,
            locked: false,
          };
        }

        // Second pass: link parents by name
        for (const fo of fileObjects) {
          const parentName = fo.parent;
          const parentId = parentName ? nameToId[parentName] : undefined;
          const id = nameToId[fo.name];
          if (id && parentId && newObjects[id]) {
            newObjects[id].parentId = parentId;
          }
        }

        set({ objects: newObjects, isLoaded: true });
      } catch (err) {
        showError(
          `Failed to load scene: ${err instanceof Error ? err.message : String(err)}`,
        );
        set({ isLoaded: true });
      }
    },

    serializeScene: () => {
      const fileObjects = toSceneFileObjects(get().objects);
      return JSON.stringify(fileObjects, null, 2);
    },

    clearScene: () => {
      set((state) => ({
        ...state,
        objects: {},
        selection: { selectedIds: [], primaryId: null },
        transformMode: null,
      }));
    },

    addObject: (objData) => {
      const id = crypto.randomUUID();
      objectCounter++;

      const isMinimal = !("name" in objData);
      const obj: SceneObject = isMinimal
        ? {
            id,
            name: `${objData.type}_${objectCounter}`,
            type: objData.type,
            parentId: null,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            material: { ...defaultMaterial },
            visible: true,
            locked: false,
          }
        : { ...(objData as Omit<SceneObject, "id">), id };

      set((state) => ({
        objects: { ...state.objects, [id]: obj },
      }));
      return id;
    },

    removeObject: (id) => {
      const descendants = get().getDescendants(id);
      const idsToRemove = [id, ...descendants.map((d) => d.id)];

      set((state) => {
        const newObjects = { ...state.objects };
        idsToRemove.forEach((rid) => delete newObjects[rid]);

        const newSelectedIds = state.selection.selectedIds.filter(
          (sid) => !idsToRemove.includes(sid),
        );
        const newPrimaryId = idsToRemove.includes(
          state.selection.primaryId ?? "",
        )
          ? (newSelectedIds[0] ?? null)
          : state.selection.primaryId;

        return {
          objects: newObjects,
          selection: { selectedIds: newSelectedIds, primaryId: newPrimaryId },
        };
      });
    },

    updateObject: (id, partial) => {
      set((state) => {
        const existing = state.objects[id];
        if (!existing) return state;
        return {
          objects: {
            ...state.objects,
            [id]: { ...existing, ...partial },
          },
        };
      });
    },

    reparentObject: (id, newParentId) => {
      const objects = get().objects;
      const existing = objects[id];
      if (!existing) return;

      // Prevent circular references
      const descendants = get().getDescendants(id);
      if (newParentId && descendants.some((d) => d.id === newParentId)) {
        return;
      }
      if (newParentId === id) {
        return;
      }

      // Skip if parent isn't changing
      if (existing.parentId === newParentId) {
        return;
      }

      // Get current world transform
      const worldMatrix = getWorldMatrix(id, objects);

      // Compute new local transform relative to new parent
      let newLocalTransform: {
        position: [number, number, number];
        rotation: [number, number, number];
        scale: [number, number, number];
      };

      if (newParentId) {
        // Get new parent's world matrix and invert it
        const parentWorldMatrix = getWorldMatrix(newParentId, objects);
        const parentWorldInverse = parentWorldMatrix.clone().invert();
        // Local = ParentInverse * World
        const localMatrix = parentWorldInverse.multiply(worldMatrix);
        newLocalTransform = decomposeMatrix(localMatrix);
      } else {
        // No parent, world transform becomes local transform
        newLocalTransform = decomposeMatrix(worldMatrix);
      }

      set((state) => ({
        objects: {
          ...state.objects,
          [id]: {
            ...existing,
            parentId: newParentId,
            position: newLocalTransform.position,
            rotation: newLocalTransform.rotation,
            scale: newLocalTransform.scale,
          },
        },
      }));
    },

    getChildren: (parentId) => {
      const objs = get().objects;
      return Object.values(objs).filter((o) => o.parentId === parentId);
    },

    getDescendants: (id) => {
      const result: SceneObject[] = [];
      const children = get().getChildren(id);

      for (const child of children) {
        result.push(child);
        result.push(...get().getDescendants(child.id));
      }
      return result;
    },

    select: (id, additive = false) => {
      set((state) => {
        if (additive) {
          const alreadySelected = state.selection.selectedIds.includes(id);
          if (alreadySelected) {
            const newSelectedIds = state.selection.selectedIds.filter(
              (sid) => sid !== id,
            );
            return {
              selection: {
                selectedIds: newSelectedIds,
                primaryId: newSelectedIds[0] ?? null,
              },
            };
          }
          return {
            selection: {
              selectedIds: [...state.selection.selectedIds, id],
              primaryId: id,
            },
          };
        }
        return {
          selection: { selectedIds: [id], primaryId: id },
        };
      });
    },

    deselect: (id) => {
      set((state) => ({
        selection: {
          selectedIds: state.selection.selectedIds.filter((sid) => sid !== id),
          primaryId:
            state.selection.primaryId === id
              ? (state.selection.selectedIds.filter((sid) => sid !== id)[0] ??
                null)
              : state.selection.primaryId,
        },
      }));
    },

    clearSelection: () => {
      set({ selection: { selectedIds: [], primaryId: null } });
    },

    setTransformMode: (mode) => {
      set({ transformMode: mode });
    },
  })),
);

// Auto-save when objects change
useSceneStore.subscribe(
  (state) => state.objects,
  (objects) => {
    if (useSceneStore.getState().isLoaded) {
      saveToFile(objects);
    }
  },
);
