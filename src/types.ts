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

// Clay Scene Types

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
  | "edges"
  | "polyhedron";

export type TransformMode = "translate" | "rotate" | "scale";

// Standard PBR material (MeshStandardMaterial)
export interface StandardMaterialProps {
  type?: "standard"; // Optional for backwards compatibility
  color: string;
  metalness: number;
  roughness: number;
}

// Uniform types for shader materials
export type ShaderUniformType =
  | "float"
  | "int"
  | "bool"
  | "color"
  | "vec2"
  | "vec3"
  | "vec4";

export interface ShaderUniform {
  type: ShaderUniformType;
  value: number | boolean | string | number[];
  animated?: boolean; // If true, runtime updates (e.g., time)
  min?: number; // UI hint for sliders
  max?: number; // UI hint for sliders
  step?: number; // UI hint for sliders
}

// Shader material (custom GLSL shaders)
export interface ShaderMaterialProps {
  type: "shader";
  shaderName: string; // References shaders/{name}.vert and .frag files
  vertex?: string; // Cached vertex shader code (loaded from file)
  fragment?: string; // Cached fragment shader code (loaded from file)
  uniforms: Record<string, ShaderUniform>;
  transparent?: boolean;
  side?: "front" | "back" | "double";
  depthWrite?: boolean;
  depthTest?: boolean;
}

// Union type for all materials
export type MaterialProps = StandardMaterialProps | ShaderMaterialProps;

// Type guards
export function isShaderMaterial(
  mat: MaterialProps,
): mat is ShaderMaterialProps {
  return mat.type === "shader";
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
  // Complex geometry data (optional, for lathe/extrude/shape/tube/edges/polyhedron)
  points?: [number, number][];
  shape?: TPJShapePath;
  extrudeOptions?: TPJExtrudeOptions;
  path?: TPJCurve3D;
  sourceGeometry?: string;
  vertices?: number[];
  indices?: number[];
}

export interface SelectionState {
  selectedIds: string[];
  primaryId: string | null;
}

// TPJ (Three Primitive JSON) Export Types

export type TPJMaterialSide = "front" | "back" | "double";

// Standard PBR material for TPJ
export interface TPJStandardMaterial {
  type?: "standard"; // Optional for backwards compatibility
  color: string;
  metalness: number;
  roughness: number;
  // Optional extended properties
  emissive?: string; // Hex color, default "#000000"
  emissiveIntensity?: number; // 0-1, default 0
  opacity?: number; // 0-1, default 1
  transparent?: boolean; // default false
  side?: TPJMaterialSide; // default "front"
}

// Shader material for TPJ (inline GLSL)
export interface TPJShaderMaterial {
  type: "shader";
  vertex: string; // GLSL vertex shader code
  fragment: string; // GLSL fragment shader code
  uniforms: Record<string, ShaderUniform>;
  transparent?: boolean;
  side?: TPJMaterialSide;
  depthWrite?: boolean;
  depthTest?: boolean;
}

// Union type for TPJ materials
export type TPJMaterial = TPJStandardMaterial | TPJShaderMaterial;

// Shape path command types (mirrors THREE.Path/Shape API)
export type TPJShapeCommand =
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

export interface TPJShapePath {
  commands: TPJShapeCommand[];
  holes?: TPJShapeCommand[][];
}

// 3D curve types for TubeGeometry
export type TPJCurve3D =
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
export interface TPJExtrudeOptions {
  depth?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelOffset?: number;
  bevelSegments?: number;
  steps?: number;
  extrudePath?: TPJCurve3D;
}

export interface TPJGeometry {
  type: PrimitiveType;
  // Simple geometries (numeric args)
  args?: number[];
  // LatheGeometry (Vector2 points)
  points?: [number, number][];
  // ExtrudeGeometry, ShapeGeometry (shape path)
  shape?: TPJShapePath;
  // ExtrudeGeometry options
  extrudeOptions?: TPJExtrudeOptions;
  // TubeGeometry (3D curve path)
  path?: TPJCurve3D;
  // EdgesGeometry (reference to source geometry)
  sourceGeometry?: string;
  // PolyhedronGeometry (raw vertex/index data)
  vertices?: number[];
  indices?: number[];
}

export interface TPJObject {
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

export interface TPJMetadata {
  name: string;
  created: string; // ISO 8601 timestamp
  generator: string;
}

export interface TPJFile {
  version: string;
  metadata: TPJMetadata;
  materials: Record<string, TPJMaterial>;
  geometries: Record<string, TPJGeometry>;
  objects: TPJObject[];
  roots: string[]; // ids of root objects
}
