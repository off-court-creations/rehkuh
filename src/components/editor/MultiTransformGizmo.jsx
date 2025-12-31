import { useRef, useEffect, useState, useCallback } from "react";
import { TransformControls } from "@react-three/drei";
import { Vector3, Euler, Quaternion } from "three";
import { useSceneStore } from "@/store/sceneStore";

export function MultiTransformGizmo({ selectedIds, onDragStart, onDragEnd }) {
  const objects = useSceneStore((state) => state.objects);
  const mode = useSceneStore((state) => state.transformMode);
  const updateObject = useSceneStore((state) => state.updateObject);

  const transformRef = useRef();
  const [pivot, setPivot] = useState(null);

  // Store initial state when drag starts
  const initialStateRef = useRef(null);

  // Get selected objects
  const selectedObjects = selectedIds.map((id) => objects[id]).filter(Boolean);
  const selectionKey = selectedIds.join(",");
  const selectionCount = selectedObjects.length;

  // Calculate center of all selected objects
  const calculateCenter = useCallback(() => {
    if (selectedObjects.length === 0) return [0, 0, 0];

    const sum = selectedObjects.reduce(
      (acc, obj) => [
        acc[0] + obj.position[0],
        acc[1] + obj.position[1],
        acc[2] + obj.position[2],
      ],
      [0, 0, 0],
    );

    return [
      sum[0] / selectedObjects.length,
      sum[1] / selectedObjects.length,
      sum[2] / selectedObjects.length,
    ];
  }, [selectedObjects]);

  // Sync pivot position with center of selection
  useEffect(() => {
    if (pivot && selectionCount > 0) {
      const center = calculateCenter();
      pivot.position.set(...center);
      pivot.rotation.set(0, 0, 0);
      pivot.scale.set(1, 1, 1);
    }
  }, [pivot, selectionKey, selectionCount, calculateCenter]);

  useEffect(() => {
    const controls = transformRef.current;
    if (!controls) return;

    const handleDraggingChanged = (event) => {
      if (event.value) {
        // Store initial state of all selected objects
        const center = calculateCenter();
        initialStateRef.current = {
          center: new Vector3(...center),
          pivotRotation: new Euler(0, 0, 0),
          pivotScale: new Vector3(1, 1, 1),
          objects: selectedObjects.map((obj) => ({
            id: obj.id,
            position: new Vector3(...obj.position),
            rotation: new Euler(...obj.rotation),
            scale: new Vector3(...obj.scale),
            // Offset from center
            offset: new Vector3(
              obj.position[0] - center[0],
              obj.position[1] - center[1],
              obj.position[2] - center[2],
            ),
          })),
        };
        onDragStart?.();
      } else {
        initialStateRef.current = null;
        onDragEnd?.();
      }
    };

    const handleChange = () => {
      if (!pivot || !initialStateRef.current) return;

      const initial = initialStateRef.current;

      if (mode === "translate") {
        // For translation, just apply the delta to all objects
        const delta = new Vector3().subVectors(pivot.position, initial.center);

        initial.objects.forEach((initObj) => {
          const newPos = new Vector3().addVectors(initObj.position, delta);
          updateObject(initObj.id, {
            position: newPos.toArray(),
          });
        });
      } else if (mode === "rotate") {
        // For rotation, rotate each object's position around the pivot
        // and also rotate its own rotation
        const pivotQuat = new Quaternion().setFromEuler(pivot.rotation);

        initial.objects.forEach((initObj) => {
          // Rotate offset around pivot
          const newOffset = initObj.offset.clone().applyQuaternion(pivotQuat);
          const newPos = new Vector3().addVectors(initial.center, newOffset);

          // Combine rotations
          const objQuat = new Quaternion().setFromEuler(initObj.rotation);
          const newQuat = new Quaternion().multiplyQuaternions(
            pivotQuat,
            objQuat,
          );
          const newRot = new Euler().setFromQuaternion(newQuat);

          updateObject(initObj.id, {
            position: newPos.toArray(),
            rotation: [newRot.x, newRot.y, newRot.z],
          });
        });
      } else if (mode === "scale") {
        // For scale, scale each object's offset from center and its own scale
        const scaleVec = pivot.scale;

        initial.objects.forEach((initObj) => {
          // Scale offset from center
          const newOffset = new Vector3(
            initObj.offset.x * scaleVec.x,
            initObj.offset.y * scaleVec.y,
            initObj.offset.z * scaleVec.z,
          );
          const newPos = new Vector3().addVectors(initial.center, newOffset);

          // Scale the object's own scale
          const newScale = new Vector3(
            initObj.scale.x * scaleVec.x,
            initObj.scale.y * scaleVec.y,
            initObj.scale.z * scaleVec.z,
          );

          updateObject(initObj.id, {
            position: newPos.toArray(),
            scale: newScale.toArray(),
          });
        });
      }
    };

    controls.addEventListener("dragging-changed", handleDraggingChanged);
    controls.addEventListener("change", handleChange);

    return () => {
      controls.removeEventListener("dragging-changed", handleDraggingChanged);
      controls.removeEventListener("change", handleChange);
    };
  }, [
    pivot,
    mode,
    selectionKey,
    onDragStart,
    onDragEnd,
    updateObject,
    calculateCenter,
    selectedObjects,
  ]);

  if (selectedObjects.length === 0) return null;

  const center = calculateCenter();

  return (
    <>
      <mesh ref={setPivot} visible={false} position={center} />
      {pivot && (
        <TransformControls ref={transformRef} object={pivot} mode={mode} />
      )}
    </>
  );
}
