import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "@/store/sceneStore";

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
        time: { value: 0.0 },
        speed: { value: 0.35 },
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
        uniform float time;
        uniform float speed;
        varying vec2 vUv;

        void main() {
          float drift = time * speed;
          float t = fract((vUv.x + vUv.y + drift) * stripeDensity);
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

  useFrame(({ clock }) => {
    if (!isSelected) return;
    outlineMaterial.uniforms.time.value = clock.getElapsedTime();
  });

  const handleClick = (e) => {
    e.stopPropagation();
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
        return new THREE.TorusGeometry(0.4, 0.15, 16, 32);
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
        return new THREE.TubeGeometry(curve, 64, 0.1, 8, false);

      case "polyhedron":
        if (!obj.vertices || !obj.indices)
          return new THREE.BoxGeometry(1, 1, 1);
        return new THREE.PolyhedronGeometry(obj.vertices, obj.indices, 1, 0);

      case "edges":
        // EdgesGeometry needs a source - fallback to box for now
        return new THREE.BoxGeometry(1, 1, 1);

      default:
        return null;
    }
  }, [obj?.type, obj?.points, obj?.shape, obj?.extrudeOptions, obj?.path, obj?.vertices, obj?.indices]);

  if (!obj || !obj.visible) return null;

  return (
    <group
      position={obj.position}
      rotation={obj.rotation}
      scale={obj.scale}
      userData={{ objectId: id }}
    >
      {obj.type !== "group" && geometry && (
        <>
          <mesh
            ref={meshRef}
            onClick={handleClick}
            userData={{ objectId: id }}
            castShadow
            receiveShadow
            geometry={geometry}
          >
            <meshStandardMaterial
              color={obj.material.color}
              metalness={obj.material.metalness}
              roughness={obj.material.roughness}
              side={THREE.DoubleSide}
            />
          </mesh>

          {isSelected && (
            <mesh
              scale={[1.15, 1.15, 1.15]}
              raycast={() => null}
              renderOrder={999}
              geometry={geometry}
            >
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
