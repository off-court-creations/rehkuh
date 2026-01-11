import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "@/store/sceneStore";

// Bounding box visualization for selected groups
function GroupBoundingBox({ id }) {
  const { scene } = useThree();
  const getDescendants = useSceneStore((state) => state.getDescendants);

  // Calculate bounding box and edges from all descendant meshes
  const { edgesGeometry, boundsMin, boundsMax } = useMemo(() => {
    const descendants = getDescendants(id);
    if (descendants.length === 0)
      return { edgesGeometry: null, boundsMin: null, boundsMax: null };

    const descendantIds = new Set(descendants.map((d) => d.id));
    const bounds = new THREE.Box3();
    const tmp = new THREE.Box3();
    let hasAny = false;

    scene.traverse((obj) => {
      const objectId = obj?.userData?.objectId;
      if (!objectId || !descendantIds.has(objectId)) return;
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

    if (!hasAny || bounds.isEmpty())
      return { edgesGeometry: null, boundsMin: null, boundsMax: null };

    // Create box geometry from bounds
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bounds.getSize(size);
    bounds.getCenter(center);

    const geo = new THREE.BoxGeometry(size.x, size.y, size.z);
    geo.translate(center.x, center.y, center.z);

    return {
      edgesGeometry: new THREE.EdgesGeometry(geo),
      boundsMin: bounds.min.clone(),
      boundsMax: bounds.max.clone(),
    };
  }, [id, getDescendants, scene]);

  const edgesMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vLocalPosition;
          void main() {
            vLocalPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 colorA;
          uniform vec3 colorB;
          uniform vec3 boundsMin;
          uniform vec3 boundsMax;
          varying vec3 vLocalPosition;
          void main() {
            // Normalize position within bounds for consistent gradient
            vec3 range = boundsMax - boundsMin;
            float t = ((vLocalPosition.x - boundsMin.x) + (vLocalPosition.y - boundsMin.y) + (vLocalPosition.z - boundsMin.z)) / (range.x + range.y + range.z);
            t = clamp(t, 0.0, 1.0);
            vec3 color = mix(colorA, colorB, t);
            gl_FragColor = vec4(color, 0.9);
          }
        `,
        uniforms: {
          colorA: { value: new THREE.Color("#00ffd5") },
          colorB: { value: new THREE.Color("#ff00ff") },
          boundsMin: { value: new THREE.Vector3(-1, -1, -1) },
          boundsMax: { value: new THREE.Vector3(1, 1, 1) },
        },
        transparent: true,
        depthTest: true,
      }),
    [],
  );

  // Update uniforms when bounds change
  if (boundsMin && boundsMax) {
    edgesMaterial.uniforms.boundsMin.value.copy(boundsMin);
    edgesMaterial.uniforms.boundsMax.value.copy(boundsMax);
  }

  if (!edgesGeometry) return null;

  return (
    <lineSegments
      geometry={edgesGeometry}
      material={edgesMaterial}
      raycast={() => null}
      renderOrder={1000}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      scale={[1, 1, 1]}
    />
  );
}

// Build THREE.Shape from shape path commands
function buildShapeFromPath(shapePath) {
  const shape = new THREE.Shape();

  for (const cmd of shapePath.commands) {
    switch (cmd.op) {
      case "moveTo":
        shape.moveTo(cmd.x, cmd.y);
        break;
      case "lineTo":
        shape.lineTo(cmd.x, cmd.y);
        break;
      case "bezierCurveTo":
        shape.bezierCurveTo(
          cmd.cp1x,
          cmd.cp1y,
          cmd.cp2x,
          cmd.cp2y,
          cmd.x,
          cmd.y,
        );
        break;
      case "quadraticCurveTo":
        shape.quadraticCurveTo(cmd.cpx, cmd.cpy, cmd.x, cmd.y);
        break;
      case "arc":
        shape.arc(
          cmd.x,
          cmd.y,
          cmd.radius,
          cmd.startAngle,
          cmd.endAngle,
          cmd.clockwise ?? false,
        );
        break;
      case "absarc":
        shape.absarc(
          cmd.x,
          cmd.y,
          cmd.radius,
          cmd.startAngle,
          cmd.endAngle,
          cmd.clockwise ?? false,
        );
        break;
      case "ellipse":
        shape.ellipse(
          cmd.x,
          cmd.y,
          cmd.xRadius,
          cmd.yRadius,
          cmd.startAngle,
          cmd.endAngle,
          cmd.clockwise ?? false,
          cmd.rotation ?? 0,
        );
        break;
      case "absellipse":
        shape.absellipse(
          cmd.x,
          cmd.y,
          cmd.xRadius,
          cmd.yRadius,
          cmd.startAngle,
          cmd.endAngle,
          cmd.clockwise ?? false,
          cmd.rotation ?? 0,
        );
        break;
    }
  }

  if (shapePath.holes) {
    for (const holeCommands of shapePath.holes) {
      const hole = new THREE.Path();
      for (const cmd of holeCommands) {
        switch (cmd.op) {
          case "moveTo":
            hole.moveTo(cmd.x, cmd.y);
            break;
          case "lineTo":
            hole.lineTo(cmd.x, cmd.y);
            break;
          case "bezierCurveTo":
            hole.bezierCurveTo(
              cmd.cp1x,
              cmd.cp1y,
              cmd.cp2x,
              cmd.cp2y,
              cmd.x,
              cmd.y,
            );
            break;
          case "quadraticCurveTo":
            hole.quadraticCurveTo(cmd.cpx, cmd.cpy, cmd.x, cmd.y);
            break;
        }
      }
      shape.holes.push(hole);
    }
  }

  return shape;
}

// Build THREE.Curve3 from curve definition
function buildCurve3D(curveDef) {
  switch (curveDef.curveType) {
    case "catmullRom":
      return new THREE.CatmullRomCurve3(
        curveDef.points.map((p) => new THREE.Vector3(...p)),
        curveDef.closed ?? false,
        "centripetal",
        curveDef.tension ?? 0.5,
      );
    case "cubicBezier":
      return new THREE.CubicBezierCurve3(
        new THREE.Vector3(...curveDef.v0),
        new THREE.Vector3(...curveDef.v1),
        new THREE.Vector3(...curveDef.v2),
        new THREE.Vector3(...curveDef.v3),
      );
    case "quadraticBezier":
      return new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...curveDef.v0),
        new THREE.Vector3(...curveDef.v1),
        new THREE.Vector3(...curveDef.v2),
      );
    case "line":
      return new THREE.LineCurve3(
        new THREE.Vector3(...curveDef.v1),
        new THREE.Vector3(...curveDef.v2),
      );
    default:
      return null;
  }
}

// Side map for shader materials
const sideMap = {
  front: THREE.FrontSide,
  back: THREE.BackSide,
  double: THREE.DoubleSide,
};

// Parse uniform value based on type
function parseUniformValue(type, value) {
  switch (type) {
    case "color":
      return new THREE.Color(value);
    case "vec2":
      return new THREE.Vector2(...value);
    case "vec3":
      return new THREE.Vector3(...value);
    case "vec4":
      return new THREE.Vector4(...value);
    case "float":
    case "int":
    case "bool":
    default:
      return value;
  }
}

// Hot pink error material for shader compilation failures
const errorMaterial = new THREE.MeshBasicMaterial({ color: "#ff00ff" });

export function SceneObject({ id }) {
  const obj = useSceneStore((state) => state.objects[id]);
  const children = useSceneStore((state) =>
    Object.values(state.objects).filter((o) => o.parentId === id),
  );
  const isSelected = useSceneStore((state) =>
    state.selection.selectedIds.includes(id),
  );
  const select = useSceneStore((state) => state.select);
  const isDragging = useSceneStore((state) => state.isDragging);

  const meshRef = useRef();
  const materialRef = useRef();

  const selectionMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vLocalPosition;
          void main() {
            vLocalPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 colorA;
          uniform vec3 colorB;
          varying vec3 vLocalPosition;
          void main() {
            // Gradient based on local position (diagonal across object)
            float t = (vLocalPosition.x + vLocalPosition.y + vLocalPosition.z + 1.5) / 3.0;
            t = clamp(t, 0.0, 1.0);
            vec3 color = mix(colorA, colorB, t);
            gl_FragColor = vec4(color, 0.9);
          }
        `,
        uniforms: {
          colorA: { value: new THREE.Color("#00ffd5") }, // teal
          colorB: { value: new THREE.Color("#ff00ff") }, // magenta
        },
        transparent: true,
        depthTest: true,
      }),
    [],
  );

  // Create object material (standard, physical, or shader)
  const objectMaterial = useMemo(() => {
    if (!obj) return null;
    const mat = obj.material;

    if (mat?.type === "shader") {
      // Shader material
      const uniforms = {};
      for (const [name, def] of Object.entries(mat.uniforms || {})) {
        uniforms[name] = { value: parseUniformValue(def.type, def.value) };
      }

      try {
        return new THREE.ShaderMaterial({
          vertexShader: mat.vertex || "",
          fragmentShader: mat.fragment || "",
          uniforms,
          transparent: mat.transparent ?? false,
          side: sideMap[mat.side] ?? THREE.DoubleSide,
          depthWrite: mat.depthWrite ?? true,
          depthTest: mat.depthTest ?? true,
        });
      } catch (e) {
        console.error("Shader compilation failed:", e);
        return errorMaterial;
      }
    }

    if (mat?.type === "physical") {
      // Physical PBR material (MeshPhysicalMaterial)
      return new THREE.MeshPhysicalMaterial({
        color: mat.color ?? "#4bd0d2",
        metalness: mat.metalness ?? 0.2,
        roughness: mat.roughness ?? 0.4,
        side: THREE.DoubleSide,

        // Clearcoat channel
        clearcoat: mat.clearcoat ?? 0,
        clearcoatRoughness: mat.clearcoatRoughness ?? 0,

        // Sheen channel
        sheen: mat.sheen ?? 0,
        sheenRoughness: mat.sheenRoughness ?? 1,
        sheenColor: mat.sheenColor
          ? new THREE.Color(mat.sheenColor)
          : new THREE.Color("#ffffff"),

        // Transmission channel
        transmission: mat.transmission ?? 0,
        thickness: mat.thickness ?? 0,
        attenuationColor: mat.attenuationColor
          ? new THREE.Color(mat.attenuationColor)
          : new THREE.Color("#ffffff"),
        attenuationDistance: mat.attenuationDistance ?? Infinity,

        // IOR
        ior: mat.ior ?? 1.5,

        // Specular channel
        specularIntensity: mat.specularIntensity ?? 1,
        specularColor: mat.specularColor
          ? new THREE.Color(mat.specularColor)
          : new THREE.Color("#ffffff"),
        reflectivity: mat.reflectivity ?? 0.5,

        // Iridescence channel
        iridescence: mat.iridescence ?? 0,
        iridescenceIOR: mat.iridescenceIOR ?? 1.3,
        iridescenceThicknessRange: mat.iridescenceThicknessRange ?? [100, 400],

        // Anisotropy channel
        anisotropy: mat.anisotropy ?? 0,
        anisotropyRotation: mat.anisotropyRotation ?? 0,

        // Dispersion
        dispersion: mat.dispersion ?? 0,

        // Other
        envMapIntensity: mat.envMapIntensity ?? 1,
        flatShading: mat.flatShading ?? false,
      });
    }

    // Standard material (default)
    return new THREE.MeshStandardMaterial({
      color: mat?.color ?? "#4bd0d2",
      metalness: mat?.metalness ?? 0.2,
      roughness: mat?.roughness ?? 0.4,
      emissive: mat?.emissive
        ? new THREE.Color(mat.emissive)
        : new THREE.Color("#000000"),
      emissiveIntensity: mat?.emissiveIntensity ?? 0,
      opacity: mat?.opacity ?? 1,
      transparent: mat?.transparent ?? false,
      side: mat?.side ? sideMap[mat.side] : THREE.DoubleSide,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only recreate material when material props change
  }, [obj?.material]);

  // Store material ref for animation
  materialRef.current = objectMaterial;

  useFrame(({ clock }) => {
    // Animate shader material uniforms
    if (obj?.material?.type === "shader" && materialRef.current) {
      const elapsed = clock.getElapsedTime();
      const mat = obj.material;
      for (const [name, def] of Object.entries(mat.uniforms || {})) {
        if (def.animated && materialRef.current.uniforms?.[name]) {
          if (name === "time") {
            materialRef.current.uniforms[name].value = elapsed;
          }
        }
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    // Don't select if we just finished a gizmo drag
    if (isDragging) return;
    select(id, e.shiftKey);
  };

  // Memoize complex geometry creation
  const geometry = useMemo(() => {
    if (!obj) return null;
    const type = obj.type;

    switch (type) {
      // Simple geometries
      case "box":
        return new THREE.BoxGeometry(1, 1, 1);
      case "sphere":
        return new THREE.SphereGeometry(0.5, 32, 32);
      case "cylinder":
        return new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
      case "cone":
        return new THREE.ConeGeometry(0.5, 1, 32);
      case "torus":
        return new THREE.TorusGeometry(0.5, 0.2, 16, 32);
      case "plane":
        return new THREE.PlaneGeometry(1, 1);
      case "capsule":
        return new THREE.CapsuleGeometry(0.5, 1, 4, 8);
      case "circle":
        return new THREE.CircleGeometry(0.5, 32);
      case "dodecahedron":
        return new THREE.DodecahedronGeometry(0.5, 0);
      case "icosahedron":
        return new THREE.IcosahedronGeometry(0.5, 0);
      case "octahedron":
        return new THREE.OctahedronGeometry(0.5, 0);
      case "ring":
        return new THREE.RingGeometry(0.25, 0.5, 32);
      case "tetrahedron":
        return new THREE.TetrahedronGeometry(0.5, 0);
      case "torusKnot":
        return new THREE.TorusKnotGeometry(0.5, 0.15, 64, 8, 2, 3);

      // Complex geometries
      case "lathe":
        if (!obj.points) return new THREE.BoxGeometry(1, 1, 1);
        return new THREE.LatheGeometry(
          obj.points.map(([x, y]) => new THREE.Vector2(x, y)),
          12,
          0,
          Math.PI * 2,
        );

      case "shape":
        if (!obj.shape) return new THREE.BoxGeometry(1, 1, 1);
        return new THREE.ShapeGeometry(buildShapeFromPath(obj.shape), 12);

      case "extrude":
        if (!obj.shape) return new THREE.BoxGeometry(1, 1, 1);
        const extrudeShape = buildShapeFromPath(obj.shape);
        const extrudeOpts = { ...(obj.extrudeOptions ?? { depth: 0.5 }) };
        if (extrudeOpts.extrudePath) {
          extrudeOpts.extrudePath = buildCurve3D(extrudeOpts.extrudePath);
        }
        return new THREE.ExtrudeGeometry(extrudeShape, extrudeOpts);

      case "tube":
        if (!obj.path) return new THREE.BoxGeometry(1, 1, 1);
        const curve = buildCurve3D(obj.path);
        if (!curve) return new THREE.BoxGeometry(1, 1, 1);
        const tubeRadius = obj.tubeRadius ?? 0.1;
        const tubeTubularSegments = obj.tubeTubularSegments ?? 64;
        const tubeRadialSegments = obj.tubeRadialSegments ?? 8;
        const tubeClosed = obj.tubeClosed ?? false;
        return new THREE.TubeGeometry(
          curve,
          tubeTubularSegments,
          tubeRadius,
          tubeRadialSegments,
          tubeClosed,
        );

      case "polyhedron":
        if (!obj.vertices || !obj.indices)
          return new THREE.BoxGeometry(1, 1, 1);
        return new THREE.PolyhedronGeometry(obj.vertices, obj.indices, 1, 0);

      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only recreate geometry when geometry-related props change
  }, [
    obj?.type,
    obj?.points,
    obj?.shape,
    obj?.extrudeOptions,
    obj?.path,
    obj?.tubeRadius,
    obj?.tubeTubularSegments,
    obj?.tubeRadialSegments,
    obj?.tubeClosed,
    obj?.vertices,
    obj?.indices,
  ]);

  // Edges geometry for selection wireframe
  const edgesGeometry = useMemo(() => {
    if (!geometry) return null;
    return new THREE.EdgesGeometry(geometry);
  }, [geometry]);

  if (!obj || !obj.visible) return null;

  return (
    <>
      <group
        position={obj.position}
        rotation={obj.rotation}
        scale={obj.scale}
        userData={{ objectId: id }}
      >
        {obj.type !== "group" && geometry && objectMaterial && (
          <>
            <mesh
              ref={meshRef}
              onClick={handleClick}
              userData={{ objectId: id }}
              castShadow={obj.castShadow ?? true}
              receiveShadow={obj.receiveShadow ?? true}
              geometry={geometry}
              material={objectMaterial}
            />

            {isSelected && edgesGeometry && (
              <lineSegments
                raycast={() => null}
                renderOrder={999}
                geometry={edgesGeometry}
                material={selectionMaterial}
              />
            )}
          </>
        )}

        {children.map((child) => (
          <SceneObject key={child.id} id={child.id} />
        ))}
      </group>

      {/* Bounding box for selected groups - rendered outside group transform */}
      {isSelected && obj.type === "group" && <GroupBoundingBox id={id} />}
    </>
  );
}
