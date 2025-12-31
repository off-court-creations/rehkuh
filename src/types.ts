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
