import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import { Vector3, Euler, Quaternion, Box3 } from "three";
import { useSceneStore } from "@/store/sceneStore";

export function MultiTransformGizmo({ selectedIds, onDragStart, onDragEnd }) {
  const { scene } = useThree();
  const objects = useSceneStore((state) => state.objects);
  const mode = useSceneStore((state) => state.transformMode);
  const updateObject = useSceneStore((state) => state.updateObject);
  const getDescendants = useSceneStore((state) => state.getDescendants);

  const transformRef = useRef();
  const [pivot, setPivot] = useState(null);

  // Store initial state when drag starts
  const initialStateRef = useRef(null);

  // Reusable Box3 for bounding calculations
  const tmpBox = useMemo(() => new Box3(), []);

  // Get selected objects
  const selectedObjects = selectedIds.map((id) => objects[id]).filter(Boolean);
  const selectionKey = selectedIds.join(",");
  const selectionCount = selectedObjects.length;

  // Build set of all object IDs we need to find meshes for (selected + their descendants)
  const relevantObjectIds = useMemo(() => {
    const ids = new Set();
    for (const obj of selectedObjects) {
      if (obj.type === "group") {
        // For groups, include all descendants
        const descendants = getDescendants(obj.id);
        for (const d of descendants) {
          ids.add(d.id);
        }
      } else {
        // For primitives, include the object itself
        ids.add(obj.id);
      }
    }
    return ids;
  }, [selectedObjects, getDescendants]);

  // Calculate transform center using stored positions (local space)
  // Used for rotation/scale offset calculations
  const getTransformCenter = useCallback(() => {
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

  // Calculate visual center using bounding box (world space)
  // Used for positioning the gizmo at the visual center of the selection
  const getVisualCenter = useCallback(() => {
    if (selectedObjects.length === 0) return [0, 0, 0];

    const bounds = new Box3();
    let hasAny = false;

    scene.traverse((obj) => {
      const objectId = obj?.userData?.objectId;
      if (!objectId || !relevantObjectIds.has(objectId)) return;
      if (!obj.isMesh) return;

      obj.updateWorldMatrix(true, false);
      tmpBox.setFromObject(obj);
      if (tmpBox.isEmpty()) return;

      if (!hasAny) {
        bounds.copy(tmpBox);
        hasAny = true;
      } else {
        bounds.union(tmpBox);
      }
    });

    if (!hasAny || bounds.isEmpty()) {
      // Fallback to position average if no meshes found
      return getTransformCenter();
    }

    const center = new Vector3();
    bounds.getCenter(center);
    return center.toArray();
  }, [selectedObjects, relevantObjectIds, scene, tmpBox, getTransformCenter]);

  // Sync pivot position with visual center of selection
  useEffect(() => {
    if (pivot && selectionCount > 0) {
      const visualCenter = getVisualCenter();
      pivot.position.set(...visualCenter);
      pivot.rotation.set(0, 0, 0);
      pivot.scale.set(1, 1, 1);
    }
  }, [pivot, selectionKey, selectionCount, getVisualCenter]);

  useEffect(() => {
    const controls = transformRef.current;
    if (!controls) return;

    const handleDraggingChanged = (event) => {
      if (event.value) {
        // Store initial state of all selected objects
        // Use transform center (position average) for rotation/scale offset calculations
        const transformCenter = getTransformCenter();
        initialStateRef.current = {
          // Store pivot's actual starting position for translation delta
          pivotStartPosition: pivot.position.clone(),
          // Transform center for rotation/scale calculations
          center: new Vector3(...transformCenter),
          pivotRotation: new Euler(0, 0, 0),
          pivotScale: new Vector3(1, 1, 1),
          objects: selectedObjects.map((obj) => ({
            id: obj.id,
            position: new Vector3(...obj.position),
            rotation: new Euler(...obj.rotation),
            scale: new Vector3(...obj.scale),
            // Offset from transform center (in local space)
            offset: new Vector3(
              obj.position[0] - transformCenter[0],
              obj.position[1] - transformCenter[1],
              obj.position[2] - transformCenter[2],
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
        // For translation, compute delta from pivot's starting position
        // This ensures delta starts at zero and grows as user drags
        const delta = new Vector3().subVectors(
          pivot.position,
          initial.pivotStartPosition,
        );

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
    getTransformCenter,
    selectedObjects,
  ]);

  if (selectedObjects.length === 0) return null;

  const visualCenter = getVisualCenter();

  return (
    <>
      <mesh ref={setPivot} visible={false} position={visualCenter} />
      {pivot && (
        <TransformControls ref={transformRef} object={pivot} mode={mode} />
      )}
    </>
  );
}
