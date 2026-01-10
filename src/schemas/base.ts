import { z } from "zod";

export const Vector2Schema = z.tuple([z.number(), z.number()]);
export const Vector3Schema = z.tuple([z.number(), z.number(), z.number()]);

export const HexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color format");

export const PrimitiveTypeSchema = z.enum([
  // Existing
  "box",
  "sphere",
  "cylinder",
  "cone",
  "torus",
  "plane",
  // Simple additions
  "capsule",
  "circle",
  "dodecahedron",
  "icosahedron",
  "octahedron",
  "ring",
  "tetrahedron",
  "torusKnot",
  // Complex additions
  "lathe",
  "extrude",
  "shape",
  "tube",
  "polyhedron",
]);

export const ObjectTypeSchema = z.enum([
  // Existing
  "box",
  "sphere",
  "cylinder",
  "cone",
  "torus",
  "plane",
  // Simple additions
  "capsule",
  "circle",
  "dodecahedron",
  "icosahedron",
  "octahedron",
  "ring",
  "tetrahedron",
  "torusKnot",
  // Complex additions
  "lathe",
  "extrude",
  "shape",
  "tube",
  "polyhedron",
  // Group
  "group",
]);
