#!/usr/bin/env npx tsx
/**
 * Validates staging-scene.json and promotes it to scene.json if valid.
 *
 * Usage:
 *   npx tsx scripts/promote-staging.ts
 *   npm run promote-staging
 *
 * Exit codes:
 *   0 - Success, staging promoted to scene
 *   1 - Validation failed
 *   2 - File read/write error
 */

import "dotenv/config";
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "fs";
import { join } from "path";

// Import validation functions - use relative path for script
const SCENE_DIR = join(process.cwd(), "scene");
const STAGING_PATH = join(SCENE_DIR, "staging-scene.json");
const SCENE_PATH = join(SCENE_DIR, "scene.json");
const BACKUP_PATH = join(SCENE_DIR, "scene.backup.json");
const SHADERS_DIR = join(process.cwd(), "shaders");
const STAGING_SHADERS_DIR = join(SHADERS_DIR, "staging");

// Inline validation to avoid module resolution issues in script context
import { z } from "zod";

// Base schemas
const HexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const Vector2Schema = z.tuple([z.number(), z.number()]);
const Vector3Schema = z.tuple([z.number(), z.number(), z.number()]);

const PrimitiveTypeSchema = z.enum([
  "box",
  "sphere",
  "cylinder",
  "cone",
  "torus",
  "plane",
  "capsule",
  "circle",
  "dodecahedron",
  "icosahedron",
  "octahedron",
  "ring",
  "tetrahedron",
  "torusKnot",
  "lathe",
  "extrude",
  "shape",
  "tube",
  "polyhedron",
]);

const ObjectTypeSchema = z.union([PrimitiveTypeSchema, z.literal("group")]);

const TSPMaterialSideSchema = z.enum(["front", "back", "double"]);

const TSPUniformTypeSchema = z.enum([
  "float",
  "int",
  "bool",
  "color",
  "vec2",
  "vec3",
  "vec4",
]);

const TSPUniformSchema = z.object({
  type: TSPUniformTypeSchema,
  value: z.union([z.number(), z.boolean(), z.string(), z.array(z.number())]),
  animated: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
});

// Material schemas
const StandardMaterialPropsSchema = z.object({
  type: z.literal("standard").optional(),
  color: HexColorSchema,
  metalness: z.number().min(0).max(1),
  roughness: z.number().min(0).max(1),
});

const ShaderMaterialPropsSchema = z.object({
  type: z.literal("shader"),
  shaderName: z.string().optional(),
  vertex: z.string().optional(),
  fragment: z.string().optional(),
  uniforms: z.record(z.string(), TSPUniformSchema),
  transparent: z.boolean().optional(),
  side: TSPMaterialSideSchema.optional(),
  depthWrite: z.boolean().optional(),
  depthTest: z.boolean().optional(),
});

const PhysicalMaterialPropsSchema = z.object({
  type: z.literal("physical"),
  color: HexColorSchema,
  metalness: z.number().min(0).max(1),
  roughness: z.number().min(0).max(1),
  clearcoat: z.number().min(0).max(1).optional(),
  clearcoatRoughness: z.number().min(0).max(1).optional(),
  sheen: z.number().min(0).max(1).optional(),
  sheenRoughness: z.number().min(0).max(1).optional(),
  sheenColor: HexColorSchema.optional(),
  transmission: z.number().min(0).max(1).optional(),
  thickness: z.number().min(0).optional(),
  attenuationColor: HexColorSchema.optional(),
  attenuationDistance: z.number().min(0).optional(),
  ior: z.number().min(1).max(2.333).optional(),
  specularIntensity: z.number().min(0).max(1).optional(),
  specularColor: HexColorSchema.optional(),
  reflectivity: z.number().min(0).max(1).optional(),
  iridescence: z.number().min(0).max(1).optional(),
  iridescenceIOR: z.number().min(1).max(2.333).optional(),
  iridescenceThicknessRange: Vector2Schema.optional(),
  anisotropy: z.number().min(0).max(1).optional(),
  anisotropyRotation: z.number().optional(),
  dispersion: z.number().min(0).optional(),
  envMapIntensity: z.number().min(0).optional(),
  flatShading: z.boolean().optional(),
});

const MaterialPropsSchema = z.union([
  StandardMaterialPropsSchema,
  PhysicalMaterialPropsSchema,
  ShaderMaterialPropsSchema,
]);

// Shape path schemas
const TSPShapeCommandSchema = z.discriminatedUnion("op", [
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

const TSPShapePathSchema = z.object({
  commands: z.array(TSPShapeCommandSchema),
  holes: z.array(z.array(TSPShapeCommandSchema)).optional(),
});

const TSPCurve3DSchema = z.discriminatedUnion("curveType", [
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

const TSPExtrudeOptionsSchema = z.object({
  depth: z.number().optional(),
  bevelEnabled: z.boolean().optional(),
  bevelThickness: z.number().optional(),
  bevelSize: z.number().optional(),
  bevelOffset: z.number().optional(),
  bevelSegments: z.number().optional(),
  steps: z.number().optional(),
  extrudePath: TSPCurve3DSchema.optional(),
});

// Scene file object schema
const SceneFileObjectSchema = z.object({
  name: z.string().min(1, "Object name cannot be empty"),
  type: ObjectTypeSchema,
  parent: z.string().optional(),
  position: Vector3Schema,
  rotation: Vector3Schema,
  scale: Vector3Schema,
  material: MaterialPropsSchema.optional(),
  points: z.array(z.tuple([z.number(), z.number()])).optional(),
  shape: TSPShapePathSchema.optional(),
  extrudeOptions: TSPExtrudeOptionsSchema.optional(),
  path: TSPCurve3DSchema.optional(),
  tubeRadius: z.number().min(0).optional(),
  vertices: z.array(z.number()).optional(),
  indices: z.array(z.number()).optional(),
});

const SceneFileSchema = z.array(SceneFileObjectSchema);

type SceneFileZ = z.infer<typeof SceneFileSchema>;

function validateSceneFile(
  data: unknown
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

function validateParentReferences(
  objects: SceneFileZ
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

// Main promotion logic
function promoteStaging(): { success: boolean; message: string } {
  // Check staging file exists
  if (!existsSync(STAGING_PATH)) {
    return {
      success: false,
      message: `Staging file not found: ${STAGING_PATH}`,
    };
  }

  // Read staging file
  let rawContent: string;
  try {
    rawContent = readFileSync(STAGING_PATH, "utf-8");
  } catch (err) {
    return {
      success: false,
      message: `Failed to read staging file: ${err}`,
    };
  }

  // Parse JSON
  let data: unknown;
  try {
    data = JSON.parse(rawContent);
  } catch (err) {
    return {
      success: false,
      message: `Invalid JSON in staging file: ${err}`,
    };
  }

  // Validate schema
  const validation = validateSceneFile(data);
  if (!validation.success) {
    return {
      success: false,
      message: `Schema validation failed: ${validation.error}`,
    };
  }

  // Validate parent references
  const parentValidation = validateParentReferences(validation.data);
  if (!parentValidation.success) {
    return {
      success: false,
      message: `Parent validation failed: ${parentValidation.error}`,
    };
  }

  // Validate and collect shader materials that reference external files
  const shaderNames = new Set<string>();
  for (const obj of validation.data) {
    const mat = obj.material;
    if (mat && mat.type === "shader" && mat.shaderName) {
      shaderNames.add(mat.shaderName);
    }
  }

  // Check that all referenced staging shaders exist
  const missingShaders: string[] = [];
  for (const shaderName of shaderNames) {
    const vertPath = join(STAGING_SHADERS_DIR, `${shaderName}.vert`);
    const fragPath = join(STAGING_SHADERS_DIR, `${shaderName}.frag`);
    if (!existsSync(vertPath)) {
      missingShaders.push(`${shaderName}.vert`);
    }
    if (!existsSync(fragPath)) {
      missingShaders.push(`${shaderName}.frag`);
    }
  }

  if (missingShaders.length > 0) {
    return {
      success: false,
      message: `Missing staging shader files in shaders/staging/: ${missingShaders.join(", ")}`,
    };
  }

  // Copy staging shaders to production shaders directory
  for (const shaderName of shaderNames) {
    const stagingVertPath = join(STAGING_SHADERS_DIR, `${shaderName}.vert`);
    const stagingFragPath = join(STAGING_SHADERS_DIR, `${shaderName}.frag`);
    const prodVertPath = join(SHADERS_DIR, `${shaderName}.vert`);
    const prodFragPath = join(SHADERS_DIR, `${shaderName}.frag`);

    try {
      copyFileSync(stagingVertPath, prodVertPath);
      copyFileSync(stagingFragPath, prodFragPath);
    } catch (err) {
      return {
        success: false,
        message: `Failed to copy shader ${shaderName}: ${err}`,
      };
    }
  }

  // Backup current scene.json if it exists
  if (existsSync(SCENE_PATH)) {
    try {
      copyFileSync(SCENE_PATH, BACKUP_PATH);
    } catch (err) {
      console.warn(`Warning: Could not create backup: ${err}`);
    }
  }

  // Write validated content to scene.json (formatted)
  try {
    const formattedContent = JSON.stringify(validation.data, null, 2);
    writeFileSync(SCENE_PATH, formattedContent, "utf-8");
  } catch (err) {
    return {
      success: false,
      message: `Failed to write scene file: ${err}`,
    };
  }

  const shaderCount = shaderNames.size;
  const shaderMsg = shaderCount > 0 ? ` and ${shaderCount} shader(s)` : "";
  return {
    success: true,
    message: `Promoted ${validation.data.length} objects${shaderMsg} from staging to scene`,
  };
}

// Try API first (if dev server is running), then fall back to direct file write
async function tryApiPromotion(): Promise<{
  success: boolean;
  message: string;
} | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);

    const candidatePorts = process.env.VITE_PORT
      ? [process.env.VITE_PORT]
      : ["5178", "5173"];

    for (const port of candidatePorts) {
      try {
        const res = await fetch(`http://localhost:${port}/__promote-staging`, {
          method: "POST",
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const data = (await res.json()) as {
          ok?: boolean;
          message?: string;
          error?: string;
        };
        if (data.ok) {
          return { success: true, message: data.message || "Promoted via API" };
        }
        return {
          success: false,
          message: data.error || "API promotion failed",
        };
      } catch {
        // try next port
      }
    }

    clearTimeout(timeout);
    return null;
  } catch {
    // Server not running or unreachable, fall back to direct file write
    return null;
  }
}

// Run if executed directly
(async () => {
  // Try API first
  const apiResult = await tryApiPromotion();
  if (apiResult !== null) {
    if (apiResult.success) {
      console.log(`✓ ${apiResult.message}`);
      process.exit(0);
    } else {
      console.error(`✗ ${apiResult.message}`);
      process.exit(1);
    }
  }

  // Fall back to direct file operations (server not running)
  const result = promoteStaging();
  if (result.success) {
    console.log(`✓ ${result.message}`);
    process.exit(0);
  } else {
    console.error(`✗ ${result.message}`);
    process.exit(1);
  }
})();
