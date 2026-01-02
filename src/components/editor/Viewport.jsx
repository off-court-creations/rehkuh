import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useSceneStore } from "@/store/sceneStore";
import { SceneObject } from "./SceneObject";
import { MultiTransformGizmo } from "./MultiTransformGizmo";

function DeselectOnEmptyDoubleClick({ isDraggingRef }) {
  const clearSelection = useSceneStore((state) => state.clearSelection);
  const { gl, raycaster, camera, scene } = useThree();

  useEffect(() => {
    const domElement = gl.domElement;
    const handleDoubleClick = (e) => {
      if (isDraggingRef.current) return;

      const rect = domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2 - 1),
      );

      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster
        .intersectObjects(scene.children, true)
        .filter((hit) => hit.object?.userData?.objectId);

      if (hits.length === 0) clearSelection();
    };

    domElement.addEventListener("dblclick", handleDoubleClick);
    return () => {
      domElement.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [camera, clearSelection, gl, isDraggingRef, raycaster, scene]);

  return null;
}

function Scene({ orbitEnabled, setOrbitEnabled, isDraggingRef }) {
  const objects = useSceneStore((state) => Object.values(state.objects));
  const selectedIds = useSceneStore((state) => state.selection.selectedIds);
  const transformMode = useSceneStore((state) => state.transformMode);
  const beginTransaction = useSceneStore((state) => state.beginTransaction);
  const commitTransaction = useSceneStore((state) => state.commitTransaction);

  const rootObjects = objects.filter((o) => o.parentId === null);

  const handleDragStart = () => {
    isDraggingRef.current = true;
    setOrbitEnabled(false);
    beginTransaction();
  };

  const handleDragEnd = () => {
    // Delay resetting the flag so onPointerMissed doesn't fire
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
    setOrbitEnabled(true);
    commitTransaction();
  };

  return (
    <>
      <color attach="background" args={["#1a1a2e"]} />
      <fog attach="fog" args={["#1a1a2e", 20, 60]} />

      <Suspense fallback={null}>
        <Environment preset="apartment" />
      </Suspense>

      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.8} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      <OrbitControls enabled={orbitEnabled} makeDefault />

      <DeselectOnEmptyDoubleClick isDraggingRef={isDraggingRef} />

      {rootObjects.map((obj) => (
        <SceneObject key={obj.id} id={obj.id} />
      ))}

      {selectedIds.length > 0 && transformMode && (
        <MultiTransformGizmo
          selectedIds={selectedIds}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      )}

      <Grid
        position={[0, -0.01, 0]}
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#444"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#666"
        fadeDistance={50}
        fadeStrength={1}
        infiniteGrid
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a2a3a" transparent opacity={0.5} />
      </mesh>
    </>
  );
}

export function Viewport() {
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const isDraggingRef = useRef(false);
  const transformMode = useSceneStore((state) => state.transformMode);
  const setTransformMode = useSceneStore((state) => state.setTransformMode);

  useEffect(() => {
    const shouldIgnoreKeyEvent = (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return false;
      if (target.isContentEditable) return true;
      return (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      );
    };

    const handleKeyDown = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (shouldIgnoreKeyEvent(e)) return;

      const key = e.key.toLowerCase();
      if (key === "q") {
        setTransformMode(null);
        return;
      }

      const keyToMode = {
        w: "translate",
        e: "rotate",
        r: "scale",
      };
      const nextMode = keyToMode[key];
      if (!nextMode) return;

      setTransformMode(transformMode === nextMode ? null : nextMode);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setTransformMode, transformMode]);

  return (
    <Canvas
      shadows
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <Scene
        orbitEnabled={orbitEnabled}
        setOrbitEnabled={setOrbitEnabled}
        isDraggingRef={isDraggingRef}
      />
    </Canvas>
  );
}
