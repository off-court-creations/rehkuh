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
        // Sphere geometry subdivision
        if (geo.sphereWidthSegments !== undefined)
          sceneObj.sphereWidthSegments = geo.sphereWidthSegments;
        if (geo.sphereHeightSegments !== undefined)
          sceneObj.sphereHeightSegments = geo.sphereHeightSegments;
        // Sphere geometry partial sphere params
        if (geo.spherePhiStart !== undefined)
          sceneObj.spherePhiStart = geo.spherePhiStart;
        if (geo.spherePhiLength !== undefined)
          sceneObj.spherePhiLength = geo.spherePhiLength;
        if (geo.sphereThetaStart !== undefined)
          sceneObj.sphereThetaStart = geo.sphereThetaStart;
        if (geo.sphereThetaLength !== undefined)
          sceneObj.sphereThetaLength = geo.sphereThetaLength;
        // Cylinder geometry params
        if (geo.cylinderRadiusTop !== undefined)
          sceneObj.cylinderRadiusTop = geo.cylinderRadiusTop;
        if (geo.cylinderRadiusBottom !== undefined)
          sceneObj.cylinderRadiusBottom = geo.cylinderRadiusBottom;
        if (geo.cylinderRadialSegments !== undefined)
          sceneObj.cylinderRadialSegments = geo.cylinderRadialSegments;
        if (geo.cylinderHeightSegments !== undefined)
          sceneObj.cylinderHeightSegments = geo.cylinderHeightSegments;
        if (geo.cylinderOpenEnded !== undefined)
          sceneObj.cylinderOpenEnded = geo.cylinderOpenEnded;
        if (geo.cylinderThetaStart !== undefined)
          sceneObj.cylinderThetaStart = geo.cylinderThetaStart;
        if (geo.cylinderThetaLength !== undefined)
          sceneObj.cylinderThetaLength = geo.cylinderThetaLength;
        // Cone geometry params
        if (geo.coneRadius !== undefined) sceneObj.coneRadius = geo.coneRadius;
        if (geo.coneRadialSegments !== undefined)
          sceneObj.coneRadialSegments = geo.coneRadialSegments;
        if (geo.coneHeightSegments !== undefined)
          sceneObj.coneHeightSegments = geo.coneHeightSegments;
        if (geo.coneOpenEnded !== undefined)
          sceneObj.coneOpenEnded = geo.coneOpenEnded;
        if (geo.coneThetaStart !== undefined)
          sceneObj.coneThetaStart = geo.coneThetaStart;
        if (geo.coneThetaLength !== undefined)
          sceneObj.coneThetaLength = geo.coneThetaLength;
        // Torus geometry params
        if (geo.torusRadius !== undefined)
          sceneObj.torusRadius = geo.torusRadius;
        if (geo.torusTube !== undefined) sceneObj.torusTube = geo.torusTube;
        if (geo.torusRadialSegments !== undefined)
          sceneObj.torusRadialSegments = geo.torusRadialSegments;
        if (geo.torusTubularSegments !== undefined)
          sceneObj.torusTubularSegments = geo.torusTubularSegments;
        if (geo.torusArc !== undefined) sceneObj.torusArc = geo.torusArc;
        // Plane geometry params
        if (geo.planeWidthSegments !== undefined)
          sceneObj.planeWidthSegments = geo.planeWidthSegments;
        if (geo.planeHeightSegments !== undefined)
          sceneObj.planeHeightSegments = geo.planeHeightSegments;
        // Capsule geometry params
        if (geo.capsuleRadius !== undefined)
          sceneObj.capsuleRadius = geo.capsuleRadius;
        if (geo.capsuleLength !== undefined)
          sceneObj.capsuleLength = geo.capsuleLength;
        if (geo.capsuleCapSegments !== undefined)
          sceneObj.capsuleCapSegments = geo.capsuleCapSegments;
        if (geo.capsuleRadialSegments !== undefined)
          sceneObj.capsuleRadialSegments = geo.capsuleRadialSegments;
        // Circle geometry params
        if (geo.circleRadius !== undefined)
          sceneObj.circleRadius = geo.circleRadius;
        if (geo.circleSegments !== undefined)
          sceneObj.circleSegments = geo.circleSegments;
        if (geo.circleThetaStart !== undefined)
          sceneObj.circleThetaStart = geo.circleThetaStart;
        if (geo.circleThetaLength !== undefined)
          sceneObj.circleThetaLength = geo.circleThetaLength;
        // Ring geometry params
        if (geo.ringInnerRadius !== undefined)
          sceneObj.ringInnerRadius = geo.ringInnerRadius;
        if (geo.ringOuterRadius !== undefined)
          sceneObj.ringOuterRadius = geo.ringOuterRadius;
        if (geo.ringThetaSegments !== undefined)
          sceneObj.ringThetaSegments = geo.ringThetaSegments;
        if (geo.ringPhiSegments !== undefined)
          sceneObj.ringPhiSegments = geo.ringPhiSegments;
        if (geo.ringThetaStart !== undefined)
          sceneObj.ringThetaStart = geo.ringThetaStart;
        if (geo.ringThetaLength !== undefined)
          sceneObj.ringThetaLength = geo.ringThetaLength;
        // TorusKnot geometry params
        if (geo.torusKnotRadius !== undefined)
          sceneObj.torusKnotRadius = geo.torusKnotRadius;
        if (geo.torusKnotTube !== undefined)
          sceneObj.torusKnotTube = geo.torusKnotTube;
        if (geo.torusKnotTubularSegments !== undefined)
          sceneObj.torusKnotTubularSegments = geo.torusKnotTubularSegments;
        if (geo.torusKnotRadialSegments !== undefined)
          sceneObj.torusKnotRadialSegments = geo.torusKnotRadialSegments;
        if (geo.torusKnotP !== undefined) sceneObj.torusKnotP = geo.torusKnotP;
        if (geo.torusKnotQ !== undefined) sceneObj.torusKnotQ = geo.torusKnotQ;
        // Polyhedra geometry params
        if (geo.octaRadius !== undefined) sceneObj.octaRadius = geo.octaRadius;
        if (geo.octaDetail !== undefined) sceneObj.octaDetail = geo.octaDetail;
        if (geo.dodecaRadius !== undefined)
          sceneObj.dodecaRadius = geo.dodecaRadius;
        if (geo.dodecaDetail !== undefined)
          sceneObj.dodecaDetail = geo.dodecaDetail;
        if (geo.icosaRadius !== undefined)
          sceneObj.icosaRadius = geo.icosaRadius;
        if (geo.icosaDetail !== undefined)
          sceneObj.icosaDetail = geo.icosaDetail;
        if (geo.tetraRadius !== undefined)
          sceneObj.tetraRadius = geo.tetraRadius;
        if (geo.tetraDetail !== undefined)
          sceneObj.tetraDetail = geo.tetraDetail;
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
