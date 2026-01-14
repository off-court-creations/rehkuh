import { z } from "zod";
import {
  PrimitiveTypeSchema,
  ObjectTypeSchema,
  Vector2Schema,
  Vector3Schema,
  HexColorSchema,
} from "./base";

export const TSPMaterialSideSchema = z.enum(["front", "back", "double"]);

// Shader uniform types
export const TSPUniformTypeSchema = z.enum([
  "float",
  "int",
  "bool",
  "color",
  "vec2",
  "vec3",
  "vec4",
]);

// Shader uniform definition
export const TSPUniformSchema = z.object({
  type: TSPUniformTypeSchema,
  value: z.union([z.number(), z.boolean(), z.string(), z.array(z.number())]),
  animated: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
});

// Standard material schema
export const TSPStandardMaterialSchema = z.object({
  type: z.literal("standard").optional(), // Optional for backwards compatibility
  color: HexColorSchema,
  metalness: z.number().min(0).max(1),
  roughness: z.number().min(0).max(1),
  // Optional extended properties
  emissive: HexColorSchema.optional(),
  emissiveIntensity: z.number().min(0).max(1).optional(),
  opacity: z.number().min(0).max(1).optional(),
  transparent: z.boolean().optional(),
  side: TSPMaterialSideSchema.optional(),
});

// Shader material schema
export const TSPShaderMaterialSchema = z.object({
  type: z.literal("shader"),
  vertex: z.string(),
  fragment: z.string(),
  uniforms: z.record(z.string(), TSPUniformSchema),
  transparent: z.boolean().optional(),
  side: TSPMaterialSideSchema.optional(),
  depthWrite: z.boolean().optional(),
  depthTest: z.boolean().optional(),
});

// Physical material schema (MeshPhysicalMaterial)
export const TSPPhysicalMaterialSchema = z.object({
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
});

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
export const TSPGeometrySchema = z.object({
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
});

export const TSPObjectSchema = z.object({
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

export const TSPMetadataSchema = z.object({
  version: z.string(),
  id: z.string().uuid(),
  created: z.string(),
  generator: z.string(),
  generatorVersion: z.string(),
  author: z.string().optional(),
  copyright: z.string().optional(),
});

export const TSPFileSchema = z.object({
  metadata: TSPMetadataSchema,
  materials: z.record(z.string(), TSPMaterialSchema),
  geometries: z.record(z.string(), TSPGeometrySchema),
  objects: z.array(TSPObjectSchema),
  roots: z.array(z.string()),
});

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
