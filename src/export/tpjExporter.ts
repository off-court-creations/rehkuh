import type {
  SceneObject,
  PrimitiveType,
  MaterialProps,
  TPJFile,
  TPJMaterial,
  TPJGeometry,
  TPJObject,
} from "../types";

const GEOMETRY_ARGS: Record<PrimitiveType, number[]> = {
  box: [1, 1, 1],
  sphere: [0.5, 32, 32],
  cylinder: [0.5, 0.5, 1, 32],
  cone: [0.5, 1, 32],
  torus: [0.5, 0.2, 16, 32],
  plane: [1, 1],
};

function generateMaterialKey(material: MaterialProps): string {
  const colorPart = material.color.replace("#", "").toLowerCase();
  const metalPart = Math.round(material.metalness * 100)
    .toString()
    .padStart(2, "0");
  const roughPart = Math.round(material.roughness * 100)
    .toString()
    .padStart(2, "0");
  return `mat_${colorPart}_${metalPart}_${roughPart}`;
}

function materialsEqual(a: MaterialProps, b: MaterialProps): boolean {
  return (
    a.color.toLowerCase() === b.color.toLowerCase() &&
    Math.round(a.metalness * 100) === Math.round(b.metalness * 100) &&
    Math.round(a.roughness * 100) === Math.round(b.roughness * 100)
  );
}

export function exportToTPJ(objects: Record<string, SceneObject>): TPJFile {
  const objectList = Object.values(objects);

  // Build deduplicated materials dictionary
  const materials: Record<string, TPJMaterial> = {};
  const materialKeyMap = new Map<string, string>(); // object id -> material key

  for (const obj of objectList) {
    if (obj.type === "group") continue;

    const key = generateMaterialKey(obj.material);
    if (!materials[key]) {
      materials[key] = {
        color: obj.material.color,
        metalness: obj.material.metalness,
        roughness: obj.material.roughness,
      };
    }
    materialKeyMap.set(obj.id, key);
  }

  // Build geometries dictionary (one per type used)
  const geometries: Record<string, TPJGeometry> = {};
  const usedTypes = new Set<PrimitiveType>();

  for (const obj of objectList) {
    if (obj.type !== "group") {
      usedTypes.add(obj.type);
    }
  }

  for (const type of usedTypes) {
    geometries[type] = {
      type,
      args: GEOMETRY_ARGS[type],
    };
  }

  // Transform objects
  const tpjObjects: TPJObject[] = objectList.map((obj) => {
    const base: TPJObject = {
      id: obj.id,
      name: obj.name,
      type: obj.type,
      position: obj.position,
      rotation: obj.rotation,
      scale: obj.scale,
      parent: obj.parentId,
      visible: obj.visible,
    };

    if (obj.type !== "group") {
      base.geometry = obj.type;
      base.material = materialKeyMap.get(obj.id)!;
    }

    return base;
  });

  // Find root objects
  const roots = objectList
    .filter((obj) => obj.parentId === null)
    .map((obj) => obj.id);

  // Derive scene name from first root group or "scene"
  const firstRoot = objectList.find(
    (obj) => obj.parentId === null && obj.type === "group",
  );
  const sceneName = firstRoot?.name || "scene";

  return {
    version: "1.1",
    metadata: {
      name: sceneName,
      created: new Date().toISOString(),
      generator: "rekuh",
    },
    materials,
    geometries,
    objects: tpjObjects,
    roots,
  };
}

export function serializeTPJ(tpjData: TPJFile): string {
  return JSON.stringify(tpjData, null, 2);
}
