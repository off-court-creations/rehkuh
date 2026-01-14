# AI Scene Editing Guide

This guide explains how AI agents should edit scenes in rehkuh.

## The Golden Rule

**NEVER edit `scene/scene.json` directly.** Direct edits are automatically reverted.

Edit `scene/staging-scene.json` instead, then promote it.

## Quick Start

```bash
# 1. Copy current scene and shaders to staging (optional - starts from current state)
curl -X POST http://localhost:5173/__copy-to-staging

# 2. Edit scene/staging-scene.json with your changes

# 3. Validate and promote to live
npm run promote-staging
# or
curl -X POST http://localhost:5173/__promote-staging
```

## File Structure

```
scene/
├── staging-scene.json      ← YOU EDIT THIS
├── scene.json              ← Live scene (auto-reverts direct edits)
├── scene.backup.json       ← Auto-backup before promotions
└── UNAUTHORIZED_EDIT_REVERTED.md  ← Created if you edit scene.json directly

shaders/
├── staging/                ← YOU EDIT SHADERS HERE
│   ├── myShader.vert
│   └── myShader.frag
├── _template.vert          ← Template for new shaders
├── _template.frag
├── myShader.vert           ← Live shaders (auto-reverts direct edits)
├── myShader.frag
└── UNAUTHORIZED_EDIT_REVERTED.md  ← Created if you edit live shaders directly
```

## API Reference

All endpoints are on the dev server (default `http://localhost:5173`).

### Copy Scene to Staging

```bash
curl -X POST http://localhost:5173/__copy-to-staging
```

Copies `scene.json` → `staging-scene.json` and shaders from `shaders/` → `shaders/staging/` (excluding templates). Use this to start editing from the current scene state without reading files into context.

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
  -d '{"title": "My Scene", "objects": [{"name": "cube", "type": "box", "position": [0,0,0], "rotation": [0,0,0], "scale": [1,1,1], "material": {"color": "#ff0000", "metalness": 0.5, "roughness": 0.5}}]}'
```

Writes directly to `staging-scene.json`. No validation - use `/__promote-staging` to validate.

### Read Live Scene

```bash
curl http://localhost:5173/__scene
```

Returns the current live `scene.json`. Use this to see what the user changed via UI.

## Workflow Examples

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

## Scene Format Quick Reference

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

**Object required fields:** `name`, `type`, `position`, `rotation`, `scale`

**Object optional fields:** `parent`, `material` (and complex geometry fields)

**Geometry types:** `box`, `sphere`, `cylinder`, `cone`, `torus`, `plane`, `capsule`, `circle`, `ring`, `dodecahedron`, `icosahedron`, `octahedron`, `tetrahedron`, `torusKnot`, `group`, `lathe`, `extrude`, `shape`, `tube`, `polyhedron`

For full format details, see `docs/tsp-format.md`.

For shader material examples, see `public/tsp/animatedHeart.tsp`.

## External Shader Files

For shader materials, you can write vertex and fragment shaders as separate files instead of inlining them in JSON. This makes shaders easier to write and maintain.

### Directory Structure

```
scene/
├── staging-scene.json     ← Scene JSON with shaderName references
└── shaders/               ← Staging shader files
    ├── myShader.vert      ← Vertex shader
    └── myShader.frag      ← Fragment shader

shaders/                   ← Production shaders (copied on promote)
├── _template.vert         ← Template for new shaders
└── _template.frag
```

### Workflow

1. **Write the staging scene JSON** with a `shaderName` reference (no inline `vertex`/`fragment`):

```json
{
  "title": "Glow Demo",
  "objects": [
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
  ]
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

### API Endpoints

**Read staging shader:**
```bash
curl http://localhost:5173/__staging-shader/glow
# Returns: { "vert": "...", "frag": "..." }
```

**Write staging shader:**
```bash
curl -X POST http://localhost:5173/__staging-shader-write/glow \
  -H "Content-Type: application/json" \
  -d '{"vert": "...", "frag": "..."}'
```

### Inline vs External Shaders

| Approach | When to Use |
|----------|-------------|
| **External files** (`shaderName`) | Development workflow, easier to edit, hot reload support |
| **Inline** (`vertex`/`fragment`) | TSP export, portable files, one-off shaders |

When you use `shaderName`, the viewport loads shaders at runtime. When you export to TSP, shaders are inlined automatically.

### Shader Hot Reload

When you edit files in `shaders/staging/`, the changes are broadcast via WebSocket. The viewport can pick up changes without a full reload (though a promote is still required to update the live scene).

## Validation Errors

Common validation errors and fixes:

| Error | Fix |
|-------|-----|
| `name: Object name cannot be empty` | Add a unique `name` field |
| `position: Expected array, received undefined` | Add `position: [x, y, z]` |
| `Duplicate object names: foo` | Make all `name` values unique |
| `references non-existent parent` | Check `parent` field points to valid object name |
| `color: Invalid` | Use hex format: `"#rrggbb"` |
| `metalness: Number must be <= 1` | Keep metalness/roughness in 0-1 range |
| `Missing staging shader files: foo.vert` | Create `shaders/staging/foo.vert` and `foo.frag` |

## Why This Workflow?

1. **Validation** - Staging is validated before going live, preventing broken scenes
2. **Safety** - Live scene can't be corrupted by invalid edits
3. **Backup** - Auto-backup before each promotion allows recovery
4. **Collaboration** - User UI changes and AI changes don't conflict
