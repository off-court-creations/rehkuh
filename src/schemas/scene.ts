import { z } from "zod";
import {
  TSPShapePathSchema,
  TSPCurve3DSchema,
  TSPExtrudeOptionsSchema,
  TSPUniformSchema,
  TSPMaterialSideSchema,
} from "./tsp";
import {
  HexColorSchema,
  ObjectTypeSchema,
  Vector2Schema,
  Vector3Schema,
} from "./base";

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
  // Extended properties
  emissive: HexColorSchema.optional(),
  emissiveIntensity: z.number().min(0).max(1).optional(),
  opacity: z.number().min(0).max(1).optional(),
  transparent: z.boolean().optional(),
  side: TSPMaterialSideSchema.optional(),
});

// Shader material schema for scene files
export const ShaderMaterialPropsSchema = z.object({
  type: z.literal("shader"),
  shaderName: z.string().optional(), // Reference to external shader file
  vertex: z.string().optional(), // Inline or cached from file
  fragment: z.string().optional(), // Inline or cached from file
  uniforms: z.record(z.string(), TSPUniformSchema),
  transparent: z.boolean().optional(),
  side: TSPMaterialSideSchema.optional(),
  depthWrite: z.boolean().optional(),
  depthTest: z.boolean().optional(),
});

// Physical material schema for scene files (MeshPhysicalMaterial)
export const PhysicalMaterialPropsSchema = z.object({
  type: z.literal("physical"),
  color: HexColorSchema,
  metalness: z.number().min(0).max(1),
  roughness: z.number().min(0).max(1),

  // Clearcoat channel
  clearcoat: z.number().min(0).max(1).optional(),
  clearcoatRoughness: z.number().min(0).max(1).optional(),

  // Sheen channel
  sheen: z.number().min(0).max(1).optional(),
  sheenRoughness: z.number().min(0).max(1).optional(),
  sheenColor: HexColorSchema.optional(),

  // Transmission channel
  transmission: z.number().min(0).max(1).optional(),
  thickness: z.number().min(0).optional(),
  attenuationColor: HexColorSchema.optional(),
  attenuationDistance: z.number().min(0).optional(),

  // IOR
  ior: z.number().min(1).max(2.333).optional(),

  // Specular channel
  specularIntensity: z.number().min(0).max(1).optional(),
  specularColor: HexColorSchema.optional(),
  reflectivity: z.number().min(0).max(1).optional(),

  // Iridescence channel
  iridescence: z.number().min(0).max(1).optional(),
  iridescenceIOR: z.number().min(1).max(2.333).optional(),
  iridescenceThicknessRange: Vector2Schema.optional(),

  // Anisotropy channel
  anisotropy: z.number().min(0).max(1).optional(),
  anisotropyRotation: z.number().optional(),

  // Dispersion
  dispersion: z.number().min(0).optional(),

  // Other
  envMapIntensity: z.number().min(0).optional(),
  flatShading: z.boolean().optional(),
});

// Union type for all material props
export const MaterialPropsSchema = z.union([
  StandardMaterialPropsSchema,
  PhysicalMaterialPropsSchema,
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
  // Box geometry subdivision
  boxWidthSegments: z.number().int().min(1).optional(),
  boxHeightSegments: z.number().int().min(1).optional(),
  boxDepthSegments: z.number().int().min(1).optional(),
  // Complex geometry data (optional)
  points: z.array(z.tuple([z.number(), z.number()])).optional(),
  shape: TSPShapePathSchema.optional(),
  extrudeOptions: TSPExtrudeOptionsSchema.optional(),
  path: TSPCurve3DSchema.optional(),
  tubeRadius: z.number().min(0).optional(), // For tube geometry
  tubeTubularSegments: z.number().int().min(1).optional(), // For tube geometry
  tubeRadialSegments: z.number().int().min(3).optional(), // For tube geometry
  tubeClosed: z.boolean().optional(), // For tube geometry
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
