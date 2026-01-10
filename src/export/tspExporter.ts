import type {
  SceneObject,
  PrimitiveType,
  MaterialProps,
  PhysicalMaterialProps,
  TSPFile,
  TSPMaterial,
  TSPPhysicalMaterial,
  TSPGeometry,
  TSPObject,
} from "../types";
import { isShaderMaterial, isPhysicalMaterial } from "../types";

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

// Simple hash function for physical material properties
function hashPhysicalMaterial(mat: PhysicalMaterialProps): string {
  // Create a string of all non-default properties and hash it
  const props = [
    mat.color,
    mat.metalness,
    mat.roughness,
    mat.clearcoat,
    mat.clearcoatRoughness,
    mat.sheen,
    mat.sheenRoughness,
    mat.sheenColor,
    mat.transmission,
    mat.thickness,
    mat.attenuationColor,
    mat.attenuationDistance,
    mat.ior,
    mat.specularIntensity,
    mat.specularColor,
    mat.reflectivity,
    mat.iridescence,
    mat.iridescenceIOR,
    mat.iridescenceThicknessRange?.join(","),
    mat.anisotropy,
    mat.anisotropyRotation,
    mat.dispersion,
    mat.envMapIntensity,
    mat.flatShading,
  ]
    .filter((v) => v !== undefined)
    .join("_");

  // Simple hash (djb2)
  let hash = 5381;
  for (let i = 0; i < props.length; i++) {
    hash = (hash * 33) ^ props.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).slice(0, 12);
}

function generateMaterialKey(material: MaterialProps): string {
  if (isShaderMaterial(material)) {
    // For shader materials, use the shader name as the key
    return `mat_shader_${material.shaderName}`;
  }

  if (isPhysicalMaterial(material)) {
    // For physical materials, use a content hash
    return `mat_physical_${hashPhysicalMaterial(material)}`;
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

function convertToTSPMaterial(material: MaterialProps): TSPMaterial {
  if (isShaderMaterial(material)) {
    // For shader materials, we need to read the shader files and inline them
    // For now, we'll use the cached vertex/fragment if available
    const tspMat: TSPMaterial = {
      type: "shader",
      vertex: material.vertex || "",
      fragment: material.fragment || "",
      uniforms: material.uniforms,
    };

    if (material.transparent !== undefined)
      tspMat.transparent = material.transparent;
    if (material.side) tspMat.side = material.side;
    if (material.depthWrite !== undefined)
      tspMat.depthWrite = material.depthWrite;
    if (material.depthTest !== undefined) tspMat.depthTest = material.depthTest;

    return tspMat;
  }

  if (isPhysicalMaterial(material)) {
    // Physical material - include all defined properties
    const tspMat: TSPPhysicalMaterial = {
      type: "physical",
      color: material.color,
      metalness: material.metalness,
      roughness: material.roughness,
    };

    // Clearcoat channel
    if (material.clearcoat !== undefined) tspMat.clearcoat = material.clearcoat;
    if (material.clearcoatRoughness !== undefined)
      tspMat.clearcoatRoughness = material.clearcoatRoughness;

    // Sheen channel
    if (material.sheen !== undefined) tspMat.sheen = material.sheen;
    if (material.sheenRoughness !== undefined)
      tspMat.sheenRoughness = material.sheenRoughness;
    if (material.sheenColor !== undefined)
      tspMat.sheenColor = material.sheenColor;

    // Transmission channel
    if (material.transmission !== undefined)
      tspMat.transmission = material.transmission;
    if (material.thickness !== undefined) tspMat.thickness = material.thickness;
    if (material.attenuationColor !== undefined)
      tspMat.attenuationColor = material.attenuationColor;
    if (material.attenuationDistance !== undefined)
      tspMat.attenuationDistance = material.attenuationDistance;

    // IOR
    if (material.ior !== undefined) tspMat.ior = material.ior;

    // Specular channel
    if (material.specularIntensity !== undefined)
      tspMat.specularIntensity = material.specularIntensity;
    if (material.specularColor !== undefined)
      tspMat.specularColor = material.specularColor;
    if (material.reflectivity !== undefined)
      tspMat.reflectivity = material.reflectivity;

    // Iridescence channel
    if (material.iridescence !== undefined)
      tspMat.iridescence = material.iridescence;
    if (material.iridescenceIOR !== undefined)
      tspMat.iridescenceIOR = material.iridescenceIOR;
    if (material.iridescenceThicknessRange !== undefined)
      tspMat.iridescenceThicknessRange = material.iridescenceThicknessRange;

    // Anisotropy channel
    if (material.anisotropy !== undefined)
      tspMat.anisotropy = material.anisotropy;
    if (material.anisotropyRotation !== undefined)
      tspMat.anisotropyRotation = material.anisotropyRotation;

    // Dispersion
    if (material.dispersion !== undefined)
      tspMat.dispersion = material.dispersion;

    // Other
    if (material.envMapIntensity !== undefined)
      tspMat.envMapIntensity = material.envMapIntensity;
    if (material.flatShading !== undefined)
      tspMat.flatShading = material.flatShading;

    return tspMat;
  }

  // Standard material
  return {
    color: material.color,
    metalness: material.metalness,
    roughness: material.roughness,
  };
}

export function exportToTSP(objects: Record<string, SceneObject>): TSPFile {
  const objectList = Object.values(objects);

  // Build deduplicated materials dictionary
  const materials: Record<string, TSPMaterial> = {};
  const materialKeyMap = new Map<string, string>(); // object id -> material key

  for (const obj of objectList) {
    if (obj.type === "group") continue;

    const key = generateMaterialKey(obj.material);
    if (!materials[key]) {
      materials[key] = convertToTSPMaterial(obj.material);
    }
    materialKeyMap.set(obj.id, key);
  }

  // Build geometries dictionary
  // Simple geometries: one per type (shared)
  // Complex geometries: one per object (unique data per instance)
  const geometries: Record<string, TSPGeometry> = {};
  const geometryKeyMap = new Map<string, string>(); // object id -> geometry key

  for (const obj of objectList) {
    if (obj.type === "group") continue;

    const isComplex = COMPLEX_GEOMETRY_TYPES.includes(obj.type);

    if (isComplex) {
      // Complex geometry - unique key per object
      const geoKey = `${obj.type}_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = { type: obj.type };

      // Include the complex geometry data
      if (obj.points) geo.points = obj.points;
      if (obj.shape) geo.shape = obj.shape;
      if (obj.extrudeOptions) geo.extrudeOptions = obj.extrudeOptions;
      if (obj.path) geo.path = obj.path;
      if (obj.tubeRadius !== undefined) geo.tubeRadius = obj.tubeRadius;
      if (obj.sourceGeometry) geo.sourceGeometry = obj.sourceGeometry;
      if (obj.vertices) geo.vertices = obj.vertices;
      if (obj.indices) geo.indices = obj.indices;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else {
      // Simple geometry - shared by type
      if (!geometries[obj.type]) {
        const args = GEOMETRY_ARGS[obj.type];
        geometries[obj.type] = args
          ? { type: obj.type, args }
          : { type: obj.type };
      }
      geometryKeyMap.set(obj.id, obj.type);
    }
  }

  // Transform objects
  const tspObjects: TSPObject[] = objectList.map((obj) => {
    const base: TSPObject = {
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
      generator: "rehkuh",
    },
    materials,
    geometries,
    objects: tspObjects,
    roots,
  };
}

export function serializeTSP(tspData: TSPFile): string {
  return JSON.stringify(tspData, null, 2);
}
