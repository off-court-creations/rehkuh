import { z } from "zod";
import {
  PrimitiveTypeSchema,
  ObjectTypeSchema,
  Vector3Schema,
  HexColorSchema,
} from "./scene";

export const TPJMaterialSideSchema = z.enum(["front", "back", "double"]);

export const TPJMaterialSchema = z.object({
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

export const TPJGeometrySchema = z.object({
  type: PrimitiveTypeSchema,
  args: z.array(z.number()),
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
