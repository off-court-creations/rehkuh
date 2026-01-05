# TPJ File Format Specification

TPJ (Three Primitive JSON) is a custom 3D file format for primitive-based 3D models. It uses JSON structure with a `.tpj` extension.

## Overview

TPJ is designed for:
- Exporting 3D scenes from rekuh (primitive modeling tool)
- Loading into Three.js/React Three Fiber applications
- Efficient geometry and material sharing through deduplication

## File Structure

```json
{
  "version": "1.1",
  "metadata": {
    "name": "scene_name",
    "created": "2026-01-04T12:00:00Z",
    "generator": "rekuh"
  },
  "materials": {
    "mat_ff0000_50_30": {
      "color": "#ff0000",
      "metalness": 0.5,
      "roughness": 0.3,
      "emissive": "#ffff00",
      "emissiveIntensity": 0.5,
      "opacity": 1.0,
      "transparent": false,
      "side": "front"
    }
  },
  "geometries": {
    "box": { "type": "box", "args": [1, 1, 1] },
    "sphere": { "type": "sphere", "args": [0.5, 32, 32] }
  },
  "objects": [
    {
      "id": "uuid-1",
      "name": "my_cube",
      "type": "box",
      "geometry": "box",
      "material": "mat_ff0000_50_30",
      "position": [0, 1, 0],
      "rotation": [0, 0, 0],
      "scale": [2, 2, 2],
      "parent": null,
      "visible": true,
      "castShadow": true,
      "receiveShadow": true,
      "userData": { "interactable": true }
    }
  ],
  "roots": ["uuid-1"]
}
```

## Sections

### `version`

Format version string. Currently `"1.1"`.

### `metadata`

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Scene name (derived from first root group or "scene") |
| `created` | string | ISO 8601 timestamp |
| `generator` | string | Tool that created the file (e.g., "rekuh") |

### `materials`

Dictionary of deduplicated materials. Keys are generated hashes based on color, metalness, and roughness.

**Key format:** `mat_{color}_{metalness*100}_{roughness*100}`

Example: `mat_ff0000_50_30` = red color, 0.5 metalness, 0.3 roughness

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `color` | string | required | Hex color (e.g., "#ff0000") |
| `metalness` | number | required | 0-1 range |
| `roughness` | number | required | 0-1 range |
| `emissive` | string? | "#000000" | Emissive hex color for glowing surfaces |
| `emissiveIntensity` | number? | 0 | Emissive intensity, 0-1 range |
| `opacity` | number? | 1 | Opacity, 0-1 range |
| `transparent` | boolean? | false | Enable transparency |
| `side` | string? | "front" | Which side(s) to render: "front", "back", or "double" |

### `geometries`

Dictionary of geometry definitions. All geometries use unit scale; actual size is applied via object's `scale` transform.

| Type | Args |
|------|------|
| `box` | `[width, height, depth]` → `[1, 1, 1]` |
| `sphere` | `[radius, widthSegments, heightSegments]` → `[0.5, 32, 32]` |
| `cylinder` | `[radiusTop, radiusBottom, height, radialSegments]` → `[0.5, 0.5, 1, 32]` |
| `cone` | `[radius, height, radialSegments]` → `[0.5, 1, 32]` |
| `torus` | `[radius, tube, radialSegments, tubularSegments]` → `[0.5, 0.2, 16, 32]` |
| `plane` | `[width, height]` → `[1, 1]` |

### `objects`

Array of scene objects (meshes and groups).

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | string | required | Unique identifier (UUID) |
| `name` | string | required | Human-readable name |
| `type` | string | required | Primitive type or "group" |
| `geometry` | string? | - | Key into geometries dict (omitted for groups) |
| `material` | string? | - | Key into materials dict (omitted for groups) |
| `position` | [x, y, z] | required | Local position |
| `rotation` | [x, y, z] | required | Euler rotation in radians |
| `scale` | [x, y, z] | required | Scale multipliers |
| `parent` | string \| null | required | Parent object ID, or null for root objects |
| `visible` | boolean | required | Visibility flag |
| `castShadow` | boolean? | true | Whether mesh casts shadows |
| `receiveShadow` | boolean? | true | Whether mesh receives shadows |
| `userData` | object? | {} | Custom properties for gameplay/interactivity |

### `roots`

Array of object IDs that have no parent. Used for quick hierarchy traversal.

## Zod Schema

TPJ files are validated using Zod schemas defined in `src/schemas/tpj.ts`:

```typescript
import { z } from "zod";

const TPJMaterialSideSchema = z.enum(["front", "back", "double"]);

const TPJMaterialSchema = z.object({
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  metalness: z.number().min(0).max(1),
  roughness: z.number().min(0).max(1),
  // Optional extended properties
  emissive: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  emissiveIntensity: z.number().min(0).max(1).optional(),
  opacity: z.number().min(0).max(1).optional(),
  transparent: z.boolean().optional(),
  side: TPJMaterialSideSchema.optional(),
});

const TPJGeometrySchema = z.object({
  type: z.enum(["box", "sphere", "cylinder", "cone", "torus", "plane"]),
  args: z.array(z.number()),
});

const TPJObjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["box", "sphere", "cylinder", "cone", "torus", "plane", "group"]),
  geometry: z.string().optional(),
  material: z.string().optional(),
  position: z.tuple([z.number(), z.number(), z.number()]),
  rotation: z.tuple([z.number(), z.number(), z.number()]),
  scale: z.tuple([z.number(), z.number(), z.number()]),
  parent: z.string().nullable(),
  visible: z.boolean(),
  // Optional extended properties
  castShadow: z.boolean().optional(),
  receiveShadow: z.boolean().optional(),
  userData: z.record(z.string(), z.unknown()).optional(),
});

const TPJFileSchema = z.object({
  version: z.string(),
  metadata: z.object({
    name: z.string(),
    created: z.string(),
    generator: z.string(),
  }),
  materials: z.record(z.string(), TPJMaterialSchema),
  geometries: z.record(z.string(), TPJGeometrySchema),
  objects: z.array(TPJObjectSchema),
  roots: z.array(z.string()),
});
```

## Design Decisions

### Material Deduplication

Materials are stored in a dictionary keyed by a hash of their properties. Multiple objects with identical materials reference the same key, enabling shared material instances when loaded into Three.js.

### Unit Geometries

All geometries use unit dimensions (1x1x1 box, 0.5 radius sphere, etc.). Actual object size is controlled by the `scale` transform. This maximizes geometry sharing—all boxes share one geometry regardless of their size.

### Parent References by ID

Objects reference their parent by ID (not name), ensuring reliable hierarchy reconstruction. The `roots` array provides direct access to top-level objects.

## Exporting from Rekuh

Click the **Export** button in the Outliner panel. The file picker will suggest a filename based on the scene name with a `.tpj` extension.

## Related Files

- `src/types.ts` - TypeScript interfaces
- `src/schemas/tpj.ts` - Zod validation schemas
- `src/export/tpjExporter.ts` - Export logic
