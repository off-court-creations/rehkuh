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

  const meshRef = useRef();
  const materialRef = useRef();

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
      side: THREE.DoubleSide,
    });
  }, [obj?.material]);

  // Store material ref for animation
  materialRef.current = objectMaterial;

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    // Animate outline material when selected
    if (isSelected) {
      outlineMaterial.uniforms.time.value = elapsed;
    }

    // Animate shader material uniforms
    if (obj?.material?.type === "shader" && materialRef.current) {
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
        return new THREE.TubeGeometry(curve, 64, tubeRadius, 8, false);

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
  }, [
    obj?.type,
    obj?.points,
    obj?.shape,
    obj?.extrudeOptions,
    obj?.path,
    obj?.vertices,
    obj?.indices,
  ]);

  if (!obj || !obj.visible) return null;

  return (
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
            castShadow
            receiveShadow
            geometry={geometry}
            material={objectMaterial}
          />

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
