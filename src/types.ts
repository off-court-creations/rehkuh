export type DocPageType =
  | "landing"
  | "guide"
  | "concept"
  | "tutorial"
  | "reference"
  | "recipe";

export interface DocMeta {
  id: string;
  title: string;
  description: string;
  pageType: DocPageType;
  components?: string[];
  prerequisites?: string[];
  tldr?: string;
}

// rehkuh Scene Types

export type PrimitiveType =
  // Existing
  | "box"
  | "sphere"
  | "cylinder"
  | "cone"
  | "torus"
  | "plane"
  // Simple additions
  | "capsule"
  | "circle"
  | "dodecahedron"
  | "icosahedron"
  | "octahedron"
  | "ring"
  | "tetrahedron"
  | "torusKnot"
  // Complex additions
  | "lathe"
  | "extrude"
  | "shape"
  | "tube"
  | "polyhedron";

export type TransformMode = "translate" | "rotate" | "scale";

// Material render side
export type MaterialSide = "front" | "back" | "double";

// Standard PBR material (MeshStandardMaterial)
export interface StandardMaterialProps {
  type?: "standard"; // Optional for backwards compatibility
  color: string;
  metalness: number;
  roughness: number;
  // Optional extended properties
  emissive?: string; // Hex color, default "#000000"
  emissiveIntensity?: number; // 0-1, default 0
  opacity?: number; // 0-1, default 1
  transparent?: boolean; // default false
  side?: MaterialSide; // default "front"
}

// Physical PBR material (MeshPhysicalMaterial)
// Extends standard with advanced PBR channels
export interface PhysicalMaterialProps {
  type: "physical";
  color: string;
  metalness: number;
  roughness: number;

  // Base properties (shared with standard material)
  emissive?: string; // Hex color, default "#000000"
  emissiveIntensity?: number; // >= 0, default 0
  opacity?: number; // 0-1, default 1
  transparent?: boolean; // default false
  side?: MaterialSide; // default "front"

  // Clearcoat channel (car paint, wet surfaces, varnished wood)
  clearcoat?: number; // 0-1
  clearcoatRoughness?: number; // 0-1

  // Sheen channel (velvet, felt, cloth, fabric)
  sheen?: number; // 0-1
  sheenRoughness?: number; // 0-1
  sheenColor?: string; // Hex color

  // Transmission channel (glass, water, gems, liquids)
  transmission?: number; // 0-1
  thickness?: number; // World units
  attenuationColor?: string; // Hex color
  attenuationDistance?: number; // World units (Infinity = no attenuation)

  // IOR (index of refraction)
  ior?: number; // 1.0-2.333

  // Specular channel (skin, layered materials)
  specularIntensity?: number; // 0-1
  specularColor?: string; // Hex color
  reflectivity?: number; // 0-1

  // Iridescence channel (soap bubbles, oil slicks, beetles)
  iridescence?: number; // 0-1
  iridescenceIOR?: number; // 1.0-2.333
  iridescenceThicknessRange?: [number, number]; // [min, max] nanometers

  // Anisotropy channel (brushed metal, hair, satin)
  anisotropy?: number; // 0-1
  anisotropyRotation?: number; // Radians

  // Dispersion (diamonds, prisms, cut glass)
  dispersion?: number; // 0+

  // Other
  envMapIntensity?: number; // 0+
  flatShading?: boolean;
}

// Uniform types for shader materials
export type ShaderUniformType =
  | "float"
  | "int"
  | "bool"
  | "color"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat3"
  | "mat4";

export interface ShaderUniform {
  type: ShaderUniformType;
  value: number | boolean | string | number[];
  animated?: boolean; // If true, runtime updates (e.g., time, resolution)
  min?: number; // UI hint for sliders
  max?: number; // UI hint for sliders
}

// Shader material (custom GLSL shaders)
// Either use shaderName (external files) OR inline vertex/fragment
export interface ShaderMaterialProps {
  type: "shader";
  shaderName?: string; // References shaders/{name}.vert and .frag files
  vertex?: string; // Inline or cached vertex shader code
  fragment?: string; // Inline or cached fragment shader code
  uniforms: Record<string, ShaderUniform>;
  transparent?: boolean;
  side?: "front" | "back" | "double";
  depthWrite?: boolean;
  depthTest?: boolean;
}

// Union type for all materials
export type MaterialProps =
  | StandardMaterialProps
  | PhysicalMaterialProps
  | ShaderMaterialProps;

// Type guards
export function isShaderMaterial(
  mat: MaterialProps,
): mat is ShaderMaterialProps {
  return mat.type === "shader";
}

export function isPhysicalMaterial(
  mat: MaterialProps,
): mat is PhysicalMaterialProps {
  return mat.type === "physical";
}

export function isStandardMaterial(
  mat: MaterialProps,
): mat is StandardMaterialProps {
  return mat.type === "standard" || mat.type === undefined;
}

export interface SceneObject {
  id: string;
  name: string;
  type: PrimitiveType | "group";
  parentId: string | null;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  material: MaterialProps;
  visible: boolean;
  locked: boolean;
  // Shadow properties (optional, default true for meshes)
  castShadow?: boolean;
  receiveShadow?: boolean;
  // Custom properties
  userData?: Record<string, unknown>;
  // Box geometry subdivision
  boxWidthSegments?: number;
  boxHeightSegments?: number;
  boxDepthSegments?: number;
  // Sphere geometry subdivision
  sphereWidthSegments?: number;
  sphereHeightSegments?: number;
  // Sphere geometry partial sphere params (radians)
  spherePhiStart?: number;
  spherePhiLength?: number;
  sphereThetaStart?: number;
  sphereThetaLength?: number;
  // Cylinder geometry params
  cylinderRadiusTop?: number;
  cylinderRadiusBottom?: number;
  cylinderRadialSegments?: number;
  cylinderHeightSegments?: number;
  cylinderOpenEnded?: boolean;
  cylinderThetaStart?: number;
  cylinderThetaLength?: number;
  // Cone geometry params
  coneRadius?: number;
  coneRadialSegments?: number;
  coneHeightSegments?: number;
  coneOpenEnded?: boolean;
  coneThetaStart?: number;
  coneThetaLength?: number;
  // Torus geometry params
  torusRadius?: number;
  torusTube?: number;
  torusRadialSegments?: number;
  torusTubularSegments?: number;
  torusArc?: number;
  // Plane geometry params
  planeWidthSegments?: number;
  planeHeightSegments?: number;
  // Capsule geometry params
  capsuleRadius?: number;
  capsuleLength?: number;
  capsuleCapSegments?: number;
  capsuleRadialSegments?: number;
  // Circle geometry params
  circleRadius?: number;
  circleSegments?: number;
  circleThetaStart?: number;
  circleThetaLength?: number;
  // Ring geometry params
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  ringThetaSegments?: number;
  ringPhiSegments?: number;
  ringThetaStart?: number;
  ringThetaLength?: number;
  // TorusKnot geometry params
  torusKnotRadius?: number;
  torusKnotTube?: number;
  torusKnotTubularSegments?: number;
  torusKnotRadialSegments?: number;
  torusKnotP?: number;
  torusKnotQ?: number;
  // Polyhedra geometry params (shared: radius, detail)
  octaRadius?: number;
  octaDetail?: number;
  dodecaRadius?: number;
  dodecaDetail?: number;
  icosaRadius?: number;
  icosaDetail?: number;
  tetraRadius?: number;
  tetraDetail?: number;
  // Complex geometry data (optional, for lathe/extrude/shape/tube/polyhedron)
  points?: [number, number][];
  shape?: TSPShapePath;
  extrudeOptions?: TSPExtrudeOptions;
  path?: TSPCurve3D;
  tubeRadius?: number;
  tubeTubularSegments?: number;
  tubeRadialSegments?: number;
  tubeClosed?: boolean;
  vertices?: number[];
  indices?: number[];
}

export interface SelectionState {
  selectedIds: string[];
  primaryId: string | null;
}

// TSP (Three Shaded Primitive) Export Types

export type TSPMaterialSide = "front" | "back" | "double";

// Standard PBR material for TSP
export interface TSPStandardMaterial {
  type?: "standard"; // Optional for backwards compatibility
  color: string;
  metalness: number;
  roughness: number;
  // Optional extended properties
  emissive?: string; // Hex color, default "#000000"
  emissiveIntensity?: number; // 0-1, default 0
  opacity?: number; // 0-1, default 1
  transparent?: boolean; // default false
  side?: TSPMaterialSide; // default "front"
}

// Shader material for TSP (inline GLSL)
export interface TSPShaderMaterial {
  type: "shader";
  vertex: string; // GLSL vertex shader code
  fragment: string; // GLSL fragment shader code
  uniforms: Record<string, ShaderUniform>;
  transparent?: boolean;
  side?: TSPMaterialSide;
  depthWrite?: boolean;
  depthTest?: boolean;
}

// Physical PBR material for TSP (MeshPhysicalMaterial)
export interface TSPPhysicalMaterial {
  type: "physical";
  color: string;
  metalness: number;
  roughness: number;

  // Base properties (optional, with defaults)
  emissive?: string;
  emissiveIntensity?: number;
  opacity?: number;
  transparent?: boolean;
  side?: TSPMaterialSide;

  // Clearcoat channel
  clearcoat?: number;
  clearcoatRoughness?: number;

  // Sheen channel
  sheen?: number;
  sheenRoughness?: number;
  sheenColor?: string;

  // Transmission channel
  transmission?: number;
  thickness?: number;
  attenuationColor?: string;
  attenuationDistance?: number;

  // IOR
  ior?: number;

  // Specular channel
  specularIntensity?: number;
  specularColor?: string;
  reflectivity?: number;

  // Iridescence channel
  iridescence?: number;
  iridescenceIOR?: number;
  iridescenceThicknessRange?: [number, number];

  // Anisotropy channel
  anisotropy?: number;
  anisotropyRotation?: number;

  // Dispersion
  dispersion?: number;

  // Other
  envMapIntensity?: number;
  flatShading?: boolean;
}

// Union type for TSP materials
export type TSPMaterial =
  | TSPStandardMaterial
  | TSPPhysicalMaterial
  | TSPShaderMaterial;

// Shape path command types (mirrors THREE.Path/Shape API)
export type TSPShapeCommand =
  | { op: "moveTo"; x: number; y: number }
  | { op: "lineTo"; x: number; y: number }
  | {
      op: "bezierCurveTo";
      cp1x: number;
      cp1y: number;
      cp2x: number;
      cp2y: number;
      x: number;
      y: number;
    }
  | { op: "quadraticCurveTo"; cpx: number; cpy: number; x: number; y: number }
  | {
      op: "arc";
      x: number;
      y: number;
      radius: number;
      startAngle: number;
      endAngle: number;
      clockwise?: boolean;
    }
  | {
      op: "absarc";
      x: number;
      y: number;
      radius: number;
      startAngle: number;
      endAngle: number;
      clockwise?: boolean;
    }
  | {
      op: "ellipse";
      x: number;
      y: number;
      xRadius: number;
      yRadius: number;
      startAngle: number;
      endAngle: number;
      clockwise?: boolean;
      rotation?: number;
    }
  | {
      op: "absellipse";
      x: number;
      y: number;
      xRadius: number;
      yRadius: number;
      startAngle: number;
      endAngle: number;
      clockwise?: boolean;
      rotation?: number;
    };

export interface TSPShapePath {
  commands: TSPShapeCommand[];
  holes?: TSPShapeCommand[][];
}

// 3D curve types for TubeGeometry
export type TSPCurve3D =
  | {
      curveType: "catmullRom";
      points: [number, number, number][];
      closed?: boolean;
      tension?: number;
    }
  | {
      curveType: "cubicBezier";
      v0: [number, number, number];
      v1: [number, number, number];
      v2: [number, number, number];
      v3: [number, number, number];
    }
  | {
      curveType: "quadraticBezier";
      v0: [number, number, number];
      v1: [number, number, number];
      v2: [number, number, number];
    }
  | {
      curveType: "line";
      v1: [number, number, number];
      v2: [number, number, number];
    };

// Extrude options for ExtrudeGeometry
export interface TSPExtrudeOptions {
  depth?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelOffset?: number;
  bevelSegments?: number;
  steps?: number;
  extrudePath?: TSPCurve3D;
}

export interface TSPGeometry {
  type: PrimitiveType;
  // Simple geometries (numeric args)
  args?: number[];
  // BoxGeometry subdivision
  boxWidthSegments?: number;
  boxHeightSegments?: number;
  boxDepthSegments?: number;
  // SphereGeometry subdivision
  sphereWidthSegments?: number;
  sphereHeightSegments?: number;
  // SphereGeometry partial sphere params (radians)
  spherePhiStart?: number;
  spherePhiLength?: number;
  sphereThetaStart?: number;
  sphereThetaLength?: number;
  // CylinderGeometry params
  cylinderRadiusTop?: number;
  cylinderRadiusBottom?: number;
  cylinderRadialSegments?: number;
  cylinderHeightSegments?: number;
  cylinderOpenEnded?: boolean;
  cylinderThetaStart?: number;
  cylinderThetaLength?: number;
  // ConeGeometry params
  coneRadius?: number;
  coneRadialSegments?: number;
  coneHeightSegments?: number;
  coneOpenEnded?: boolean;
  coneThetaStart?: number;
  coneThetaLength?: number;
  // TorusGeometry params
  torusRadius?: number;
  torusTube?: number;
  torusRadialSegments?: number;
  torusTubularSegments?: number;
  torusArc?: number;
  // PlaneGeometry params
  planeWidthSegments?: number;
  planeHeightSegments?: number;
  // CapsuleGeometry params
  capsuleRadius?: number;
  capsuleLength?: number;
  capsuleCapSegments?: number;
  capsuleRadialSegments?: number;
  // CircleGeometry params
  circleRadius?: number;
  circleSegments?: number;
  circleThetaStart?: number;
  circleThetaLength?: number;
  // RingGeometry params
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  ringThetaSegments?: number;
  ringPhiSegments?: number;
  ringThetaStart?: number;
  ringThetaLength?: number;
  // TorusKnotGeometry params
  torusKnotRadius?: number;
  torusKnotTube?: number;
  torusKnotTubularSegments?: number;
  torusKnotRadialSegments?: number;
  torusKnotP?: number;
  torusKnotQ?: number;
  // Polyhedra geometry params (shared: radius, detail)
  octaRadius?: number;
  octaDetail?: number;
  dodecaRadius?: number;
  dodecaDetail?: number;
  icosaRadius?: number;
  icosaDetail?: number;
  tetraRadius?: number;
  tetraDetail?: number;
  // LatheGeometry (Vector2 points)
  points?: [number, number][];
  // ExtrudeGeometry, ShapeGeometry (shape path)
  shape?: TSPShapePath;
  // ExtrudeGeometry options
  extrudeOptions?: TSPExtrudeOptions;
  // TubeGeometry (3D curve path)
  path?: TSPCurve3D;
  // TubeGeometry radius
  tubeRadius?: number;
  // TubeGeometry tubular segments
  tubeTubularSegments?: number;
  // TubeGeometry radial segments
  tubeRadialSegments?: number;
  // TubeGeometry closed
  tubeClosed?: boolean;
  // PolyhedronGeometry (raw vertex/index data)
  vertices?: number[];
  indices?: number[];
}

export interface TSPObject {
  id: string;
  name: string;
  type: PrimitiveType | "group";
  geometry?: string; // key into geometries dict (omitted for groups)
  material?: string; // key into materials dict (omitted for groups)
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  parent: string | null; // id of parent object
  visible: boolean;
  // Optional extended properties
  castShadow?: boolean; // default true for meshes
  receiveShadow?: boolean; // default true for meshes
  userData?: Record<string, unknown>; // custom properties
}

export interface TSPMetadata {
  version: string; // TSP format version (semver X.Y.Z)
  id: string; // UUID v4 - users can use this how they please
  created: string; // ISO 8601 timestamp
  generator: string;
  generatorVersion: string; // semver of the generator (e.g. rehkuh version)
  prerelease?: string; // e.g., "rc.1", "beta.2"
  author?: string;
  copyright?: string;
  title?: string;
  description?: string;
}

// Animation Types (shared between Scene and TSP formats)

export type AnimationPath = "position" | "scale" | "quaternion" | "visible";
export type AnimationInterpolation = "linear" | "smooth" | "discrete";

// Base track interface (shared shape, target type varies by format)
export interface AnimationTrackBase {
  path: AnimationPath;
  interpolation: AnimationInterpolation;
  times: number[];
  values: number[] | boolean[];
}

// JSON Scene Format: target by object NAME
export interface SceneAnimationTrack extends AnimationTrackBase {
  target: string; // Object name (matches objects[].name)
}

export interface SceneAnimationClip {
  name: string;
  duration?: number;
  tracks: SceneAnimationTrack[];
}

// TSP Format: target by object UUID
export interface TSPAnimationTrack extends AnimationTrackBase {
  target: string; // Object UUID (matches objects[].id)
}

export interface TSPAnimationClip {
  name: string;
  duration?: number;
  tracks: TSPAnimationTrack[];
}

export interface TSPFile {
  metadata: TSPMetadata;
  materials: Record<string, TSPMaterial>;
  geometries: Record<string, TSPGeometry>;
  objects: TSPObject[];
  roots: string[]; // ids of root objects
  animations?: Record<string, TSPAnimationClip>; // Animation clips by key
}
