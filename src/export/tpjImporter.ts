import type {
  SceneObject,
  TPJFile,
  MaterialProps,
  StandardMaterialProps,
  ShaderMaterialProps,
  TPJMaterial,
} from "../types";

const defaultMaterial: StandardMaterialProps = {
  color: "#4bd0d2",
  metalness: 0.2,
  roughness: 0.4,
};

function isTPJShaderMaterial(
  mat: TPJMaterial,
): mat is TPJMaterial & { type: "shader" } {
  return mat.type === "shader";
}

function convertTPJMaterial(tpjMat: TPJMaterial): MaterialProps {
  if (isTPJShaderMaterial(tpjMat)) {
    // Shader material - convert to ShaderMaterialProps
    // Generate a shader name from the material key or use a default
    const shaderMat: ShaderMaterialProps = {
      type: "shader",
      shaderName: "imported_shader",
      vertex: tpjMat.vertex,
      fragment: tpjMat.fragment,
      uniforms: tpjMat.uniforms,
    };

    if (tpjMat.transparent !== undefined)
      shaderMat.transparent = tpjMat.transparent;
    if (tpjMat.side) shaderMat.side = tpjMat.side;
    if (tpjMat.depthWrite !== undefined)
      shaderMat.depthWrite = tpjMat.depthWrite;
    if (tpjMat.depthTest !== undefined) shaderMat.depthTest = tpjMat.depthTest;

    return shaderMat;
  }

  // Standard material
  return {
    color: tpjMat.color,
    metalness: tpjMat.metalness,
    roughness: tpjMat.roughness,
  };
}

export function importFromTPJ(tpjData: TPJFile): Record<string, SceneObject> {
  const objects: Record<string, SceneObject> = {};

  for (const tpjObj of tpjData.objects) {
    // Get material from materials dictionary
    let material: MaterialProps = { ...defaultMaterial };
    if (tpjObj.material) {
      const tpjMat = tpjData.materials[tpjObj.material];
      if (tpjMat) {
        material = convertTPJMaterial(tpjMat);
      }
    }

    const sceneObj: SceneObject = {
      id: tpjObj.id,
      name: tpjObj.name,
      type: tpjObj.type,
      parentId: tpjObj.parent,
      position: tpjObj.position,
      rotation: tpjObj.rotation,
      scale: tpjObj.scale,
      material,
      visible: tpjObj.visible,
      locked: false,
    };

    objects[tpjObj.id] = sceneObj;
  }

  return objects;
}
