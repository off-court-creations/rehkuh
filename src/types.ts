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
  | "box"
  | "sphere"
  | "cylinder"
  | "cone"
  | "torus"
  | "plane";

export type TransformMode = "translate" | "rotate" | "scale";

export interface MaterialProps {
  color: string;
  metalness: number;
  roughness: number;
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
}

export interface SelectionState {
  selectedIds: string[];
  primaryId: string | null;
}

// TPJ (Three Primitive JSON) Export Types

export type TPJMaterialSide = "front" | "back" | "double";

export interface TPJMaterial {
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

export interface TPJGeometry {
  type: PrimitiveType;
  args: number[];
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
