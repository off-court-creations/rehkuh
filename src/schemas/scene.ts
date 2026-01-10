import { z } from "zod";
import {
  TPJShapePathSchema,
  TPJCurve3DSchema,
  TPJExtrudeOptionsSchema,
  TPJUniformSchema,
  TPJMaterialSideSchema,
} from "./tpj";
import { HexColorSchema, ObjectTypeSchema, Vector3Schema } from "./base";

// Re-export from base to maintain backwards compatibility
export {
  PrimitiveTypeSchema,
  ObjectTypeSchema,
  Vector3Schema,
  HexColorSchema,
} from "./base";

// Standard material schema for scene files
export const StandardMaterialPropsSchema = z.object({
  type: z.literal("standard").optional(), // Optional for backwards compatibility
  color: HexColorSchema,
  metalness: z.number().min(0).max(1),
  roughness: z.number().min(0).max(1),
});

// Shader material schema for scene files
export const ShaderMaterialPropsSchema = z.object({
  type: z.literal("shader"),
  shaderName: z.string(),
  vertex: z.string().optional(), // Cached from file
  fragment: z.string().optional(), // Cached from file
  uniforms: z.record(z.string(), TPJUniformSchema),
  transparent: z.boolean().optional(),
  side: TPJMaterialSideSchema.optional(),
  depthWrite: z.boolean().optional(),
  depthTest: z.boolean().optional(),
});

// Union type for all material props
export const MaterialPropsSchema = z.union([
  StandardMaterialPropsSchema,
  ShaderMaterialPropsSchema,
]);

export const SceneFileObjectSchema = z.object({
  name: z.string().min(1, "Object name cannot be empty"),
  type: ObjectTypeSchema,
  parent: z.string().optional(),
  position: Vector3Schema,
  rotation: Vector3Schema,
  scale: Vector3Schema,
  material: MaterialPropsSchema.optional(),
  // Complex geometry data (optional)
  points: z.array(z.tuple([z.number(), z.number()])).optional(),
  shape: TPJShapePathSchema.optional(),
  extrudeOptions: TPJExtrudeOptionsSchema.optional(),
  path: TPJCurve3DSchema.optional(),
  sourceGeometry: z.string().optional(),
  vertices: z.array(z.number()).optional(),
  indices: z.array(z.number()).optional(),
});

export const SceneFileSchema = z.array(SceneFileObjectSchema);

export type SceneFileObjectZ = z.infer<typeof SceneFileObjectSchema>;
export type SceneFileZ = z.infer<typeof SceneFileSchema>;

export function validateSceneFile(
  data: unknown,
): { success: true; data: SceneFileZ } | { success: false; error: string } {
  const result = SceneFileSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const issues = result.error.issues.map((issue) => {
    const path = issue.path.join(".");
    return `${path}: ${issue.message}`;
  });
  return { success: false, error: issues.join("; ") };
}

export function validateParentReferences(
  objects: SceneFileZ,
): { success: true } | { success: false; error: string } {
  const names = new Set(objects.map((o) => o.name));
  const duplicates = objects
    .map((o) => o.name)
    .filter((name, i, arr) => arr.indexOf(name) !== i);

  if (duplicates.length > 0) {
    return {
      success: false,
      error: `Duplicate object names: ${[...new Set(duplicates)].join(", ")}`,
    };
  }

  for (const obj of objects) {
    if (obj.parent && !names.has(obj.parent)) {
      return {
        success: false,
        error: `Object "${obj.name}" references non-existent parent "${obj.parent}"`,
      };
    }
  }
  return { success: true };
}
