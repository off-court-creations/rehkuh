import { z } from "zod";
import {
  PrimitiveTypeSchema,
  ObjectTypeSchema,
  Vector3Schema,
  HexColorSchema,
} from "./base";

export const TPJMaterialSideSchema = z.enum(["front", "back", "double"]);

// Shader uniform types
export const TPJUniformTypeSchema = z.enum([
  "float",
  "int",
  "bool",
  "color",
  "vec2",
  "vec3",
  "vec4",
]);

// Shader uniform definition
export const TPJUniformSchema = z.object({
  type: TPJUniformTypeSchema,
  value: z.union([z.number(), z.boolean(), z.string(), z.array(z.number())]),
  animated: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
});

// Standard material schema
export const TPJStandardMaterialSchema = z.object({
  type: z.literal("standard").optional(), // Optional for backwards compatibility
  color: HexColorSchema,
  metalness: z.number().min(0).max(1),
  roughness: z.number().min(0).max(1),
  // Optional extended properties
  emissive: HexColorSchema.optional(),
  emissiveIntensity: z.number().min(0).max(1).optional(),
  opacity: z.number().min(0).max(1).optional(),
  transparent: z.boolean().optional(),
  side: TPJMaterialSideSchema.optional(),
});

// Shader material schema
export const TPJShaderMaterialSchema = z.object({
  type: z.literal("shader"),
  vertex: z.string(),
  fragment: z.string(),
  uniforms: z.record(z.string(), TPJUniformSchema),
  transparent: z.boolean().optional(),
  side: TPJMaterialSideSchema.optional(),
  depthWrite: z.boolean().optional(),
  depthTest: z.boolean().optional(),
});

// Union type for all TPJ materials
export const TPJMaterialSchema = z.union([
  TPJStandardMaterialSchema,
  TPJShaderMaterialSchema,
]);

// Shape path command schemas (mirrors THREE.Path/Shape API)
export const TPJShapeCommandSchema = z.discriminatedUnion("op", [
  z.object({ op: z.literal("moveTo"), x: z.number(), y: z.number() }),
  z.object({ op: z.literal("lineTo"), x: z.number(), y: z.number() }),
  z.object({
    op: z.literal("bezierCurveTo"),
    cp1x: z.number(),
    cp1y: z.number(),
    cp2x: z.number(),
    cp2y: z.number(),
    x: z.number(),
    y: z.number(),
  }),
  z.object({
    op: z.literal("quadraticCurveTo"),
    cpx: z.number(),
    cpy: z.number(),
    x: z.number(),
    y: z.number(),
  }),
  z.object({
    op: z.literal("arc"),
    x: z.number(),
    y: z.number(),
    radius: z.number(),
    startAngle: z.number(),
    endAngle: z.number(),
    clockwise: z.boolean().optional(),
  }),
  z.object({
    op: z.literal("absarc"),
    x: z.number(),
    y: z.number(),
    radius: z.number(),
    startAngle: z.number(),
    endAngle: z.number(),
    clockwise: z.boolean().optional(),
  }),
  z.object({
    op: z.literal("ellipse"),
    x: z.number(),
    y: z.number(),
    xRadius: z.number(),
    yRadius: z.number(),
    startAngle: z.number(),
    endAngle: z.number(),
    clockwise: z.boolean().optional(),
    rotation: z.number().optional(),
  }),
  z.object({
    op: z.literal("absellipse"),
    x: z.number(),
    y: z.number(),
    xRadius: z.number(),
    yRadius: z.number(),
    startAngle: z.number(),
    endAngle: z.number(),
    clockwise: z.boolean().optional(),
    rotation: z.number().optional(),
  }),
]);

export const TPJShapePathSchema = z.object({
  commands: z.array(TPJShapeCommandSchema),
  holes: z.array(z.array(TPJShapeCommandSchema)).optional(),
});

// 3D curve schemas for TubeGeometry
export const TPJCurve3DSchema = z.discriminatedUnion("curveType", [
  z.object({
    curveType: z.literal("catmullRom"),
    points: z.array(Vector3Schema),
    closed: z.boolean().optional(),
    tension: z.number().optional(),
  }),
  z.object({
    curveType: z.literal("cubicBezier"),
    v0: Vector3Schema,
    v1: Vector3Schema,
    v2: Vector3Schema,
    v3: Vector3Schema,
  }),
  z.object({
    curveType: z.literal("quadraticBezier"),
    v0: Vector3Schema,
    v1: Vector3Schema,
    v2: Vector3Schema,
  }),
  z.object({
    curveType: z.literal("line"),
    v1: Vector3Schema,
    v2: Vector3Schema,
  }),
]);

// Extrude options for ExtrudeGeometry
export const TPJExtrudeOptionsSchema = z.object({
  depth: z.number().optional(),
  bevelEnabled: z.boolean().optional(),
  bevelThickness: z.number().optional(),
  bevelSize: z.number().optional(),
  bevelOffset: z.number().optional(),
  bevelSegments: z.number().optional(),
  steps: z.number().optional(),
  extrudePath: TPJCurve3DSchema.optional(),
});

// Extended geometry schema supporting all Three.js geometry types
export const TPJGeometrySchema = z.object({
  type: PrimitiveTypeSchema,
  // Simple geometries (numeric args)
  args: z.array(z.number()).optional(),
  // LatheGeometry (Vector2 points)
  points: z.array(z.tuple([z.number(), z.number()])).optional(),
  // ExtrudeGeometry, ShapeGeometry (shape path)
  shape: TPJShapePathSchema.optional(),
  // ExtrudeGeometry options
  extrudeOptions: TPJExtrudeOptionsSchema.optional(),
  // TubeGeometry (3D curve path)
  path: TPJCurve3DSchema.optional(),
  // EdgesGeometry (reference to source geometry)
  sourceGeometry: z.string().optional(),
  // PolyhedronGeometry (raw vertex/index data)
  vertices: z.array(z.number()).optional(),
  indices: z.array(z.number()).optional(),
});

export const TPJObjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: ObjectTypeSchema,
  geometry: z.string().optional(),
  material: z.string().optional(),
  position: Vector3Schema,
  rotation: Vector3Schema,
  scale: Vector3Schema,
  parent: z.string().nullable(),
  visible: z.boolean(),
  // Optional extended properties
  castShadow: z.boolean().optional(),
  receiveShadow: z.boolean().optional(),
  userData: z.record(z.string(), z.unknown()).optional(),
});

export const TPJMetadataSchema = z.object({
  name: z.string(),
  created: z.string(),
  generator: z.string(),
});

export const TPJFileSchema = z.object({
  version: z.string(),
  metadata: TPJMetadataSchema,
  materials: z.record(z.string(), TPJMaterialSchema),
  geometries: z.record(z.string(), TPJGeometrySchema),
  objects: z.array(TPJObjectSchema),
  roots: z.array(z.string()),
});

export type TPJFileZ = z.infer<typeof TPJFileSchema>;

export function validateTPJFile(
  data: unknown,
): { success: true; data: TPJFileZ } | { success: false; error: string } {
  const result = TPJFileSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const issues = result.error.issues.map((issue) => {
    const path = issue.path.join(".");
    return `${path}: ${issue.message}`;
  });
  return { success: false, error: issues.join("; ") };
}
