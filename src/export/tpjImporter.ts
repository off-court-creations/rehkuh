import type { SceneObject, TPJFile, MaterialProps } from "../types";

const defaultMaterial: MaterialProps = {
  color: "#4bd0d2",
  metalness: 0.2,
  roughness: 0.4,
};

export function importFromTPJ(tpjData: TPJFile): Record<string, SceneObject> {
  const objects: Record<string, SceneObject> = {};

  for (const tpjObj of tpjData.objects) {
    // Get material from materials dictionary
    let material: MaterialProps = { ...defaultMaterial };
    if (tpjObj.material) {
      const tpjMat = tpjData.materials[tpjObj.material];
      if (tpjMat) {
        material = {
          color: tpjMat.color,
          metalness: tpjMat.metalness,
          roughness: tpjMat.roughness,
        };
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
