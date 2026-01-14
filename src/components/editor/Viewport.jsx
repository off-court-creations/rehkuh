import { useState, useRef, Suspense, useEffect, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useSceneStore } from "@/store/sceneStore";
import { useSettingsStore } from "@/store/settingsStore";
import { SceneObject } from "./SceneObject";
import { MultiTransformGizmo } from "./MultiTransformGizmo";

function FocusOnF({ isDraggingRef }) {
  const selectedId = useSceneStore((state) =>
    state.selection.primaryId
      ? state.selection.primaryId
      : (state.selection.selectedIds[0] ?? null),
  );
  const { scene, camera, controls } = useThree();

  const shouldIgnoreKeyEvent = useCallback((e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    return (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT"
    );
  }, []);

  const findObjectForSelection = useCallback(
    (objectId) => {
      let bestMatch = null;
      scene.traverse((obj) => {
        if (obj?.userData?.objectId !== objectId) return;
        if (!bestMatch) bestMatch = obj;
        if (obj.isGroup) bestMatch = obj;
      });
      return bestMatch;
    },
    [scene],
  );

  const computeSceneBounds = useCallback(() => {
    const bounds = new THREE.Box3();
    const tmp = new THREE.Box3();
    let hasAny = false;

    scene.traverse((obj) => {
      if (!obj?.userData?.objectId) return;
      if (!obj.isMesh) return;
      tmp.setFromObject(obj);
      if (tmp.isEmpty()) return;
      if (!hasAny) {
        bounds.copy(tmp);
        hasAny = true;
      } else {
        bounds.union(tmp);
      }
    });

    return hasAny ? bounds : null;
  }, [scene]);

  const focusBox = useCallback(
    (box) => {
      if (!box || box.isEmpty()) return;

      const center = new THREE.Vector3();
      const sphere = new THREE.Sphere();
      box.getCenter(center);
      box.getBoundingSphere(sphere);

      const perspectiveCamera = camera;
      const halfVertFov = THREE.MathUtils.degToRad(perspectiveCamera.fov) / 2;
      const aspect = perspectiveCamera.aspect || 1;
      const halfHorizFov = Math.atan(Math.tan(halfVertFov) * aspect);
      const limitingHalfFov = Math.min(halfVertFov, halfHorizFov);

      const radius = Math.max(0.001, sphere.radius);
      const distance = Math.max(
        0.5,
        (radius / Math.sin(limitingHalfFov)) * 1.2,
      );

      const target =
        controls?.target instanceof THREE.Vector3
          ? controls.target
          : new THREE.Vector3(0, 0, 0);

      const direction = new THREE.Vector3().subVectors(camera.position, target);
      if (direction.lengthSq() < 1e-8) {
        camera.getWorldDirection(direction);
        direction.multiplyScalar(-1);
      }
      direction.normalize();

      camera.position.copy(center).addScaledVector(direction, distance);
      camera.near = Math.max(0.01, distance / 100);
      camera.far = Math.max(camera.far, distance * 100);
      camera.updateProjectionMatrix();

      if (controls?.target instanceof THREE.Vector3) {
        controls.target.copy(center);
        controls.update?.();
      } else {
        camera.lookAt(center);
      }
    },
    [camera, controls],
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (shouldIgnoreKeyEvent(e)) return;
      if (isDraggingRef.current) return;

      if (e.key.toLowerCase() !== "f") return;
      e.preventDefault();

      if (selectedId) {
        const selectedObj = findObjectForSelection(selectedId);
        if (selectedObj) {
          const box = new THREE.Box3().setFromObject(selectedObj);
          focusBox(box);
          return;
        }
      }

      const sceneBox = computeSceneBounds();
      if (sceneBox) focusBox(sceneBox);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    computeSceneBounds,
    findObjectForSelection,
    focusBox,
    isDraggingRef,
    selectedId,
    shouldIgnoreKeyEvent,
  ]);

  return null;
}

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
  const setIsDragging = useSceneStore((state) => state.setIsDragging);
  const showGrid = useSettingsStore((state) => state.showGrid);

  const rootObjects = objects.filter((o) => o.parentId === null);

  const handleDragStart = () => {
    isDraggingRef.current = true;
    setIsDragging(true);
    setOrbitEnabled(false);
    beginTransaction();
  };

  const handleDragEnd = () => {
    // Delay resetting the flag so click-to-select doesn't fire on mouseup
    setTimeout(() => {
      isDraggingRef.current = false;
      setIsDragging(false);
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
      <FocusOnF isDraggingRef={isDraggingRef} />

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

      {showGrid && (
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
      )}

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
