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
  SceneAnimationClip,
  TSPAnimationClip,
} from "../types";
import { isShaderMaterial, isPhysicalMaterial } from "../types";

// Complex geometry types that need per-instance data (not shared)
const COMPLEX_GEOMETRY_TYPES: PrimitiveType[] = [
  "lathe",
  "extrude",
  "shape",
  "tube",
  "polyhedron",
];

// Default args for simple geometries (unit scale)
// Complex geometries (lathe, extrude, shape, tube, polyhedron)
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
  capsule: [0.5, 1, 4, 8], // radius, length, capSegments, tubeRadialSegments
  circle: [0.5, 32], // radius, segments
  dodecahedron: [0.5, 0], // radius, detail
  icosahedron: [0.5, 0], // radius, detail
  octahedron: [0.5, 0], // radius, detail
  ring: [0.25, 0.5, 32], // innerRadius, outerRadius, thetaSegments
  tetrahedron: [0.5, 0], // radius, detail
  torusKnot: [0.5, 0.15, 64, 8, 2, 3], // radius, tube, tubeTubularSegments, tubeRadialSegments, p, q
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
  const tspMat: TSPMaterial = {
    color: material.color,
    metalness: material.metalness,
    roughness: material.roughness,
  };

  // Optional extended properties
  if (material.emissive !== undefined) tspMat.emissive = material.emissive;
  if (material.emissiveIntensity !== undefined)
    tspMat.emissiveIntensity = material.emissiveIntensity;
  if (material.opacity !== undefined) tspMat.opacity = material.opacity;
  if (material.transparent !== undefined)
    tspMat.transparent = material.transparent;
  if (material.side !== undefined) tspMat.side = material.side;

  return tspMat;
}

export interface ExportOptions {
  author?: string;
  copyright?: string;
  title?: string;
  description?: string;
  animations?: SceneAnimationClip[];
}

/**
 * Converts scene animation clips (name targets) to TSP animation clips (UUID targets).
 */
function convertSceneAnimationsToTSP(
  animations: SceneAnimationClip[] | undefined,
  nameToIdMap: Map<string, string>,
): Record<string, TSPAnimationClip> | undefined {
  if (!animations || animations.length === 0) return undefined;

  const result: Record<string, TSPAnimationClip> = {};

  for (const clip of animations) {
    // Generate a clip ID based on name
    const clipId = `clip_${clip.name.replace(/[^a-zA-Z0-9_]/g, "_")}`;

    const tracks = clip.tracks.map((track) => {
      // Convert object name target to UUID
      const targetId = nameToIdMap.get(track.target);
      if (!targetId) {
        console.warn(
          `Animation track references unknown object name: ${track.target}`,
        );
      }
      return {
        target: targetId ?? track.target, // Fallback to name if ID not found
        path: track.path,
        interpolation: track.interpolation,
        times: track.times,
        values: track.values,
      };
    });

    const tspClip: TSPAnimationClip = {
      name: clip.name,
      tracks,
    };
    if (clip.duration !== undefined) {
      tspClip.duration = clip.duration;
    }
    result[clipId] = tspClip;
  }

  return result;
}

export function exportToTSP(
  objects: Record<string, SceneObject>,
  options: ExportOptions = {},
): TSPFile {
  const objectList = Object.values(objects);

  // Build name -> ID map for animation target conversion
  const nameToIdMap = new Map<string, string>();
  for (const obj of objectList) {
    nameToIdMap.set(obj.name, obj.id);
  }

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

    // Check if box has custom segments (requires unique geometry)
    const hasCustomBoxSegments =
      obj.type === "box" &&
      (obj.boxWidthSegments !== undefined ||
        obj.boxHeightSegments !== undefined ||
        obj.boxDepthSegments !== undefined);

    // Check if sphere has custom params (requires unique geometry)
    const hasCustomSphereParams =
      obj.type === "sphere" &&
      (obj.sphereWidthSegments !== undefined ||
        obj.sphereHeightSegments !== undefined ||
        obj.spherePhiStart !== undefined ||
        obj.spherePhiLength !== undefined ||
        obj.sphereThetaStart !== undefined ||
        obj.sphereThetaLength !== undefined);

    // Check if cylinder has custom params (requires unique geometry)
    const hasCustomCylinderParams =
      obj.type === "cylinder" &&
      (obj.cylinderRadiusTop !== undefined ||
        obj.cylinderRadiusBottom !== undefined ||
        obj.cylinderRadialSegments !== undefined ||
        obj.cylinderHeightSegments !== undefined ||
        obj.cylinderOpenEnded !== undefined ||
        obj.cylinderThetaStart !== undefined ||
        obj.cylinderThetaLength !== undefined);

    // Check if cone has custom params (requires unique geometry)
    const hasCustomConeParams =
      obj.type === "cone" &&
      (obj.coneRadius !== undefined ||
        obj.coneRadialSegments !== undefined ||
        obj.coneHeightSegments !== undefined ||
        obj.coneOpenEnded !== undefined ||
        obj.coneThetaStart !== undefined ||
        obj.coneThetaLength !== undefined);

    // Check if torus has custom params (requires unique geometry)
    const hasCustomTorusParams =
      obj.type === "torus" &&
      (obj.torusRadius !== undefined ||
        obj.torusTube !== undefined ||
        obj.torusRadialSegments !== undefined ||
        obj.torusTubularSegments !== undefined ||
        obj.torusArc !== undefined);

    // Check if plane has custom params (requires unique geometry)
    const hasCustomPlaneParams =
      obj.type === "plane" &&
      (obj.planeWidthSegments !== undefined ||
        obj.planeHeightSegments !== undefined);

    // Check if capsule has custom params (requires unique geometry)
    const hasCustomCapsuleParams =
      obj.type === "capsule" &&
      (obj.capsuleRadius !== undefined ||
        obj.capsuleLength !== undefined ||
        obj.capsuleCapSegments !== undefined ||
        obj.capsuleRadialSegments !== undefined);

    // Check if circle has custom params (requires unique geometry)
    const hasCustomCircleParams =
      obj.type === "circle" &&
      (obj.circleRadius !== undefined ||
        obj.circleSegments !== undefined ||
        obj.circleThetaStart !== undefined ||
        obj.circleThetaLength !== undefined);

    // Check if ring has custom params (requires unique geometry)
    const hasCustomRingParams =
      obj.type === "ring" &&
      (obj.ringInnerRadius !== undefined ||
        obj.ringOuterRadius !== undefined ||
        obj.ringThetaSegments !== undefined ||
        obj.ringPhiSegments !== undefined ||
        obj.ringThetaStart !== undefined ||
        obj.ringThetaLength !== undefined);

    // Check if torusKnot has custom params (requires unique geometry)
    const hasCustomTorusKnotParams =
      obj.type === "torusKnot" &&
      (obj.torusKnotRadius !== undefined ||
        obj.torusKnotTube !== undefined ||
        obj.torusKnotTubularSegments !== undefined ||
        obj.torusKnotRadialSegments !== undefined ||
        obj.torusKnotP !== undefined ||
        obj.torusKnotQ !== undefined);

    // Check if octahedron has custom params (requires unique geometry)
    const hasCustomOctaParams =
      obj.type === "octahedron" &&
      (obj.octaRadius !== undefined || obj.octaDetail !== undefined);

    // Check if dodecahedron has custom params (requires unique geometry)
    const hasCustomDodecaParams =
      obj.type === "dodecahedron" &&
      (obj.dodecaRadius !== undefined || obj.dodecaDetail !== undefined);

    // Check if icosahedron has custom params (requires unique geometry)
    const hasCustomIcosaParams =
      obj.type === "icosahedron" &&
      (obj.icosaRadius !== undefined || obj.icosaDetail !== undefined);

    // Check if tetrahedron has custom params (requires unique geometry)
    const hasCustomTetraParams =
      obj.type === "tetrahedron" &&
      (obj.tetraRadius !== undefined || obj.tetraDetail !== undefined);

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
      if (obj.tubeTubularSegments !== undefined)
        geo.tubeTubularSegments = obj.tubeTubularSegments;
      if (obj.tubeRadialSegments !== undefined)
        geo.tubeRadialSegments = obj.tubeRadialSegments;
      if (obj.tubeClosed !== undefined) geo.tubeClosed = obj.tubeClosed;
      if (obj.vertices) geo.vertices = obj.vertices;
      if (obj.indices) geo.indices = obj.indices;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else if (hasCustomBoxSegments) {
      // Box with custom segments - unique key per object
      const geoKey = `box_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = { type: "box", args: [1, 1, 1] };

      if (obj.boxWidthSegments !== undefined)
        geo.boxWidthSegments = obj.boxWidthSegments;
      if (obj.boxHeightSegments !== undefined)
        geo.boxHeightSegments = obj.boxHeightSegments;
      if (obj.boxDepthSegments !== undefined)
        geo.boxDepthSegments = obj.boxDepthSegments;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else if (hasCustomSphereParams) {
      // Sphere with custom params - unique key per object
      const geoKey = `sphere_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = { type: "sphere", args: [0.5, 32, 32] };

      if (obj.sphereWidthSegments !== undefined)
        geo.sphereWidthSegments = obj.sphereWidthSegments;
      if (obj.sphereHeightSegments !== undefined)
        geo.sphereHeightSegments = obj.sphereHeightSegments;
      if (obj.spherePhiStart !== undefined)
        geo.spherePhiStart = obj.spherePhiStart;
      if (obj.spherePhiLength !== undefined)
        geo.spherePhiLength = obj.spherePhiLength;
      if (obj.sphereThetaStart !== undefined)
        geo.sphereThetaStart = obj.sphereThetaStart;
      if (obj.sphereThetaLength !== undefined)
        geo.sphereThetaLength = obj.sphereThetaLength;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else if (hasCustomCylinderParams) {
      // Cylinder with custom params - unique key per object
      const geoKey = `cylinder_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = { type: "cylinder", args: [0.5, 0.5, 1, 32] };

      if (obj.cylinderRadiusTop !== undefined)
        geo.cylinderRadiusTop = obj.cylinderRadiusTop;
      if (obj.cylinderRadiusBottom !== undefined)
        geo.cylinderRadiusBottom = obj.cylinderRadiusBottom;
      if (obj.cylinderRadialSegments !== undefined)
        geo.cylinderRadialSegments = obj.cylinderRadialSegments;
      if (obj.cylinderHeightSegments !== undefined)
        geo.cylinderHeightSegments = obj.cylinderHeightSegments;
      if (obj.cylinderOpenEnded !== undefined)
        geo.cylinderOpenEnded = obj.cylinderOpenEnded;
      if (obj.cylinderThetaStart !== undefined)
        geo.cylinderThetaStart = obj.cylinderThetaStart;
      if (obj.cylinderThetaLength !== undefined)
        geo.cylinderThetaLength = obj.cylinderThetaLength;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else if (hasCustomConeParams) {
      // Cone with custom params - unique key per object
      const geoKey = `cone_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = { type: "cone", args: [0.5, 1, 32] };

      if (obj.coneRadius !== undefined) geo.coneRadius = obj.coneRadius;
      if (obj.coneRadialSegments !== undefined)
        geo.coneRadialSegments = obj.coneRadialSegments;
      if (obj.coneHeightSegments !== undefined)
        geo.coneHeightSegments = obj.coneHeightSegments;
      if (obj.coneOpenEnded !== undefined)
        geo.coneOpenEnded = obj.coneOpenEnded;
      if (obj.coneThetaStart !== undefined)
        geo.coneThetaStart = obj.coneThetaStart;
      if (obj.coneThetaLength !== undefined)
        geo.coneThetaLength = obj.coneThetaLength;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else if (hasCustomTorusParams) {
      // Torus with custom params - unique key per object
      const geoKey = `torus_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = { type: "torus", args: [0.5, 0.2, 16, 32] };

      if (obj.torusRadius !== undefined) geo.torusRadius = obj.torusRadius;
      if (obj.torusTube !== undefined) geo.torusTube = obj.torusTube;
      if (obj.torusRadialSegments !== undefined)
        geo.torusRadialSegments = obj.torusRadialSegments;
      if (obj.torusTubularSegments !== undefined)
        geo.torusTubularSegments = obj.torusTubularSegments;
      if (obj.torusArc !== undefined) geo.torusArc = obj.torusArc;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else if (hasCustomPlaneParams) {
      // Plane with custom params - unique key per object
      const geoKey = `plane_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = { type: "plane", args: [1, 1] };

      if (obj.planeWidthSegments !== undefined)
        geo.planeWidthSegments = obj.planeWidthSegments;
      if (obj.planeHeightSegments !== undefined)
        geo.planeHeightSegments = obj.planeHeightSegments;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else if (hasCustomCapsuleParams) {
      // Capsule with custom params - unique key per object
      const geoKey = `capsule_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = { type: "capsule", args: [0.5, 1, 4, 8] };

      if (obj.capsuleRadius !== undefined)
        geo.capsuleRadius = obj.capsuleRadius;
      if (obj.capsuleLength !== undefined)
        geo.capsuleLength = obj.capsuleLength;
      if (obj.capsuleCapSegments !== undefined)
        geo.capsuleCapSegments = obj.capsuleCapSegments;
      if (obj.capsuleRadialSegments !== undefined)
        geo.capsuleRadialSegments = obj.capsuleRadialSegments;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else if (hasCustomCircleParams) {
      // Circle with custom params - unique key per object
      const geoKey = `circle_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = { type: "circle", args: [0.5, 32] };

      if (obj.circleRadius !== undefined) geo.circleRadius = obj.circleRadius;
      if (obj.circleSegments !== undefined)
        geo.circleSegments = obj.circleSegments;
      if (obj.circleThetaStart !== undefined)
        geo.circleThetaStart = obj.circleThetaStart;
      if (obj.circleThetaLength !== undefined)
        geo.circleThetaLength = obj.circleThetaLength;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else if (hasCustomRingParams) {
      // Ring with custom params - unique key per object
      const geoKey = `ring_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = { type: "ring", args: [0.25, 0.5, 32] };

      if (obj.ringInnerRadius !== undefined)
        geo.ringInnerRadius = obj.ringInnerRadius;
      if (obj.ringOuterRadius !== undefined)
        geo.ringOuterRadius = obj.ringOuterRadius;
      if (obj.ringThetaSegments !== undefined)
        geo.ringThetaSegments = obj.ringThetaSegments;
      if (obj.ringPhiSegments !== undefined)
        geo.ringPhiSegments = obj.ringPhiSegments;
      if (obj.ringThetaStart !== undefined)
        geo.ringThetaStart = obj.ringThetaStart;
      if (obj.ringThetaLength !== undefined)
        geo.ringThetaLength = obj.ringThetaLength;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else if (hasCustomTorusKnotParams) {
      // TorusKnot with custom params - unique key per object
      const geoKey = `torusKnot_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = {
        type: "torusKnot",
        args: [0.5, 0.15, 64, 8, 2, 3],
      };

      if (obj.torusKnotRadius !== undefined)
        geo.torusKnotRadius = obj.torusKnotRadius;
      if (obj.torusKnotTube !== undefined)
        geo.torusKnotTube = obj.torusKnotTube;
      if (obj.torusKnotTubularSegments !== undefined)
        geo.torusKnotTubularSegments = obj.torusKnotTubularSegments;
      if (obj.torusKnotRadialSegments !== undefined)
        geo.torusKnotRadialSegments = obj.torusKnotRadialSegments;
      if (obj.torusKnotP !== undefined) geo.torusKnotP = obj.torusKnotP;
      if (obj.torusKnotQ !== undefined) geo.torusKnotQ = obj.torusKnotQ;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else if (hasCustomOctaParams) {
      // Octahedron with custom params - unique key per object
      const geoKey = `octahedron_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = { type: "octahedron", args: [0.5, 0] };

      if (obj.octaRadius !== undefined) geo.octaRadius = obj.octaRadius;
      if (obj.octaDetail !== undefined) geo.octaDetail = obj.octaDetail;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else if (hasCustomDodecaParams) {
      // Dodecahedron with custom params - unique key per object
      const geoKey = `dodecahedron_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = { type: "dodecahedron", args: [0.5, 0] };

      if (obj.dodecaRadius !== undefined) geo.dodecaRadius = obj.dodecaRadius;
      if (obj.dodecaDetail !== undefined) geo.dodecaDetail = obj.dodecaDetail;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else if (hasCustomIcosaParams) {
      // Icosahedron with custom params - unique key per object
      const geoKey = `icosahedron_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = { type: "icosahedron", args: [0.5, 0] };

      if (obj.icosaRadius !== undefined) geo.icosaRadius = obj.icosaRadius;
      if (obj.icosaDetail !== undefined) geo.icosaDetail = obj.icosaDetail;

      geometries[geoKey] = geo;
      geometryKeyMap.set(obj.id, geoKey);
    } else if (hasCustomTetraParams) {
      // Tetrahedron with custom params - unique key per object
      const geoKey = `tetrahedron_${obj.id.slice(0, 8)}`;
      const geo: TSPGeometry = { type: "tetrahedron", args: [0.5, 0] };

      if (obj.tetraRadius !== undefined) geo.tetraRadius = obj.tetraRadius;
      if (obj.tetraDetail !== undefined) geo.tetraDetail = obj.tetraDetail;

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

    // Optional extended properties
    if (obj.castShadow !== undefined) base.castShadow = obj.castShadow;
    if (obj.receiveShadow !== undefined) base.receiveShadow = obj.receiveShadow;
    if (obj.userData !== undefined && Object.keys(obj.userData).length > 0) {
      base.userData = obj.userData;
    }

    return base;
  });

  // Find root objects
  const roots = objectList
    .filter((obj) => obj.parentId === null)
    .map((obj) => obj.id);

  const metadata: TSPFile["metadata"] = {
    version: "0.10.0",
    id: crypto.randomUUID(),
    created: new Date().toISOString(),
    generator: "rehkuh",
    generatorVersion: "0.1.0",
  };

  if (options.author) {
    metadata.author = options.author;
  }
  if (options.copyright) {
    metadata.copyright = options.copyright;
  }
  if (options.title) {
    metadata.title = options.title;
  }
  if (options.description) {
    metadata.description = options.description;
  }

  // Convert animations (name targets -> UUID targets)
  const animations = convertSceneAnimationsToTSP(
    options.animations,
    nameToIdMap,
  );

  const result: TSPFile = {
    metadata,
    materials,
    geometries,
    objects: tspObjects,
    roots,
  };

  if (animations) {
    result.animations = animations;
  }

  return result;
}

export function serializeTSP(tspData: TSPFile): string {
  return JSON.stringify(tspData, null, 2);
}
