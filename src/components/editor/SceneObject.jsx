import { useMemo, useRef } from "react";
import * as THREE from "three";
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

  const geometryType = useMemo(() => obj?.type ?? null, [obj?.type]);
  const renderGeometry = () => {
    switch (geometryType) {
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
  };

  if (!obj || !obj.visible) return null;

  return (
    <group position={obj.position} rotation={obj.rotation} scale={obj.scale}>
      {obj.type !== "group" && (
        <>
          <mesh
            ref={meshRef}
            onClick={handleClick}
            userData={{ objectId: id }}
            castShadow
            receiveShadow
          >
            {renderGeometry()}
            <meshStandardMaterial
              color={obj.material.color}
              metalness={obj.material.metalness}
              roughness={obj.material.roughness}
            />
          </mesh>

          {isSelected && (
            <mesh
              scale={[1.03, 1.03, 1.03]}
              raycast={() => null}
              renderOrder={999}
            >
              {renderGeometry()}
              <meshBasicMaterial
                color="#ffaa00"
                side={THREE.BackSide}
                toneMapped={false}
                depthWrite={false}
              />
            </mesh>
          )}
        </>
      )}

      {children.map((child) => (
        <SceneObject key={child.id} id={child.id} />
      ))}
    </group>
  );
}
