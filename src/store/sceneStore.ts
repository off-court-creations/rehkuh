import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  SceneObject,
  SelectionState,
  TransformMode,
  PrimitiveType,
  MaterialProps,
} from "@/types";

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

// Debounced save to file
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
const saveToFile = (objects: Record<string, SceneObject>) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    // Convert to file format (use names for parent references)
    const fileObjects: SceneFileObject[] = Object.values(objects).map(
      (obj) => ({
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
      }),
    );

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
        const fileObjects: SceneFileObject[] = await res.json();

        if (!Array.isArray(fileObjects) || fileObjects.length === 0) {
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
      } catch {
        set({ isLoaded: true });
      }
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
      const existing = get().objects[id];
      if (!existing) return;

      const descendants = get().getDescendants(id);
      if (newParentId && descendants.some((d) => d.id === newParentId)) {
        return;
      }
      if (newParentId === id) {
        return;
      }

      set((state) => ({
        objects: {
          ...state.objects,
          [id]: { ...existing, parentId: newParentId },
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
