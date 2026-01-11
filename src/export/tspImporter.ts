import type {
  SceneObject,
  TSPFile,
  MaterialProps,
  StandardMaterialProps,
  ShaderMaterialProps,
  PhysicalMaterialProps,
  TSPMaterial,
  TSPPhysicalMaterial,
} from "../types";

const defaultMaterial: StandardMaterialProps = {
  color: "#4bd0d2",
  metalness: 0.2,
  roughness: 0.4,
};

function isTSPShaderMaterial(
  mat: TSPMaterial,
): mat is TSPMaterial & { type: "shader" } {
  return mat.type === "shader";
}

function isTSPPhysicalMaterial(mat: TSPMaterial): mat is TSPPhysicalMaterial {
  return mat.type === "physical";
}

// Extract shader name from material key (e.g., "mat_shader_heart_noise" → "heart_noise")
function extractShaderName(materialKey: string): string {
  const prefix = "mat_shader_";
  if (materialKey.startsWith(prefix)) {
    return materialKey.slice(prefix.length);
  }
  // Fallback: use the material key as-is but make it valid
  return materialKey.replace(/[^a-zA-Z0-9_-]/g, "_");
}

// Shader data to be written to files after import
export interface ExtractedShader {
  name: string;
  vertex: string;
  fragment: string;
}

function convertTSPMaterial(
  tspMat: TSPMaterial,
  materialKey: string,
  extractedShaders: Map<string, ExtractedShader>,
): MaterialProps {
  if (isTSPShaderMaterial(tspMat)) {
    // Shader material - extract to external files for editing
    const shaderName = extractShaderName(materialKey);

    // Store shader data for extraction
    if (!extractedShaders.has(shaderName)) {
      extractedShaders.set(shaderName, {
        name: shaderName,
        vertex: tspMat.vertex,
        fragment: tspMat.fragment,
      });
    }

    const shaderMat: ShaderMaterialProps = {
      type: "shader",
      shaderName,
      vertex: tspMat.vertex, // Keep inline for immediate rendering
      fragment: tspMat.fragment,
      uniforms: tspMat.uniforms,
    };

    if (tspMat.transparent !== undefined)
      shaderMat.transparent = tspMat.transparent;
    if (tspMat.side) shaderMat.side = tspMat.side;
    if (tspMat.depthWrite !== undefined)
      shaderMat.depthWrite = tspMat.depthWrite;
    if (tspMat.depthTest !== undefined) shaderMat.depthTest = tspMat.depthTest;

    return shaderMat;
  }

  if (isTSPPhysicalMaterial(tspMat)) {
    // Physical material - convert to PhysicalMaterialProps
    const physMat: PhysicalMaterialProps = {
      type: "physical",
      color: tspMat.color,
      metalness: tspMat.metalness,
      roughness: tspMat.roughness,
    };

    // Clearcoat channel
    if (tspMat.clearcoat !== undefined) physMat.clearcoat = tspMat.clearcoat;
    if (tspMat.clearcoatRoughness !== undefined)
      physMat.clearcoatRoughness = tspMat.clearcoatRoughness;

    // Sheen channel
    if (tspMat.sheen !== undefined) physMat.sheen = tspMat.sheen;
    if (tspMat.sheenRoughness !== undefined)
      physMat.sheenRoughness = tspMat.sheenRoughness;
    if (tspMat.sheenColor !== undefined) physMat.sheenColor = tspMat.sheenColor;

    // Transmission channel
    if (tspMat.transmission !== undefined)
      physMat.transmission = tspMat.transmission;
    if (tspMat.thickness !== undefined) physMat.thickness = tspMat.thickness;
    if (tspMat.attenuationColor !== undefined)
      physMat.attenuationColor = tspMat.attenuationColor;
    if (tspMat.attenuationDistance !== undefined)
      physMat.attenuationDistance = tspMat.attenuationDistance;

    // IOR
    if (tspMat.ior !== undefined) physMat.ior = tspMat.ior;

    // Specular channel
    if (tspMat.specularIntensity !== undefined)
      physMat.specularIntensity = tspMat.specularIntensity;
    if (tspMat.specularColor !== undefined)
      physMat.specularColor = tspMat.specularColor;
    if (tspMat.reflectivity !== undefined)
      physMat.reflectivity = tspMat.reflectivity;

    // Iridescence channel
    if (tspMat.iridescence !== undefined)
      physMat.iridescence = tspMat.iridescence;
    if (tspMat.iridescenceIOR !== undefined)
      physMat.iridescenceIOR = tspMat.iridescenceIOR;
    if (tspMat.iridescenceThicknessRange !== undefined)
      physMat.iridescenceThicknessRange = tspMat.iridescenceThicknessRange;

    // Anisotropy channel
    if (tspMat.anisotropy !== undefined) physMat.anisotropy = tspMat.anisotropy;
    if (tspMat.anisotropyRotation !== undefined)
      physMat.anisotropyRotation = tspMat.anisotropyRotation;

    // Dispersion
    if (tspMat.dispersion !== undefined) physMat.dispersion = tspMat.dispersion;

    // Other
    if (tspMat.envMapIntensity !== undefined)
      physMat.envMapIntensity = tspMat.envMapIntensity;
    if (tspMat.flatShading !== undefined)
      physMat.flatShading = tspMat.flatShading;

    return physMat;
  }

  // Standard material
  const stdMat: StandardMaterialProps = {
    color: tspMat.color,
    metalness: tspMat.metalness,
    roughness: tspMat.roughness,
  };

  // Optional extended properties
  if (tspMat.emissive !== undefined) stdMat.emissive = tspMat.emissive;
  if (tspMat.emissiveIntensity !== undefined)
    stdMat.emissiveIntensity = tspMat.emissiveIntensity;
  if (tspMat.opacity !== undefined) stdMat.opacity = tspMat.opacity;
  if (tspMat.transparent !== undefined) stdMat.transparent = tspMat.transparent;
  if (tspMat.side !== undefined) stdMat.side = tspMat.side;

  return stdMat;
}

export interface TSPImportResult {
  objects: Record<string, SceneObject>;
  extractedShaders: ExtractedShader[];
}

export function importFromTSP(tspData: TSPFile): TSPImportResult {
  const objects: Record<string, SceneObject> = {};
  const extractedShaders = new Map<string, ExtractedShader>();

  for (const tspObj of tspData.objects) {
    // Get material from materials dictionary
    let material: MaterialProps = { ...defaultMaterial };
    if (tspObj.material) {
      const tspMat = tspData.materials[tspObj.material];
      if (tspMat) {
        material = convertTSPMaterial(
          tspMat,
          tspObj.material,
          extractedShaders,
        );
      }
    }

    const sceneObj: SceneObject = {
      id: tspObj.id,
      name: tspObj.name,
      type: tspObj.type,
      parentId: tspObj.parent,
      position: tspObj.position,
      rotation: tspObj.rotation,
      scale: tspObj.scale,
      material,
      visible: tspObj.visible,
      locked: false,
    };

    // Get geometry data from geometries dictionary (for complex geometries)
    if (tspObj.geometry) {
      const geo = tspData.geometries[tspObj.geometry];
      if (geo) {
        // Box geometry subdivision
        if (geo.boxWidthSegments !== undefined)
          sceneObj.boxWidthSegments = geo.boxWidthSegments;
        if (geo.boxHeightSegments !== undefined)
          sceneObj.boxHeightSegments = geo.boxHeightSegments;
        if (geo.boxDepthSegments !== undefined)
          sceneObj.boxDepthSegments = geo.boxDepthSegments;
        // Complex geometry data
        if (geo.points) sceneObj.points = geo.points;
        if (geo.shape) sceneObj.shape = geo.shape;
        if (geo.extrudeOptions) sceneObj.extrudeOptions = geo.extrudeOptions;
        if (geo.path) sceneObj.path = geo.path;
        if (geo.tubeRadius !== undefined) sceneObj.tubeRadius = geo.tubeRadius;
        if (geo.tubeTubularSegments !== undefined)
          sceneObj.tubeTubularSegments = geo.tubeTubularSegments;
        if (geo.tubeRadialSegments !== undefined)
          sceneObj.tubeRadialSegments = geo.tubeRadialSegments;
        if (geo.tubeClosed !== undefined) sceneObj.tubeClosed = geo.tubeClosed;
        if (geo.vertices) sceneObj.vertices = geo.vertices;
        if (geo.indices) sceneObj.indices = geo.indices;
      }
    }

    // Optional extended properties
    if (tspObj.castShadow !== undefined)
      sceneObj.castShadow = tspObj.castShadow;
    if (tspObj.receiveShadow !== undefined)
      sceneObj.receiveShadow = tspObj.receiveShadow;
    if (tspObj.userData !== undefined) sceneObj.userData = tspObj.userData;

    objects[tspObj.id] = sceneObj;
  }

  return {
    objects,
    extractedShaders: Array.from(extractedShaders.values()),
  };
}
