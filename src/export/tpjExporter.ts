import type {
  SceneObject,
  PrimitiveType,
  MaterialProps,
  TPJFile,
  TPJMaterial,
  TPJGeometry,
  TPJObject,
} from "../types";
import { isShaderMaterial } from "../types";

// Complex geometry types that need per-instance data (not shared)
const COMPLEX_GEOMETRY_TYPES: PrimitiveType[] = [
  "lathe",
  "extrude",
  "shape",
  "tube",
  "edges",
  "polyhedron",
];

// Default args for simple geometries (unit scale)
// Complex geometries (lathe, extrude, shape, tube, edges, polyhedron)
// require additional data fields and are not included here
const GEOMETRY_ARGS: Partial<Record<PrimitiveType, number[]>> = {
  // Existing
  box: [1, 1, 1],
  sphere: [0.5, 32, 32],
  cylinder: [0.5, 0.5, 1, 32],
  cone: [0.5, 1, 32],
  torus: [0.5, 0.2, 16, 32],
  plane: [1, 1],
  // New simple geometries
  capsule: [0.5, 1, 4, 8], // radius, length, capSegments, radialSegments
  circle: [0.5, 32], // radius, segments
  dodecahedron: [0.5, 0], // radius, detail
  icosahedron: [0.5, 0], // radius, detail
  octahedron: [0.5, 0], // radius, detail
  ring: [0.25, 0.5, 32], // innerRadius, outerRadius, thetaSegments
  tetrahedron: [0.5, 0], // radius, detail
  torusKnot: [0.5, 0.15, 64, 8, 2, 3], // radius, tube, tubularSegments, radialSegments, p, q
};

function generateMaterialKey(material: MaterialProps): string {
  if (isShaderMaterial(material)) {
    // For shader materials, use the shader name as the key
    return `mat_shader_${material.shaderName}`;
  }

  // Standard material key
  const colorPart = material.color.replace("#", "").toLowerCase();
  const metalPart = Math.round(material.metalness * 100)
    .toString()
    .padStart(2, "0");
  const roughPart = Math.round(material.roughness * 100)
    .toString()
    .padStart(2, "0");
  return `mat_${colorPart}_${metalPart}_${roughPart}`;
}

function convertToTPJMaterial(material: MaterialProps): TPJMaterial {
  if (isShaderMaterial(material)) {
    // For shader materials, we need to read the shader files and inline them
    // For now, we'll use the cached vertex/fragment if available
    const tpjMat: TPJMaterial = {
      type: "shader",
      vertex: material.vertex || "",
      fragment: material.fragment || "",
      uniforms: material.uniforms,
    };

    if (material.transparent !== undefined)
      tpjMat.transparent = material.transparent;
    if (material.side) tpjMat.side = material.side;
    if (material.depthWrite !== undefined)
      tpjMat.depthWrite = material.depthWrite;
    if (material.depthTest !== undefined) tpjMat.depthTest = material.depthTest;

    return tpjMat;
  }

  // Standard material
  return {
    color: material.color,
    metalness: material.metalness,
    roughness: material.roughness,
  };
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
      materials[key] = convertToTPJMaterial(obj.material);
    }
    materialKeyMap.set(obj.id, key);
  }

  // Build geometries dictionary
  // Simple geometries: one per type (shared)
  // Complex geometries: one per object (unique data per instance)
  const geometries: Record<string, TPJGeometry> = {};
  const geometryKeyMap = new Map<string, string>(); // object id -> geometry key

  for (const obj of objectList) {
    if (obj.type === "group") continue;

    const isComplex = COMPLEX_GEOMETRY_TYPES.includes(obj.type);

    if (isComplex) {
      // Complex geometry - unique key per object
      const geoKey = `${obj.type}_${obj.id.slice(0, 8)}`;
      const geo: TPJGeometry = { type: obj.type };

      // Include the complex geometry data
      if (obj.points) geo.points = obj.points;
      if (obj.shape) geo.shape = obj.shape;
      if (obj.extrudeOptions) geo.extrudeOptions = obj.extrudeOptions;
      if (obj.path) geo.path = obj.path;
      if (obj.sourceGeometry) geo.sourceGeometry = obj.sourceGeometry;
      if (obj.vertices) geo.vertices = obj.vertices;
      if (obj.indices) geo.indices = obj.indices;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else {
      // Simple geometry - shared by type
      if (!geometries[obj.type]) {
        const args = GEOMETRY_ARGS[obj.type];
        geometries[obj.type] = args ? { type: obj.type, args } : { type: obj.type };
      }
      geometryKeyMap.set(obj.id, obj.type);
    }
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
      base.geometry = geometryKeyMap.get(obj.id)!;
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
    version: "1.0",
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
