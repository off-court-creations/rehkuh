import type {
  SceneObject,
  TSPFile,
  MaterialProps,
  StandardMaterialProps,
  ShaderMaterialProps,
  TSPMaterial,
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

function convertTSPMaterial(tspMat: TSPMaterial): MaterialProps {
  if (isTSPShaderMaterial(tspMat)) {
    // Shader material - convert to ShaderMaterialProps
    // Generate a shader name from the material key or use a default
    const shaderMat: ShaderMaterialProps = {
      type: "shader",
      shaderName: "imported_shader",
      vertex: tspMat.vertex,
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

  // Standard material
  return {
    color: tspMat.color,
    metalness: tspMat.metalness,
    roughness: tspMat.roughness,
  };
}

export function importFromTSP(tspData: TSPFile): Record<string, SceneObject> {
  const objects: Record<string, SceneObject> = {};

  for (const tspObj of tspData.objects) {
    // Get material from materials dictionary
    let material: MaterialProps = { ...defaultMaterial };
    if (tspObj.material) {
      const tspMat = tspData.materials[tspObj.material];
      if (tspMat) {
        material = convertTSPMaterial(tspMat);
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

    objects[tspObj.id] = sceneObj;
  }

  return objects;
}
