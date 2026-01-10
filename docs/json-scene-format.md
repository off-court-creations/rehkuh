# JSON Scene Format Specification

The JSON scene format is rehkuh's internal format for the staging workflow. This is the format used by `staging-scene.json` and `scene.json`.

Unlike TSP (the export format), the JSON scene format:
- Uses a flat array structure (no `materials`, `geometries` sections)
- References parents by **name** instead of UUID
- Supports inline materials per object
- Is designed for editing, not export

## File Structure

```json
[
  {
    "name": "uniqueName",
    "type": "box",
    "parent": "parentName",
    "position": [0, 1, 0],
    "rotation": [0, 0, 0],
    "scale": [1, 1, 1],
    "material": {
      "color": "#ff0000",
      "metalness": 0.5,
      "roughness": 0.3
    }
  }
]
```

The file is a JSON array of scene objects.

## Object Schema

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique identifier for the object (used for parent references) |
| `type` | string | Geometry type (see Geometry Types below) |
| `position` | [x, y, z] | World position as 3-number array |
| `rotation` | [x, y, z] | Euler rotation in radians as 3-number array |
| `scale` | [x, y, z] | Scale as 3-number array |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `parent` | string | Name of parent object (for hierarchy) |
| `material` | object | Material definition (see Materials below) |

## Geometry Types

### Simple Geometries

These use default unit dimensions and scale:

| Type | Description | Default Args |
|------|-------------|--------------|
| `box` | Box/cube | 1x1x1 |
| `sphere` | Sphere | radius 0.5, 32x32 segments |
| `cylinder` | Cylinder | radius 0.5, height 1, 32 segments |
| `cone` | Cone | radius 0.5, height 1, 32 segments |
| `torus` | Torus (donut) | radius 0.5, tube 0.2 |
| `plane` | Flat plane | 1x1 |
| `capsule` | Capsule | radius 0.5, length 1 |
| `circle` | Flat circle | radius 0.5, 32 segments |
| `ring` | Flat ring | inner 0.25, outer 0.5 |
| `dodecahedron` | 12-sided | radius 0.5 |
| `icosahedron` | 20-sided | radius 0.5 |
| `octahedron` | 8-sided | radius 0.5 |
| `tetrahedron` | 4-sided | radius 0.5 |
| `torusKnot` | Knot shape | radius 0.5 |

### Special Types

| Type | Description |
|------|-------------|
| `group` | Container with no geometry (for hierarchy) |

### Complex Geometries

These require additional data fields:

| Type | Required Fields | Description |
|------|-----------------|-------------|
| `lathe` | `points` | Revolved 2D profile |
| `extrude` | `shape`, `extrudeOptions` | Extruded 2D shape |
| `shape` | `shape` | Flat 2D shape |
| `tube` | `path`, `tubeRadius` | 3D tube along a curve |
| `polyhedron` | `vertices`, `indices` | Custom mesh |

## Materials

Three material types are supported:

### Standard Material (default)

Basic PBR material:

```json
{
  "color": "#4bd0d2",
  "metalness": 0.2,
  "roughness": 0.4
}
```

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `type` | "standard"? | - | Optional, omit for backwards compat |
| `color` | string | hex | Color in "#rrggbb" format |
| `metalness` | number | 0-1 | Metal-like reflections |
| `roughness` | number | 0-1 | Surface roughness |
| `emissive` | string? | hex | Emissive color |
| `emissiveIntensity` | number? | 0+ | Emissive brightness |
| `opacity` | number? | 0-1 | Transparency |
| `transparent` | boolean? | - | Enable transparency |
| `side` | string? | - | "front", "back", or "double" |

### Physical Material

Advanced PBR with clearcoat, sheen, transmission, etc:

```json
{
  "type": "physical",
  "color": "#ffffff",
  "metalness": 0.0,
  "roughness": 0.1,
  "transmission": 1.0,
  "thickness": 0.5,
  "ior": 1.5
}
```

All standard fields plus:

| Field | Type | Description |
|-------|------|-------------|
| `clearcoat` | number? | Clearcoat layer intensity (0-1) |
| `clearcoatRoughness` | number? | Clearcoat roughness (0-1) |
| `sheen` | number? | Sheen intensity (0-1) |
| `sheenRoughness` | number? | Sheen roughness (0-1) |
| `sheenColor` | string? | Sheen color (hex) |
| `transmission` | number? | Glass-like transparency (0-1) |
| `thickness` | number? | Refraction thickness |
| `ior` | number? | Index of refraction (1-2.333) |
| `iridescence` | number? | Rainbow effect (0-1) |
| `anisotropy` | number? | Brushed metal effect (0-1) |
| `dispersion` | number? | Prismatic dispersion (0+) |

### Shader Material

Custom GLSL shaders:

```json
{
  "type": "shader",
  "shaderName": "myShader",
  "uniforms": {
    "baseColor": { "type": "color", "value": "#00ffff" },
    "time": { "type": "float", "value": 0, "animated": true }
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | "shader" | Required discriminator |
| `shaderName` | string? | Reference to external shader files |
| `vertex` | string? | Inline vertex shader GLSL |
| `fragment` | string? | Inline fragment shader GLSL |
| `uniforms` | object | Uniform definitions (see below) |
| `transparent` | boolean? | Enable transparency |
| `side` | string? | "front", "back", or "double" |
| `depthWrite` | boolean? | Write to depth buffer |
| `depthTest` | boolean? | Test against depth buffer |

**Using `shaderName` (recommended for staging):**

When you use `shaderName`, the shader files are read from `shaders/staging/`:
- `shaders/staging/{shaderName}.vert` - Vertex shader
- `shaders/staging/{shaderName}.frag` - Fragment shader

On promotion, these are copied to `shaders/` (production).

**Uniform Types:**

| Type | Value Format | Description |
|------|--------------|-------------|
| `float` | number | Single float |
| `int` | number | Integer |
| `bool` | boolean | Boolean |
| `color` | string | Hex color (converted to vec3) |
| `vec2` | [x, y] | 2D vector |
| `vec3` | [x, y, z] | 3D vector |
| `vec4` | [x, y, z, w] | 4D vector |

**Uniform Options:**

| Field | Type | Description |
|-------|------|-------------|
| `animated` | boolean? | Auto-update each frame (for `time`) |
| `min` | number? | UI slider minimum |
| `max` | number? | UI slider maximum |
| `step` | number? | UI slider step |

## Complex Geometry Data

### Lathe Geometry

```json
{
  "type": "lathe",
  "points": [[0, 0], [0.5, 0.2], [0.3, 1.0], [0, 1.0]]
}
```

`points` is an array of [x, y] coordinates defining the profile to revolve.

### Extrude Geometry

```json
{
  "type": "extrude",
  "shape": {
    "commands": [
      { "op": "moveTo", "x": 0, "y": 0 },
      { "op": "lineTo", "x": 1, "y": 0 },
      { "op": "lineTo", "x": 0.5, "y": 1 },
      { "op": "lineTo", "x": 0, "y": 0 }
    ]
  },
  "extrudeOptions": {
    "depth": 0.5,
    "bevelEnabled": true,
    "bevelThickness": 0.1
  }
}
```

### Shape Commands

| Command | Fields | Description |
|---------|--------|-------------|
| `moveTo` | x, y | Move pen position |
| `lineTo` | x, y | Line to point |
| `bezierCurveTo` | cp1x, cp1y, cp2x, cp2y, x, y | Cubic bezier |
| `quadraticCurveTo` | cpx, cpy, x, y | Quadratic bezier |
| `arc` | x, y, radius, startAngle, endAngle, clockwise? | Arc |
| `absarc` | x, y, radius, startAngle, endAngle, clockwise? | Absolute arc |
| `ellipse` | x, y, xRadius, yRadius, startAngle, endAngle, clockwise?, rotation? | Ellipse |

### Tube Geometry

```json
{
  "type": "tube",
  "path": {
    "curveType": "catmullRom",
    "points": [[0, 0, 0], [1, 1, 0], [2, 0, 0]],
    "closed": false,
    "tension": 0.5
  },
  "tubeRadius": 0.1
}
```

### Curve Types

| Type | Fields | Description |
|------|--------|-------------|
| `catmullRom` | points, closed?, tension? | Smooth curve through points |
| `cubicBezier` | v0, v1, v2, v3 | Cubic bezier in 3D |
| `quadraticBezier` | v0, v1, v2 | Quadratic bezier in 3D |
| `line` | v1, v2 | Straight line segment |

### Polyhedron Geometry

```json
{
  "type": "polyhedron",
  "vertices": [0, 1, 0, 1, -1, 0, -1, -1, 0, 0, -1, 1],
  "indices": [0, 1, 2, 0, 2, 3]
}
```

`vertices` is a flat array of xyz coordinates. `indices` defines triangles.

## Parent Hierarchy

Objects reference parents by **name** (not UUID):

```json
[
  {
    "name": "robot",
    "type": "group",
    "position": [0, 0, 0],
    "rotation": [0, 0, 0],
    "scale": [1, 1, 1]
  },
  {
    "name": "robot_head",
    "type": "sphere",
    "parent": "robot",
    "position": [0, 2, 0],
    "rotation": [0, 0, 0],
    "scale": [0.5, 0.5, 0.5],
    "material": { "color": "#cccccc", "metalness": 0.8, "roughness": 0.2 }
  }
]
```

Child positions are relative to parent.

## Validation Rules

1. All `name` values must be unique
2. All `parent` references must point to existing object names
3. `position`, `rotation`, `scale` must be 3-number arrays
4. `color` must be hex format: `"#rrggbb"`
5. `metalness`, `roughness` must be 0-1
6. Shader materials with `shaderName` must have corresponding files in `shaders/staging/`

## Examples

### Simple Object

```json
[
  {
    "name": "redCube",
    "type": "box",
    "position": [0, 0.5, 0],
    "rotation": [0, 0.785, 0],
    "scale": [1, 1, 1],
    "material": {
      "color": "#ff0000",
      "metalness": 0.3,
      "roughness": 0.7
    }
  }
]
```

### Hierarchy with Group

```json
[
  {
    "name": "table",
    "type": "group",
    "position": [0, 0, 0],
    "rotation": [0, 0, 0],
    "scale": [1, 1, 1]
  },
  {
    "name": "tabletop",
    "type": "box",
    "parent": "table",
    "position": [0, 1, 0],
    "rotation": [0, 0, 0],
    "scale": [2, 0.1, 1],
    "material": { "color": "#8b4513", "metalness": 0, "roughness": 0.9 }
  },
  {
    "name": "leg1",
    "type": "cylinder",
    "parent": "table",
    "position": [-0.9, 0.5, -0.4],
    "rotation": [0, 0, 0],
    "scale": [0.1, 1, 0.1],
    "material": { "color": "#8b4513", "metalness": 0, "roughness": 0.9 }
  }
]
```

### Glass Material

```json
{
  "name": "glassOrb",
  "type": "sphere",
  "position": [0, 1, 0],
  "rotation": [0, 0, 0],
  "scale": [1, 1, 1],
  "material": {
    "type": "physical",
    "color": "#ffffff",
    "metalness": 0,
    "roughness": 0,
    "transmission": 1.0,
    "thickness": 0.5,
    "ior": 1.5
  }
}
```

### Shader Material with External Files

```json
{
  "name": "glowingSphere",
  "type": "sphere",
  "position": [0, 1, 0],
  "rotation": [0, 0, 0],
  "scale": [1, 1, 1],
  "material": {
    "type": "shader",
    "shaderName": "glow",
    "uniforms": {
      "baseColor": { "type": "color", "value": "#00ffff" },
      "time": { "type": "float", "value": 0, "animated": true }
    }
  }
}
```

Requires `shaders/staging/glow.vert` and `shaders/staging/glow.frag` to exist.

### Shader Material with Inline GLSL

```json
{
  "name": "proceduralBox",
  "type": "box",
  "position": [0, 0.5, 0],
  "rotation": [0, 0, 0],
  "scale": [1, 1, 1],
  "material": {
    "type": "shader",
    "vertex": "varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    "fragment": "uniform vec3 baseColor; varying vec2 vUv; void main() { gl_FragColor = vec4(baseColor * vUv.x, 1.0); }",
    "uniforms": {
      "baseColor": { "type": "color", "value": "#ff00ff" }
    }
  }
}
```

## Differences from TSP Format

| Aspect | JSON Scene | TSP |
|--------|-----------|-----|
| Purpose | Editing/staging | Export/import |
| Structure | Flat array | Nested sections |
| Parent refs | By name | By UUID |
| Materials | Inline per object | Deduplicated dictionary |
| Geometries | Implicit | Deduplicated dictionary |
| Shaders | External or inline | Always inline |
| Metadata | None | version, created, generator |

The JSON scene format is simpler for editing. TSP is more portable for sharing/loading.
