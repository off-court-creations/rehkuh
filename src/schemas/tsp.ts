import { z } from "zod";
import {
  PrimitiveTypeSchema,
  ObjectTypeSchema,
  Vector2Schema,
  Vector3Schema,
  HexColorSchema,
} from "./base";

export const TSPMaterialSideSchema = z.enum(["front", "back", "double"]);

// Shader blending modes (maps to THREE.*Blending constants)
export const TSPBlendingSchema = z.enum([
  "normal",
  "additive",
  "subtractive",
  "multiply",
]);

// Shader uniform types
export const TSPUniformTypeSchema = z.enum([
  "float",
  "int",
  "bool",
  "color",
  "vec2",
  "vec3",
  "vec4",
  "mat3",
  "mat4",
]);

// Base uniform properties shared across all types
const TSPUniformBaseSchema = z.object({
  animated: z.boolean().optional(),
  min: z.number().optional(), // UI hint for sliders
  max: z.number().optional(), // UI hint for sliders
});

// Shader uniform definition with type-specific validation
export const TSPUniformSchema = z.discriminatedUnion("type", [
  TSPUniformBaseSchema.extend({
    type: z.literal("float"),
    value: z.number(),
  }),
  TSPUniformBaseSchema.extend({
    type: z.literal("int"),
    value: z.number().int(),
  }),
  TSPUniformBaseSchema.extend({
    type: z.literal("bool"),
    value: z.boolean(),
  }),
  TSPUniformBaseSchema.extend({
    type: z.literal("color"),
    value: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be hex color #RRGGBB"),
  }),
  TSPUniformBaseSchema.extend({
    type: z.literal("vec2"),
    value: z.tuple([z.number(), z.number()]),
  }),
  TSPUniformBaseSchema.extend({
    type: z.literal("vec3"),
    value: z.tuple([z.number(), z.number(), z.number()]),
  }),
  TSPUniformBaseSchema.extend({
    type: z.literal("vec4"),
    value: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  }),
  TSPUniformBaseSchema.extend({
    type: z.literal("mat3"),
    value: z.array(z.number()).length(9, "mat3 requires exactly 9 values"),
  }),
  TSPUniformBaseSchema.extend({
    type: z.literal("mat4"),
    value: z.array(z.number()).length(16, "mat4 requires exactly 16 values"),
  }),
]);

// Standard material schema
export const TSPStandardMaterialSchema = z
  .object({
    type: z.literal("standard").optional(), // Optional for backwards compatibility
    color: HexColorSchema,
    metalness: z.number().min(0).max(1),
    roughness: z.number().min(0).max(1),
    // Optional extended properties
    emissive: HexColorSchema.optional(),
    emissiveIntensity: z.number().min(0).optional(), // Spec allows >1 for HDR
    opacity: z.number().min(0).max(1).optional(),
    transparent: z.boolean().optional(),
    side: TSPMaterialSideSchema.optional(),
  })
  .passthrough(); // Preserve unknown fields for forward compatibility

// Shader material schema
export const TSPShaderMaterialSchema = z
  .object({
    type: z.literal("shader"),
    vertex: z.string().min(1, "Vertex shader source cannot be empty"),
    fragment: z.string().min(1, "Fragment shader source cannot be empty"),
    uniforms: z.record(z.string(), TSPUniformSchema),
    transparent: z.boolean().optional(),
    side: TSPMaterialSideSchema.optional(),
    depthWrite: z.boolean().optional(),
    depthTest: z.boolean().optional(),
    blending: TSPBlendingSchema.optional(),
  })
  .passthrough(); // Preserve unknown fields for forward compatibility

// Physical material schema (MeshPhysicalMaterial)
export const TSPPhysicalMaterialSchema = z
  .object({
    type: z.literal("physical"),
    color: HexColorSchema,
    metalness: z.number().min(0).max(1),
    roughness: z.number().min(0).max(1),

    // Base properties (optional)
    emissive: HexColorSchema.optional(),
    emissiveIntensity: z.number().min(0).optional(),
    opacity: z.number().min(0).max(1).optional(),
    transparent: z.boolean().optional(),
    side: TSPMaterialSideSchema.optional(),

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
  })
  .passthrough(); // Preserve unknown fields for forward compatibility

// Union type for all TSP materials
export const TSPMaterialSchema = z.union([
  TSPStandardMaterialSchema,
  TSPPhysicalMaterialSchema,
  TSPShaderMaterialSchema,
]);

// Shape path command schemas (mirrors THREE.Path/Shape API)
export const TSPShapeCommandSchema = z.discriminatedUnion("op", [
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

export const TSPShapePathSchema = z.object({
  commands: z.array(TSPShapeCommandSchema),
  holes: z.array(z.array(TSPShapeCommandSchema)).optional(),
});

// 3D curve schemas for TubeGeometry
export const TSPCurve3DSchema = z.discriminatedUnion("curveType", [
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
export const TSPExtrudeOptionsSchema = z.object({
  depth: z.number().optional(),
  bevelEnabled: z.boolean().optional(),
  bevelThickness: z.number().optional(),
  bevelSize: z.number().optional(),
  bevelOffset: z.number().optional(),
  bevelSegments: z.number().optional(),
  steps: z.number().optional(),
  extrudePath: TSPCurve3DSchema.optional(),
});

// Extended geometry schema supporting all Three.js geometry types
export const TSPGeometrySchema = z
  .object({
    type: PrimitiveTypeSchema,
    // Simple geometries (numeric args)
    args: z.array(z.number()).optional(),
    // BoxGeometry subdivision
    boxWidthSegments: z.number().int().min(1).optional(),
    boxHeightSegments: z.number().int().min(1).optional(),
    boxDepthSegments: z.number().int().min(1).optional(),
    // SphereGeometry subdivision
    sphereWidthSegments: z.number().int().min(3).optional(),
    sphereHeightSegments: z.number().int().min(2).optional(),
    // SphereGeometry partial sphere params (radians)
    spherePhiStart: z.number().min(0).optional(),
    spherePhiLength: z.number().min(0).optional(),
    sphereThetaStart: z.number().min(0).optional(),
    sphereThetaLength: z.number().min(0).optional(),
    // CylinderGeometry params
    cylinderRadiusTop: z.number().min(0).optional(),
    cylinderRadiusBottom: z.number().min(0).optional(),
    cylinderRadialSegments: z.number().int().min(3).optional(),
    cylinderHeightSegments: z.number().int().min(1).optional(),
    cylinderOpenEnded: z.boolean().optional(),
    cylinderThetaStart: z.number().min(0).optional(),
    cylinderThetaLength: z.number().min(0).optional(),
    // ConeGeometry params
    coneRadius: z.number().min(0).optional(),
    coneRadialSegments: z.number().int().min(3).optional(),
    coneHeightSegments: z.number().int().min(1).optional(),
    coneOpenEnded: z.boolean().optional(),
    coneThetaStart: z.number().min(0).optional(),
    coneThetaLength: z.number().min(0).optional(),
    // TorusGeometry params
    torusRadius: z.number().min(0).optional(),
    torusTube: z.number().min(0).optional(),
    torusRadialSegments: z.number().int().min(3).optional(),
    torusTubularSegments: z.number().int().min(3).optional(),
    torusArc: z.number().min(0).optional(),
    // PlaneGeometry params
    planeWidthSegments: z.number().int().min(1).optional(),
    planeHeightSegments: z.number().int().min(1).optional(),
    // CapsuleGeometry params
    capsuleRadius: z.number().min(0).optional(),
    capsuleLength: z.number().min(0).optional(),
    capsuleCapSegments: z.number().int().min(1).optional(),
    capsuleRadialSegments: z.number().int().min(3).optional(),
    // CircleGeometry params
    circleRadius: z.number().min(0).optional(),
    circleSegments: z.number().int().min(3).optional(),
    circleThetaStart: z.number().min(0).optional(),
    circleThetaLength: z.number().min(0).optional(),
    // RingGeometry params
    ringInnerRadius: z.number().min(0).optional(),
    ringOuterRadius: z.number().min(0).optional(),
    ringThetaSegments: z.number().int().min(3).optional(),
    ringPhiSegments: z.number().int().min(1).optional(),
    ringThetaStart: z.number().min(0).optional(),
    ringThetaLength: z.number().min(0).optional(),
    // TorusKnotGeometry params
    torusKnotRadius: z.number().min(0).optional(),
    torusKnotTube: z.number().min(0).optional(),
    torusKnotTubularSegments: z.number().int().min(3).optional(),
    torusKnotRadialSegments: z.number().int().min(3).optional(),
    torusKnotP: z.number().int().min(1).optional(),
    torusKnotQ: z.number().int().min(1).optional(),
    // Polyhedra geometry params (octahedron, dodecahedron, icosahedron, tetrahedron)
    octaRadius: z.number().min(0).optional(),
    octaDetail: z.number().int().min(0).optional(),
    dodecaRadius: z.number().min(0).optional(),
    dodecaDetail: z.number().int().min(0).optional(),
    icosaRadius: z.number().min(0).optional(),
    icosaDetail: z.number().int().min(0).optional(),
    tetraRadius: z.number().min(0).optional(),
    tetraDetail: z.number().int().min(0).optional(),
    // LatheGeometry (Vector2 points)
    points: z.array(z.tuple([z.number(), z.number()])).optional(),
    // ExtrudeGeometry, ShapeGeometry (shape path)
    shape: TSPShapePathSchema.optional(),
    // ExtrudeGeometry options
    extrudeOptions: TSPExtrudeOptionsSchema.optional(),
    // TubeGeometry (3D curve path)
    path: TSPCurve3DSchema.optional(),
    // TubeGeometry radius
    tubeRadius: z.number().optional(),
    // TubeGeometry tubular segments
    tubeTubularSegments: z.number().int().min(1).optional(),
    // TubeGeometry radial segments
    tubeRadialSegments: z.number().int().min(3).optional(),
    // TubeGeometry closed
    tubeClosed: z.boolean().optional(),
    // PolyhedronGeometry (raw vertex/index data)
    vertices: z.array(z.number()).optional(),
    indices: z.array(z.number()).optional(),
  })
  .passthrough(); // Preserve unknown fields for forward compatibility

export const TSPObjectSchema = z
  .object({
    id: z.string().uuid(), // Must be UUID v4
    name: z.string().min(1),
    type: ObjectTypeSchema,
    geometry: z.string().optional(),
    material: z.string().optional(),
    position: Vector3Schema,
    rotation: Vector3Schema,
    scale: Vector3Schema,
    parent: z.string().uuid().nullable(), // Must reference valid UUID or null
    visible: z.boolean(),
    // Optional extended properties
    castShadow: z.boolean().optional(),
    receiveShadow: z.boolean().optional(),
    userData: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough(); // Preserve unknown fields for forward compatibility

export const TSPMetadataSchema = z
  .object({
    version: z.string().regex(/^\d+\.\d+\.\d+$/, "Must be semver format X.Y.Z"),
    id: z.string().uuid(),
    created: z.string(),
    generator: z.string().min(1),
    generatorVersion: z.string(),
    prerelease: z.string().optional(), // e.g., "rc.1", "beta.2"
    author: z.string().optional(),
    copyright: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  })
  .passthrough(); // Preserve unknown fields for forward compatibility

// Animation schemas for TSP format

export const TSPAnimationPathSchema = z.enum([
  "position",
  "scale",
  "quaternion",
  "visible",
]);

export const TSPAnimationInterpolationSchema = z.enum([
  "linear",
  "smooth",
  "discrete",
]);

// Helper to get component count for each path
function getPathComponents(path: string): number {
  switch (path) {
    case "position":
    case "scale":
      return 3; // vec3
    case "quaternion":
      return 4; // quat
    case "visible":
      return 1; // bool
    default:
      return 0;
  }
}

// Helper to check if times are strictly increasing
function isStrictlyIncreasing(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    const previous = arr[i - 1];
    if (current === undefined || previous === undefined) return false;
    if (current <= previous) return false;
  }
  return true;
}

export const TSPAnimationTrackSchema = z
  .object({
    target: z.string().uuid(), // Object UUID (references objects[].id)
    path: TSPAnimationPathSchema,
    interpolation: TSPAnimationInterpolationSchema,
    times: z.array(z.number()).min(1, "Track must have at least one keyframe"),
    values: z.union([z.array(z.number()), z.array(z.boolean())]),
  })
  .refine((track) => isStrictlyIncreasing(track.times), {
    message: "Track times must be strictly increasing",
  })
  .refine(
    (track) => {
      const components = getPathComponents(track.path);
      return track.values.length === track.times.length * components;
    },
    {
      message:
        "Track values length must equal times.length * components (3 for position/scale, 4 for quaternion, 1 for visible)",
    },
  )
  .refine(
    (track) => {
      // Validate values type based on path
      if (track.path === "visible") {
        return track.values.every((v) => typeof v === "boolean");
      } else {
        return track.values.every((v) => typeof v === "number");
      }
    },
    {
      message:
        "Track values type mismatch: 'visible' path requires boolean[], other paths require number[]",
    },
  );

export const TSPAnimationClipSchema = z.object({
  name: z.string().min(1, "Animation clip name cannot be empty"),
  duration: z.number().positive().optional(),
  tracks: z
    .array(TSPAnimationTrackSchema)
    .min(1, "Clip must have at least one track"),
});

// Helper to detect cycles in parent chain
function hasCycle(
  objectId: string,
  objectMap: Map<string, { parent: string | null }>,
  visited: Set<string> = new Set(),
): boolean {
  if (visited.has(objectId)) return true;
  visited.add(objectId);
  const obj = objectMap.get(objectId);
  if (!obj || obj.parent === null) return false;
  return hasCycle(obj.parent, objectMap, visited);
}

// Base schema without semantic validation
const TSPFileBaseSchema = z
  .object({
    metadata: TSPMetadataSchema,
    materials: z.record(z.string(), TSPMaterialSchema),
    geometries: z.record(z.string(), TSPGeometrySchema),
    objects: z.array(TSPObjectSchema),
    roots: z.array(z.string().uuid()),
    animations: z.record(z.string(), TSPAnimationClipSchema).optional(),
  })
  .passthrough(); // Preserve unknown top-level fields for forward compatibility

// Full schema with semantic validation
export const TSPFileSchema = TSPFileBaseSchema.superRefine((file, ctx) => {
  const objectIds = new Set<string>();
  const objectMap = new Map<string, { parent: string | null; type: string }>();

  // Build object map and check uniqueness
  for (let i = 0; i < file.objects.length; i++) {
    const obj = file.objects[i];
    if (!obj) continue;

    if (objectIds.has(obj.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate object ID: ${obj.id}`,
        path: ["objects", i, "id"],
      });
    }
    objectIds.add(obj.id);
    objectMap.set(obj.id, { parent: obj.parent, type: obj.type });
  }

  // Validate each object
  for (let i = 0; i < file.objects.length; i++) {
    const obj = file.objects[i];
    if (!obj) continue;

    // Parent reference integrity
    if (obj.parent !== null && !objectIds.has(obj.parent)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Parent references non-existent object: ${obj.parent}`,
        path: ["objects", i, "parent"],
      });
    }

    // Cycle detection
    if (obj.parent !== null && hasCycle(obj.id, objectMap)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Circular parent reference detected for object: ${obj.id}`,
        path: ["objects", i, "parent"],
      });
    }

    // Mesh vs group requirements
    if (obj.type === "group") {
      if (obj.geometry !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Group objects MUST NOT have a geometry property",
          path: ["objects", i, "geometry"],
        });
      }
      if (obj.material !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Group objects MUST NOT have a material property",
          path: ["objects", i, "material"],
        });
      }
    } else {
      // Non-group objects MUST have geometry and material
      if (obj.geometry === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Non-group objects MUST have a geometry property",
          path: ["objects", i, "geometry"],
        });
      }
      if (obj.material === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Non-group objects MUST have a material property",
          path: ["objects", i, "material"],
        });
      }

      // Material key integrity
      if (obj.material !== undefined && !(obj.material in file.materials)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Material key not found: ${obj.material}`,
          path: ["objects", i, "material"],
        });
      }

      // Geometry key integrity
      if (obj.geometry !== undefined && !(obj.geometry in file.geometries)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Geometry key not found: ${obj.geometry}`,
          path: ["objects", i, "geometry"],
        });
      }
    }
  }

  // Roots integrity
  for (let i = 0; i < file.roots.length; i++) {
    const rootId = file.roots[i];
    if (!rootId) continue;

    if (!objectIds.has(rootId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Root references non-existent object: ${rootId}`,
        path: ["roots", i],
      });
    } else {
      const obj = objectMap.get(rootId);
      if (obj && obj.parent !== null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Root object must have parent: null, but ${rootId} has a parent`,
          path: ["roots", i],
        });
      }
    }
  }

  // Validate geometry conditional requirements
  for (const [key, geo] of Object.entries(file.geometries)) {
    switch (geo.type) {
      case "lathe":
        if (!geo.points || geo.points.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Lathe geometry requires non-empty 'points' array",
            path: ["geometries", key, "points"],
          });
        }
        break;
      case "extrude":
      case "shape":
        if (!geo.shape) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${geo.type} geometry requires 'shape' definition`,
            path: ["geometries", key, "shape"],
          });
        }
        break;
      case "tube":
        if (!geo.path) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Tube geometry requires 'path' definition",
            path: ["geometries", key, "path"],
          });
        }
        break;
      case "polyhedron":
        if (!geo.vertices || geo.vertices.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Polyhedron geometry requires non-empty 'vertices' array",
            path: ["geometries", key, "vertices"],
          });
        }
        if (!geo.indices || geo.indices.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Polyhedron geometry requires non-empty 'indices' array",
            path: ["geometries", key, "indices"],
          });
        }
        break;
    }
  }

  // Animation target integrity
  if (file.animations) {
    for (const [clipKey, clip] of Object.entries(file.animations)) {
      for (let trackIdx = 0; trackIdx < clip.tracks.length; trackIdx++) {
        const track = clip.tracks[trackIdx];
        if (!track) continue;
        if (!objectIds.has(track.target)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Animation track target references non-existent object: ${track.target}`,
            path: ["animations", clipKey, "tracks", trackIdx, "target"],
          });
        }
      }
    }
  }
});

export type TSPAnimationTrackZ = z.infer<typeof TSPAnimationTrackSchema>;
export type TSPAnimationClipZ = z.infer<typeof TSPAnimationClipSchema>;
export type TSPFileZ = z.infer<typeof TSPFileSchema>;

export function validateTSPFile(
  data: unknown,
): { success: true; data: TSPFileZ } | { success: false; error: string } {
  const result = TSPFileSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const issues = result.error.issues.map((issue) => {
    const path = issue.path.join(".");
    return `${path}: ${issue.message}`;
  });
  return { success: false, error: issues.join("; ") };
}
