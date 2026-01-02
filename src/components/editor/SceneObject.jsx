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

  const outlineMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        colorA: { value: new THREE.Color("#00ffd5") }, // teal
        colorB: { value: new THREE.Color("#ff00ff") }, // magenta
        stripeDensity: { value: 18.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorA;
        uniform vec3 colorB;
        uniform float stripeDensity;
        varying vec2 vUv;

        void main() {
          float t = fract((vUv.x + vUv.y) * stripeDensity);
          float stripe = step(0.5, t);
          vec3 color = mix(colorA, colorB, stripe);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide,
      toneMapped: false,
      depthWrite: false,
    });

    material.polygonOffset = true;
    material.polygonOffsetFactor = 1;
    material.polygonOffsetUnits = 1;

    return material;
  }, []);

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
              scale={[1.1, 1.1, 1.1]}
              raycast={() => null}
              renderOrder={999}
            >
              {renderGeometry()}
              <primitive object={outlineMaterial} attach="material" />
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
