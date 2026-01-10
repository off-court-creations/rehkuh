# TPJ File Format Specification

TPJ (Three Primitive JSON) is Clay's export format for 3D primitive scenes. It uses JSON structure with a `.tpj` extension, designed for loading into Three.js/React Three Fiber applications.

## Exporting

Click the **Export** button in the Outliner panel. The file picker will suggest a filename based on the scene name.

## File Structure

```json
{
  "version": "1.0",
  "metadata": {
    "name": "scene_name",
    "created": "2026-01-09T12:00:00Z",
    "generator": "rekuh"
  },
  "materials": {
    "mat_ff0000_50_30": {
      "color": "#ff0000",
      "metalness": 0.5,
      "roughness": 0.3
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
      "visible": true
    }
  ],
  "roots": ["uuid-1"]
}
```

## Sections

### `version`

Format version string. Currently `"1.0"`.

### `metadata`

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Scene name (from first root group or "scene") |
| `created` | string | ISO 8601 timestamp |
| `generator` | string | Always `"rekuh"` for Clay exports |

### `materials`

Dictionary of deduplicated materials keyed by property hash.

**Key format:** `mat_{color}_{metalness*100}_{roughness*100}`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `color` | string | required | Hex color (e.g., "#ff0000") |
| `metalness` | number | required | 0-1 range |
| `roughness` | number | required | 0-1 range |
| `emissive` | string? | "#000000" | Emissive hex color |
| `emissiveIntensity` | number? | 0 | Emissive intensity, 0-1 |
| `opacity` | number? | 1 | Opacity, 0-1 |
| `transparent` | boolean? | false | Enable transparency |
| `side` | string? | "front" | Render side: "front", "back", or "double" |

### `geometries`

Dictionary of geometry definitions. All geometries use unit scale; actual size comes from object `scale` transform.

#### Simple Geometries

| Type | Args | Default |
|------|------|---------|
| `box` | `[width, height, depth]` | `[1, 1, 1]` |
| `sphere` | `[radius, widthSegments, heightSegments]` | `[0.5, 32, 32]` |
| `cylinder` | `[radiusTop, radiusBottom, height, radialSegments]` | `[0.5, 0.5, 1, 32]` |
| `cone` | `[radius, height, radialSegments]` | `[0.5, 1, 32]` |
| `torus` | `[radius, tube, radialSegments, tubularSegments]` | `[0.5, 0.2, 16, 32]` |
| `plane` | `[width, height]` | `[1, 1]` |
| `capsule` | `[radius, length, capSegments, radialSegments]` | `[0.5, 1, 4, 8]` |
| `circle` | `[radius, segments]` | `[0.5, 32]` |
| `dodecahedron` | `[radius, detail]` | `[0.5, 0]` |
| `icosahedron` | `[radius, detail]` | `[0.5, 0]` |
| `octahedron` | `[radius, detail]` | `[0.5, 0]` |
| `ring` | `[innerRadius, outerRadius, thetaSegments]` | `[0.25, 0.5, 32]` |
| `tetrahedron` | `[radius, detail]` | `[0.5, 0]` |
| `torusKnot` | `[radius, tube, tubularSegments, radialSegments, p, q]` | `[0.5, 0.15, 64, 8, 2, 3]` |

#### Complex Geometries

These require additional fields and can be hand-authored in TPJ files.

##### LatheGeometry

Revolves a 2D profile around the Y axis.

```json
{
  "type": "lathe",
  "points": [[0, -0.5], [0.3, -0.4], [0.4, 0], [0.3, 0.4], [0.1, 0.5]],
  "args": [32, 0, 6.283185]
}
```

##### ExtrudeGeometry

Extrudes a 2D shape into 3D.

```json
{
  "type": "extrude",
  "shape": {
    "commands": [
      { "op": "moveTo", "x": 0, "y": 0.5 },
      { "op": "bezierCurveTo", "cp1x": 0.5, "cp1y": 0.5, "cp2x": 0.5, "cp2y": 0, "x": 0, "y": -0.5 }
    ]
  },
  "extrudeOptions": {
    "depth": 0.2,
    "bevelEnabled": true,
    "bevelThickness": 0.05
  }
}
```

##### ShapeGeometry

Flat 2D shape from path commands.

```json
{
  "type": "shape",
  "shape": {
    "commands": [
      { "op": "moveTo", "x": 0, "y": 0 },
      { "op": "lineTo", "x": 1, "y": 0 },
      { "op": "lineTo", "x": 0.5, "y": 1 }
    ]
  }
}
```

##### TubeGeometry

Tube along a 3D curve.

```json
{
  "type": "tube",
  "path": {
    "curveType": "catmullRom",
    "points": [[0, 0, 0], [1, 1, 0], [2, 0, 0]],
    "closed": false
  },
  "args": [64, 0.1, 8, false]
}
```

##### EdgesGeometry

Wireframe edges of another geometry.

```json
{
  "type": "edges",
  "sourceGeometry": "box",
  "args": [1]
}
```

##### PolyhedronGeometry

Custom polyhedron from raw vertex/index data.

```json
{
  "type": "polyhedron",
  "vertices": [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1],
  "indices": [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1],
  "args": [1, 0]
}
```

### Shape Path Commands

| Command | Fields | Description |
|---------|--------|-------------|
| `moveTo` | `x, y` | Move to point |
| `lineTo` | `x, y` | Line to point |
| `bezierCurveTo` | `cp1x, cp1y, cp2x, cp2y, x, y` | Cubic bezier curve |
| `quadraticCurveTo` | `cpx, cpy, x, y` | Quadratic bezier curve |
| `arc` | `x, y, radius, startAngle, endAngle, clockwise?` | Arc (relative) |
| `absarc` | `x, y, radius, startAngle, endAngle, clockwise?` | Arc (absolute) |
| `ellipse` | `x, y, xRadius, yRadius, startAngle, endAngle, clockwise?, rotation?` | Ellipse (relative) |
| `absellipse` | `x, y, xRadius, yRadius, startAngle, endAngle, clockwise?, rotation?` | Ellipse (absolute) |

Shapes can include a `holes` array for cutouts.

### 3D Curve Types

| Curve Type | Fields |
|------------|--------|
| `catmullRom` | `points: [x,y,z][], closed?, tension?` |
| `cubicBezier` | `v0, v1, v2, v3` (each `[x,y,z]`) |
| `quadraticBezier` | `v0, v1, v2` (each `[x,y,z]`) |
| `line` | `v1, v2` (each `[x,y,z]`) |

### `objects`

Array of scene objects (meshes and groups).

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | string | required | Unique identifier (UUID) |
| `name` | string | required | Human-readable name |
| `type` | string | required | Geometry type or "group" |
| `geometry` | string? | - | Key into geometries dict |
| `material` | string? | - | Key into materials dict |
| `position` | [x, y, z] | required | Local position |
| `rotation` | [x, y, z] | required | Euler rotation in radians |
| `scale` | [x, y, z] | required | Scale multipliers |
| `parent` | string \| null | required | Parent object ID or null |
| `visible` | boolean | required | Visibility flag |
| `castShadow` | boolean? | true | Whether mesh casts shadows |
| `receiveShadow` | boolean? | true | Whether mesh receives shadows |
| `userData` | object? | {} | Custom properties |

### `roots`

Array of root object IDs (those with no parent).

## Design Decisions

**Material Deduplication:** Objects with identical materials share the same key, enabling instancing when loaded.

**Unit Geometries:** All geometries use unit dimensions. Object scale controls actual size, maximizing geometry sharing.

**ID-based Hierarchy:** Objects reference parents by ID for reliable reconstruction.

## Related Files

- `src/types.ts` - TypeScript interfaces
- `src/schemas/tpj.ts` - Zod validation schemas
- `src/export/tpjExporter.ts` - Export logic
