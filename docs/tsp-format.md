# TSP File Format Specification

TSP (Three Shaded Primitive) is rehkuh's export format for 3D primitive scenes. It uses JSON structure with a `.tsp` extension, designed for loading into Three.js/React Three Fiber applications.

## Exporting

Click the **Export** button in the Outliner panel. The file picker will suggest a filename based on the scene name.

## File Structure

```json
{
  "version": "0.9.0",
  "metadata": {
    "name": "scene_name",
    "created": "2026-01-09T12:00:00Z",
    "generator": "rehkuh"
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

Format version string. Currently `"0.9.0"`.

### `metadata`

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Scene name (from first root group or "scene") |
| `created` | string | ISO 8601 timestamp |
| `generator` | string | Always `"rehkuh"` for rehkuh exports |

### `materials`

Dictionary of deduplicated materials. Three material types are supported:

#### Standard Material (MeshStandardMaterial)

Basic PBR material. Key format: `mat_{color}_{metalness*100}_{roughness*100}`

```json
{
  "mat_ff0000_50_30": {
    "color": "#ff0000",
    "metalness": 0.5,
    "roughness": 0.3
  }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `type` | "standard"? | - | Optional type discriminator (omit for backwards compat) |
| `color` | string | required | Hex color (e.g., "#ff0000") |
| `metalness` | number | required | 0-1 range |
| `roughness` | number | required | 0-1 range |
| `emissive` | string? | "#000000" | Emissive hex color |
| `emissiveIntensity` | number? | 0 | Emissive intensity, 0+ |
| `opacity` | number? | 1 | Opacity, 0-1 |
| `transparent` | boolean? | false | Enable transparency |
| `side` | string? | "front" | Render side: "front", "back", or "double" |

#### Physical Material (MeshPhysicalMaterial)

Advanced PBR material with clearcoat, sheen, transmission, iridescence, anisotropy, and more. Key format: `mat_physical_{hash}`

```json
{
  "mat_physical_a1b2c3d4": {
    "type": "physical",
    "color": "#ffffff",
    "metalness": 0,
    "roughness": 0,
    "transmission": 1,
    "thickness": 0.5,
    "ior": 1.5
  }
}
```

**Base Properties:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `type` | "physical" | required | Type discriminator |
| `color` | string | required | Hex color |
| `metalness` | number | required | 0-1 range |
| `roughness` | number | required | 0-1 range |
| `emissive` | string? | "#000000" | Emissive hex color |
| `emissiveIntensity` | number? | 0 | Emissive intensity |
| `opacity` | number? | 1 | Opacity, 0-1 |
| `transparent` | boolean? | false | Enable transparency |
| `side` | string? | "front" | Render side |

**Clearcoat Channel** (car paint, wet surfaces, varnished wood):

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `clearcoat` | number? | 0 | Intensity of clear coat layer, 0-1 |
| `clearcoatRoughness` | number? | 0 | Roughness of clear coat, 0-1 |

**Sheen Channel** (velvet, felt, cloth, fabric):

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `sheen` | number? | 0 | Intensity of sheen layer, 0-1 |
| `sheenRoughness` | number? | 1 | Roughness of sheen, 0-1 |
| `sheenColor` | string? | "#ffffff" | Sheen tint color |

**Transmission Channel** (glass, water, gems, liquids):

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `transmission` | number? | 0 | Amount of light transmitted, 0-1 |
| `thickness` | number? | 0 | Thickness for attenuation (world units) |
| `attenuationColor` | string? | "#ffffff" | Color tint as light passes through |
| `attenuationDistance` | number? | Infinity | Distance for full attenuation |

**IOR** (index of refraction):

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `ior` | number? | 1.5 | Index of refraction, 1.0-2.333 |

Common IOR values: Air=1.0, Water=1.33, Glass=1.5, Diamond=2.42 (clamped to 2.333)

**Specular Channel** (skin, layered materials):

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `specularIntensity` | number? | 1 | Strength of specular reflection, 0-1 |
| `specularColor` | string? | "#ffffff" | Tint of specular reflection |
| `reflectivity` | number? | 0.5 | Controls F0, 0-1 |

**Iridescence Channel** (soap bubbles, oil slicks, beetles):

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `iridescence` | number? | 0 | Intensity of iridescence effect, 0-1 |
| `iridescenceIOR` | number? | 1.3 | IOR of thin film layer, 1.0-2.333 |
| `iridescenceThicknessRange` | [min, max]? | [100, 400] | Thickness range in nanometers |

**Anisotropy Channel** (brushed metal, hair, satin):

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `anisotropy` | number? | 0 | Strength of anisotropic effect, 0-1 |
| `anisotropyRotation` | number? | 0 | Rotation direction in radians |

**Dispersion** (diamonds, prisms, cut glass):

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `dispersion` | number? | 0 | Amount of chromatic dispersion, 0+ |

**Other Properties:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `envMapIntensity` | number? | 1 | Environment reflection intensity, 0+ |
| `flatShading` | boolean? | false | Use flat shading instead of smooth |

#### Shader Material (ShaderMaterial)

Custom GLSL shaders. Key format: `mat_shader_{shaderName}`

```json
{
  "mat_shader_hologram": {
    "type": "shader",
    "vertex": "varying vec2 vUv; void main() { ... }",
    "fragment": "uniform vec3 baseColor; void main() { ... }",
    "uniforms": {
      "baseColor": { "type": "color", "value": "#00ffff" },
      "time": { "type": "float", "value": 0, "animated": true }
    }
  }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `type` | "shader" | required | Type discriminator |
| `vertex` | string | required | GLSL vertex shader code |
| `fragment` | string | required | GLSL fragment shader code |
| `uniforms` | object | required | Uniform definitions |
| `transparent` | boolean? | false | Enable transparency |
| `side` | string? | "front" | Render side |
| `depthWrite` | boolean? | true | Write to depth buffer |
| `depthTest` | boolean? | true | Test depth buffer |

**Uniform Types:**

| Type | Value Format | Description |
|------|--------------|-------------|
| `float` | number | Floating point value |
| `int` | number | Integer value |
| `bool` | boolean | Boolean value |
| `color` | string | Hex color string |
| `vec2` | [x, y] | 2D vector |
| `vec3` | [x, y, z] | 3D vector |
| `vec4` | [x, y, z, w] | 4D vector |

Uniforms can include `animated: true` for runtime updates (e.g., time).

### `geometries`

Dictionary of geometry definitions. All geometries use unit scale; actual size comes from object `scale` transform.

#### Simple Geometries

| Type | Args | Default |
|------|------|---------|
| `box` | `[width, height, depth]` | `[1, 1, 1]` |
| `sphere` | `[radius, widthSegments, heightSegments]` | `[0.5, 32, 32]` |
| `cylinder` | `[radiusTop, radiusBottom, height, tubeRadialSegments]` | `[0.5, 0.5, 1, 32]` |
| `cone` | `[radius, height, tubeRadialSegments]` | `[0.5, 1, 32]` |
| `torus` | `[radius, tube, tubeRadialSegments, tubeTubularSegments]` | `[0.5, 0.2, 16, 32]` |
| `plane` | `[width, height]` | `[1, 1]` |
| `capsule` | `[radius, length, capSegments, tubeRadialSegments]` | `[0.5, 1, 4, 8]` |
| `circle` | `[radius, segments]` | `[0.5, 32]` |
| `dodecahedron` | `[radius, detail]` | `[0.5, 0]` |
| `icosahedron` | `[radius, detail]` | `[0.5, 0]` |
| `octahedron` | `[radius, detail]` | `[0.5, 0]` |
| `ring` | `[innerRadius, outerRadius, thetaSegments]` | `[0.25, 0.5, 32]` |
| `tetrahedron` | `[radius, detail]` | `[0.5, 0]` |
| `torusKnot` | `[radius, tube, tubeTubularSegments, tubeRadialSegments, p, q]` | `[0.5, 0.15, 64, 8, 2, 3]` |

#### BoxGeometry Options

Boxes support optional subdivision segments for smoother lighting and displacement:

```json
{
  "type": "box",
  "args": [1, 1, 1],
  "boxWidthSegments": 4,
  "boxHeightSegments": 2,
  "boxDepthSegments": 2
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `boxWidthSegments` | number? | 1 | Segments along X axis |
| `boxHeightSegments` | number? | 1 | Segments along Y axis |
| `boxDepthSegments` | number? | 1 | Segments along Z axis |

Boxes with custom segments get unique geometry keys (e.g., `box_abc12345`) instead of sharing the default `box` geometry.

#### Complex Geometries

These require additional fields and can be hand-authored in TSP files.

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
  "tubeRadius": 0.1,
  "tubeTubularSegments": 64,
  "tubeRadialSegments": 8,
  "tubeClosed": false
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `path` | TSPCurve3D | required | 3D curve defining the tube path |
| `tubeRadius` | number? | 0.1 | Radius of the tube cross-section |
| `tubeTubularSegments` | number? | 64 | Number of segments along the tube length |
| `tubeRadialSegments` | number? | 8 | Number of segments around the tube circumference |
| `tubeClosed` | boolean? | false | Whether the tube forms a closed loop |

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
- `src/schemas/tsp.ts` - Zod validation schemas
- `src/export/tspExporter.ts` - Export logic
- `src/export/tspImporter.ts` - Import logic
