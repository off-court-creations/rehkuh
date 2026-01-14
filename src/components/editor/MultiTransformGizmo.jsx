import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import { Vector3, Euler, Quaternion, Box3, Matrix4 } from "three";
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
        // Store initial state - use pivot position (visual center) as transform center
        const pivotPos = pivot.position.clone();

        // Build object data with world positions for correct pivot-relative transforms
        const objectsData = selectedObjects.map((obj) => {
          // Find the Three.js object to get world position and parent transform
          let worldPosition = new Vector3(...obj.position);
          let parentWorldMatrixInverse = new Matrix4(); // identity

          // Find the GROUP wrapper (not the mesh) - SceneObject wraps all objects
          // in a <group> that holds position/rotation/scale
          scene.traverse((threeObj) => {
            if (threeObj?.userData?.objectId === obj.id && threeObj.isGroup) {
              threeObj.updateWorldMatrix(true, false);
              threeObj.getWorldPosition(worldPosition);
              if (threeObj.parent) {
                parentWorldMatrixInverse
                  .copy(threeObj.parent.matrixWorld)
                  .invert();
              }
            }
          });

          return {
            id: obj.id,
            localPosition: new Vector3(...obj.position),
            worldPosition: worldPosition.clone(),
            rotation: new Euler(...obj.rotation),
            scale: new Vector3(...obj.scale),
            // Offset from pivot in world space
            worldOffset: new Vector3().subVectors(worldPosition, pivotPos),
            parentWorldMatrixInverse: parentWorldMatrixInverse.clone(),
          };
        });

        initialStateRef.current = {
          pivotStartPosition: pivotPos,
          objects: objectsData,
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
        // Translation: compute world delta and apply
        const delta = new Vector3().subVectors(
          pivot.position,
          initial.pivotStartPosition,
        );

        initial.objects.forEach((initObj) => {
          // Compute new world position
          const newWorldPos = new Vector3().addVectors(
            initObj.worldPosition,
            delta,
          );
          // Convert to local space
          const newLocalPos = newWorldPos
            .clone()
            .applyMatrix4(initObj.parentWorldMatrixInverse);
          updateObject(initObj.id, {
            position: newLocalPos.toArray(),
          });
        });
      } else if (mode === "rotate") {
        // Rotation: rotate world offset around pivot, convert back to local
        const pivotQuat = new Quaternion().setFromEuler(pivot.rotation);

        initial.objects.forEach((initObj) => {
          // Rotate world offset around pivot
          const newWorldOffset = initObj.worldOffset
            .clone()
            .applyQuaternion(pivotQuat);
          const newWorldPos = new Vector3().addVectors(
            initial.pivotStartPosition,
            newWorldOffset,
          );
          // Convert to local space
          const newLocalPos = newWorldPos
            .clone()
            .applyMatrix4(initObj.parentWorldMatrixInverse);

          // Combine rotations
          const objQuat = new Quaternion().setFromEuler(initObj.rotation);
          const newQuat = new Quaternion().multiplyQuaternions(
            pivotQuat,
            objQuat,
          );
          const newRot = new Euler().setFromQuaternion(newQuat);

          updateObject(initObj.id, {
            position: newLocalPos.toArray(),
            rotation: [newRot.x, newRot.y, newRot.z],
          });
        });
      } else if (mode === "scale") {
        // Scale: scale world offset from pivot, convert back to local
        // Scale is applied in local axes (object's own scale property)
        const scaleVec = pivot.scale;

        initial.objects.forEach((initObj) => {
          // Scale world offset from pivot center
          const newWorldOffset = new Vector3(
            initObj.worldOffset.x * scaleVec.x,
            initObj.worldOffset.y * scaleVec.y,
            initObj.worldOffset.z * scaleVec.z,
          );
          const newWorldPos = new Vector3().addVectors(
            initial.pivotStartPosition,
            newWorldOffset,
          );
          // Convert to local space
          const newLocalPos = newWorldPos
            .clone()
            .applyMatrix4(initObj.parentWorldMatrixInverse);

          // Scale the object's own scale (local axes)
          const newScale = new Vector3(
            initObj.scale.x * scaleVec.x,
            initObj.scale.y * scaleVec.y,
            initObj.scale.z * scaleVec.z,
          );

          updateObject(initObj.id, {
            position: newLocalPos.toArray(),
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
    selectedObjects,
    scene,
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
