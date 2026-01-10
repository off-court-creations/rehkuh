import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Matrix4, Vector3, Quaternion, Euler } from "three";
import type {
  SceneObject,
  SelectionState,
  TransformMode,
  PrimitiveType,
  MaterialProps,
  TSPShapePath,
  TSPCurve3D,
  TSPExtrudeOptions,
} from "@/types";
import { validateSceneFile, validateParentReferences } from "@/schemas/scene";
import { showError } from "@/store/notificationStore";
import { exportToTSP, serializeTSP } from "@/export/tspExporter";
import { importFromTSP } from "@/export/tspImporter";
import type { TSPFile } from "@/types";

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
  // Complex geometry data
  points?: [number, number][];
  shape?: TSPShapePath;
  extrudeOptions?: TSPExtrudeOptions;
  path?: TSPCurve3D;
  tubeRadius?: number;
  vertices?: number[];
  indices?: number[];
}

interface HistoryState {
  past: Record<string, SceneObject>[];
  future: Record<string, SceneObject>[];
}

interface SceneState {
  objects: Record<string, SceneObject>;
  selection: SelectionState;
  transformMode: TransformModeState;
  isLoaded: boolean;
  isDragging: boolean;

  // History
  history: HistoryState;
  transactionSnapshot: Record<string, SceneObject> | null;

  // Lifecycle
  loadScene: () => Promise<void>;
  loadFromTSP: (tspData: TSPFile) => Promise<void>;
  serializeScene: () => string;
  serializeSceneAsTSP: () => string;
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

  // Dragging state (prevents click-to-select during gizmo drag)
  setIsDragging: (value: boolean) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  beginTransaction: () => void;
  commitTransaction: () => void;
  cancelTransaction: () => void;
}

const defaultMaterial: MaterialProps = {
  color: "#4bd0d2",
  metalness: 0.2,
  roughness: 0.4,
};

// Helper to convert scene file material to internal MaterialProps
function toMaterialProps(mat: MaterialProps | undefined): MaterialProps {
  if (!mat) return { ...defaultMaterial };

  // Handle shader material
  if (mat.type === "shader") {
    return mat;
  }

  // Handle physical material - preserve all properties
  if (mat.type === "physical") {
    return mat;
  }

  // Handle standard material - strip undefined type
  const result: MaterialProps = {
    color: mat.color,
    metalness: mat.metalness,
    roughness: mat.roughness,
  };
  return result;
}

const HISTORY_LIMIT = 50;

// Helper to load shader files for a shader material
async function loadShaderFiles(
  shaderName: string,
): Promise<{ vert: string; frag: string }> {
  try {
    const res = await fetch(`/__shader/${shaderName}`);
    return await res.json();
  } catch {
    return { vert: "", frag: "" };
  }
}

let objectCounter = 0;

function toSceneFileObjects(
  objects: Record<string, SceneObject>,
): SceneFileObject[] {
  return Object.values(objects).map((obj) => {
    const fileObj: SceneFileObject = {
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
    };
    // Include complex geometry data if present
    if (obj.points) fileObj.points = obj.points;
    if (obj.shape) fileObj.shape = obj.shape;
    if (obj.extrudeOptions) fileObj.extrudeOptions = obj.extrudeOptions;
    if (obj.path) fileObj.path = obj.path;
    if (obj.tubeRadius !== undefined) fileObj.tubeRadius = obj.tubeRadius;
    if (obj.vertices) fileObj.vertices = obj.vertices;
    if (obj.indices) fileObj.indices = obj.indices;
    return fileObj;
  });
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
    isDragging: false,
    history: { past: [], future: [] },
    transactionSnapshot: null,

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
          const sceneObject: SceneObject = {
            id,
            name: fo.name,
            type: fo.type,
            parentId: null, // Set in second pass
            position: fo.position,
            rotation: fo.rotation,
            scale: fo.scale,
            material: toMaterialProps(fo.material as MaterialProps | undefined),
            visible: true,
            locked: false,
          };
          // Complex geometry data - only assign if defined
          if (fo.points) sceneObject.points = fo.points;
          if (fo.shape) sceneObject.shape = fo.shape as TSPShapePath;
          if (fo.extrudeOptions)
            sceneObject.extrudeOptions = fo.extrudeOptions as TSPExtrudeOptions;
          if (fo.path) sceneObject.path = fo.path as TSPCurve3D;
          if (fo.tubeRadius !== undefined)
            sceneObject.tubeRadius = fo.tubeRadius;
          if (fo.vertices) sceneObject.vertices = fo.vertices;
          if (fo.indices) sceneObject.indices = fo.indices;
          newObjects[id] = sceneObject;
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

        // Third pass: load shader files for shader materials
        const shaderLoadPromises: Promise<void>[] = [];
        for (const obj of Object.values(newObjects)) {
          if (obj.material?.type === "shader" && obj.material.shaderName) {
            const shaderName = obj.material.shaderName;
            shaderLoadPromises.push(
              loadShaderFiles(shaderName).then(({ vert, frag }) => {
                if (obj.material?.type === "shader") {
                  obj.material.vertex = vert;
                  obj.material.fragment = frag;
                }
              }),
            );
          }
        }
        await Promise.all(shaderLoadPromises);

        set({
          objects: newObjects,
          isLoaded: true,
          history: { past: [], future: [] },
          transactionSnapshot: null,
        });
      } catch (err) {
        showError(
          `Failed to load scene: ${err instanceof Error ? err.message : String(err)}`,
        );
        set({ isLoaded: true });
      }
    },

    loadFromTSP: async (tspData: TSPFile) => {
      const state = get();
      const { objects: newObjects, extractedShaders } = importFromTSP(tspData);

      // Write extracted shaders to files so they can be edited
      for (const shader of extractedShaders) {
        try {
          await fetch(`/__shader-write/${shader.name}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              vert: shader.vertex,
              frag: shader.fragment,
            }),
          });
        } catch (err) {
          console.warn(`Failed to write shader ${shader.name}:`, err);
        }
      }

      // Push current state to history
      const newPast = [...state.history.past, state.objects].slice(
        -HISTORY_LIMIT,
      );

      set({
        objects: newObjects,
        selection: { selectedIds: [], primaryId: null },
        transformMode: null,
        history: { past: newPast, future: [] },
        transactionSnapshot: null,
      });
    },

    serializeScene: () => {
      const fileObjects = toSceneFileObjects(get().objects);
      return JSON.stringify(fileObjects, null, 2);
    },

    serializeSceneAsTSP: () => {
      const tspData = exportToTSP(get().objects);
      return serializeTSP(tspData);
    },

    clearScene: () => {
      const state = get();
      // Push to history if not in a transaction
      if (!state.transactionSnapshot) {
        const newPast = [...state.history.past, state.objects].slice(
          -HISTORY_LIMIT,
        );
        set({
          objects: {},
          selection: { selectedIds: [], primaryId: null },
          transformMode: null,
          history: { past: newPast, future: [] },
        });
      } else {
        set({
          objects: {},
          selection: { selectedIds: [], primaryId: null },
          transformMode: null,
        });
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

      const state = get();
      if (!state.transactionSnapshot) {
        const newPast = [...state.history.past, state.objects].slice(
          -HISTORY_LIMIT,
        );
        set({
          objects: { ...state.objects, [id]: obj },
          history: { past: newPast, future: [] },
        });
      } else {
        set({ objects: { ...state.objects, [id]: obj } });
      }
      return id;
    },

    removeObject: (id) => {
      const state = get();
      const descendants = state.getDescendants(id);
      const idsToRemove = [id, ...descendants.map((d) => d.id)];

      const newObjects = { ...state.objects };
      idsToRemove.forEach((rid) => delete newObjects[rid]);

      const newSelectedIds = state.selection.selectedIds.filter(
        (sid) => !idsToRemove.includes(sid),
      );
      const newPrimaryId = idsToRemove.includes(state.selection.primaryId ?? "")
        ? (newSelectedIds[0] ?? null)
        : state.selection.primaryId;

      if (!state.transactionSnapshot) {
        const newPast = [...state.history.past, state.objects].slice(
          -HISTORY_LIMIT,
        );
        set({
          objects: newObjects,
          selection: { selectedIds: newSelectedIds, primaryId: newPrimaryId },
          history: { past: newPast, future: [] },
        });
      } else {
        set({
          objects: newObjects,
          selection: { selectedIds: newSelectedIds, primaryId: newPrimaryId },
        });
      }
    },

    updateObject: (id, partial) => {
      const state = get();
      const existing = state.objects[id];
      if (!existing) return;

      const newObjects = {
        ...state.objects,
        [id]: { ...existing, ...partial },
      };

      if (!state.transactionSnapshot) {
        const newPast = [...state.history.past, state.objects].slice(
          -HISTORY_LIMIT,
        );
        set({
          objects: newObjects,
          history: { past: newPast, future: [] },
        });
      } else {
        set({ objects: newObjects });
      }
    },

    reparentObject: (id, newParentId) => {
      const state = get();
      const objects = state.objects;
      const existing = objects[id];
      if (!existing) return;

      // Prevent circular references
      const descendants = state.getDescendants(id);
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

      const newObjects = {
        ...objects,
        [id]: {
          ...existing,
          parentId: newParentId,
          position: newLocalTransform.position,
          rotation: newLocalTransform.rotation,
          scale: newLocalTransform.scale,
        },
      };

      if (!state.transactionSnapshot) {
        const newPast = [...state.history.past, objects].slice(-HISTORY_LIMIT);
        set({
          objects: newObjects,
          history: { past: newPast, future: [] },
        });
      } else {
        set({ objects: newObjects });
      }
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

    setIsDragging: (value) => {
      set({ isDragging: value });
    },

    undo: () => {
      const state = get();
      if (state.history.past.length === 0) return;

      const newPast = [...state.history.past];
      const previousObjects = newPast.pop()!;
      const newFuture = [state.objects, ...state.history.future];

      // Clean up selection if objects no longer exist
      const validSelectedIds = state.selection.selectedIds.filter(
        (id) => previousObjects[id],
      );
      const validPrimaryId =
        state.selection.primaryId && previousObjects[state.selection.primaryId]
          ? state.selection.primaryId
          : (validSelectedIds[0] ?? null);

      set({
        objects: previousObjects,
        history: { past: newPast, future: newFuture },
        selection: { selectedIds: validSelectedIds, primaryId: validPrimaryId },
      });
    },

    redo: () => {
      const state = get();
      if (state.history.future.length === 0) return;

      const newFuture = [...state.history.future];
      const nextObjects = newFuture.shift()!;
      const newPast = [...state.history.past, state.objects];

      // Clean up selection if objects no longer exist
      const validSelectedIds = state.selection.selectedIds.filter(
        (id) => nextObjects[id],
      );
      const validPrimaryId =
        state.selection.primaryId && nextObjects[state.selection.primaryId]
          ? state.selection.primaryId
          : (validSelectedIds[0] ?? null);

      set({
        objects: nextObjects,
        history: { past: newPast, future: newFuture },
        selection: { selectedIds: validSelectedIds, primaryId: validPrimaryId },
      });
    },

    beginTransaction: () => {
      const state = get();
      // Only start a new transaction if one isn't already active
      if (!state.transactionSnapshot) {
        set({ transactionSnapshot: state.objects });
      }
    },

    commitTransaction: () => {
      const state = get();
      if (!state.transactionSnapshot) return;

      // Push the snapshot (pre-transaction state) to history
      const newPast = [...state.history.past, state.transactionSnapshot].slice(
        -HISTORY_LIMIT,
      );
      set({
        transactionSnapshot: null,
        history: { past: newPast, future: [] },
      });
    },

    cancelTransaction: () => {
      set({ transactionSnapshot: null });
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
