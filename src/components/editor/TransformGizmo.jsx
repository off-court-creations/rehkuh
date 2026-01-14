import { useRef, useEffect, useState } from "react";
import { TransformControls } from "@react-three/drei";
import { useSceneStore } from "@/store/sceneStore";

export function TransformGizmo({ objectId, onDragStart, onDragEnd }) {
  const obj = useSceneStore((state) => state.objects[objectId]);
  const mode = useSceneStore((state) => state.transformMode);
  const updateObject = useSceneStore((state) => state.updateObject);

  const transformRef = useRef();
  const [target, setTarget] = useState(null);

  // Sync target position with store
  useEffect(() => {
    if (target && obj) {
      target.position.set(...obj.position);
      target.rotation.set(...obj.rotation);
      target.scale.set(...obj.scale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only sync when transform props change
  }, [target, obj?.position, obj?.rotation, obj?.scale, objectId]);

  useEffect(() => {
    const controls = transformRef.current;
    if (!controls) return;

    const handleDraggingChanged = (event) => {
      if (event.value) {
        onDragStart?.();
      } else {
        onDragEnd?.();
      }
    };

    const handleChange = () => {
      if (!target) return;

      const pos = target.position.toArray();
      const rot = [target.rotation.x, target.rotation.y, target.rotation.z];
      const scl = target.scale.toArray();

      updateObject(objectId, {
        position: pos,
        rotation: rot,
        scale: scl,
      });
    };

    controls.addEventListener("dragging-changed", handleDraggingChanged);
    controls.addEventListener("change", handleChange);

    return () => {
      controls.removeEventListener("dragging-changed", handleDraggingChanged);
      controls.removeEventListener("change", handleChange);
    };
  }, [target, objectId, onDragStart, onDragEnd, updateObject]);

  if (!obj) return null;

  return (
    <>
      <mesh
        ref={setTarget}
        visible={false}
        position={obj.position}
        rotation={obj.rotation}
        scale={obj.scale}
      />
      {target && (
        <TransformControls
          ref={transformRef}
          object={target}
          mode={mode}
          space="local"
        />
      )}
    </>
  );
}
