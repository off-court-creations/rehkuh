# AI Scene Editing Guide

A practical guide for AI agents collaborating on 3D primitive art in rehkuh.

---

## Table of Contents

1. [The Golden Rule](#1-the-golden-rule)
2. [Quick Start](#2-quick-start)
3. [File Structure](#3-file-structure)
4. [API Reference](#4-api-reference)
5. [Workflow Examples](#5-workflow-examples)
6. [Scene Format Quick Reference](#6-scene-format-quick-reference)
7. [Geometry Recipes](#7-geometry-recipes)
8. [Material Recipes](#8-material-recipes)
9. [External Shaders](#9-external-shaders)
10. [Animation Best Practices](#10-animation-best-practices)
11. [Common Validation Errors](#11-common-validation-errors)
12. [Tips & Best Practices](#12-tips--best-practices)

---

## 1. The Golden Rule

**NEVER edit `scene/scene.json` directly.** Direct edits are automatically reverted.

Edit `scene/staging-scene.json` instead, then promote it.

---

## 2. Quick Start

```bash
# 1. Copy current scene and shaders to staging (optional - starts from current state)
curl -X POST http://localhost:5173/__copy-to-staging

# 2. Edit scene/staging-scene.json with your changes

# 3. Validate and promote to live
npm run promote-staging
# or
curl -X POST http://localhost:5173/__promote-staging
```

---

## 3. File Structure

```
scene/
├── staging-scene.json      <- YOU EDIT THIS
├── scene.json              <- Live scene (auto-reverts direct edits)
├── scene.backup.json       <- Auto-backup before promotions
└── UNAUTHORIZED_EDIT_REVERTED.md  <- Created if you edit scene.json directly

shaders/
├── staging/                <- YOU EDIT SHADERS HERE
│   ├── myShader.vert
│   └── myShader.frag
├── _template.vert          <- Template for new shaders
├── _template.frag
├── myShader.vert           <- Live shaders (auto-reverts direct edits)
├── myShader.frag
└── UNAUTHORIZED_EDIT_REVERTED.md  <- Created if you edit live shaders directly
```

---

## 4. API Reference

All endpoints are on the dev server (default `http://localhost:5173`).

### Copy Scene to Staging

```bash
curl -X POST http://localhost:5173/__copy-to-staging
```

Copies `scene.json` -> `staging-scene.json` and shaders from `shaders/` -> `shaders/staging/` (excluding templates). Use this to start editing from the current scene state without reading files into context.

**Response:**
```json
{ "ok": true, "message": "Copied 15 objects and 2 shader(s) to staging" }
```

### Promote Staging to Live

```bash
npm run promote-staging
# or
curl -X POST http://localhost:5173/__promote-staging
```

Validates `staging-scene.json` and if valid, copies it to `scene.json` and shaders from `shaders/staging/` to `shaders/`. The viewport auto-reloads.

**Success Response:**
```json
{ "ok": true, "message": "Promoted 15 objects from staging to scene" }
```

**Failure Response:**
```json
{ "ok": false, "error": "Schema validation failed: 0.name: Object name cannot be empty" }
```

### Read Staging Scene

```bash
curl http://localhost:5173/__staging-scene
```

Returns the current contents of `staging-scene.json`.

### Write Staging Scene

```bash
curl -X POST http://localhost:5173/__staging-scene \
  -H "Content-Type: application/json" \
  -d '{"title": "My Scene", "objects": [...]}'
```

Writes directly to `staging-scene.json`. No validation - use `/__promote-staging` to validate.

### Read Live Scene

```bash
curl http://localhost:5173/__scene
```

Returns the current live `scene.json`. Use this to see what the user changed via UI.

### Read Staging Shader

```bash
curl http://localhost:5173/__staging-shader/glow
# Returns: { "vert": "...", "frag": "..." }
```

### Write Staging Shader

```bash
curl -X POST http://localhost:5173/__staging-shader-write/glow \
  -H "Content-Type: application/json" \
  -d '{"vert": "...", "frag": "..."}'
```

---

## 5. Workflow Examples

### Adding Objects to Existing Scene

```bash
# 1. Start from current scene and shaders
curl -X POST http://localhost:5173/__copy-to-staging

# 2. Edit staging-scene.json - add your new objects

# 3. Promote
curl -X POST http://localhost:5173/__promote-staging
```

### Creating a New Scene from Scratch

```bash
# 1. Write new scene to staging (title/description are optional)
echo '{"title": "My Scene", "description": "A cool scene", "objects": []}' > scene/staging-scene.json
# or edit staging-scene.json with your objects

# 2. Promote
npm run promote-staging
```

### Checking What User Changed

```bash
# Read the live scene to see UI modifications
curl http://localhost:5173/__scene
```

---

## 6. Scene Format Quick Reference

```json
{
  "title": "My Scene",
  "description": "A description of this scene",
  "objects": [
    {
      "name": "uniqueName",
      "type": "box",
      "position": [0, 0, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 1, 1],
      "material": {
        "color": "#4bd0d2",
        "metalness": 0.2,
        "roughness": 0.4
      }
    }
  ]
}
```

**Top-level fields:**
- `objects` (required): Array of scene objects
- `title` (optional): Human-readable scene title
- `description` (optional): Scene description
- `animations` (optional): Array of animation clips

**Object required fields:** `name`, `type`, `position`, `rotation`, `scale`

**Object optional fields:** `parent`, `material` (and geometry-specific fields)

**Geometry types:** `box`, `sphere`, `cylinder`, `cone`, `torus`, `plane`, `capsule`, `circle`, `ring`, `dodecahedron`, `icosahedron`, `octahedron`, `tetrahedron`, `torusKnot`, `group`, `lathe`, `extrude`, `shape`, `tube`, `polyhedron`

For full format details, see [JSON Scene Format Specification](./json-scene-format.md).

---

## 7. Geometry Recipes

### Sphere Partials

| Shape | Parameters |
|-------|------------|
| Dome (top half) | `sphereThetaLength: 1.571` |
| Bowl (bottom half) | `sphereThetaStart: 1.571, sphereThetaLength: 1.571` |
| Half sphere (vertical cut) | `spherePhiLength: 3.142` |
| Quarter sphere | `spherePhiLength: 1.571, sphereThetaLength: 1.571` |
| Low-poly sphere | `sphereWidthSegments: 8, sphereHeightSegments: 6` |

**Example dome:**

```json
{
  "name": "dome",
  "type": "sphere",
  "position": [0, 0, 0],
  "rotation": [0, 0, 0],
  "scale": [1, 1, 1],
  "sphereThetaLength": 1.571,
  "material": { "color": "#44ff88", "metalness": 0.3, "roughness": 0.5 }
}
```

### Box Subdivision

For smoother lighting or displacement effects, subdivide boxes:

```json
{
  "name": "subdividedBox",
  "type": "box",
  "position": [0, 0.5, 0],
  "rotation": [0, 0, 0],
  "scale": [2, 1, 1],
  "boxWidthSegments": 4,
  "boxHeightSegments": 2,
  "boxDepthSegments": 2,
  "material": { "color": "#ff0000", "metalness": 0.5, "roughness": 0.5 }
}
```

### Lathe Geometry

Create vases, bottles, or any revolved profile:

```json
{
  "name": "vase",
  "type": "lathe",
  "position": [0, 0, 0],
  "rotation": [0, 0, 0],
  "scale": [1, 1, 1],
  "points": [[0, 0], [0.5, 0.2], [0.3, 1.0], [0, 1.0]],
  "material": { "color": "#8b4513", "metalness": 0.2, "roughness": 0.8 }
}
```

### Extrude Geometry

Create 3D shapes from 2D profiles:

```json
{
  "name": "star",
  "type": "extrude",
  "position": [0, 0, 0],
  "rotation": [0, 0, 0],
  "scale": [1, 1, 1],
  "shape": {
    "commands": [
      { "op": "moveTo", "x": 0, "y": 0.5 },
      { "op": "lineTo", "x": 0.1, "y": 0.2 },
      { "op": "lineTo", "x": 0.5, "y": 0.2 },
      { "op": "lineTo", "x": 0.2, "y": 0 },
      { "op": "lineTo", "x": 0.3, "y": -0.4 },
      { "op": "lineTo", "x": 0, "y": -0.1 },
      { "op": "lineTo", "x": -0.3, "y": -0.4 },
      { "op": "lineTo", "x": -0.2, "y": 0 },
      { "op": "lineTo", "x": -0.5, "y": 0.2 },
      { "op": "lineTo", "x": -0.1, "y": 0.2 }
    ]
  },
  "extrudeOptions": {
    "depth": 0.2,
    "bevelEnabled": true,
    "bevelThickness": 0.05,
    "bevelSize": 0.03
  },
  "material": { "color": "#ffd700", "metalness": 0.8, "roughness": 0.2 }
}
```

### Tube Geometry

Create pipes, ribbons, or paths:

```json
{
  "name": "curvedPipe",
  "type": "tube",
  "position": [0, 0, 0],
  "rotation": [0, 0, 0],
  "scale": [1, 1, 1],
  "path": {
    "curveType": "catmullRom",
    "points": [[0, 0, 0], [1, 1, 0], [2, 0, 0], [3, 1, 0]],
    "closed": false,
    "tension": 0.5
  },
  "tubeRadius": 0.1,
  "tubeTubularSegments": 64,
  "tubeRadialSegments": 8,
  "tubeClosed": false,
  "material": { "color": "#666666", "metalness": 0.9, "roughness": 0.1 }
}
```

---

## 8. Material Recipes

### Standard Material

Basic PBR material for most use cases:

```json
{
  "color": "#4bd0d2",
  "metalness": 0.2,
  "roughness": 0.4
}
```

### Emissive (Glowing) Material

```json
{
  "color": "#00ff00",
  "metalness": 0,
  "roughness": 1,
  "emissive": "#00ff00",
  "emissiveIntensity": 2
}
```

### Glass Material

```json
{
  "type": "physical",
  "color": "#ffffff",
  "metalness": 0,
  "roughness": 0,
  "transmission": 1.0,
  "thickness": 0.5,
  "ior": 1.5,
  "transparent": true
}
```

### Frosted Glass

```json
{
  "type": "physical",
  "color": "#ffffff",
  "metalness": 0,
  "roughness": 0.3,
  "transmission": 1.0,
  "thickness": 0.5,
  "ior": 1.5,
  "transparent": true
}
```

### Water

```json
{
  "type": "physical",
  "color": "#88ccff",
  "metalness": 0,
  "roughness": 0,
  "transmission": 1.0,
  "ior": 1.33,
  "transparent": true
}
```

### Car Paint

```json
{
  "type": "physical",
  "color": "#cc0000",
  "metalness": 0.9,
  "roughness": 0.1,
  "clearcoat": 1.0,
  "clearcoatRoughness": 0.1
}
```

### Velvet / Fabric

```json
{
  "type": "physical",
  "color": "#800020",
  "metalness": 0,
  "roughness": 0.8,
  "sheen": 1.0,
  "sheenRoughness": 0.8,
  "sheenColor": "#ff6666"
}
```

### Brushed Metal

```json
{
  "type": "physical",
  "color": "#cccccc",
  "metalness": 1.0,
  "roughness": 0.3,
  "anisotropy": 1.0,
  "anisotropyRotation": 0
}
```

### Diamond / Gem

```json
{
  "type": "physical",
  "color": "#ffffff",
  "metalness": 0,
  "roughness": 0,
  "transmission": 1.0,
  "ior": 2.333,
  "dispersion": 0.05,
  "transparent": true
}
```

### Soap Bubble / Iridescent

```json
{
  "type": "physical",
  "color": "#ffffff",
  "metalness": 0,
  "roughness": 0,
  "transmission": 0.9,
  "iridescence": 1.0,
  "iridescenceIOR": 1.3,
  "transparent": true
}
```

### Common IOR Values

| Material | IOR |
|----------|-----|
| Air | 1.0 |
| Water | 1.33 |
| Glass | 1.5 |
| Crystal | 2.0 |
| Diamond | 2.42 (use 2.333) |

---

## 9. External Shaders

For shader materials, write vertex and fragment shaders as separate files instead of inlining them in JSON.

### Workflow

1. **Write the staging scene JSON** with a `shaderName` reference:

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

2. **Write the shader files** in `shaders/staging/`:

**shaders/staging/glow.vert:**
```glsl
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

**shaders/staging/glow.frag:**
```glsl
uniform vec3 baseColor;
uniform float time;

varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  float glow = sin(time * 2.0) * 0.5 + 0.5;
  vec3 color = baseColor * (0.5 + glow * 0.5);
  gl_FragColor = vec4(color, 1.0);
}
```

3. **Promote the staging scene:**

```bash
npm run promote-staging
```

On promotion:
- Shader files are validated (both `.vert` and `.frag` must exist)
- Shader files are copied from `shaders/staging/` to `shaders/`
- The scene is copied to `scene.json`
- The viewport auto-reloads and fetches shaders at runtime

### Inline vs External Shaders

| Approach | When to Use |
|----------|-------------|
| **External files** (`shaderName`) | Development workflow, easier to edit, hot reload support |
| **Inline** (`vertex`/`fragment`) | TSP export, portable files, one-off shaders |

### Built-in Uniforms

These uniforms are automatically updated when present:
- `time` (float, `animated: true`) - Elapsed time in seconds
- `resolution` (vec2) - Viewport dimensions in pixels

---

## 10. Animation Best Practices

### Prefer Multiple Tracks in One Clip

The viewport plays **one animation clip at a time**. If you need multiple objects to animate simultaneously (e.g., a solar system with orbiting planets), put all tracks in a single clip rather than creating separate clips.

**Do this:**
```json
{
  "animations": [
    {
      "name": "solar-system",
      "duration": 20,
      "tracks": [
        { "target": "earth-orbit", "path": "quaternion", "interpolation": "linear", "times": [0, 20], "values": [0, 0, 0, 1, 0, 1, 0, 0] },
        { "target": "earth", "path": "quaternion", "interpolation": "linear", "times": [0, 2], "values": [0, 0, 0, 1, 0, 1, 0, 0] },
        { "target": "moon-orbit", "path": "quaternion", "interpolation": "linear", "times": [0, 5], "values": [0, 0, 0, 1, 0, 1, 0, 0] }
      ]
    }
  ]
}
```

**Not this** (only one will play at a time):
```json
{
  "animations": [
    { "name": "earth-orbit", "tracks": [...] },
    { "name": "earth-spin", "tracks": [...] },
    { "name": "moon-orbit", "tracks": [...] }
  ]
}
```

Only create separate clips when the user explicitly asks for separate animations that can be played independently.

### Handling Different Animation Speeds

When tracks have different speeds (e.g., earth spins faster than it orbits), expand keyframes to cover the full clip duration:

- Earth orbit: 1 rotation in 20s -> 5 keyframes
- Earth spin: 10 rotations in 20s -> 41 keyframes (every 0.5s)
- Moon orbit: 4 rotations in 20s -> 17 keyframes (every 1.25s)

### Orbital Animation Pattern

For orbital animations (moons around planets, planets around stars), use a pivot hierarchy to decouple orbits from spins:

```
earth-orbit (group, rotates for orbit)
└── earth-pivot (group at orbital distance, no animation)
    ├── earth (sphere, spins independently)
    └── moon-orbit (group, rotates for moon's orbit - sibling, not child of earth)
        └── moon (sphere, spins)
```

This prevents the moon's orbit from inheriting the earth's spin rotation.

### Bouncing Animation Example

```json
{
  "animations": [
    {
      "name": "bounce",
      "tracks": [
        {
          "target": "cube",
          "path": "position",
          "interpolation": "smooth",
          "times": [0, 0.5, 1.0],
          "values": [0, 0.5, 0, 0, 2, 0, 0, 0.5, 0]
        }
      ]
    }
  ]
}
```

### Rotation with Quaternion

90-degree rotation around Y axis:

```json
{
  "target": "cube",
  "path": "quaternion",
  "interpolation": "linear",
  "times": [0, 1.0],
  "values": [0, 0, 0, 1, 0, 0.707, 0, 0.707]
}
```

Common quaternion values:
- Identity (no rotation): `[0, 0, 0, 1]`
- 90deg around Y: `[0, 0.707, 0, 0.707]`
- 180deg around Y: `[0, 1, 0, 0]`
- 90deg around X: `[0.707, 0, 0, 0.707]`
- 90deg around Z: `[0, 0, 0.707, 0.707]`

---

## 11. Common Validation Errors

| Error | Fix |
|-------|-----|
| `name: Object name cannot be empty` | Add a unique `name` field |
| `position: Expected array, received undefined` | Add `position: [x, y, z]` |
| `Duplicate object names: foo` | Make all `name` values unique |
| `references non-existent parent` | Check `parent` field points to valid object name |
| `color: Invalid` | Use hex format: `"#rrggbb"` |
| `metalness: Number must be <= 1` | Keep metalness/roughness in 0-1 range |
| `Missing staging shader files: foo.vert` | Create `shaders/staging/foo.vert` and `foo.frag` |
| `times must be strictly increasing` | Ensure animation keyframe times increase |
| `values.length must equal times.length * components` | Check value count matches keyframes |

---

## 12. Tips & Best Practices

### General

- **Start simple, add detail iteratively** - Get the basic shapes in place first, then refine
- **Use `parent` to group related parts** - Makes it easier to move/rotate entire assemblies
- **Read `scene/scene.json` before responding** - See what the user changed via UI
- **Position values are rounded to 3 decimal places** - Don't expect full precision
- **Always validate before expecting changes** - Promotion runs validation automatically

### Hierarchies

Use groups to organize complex models:

```json
{
  "objects": [
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
}
```

### Naming Conventions

- Use descriptive names: `robot_head`, `table_leg_front_left`
- Use underscores, not spaces or special characters
- Prefix children with parent name for clarity: `car_wheel_front_left`

### Why This Workflow?

1. **Validation** - Staging is validated before going live, preventing broken scenes
2. **Safety** - Live scene can't be corrupted by invalid edits
3. **Backup** - Auto-backup before each promotion allows recovery
4. **Collaboration** - User UI changes and AI changes don't conflict
