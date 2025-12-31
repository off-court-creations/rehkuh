import { useMemo, useRef } from "react";
import { useSceneStore } from "@/store/sceneStore";

export function SceneObject({ id }) {
  const obj = useSceneStore((state) => state.objects[id]);
  const children = useSceneStore((state) =>
    Object.values(state.objects).filter((o) => o.parentId === id),
  );
  const isSelected = useSceneStore((state) =>
    state.selection.selectedIds.includes(id),
  );
  const select = useSceneStore((state) => state.select);

  const meshRef = useRef();

  const handleClick = (e) => {
    e.stopPropagation();
    select(id, e.shiftKey);
  };

  const geometry = useMemo(() => {
    if (!obj) return null;
    switch (obj.type) {
      case "box":
        return <boxGeometry args={[1, 1, 1]} />;
      case "sphere":
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case "cylinder":
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case "cone":
        return <coneGeometry args={[0.5, 1, 32]} />;
      case "torus":
        return <torusGeometry args={[0.4, 0.15, 16, 32]} />;
      case "plane":
        return <planeGeometry args={[1, 1]} />;
      default:
        return null;
    }
  }, [obj?.type]);

  if (!obj || !obj.visible) return null;

  return (
    <group position={obj.position} rotation={obj.rotation} scale={obj.scale}>
      {obj.type !== "group" && (
        <mesh
          ref={meshRef}
          onClick={handleClick}
          userData={{ objectId: id }}
          castShadow
          receiveShadow
        >
          {geometry}
          <meshStandardMaterial
            color={isSelected ? "#ffaa00" : obj.material.color}
            metalness={obj.material.metalness}
            roughness={obj.material.roughness}
            emissive={isSelected ? "#331100" : "#000000"}
          />
        </mesh>
      )}

      {children.map((child) => (
        <SceneObject key={child.id} id={child.id} />
      ))}
    </group>
  );
}
