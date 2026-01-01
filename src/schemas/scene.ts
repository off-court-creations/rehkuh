import { z } from "zod";

export const PrimitiveTypeSchema = z.enum([
  "box",
  "sphere",
  "cylinder",
  "cone",
  "torus",
  "plane",
]);

export const ObjectTypeSchema = z.enum([
  "box",
  "sphere",
  "cylinder",
  "cone",
  "torus",
  "plane",
  "group",
]);

export const Vector3Schema = z.tuple([z.number(), z.number(), z.number()]);

export const HexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color format");

export const MaterialPropsSchema = z.object({
  color: HexColorSchema,
  metalness: z.number().min(0).max(1),
  roughness: z.number().min(0).max(1),
});

export const SceneFileObjectSchema = z.object({
  name: z.string().min(1, "Object name cannot be empty"),
  type: ObjectTypeSchema,
  parent: z.string().optional(),
  position: Vector3Schema,
  rotation: Vector3Schema,
  scale: Vector3Schema,
  material: MaterialPropsSchema.optional(),
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
