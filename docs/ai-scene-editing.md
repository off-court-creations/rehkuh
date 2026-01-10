# AI Scene Editing Guide

This guide explains how AI agents should edit scenes in rehkuh.

## The Golden Rule

**NEVER edit `scene/scene.json` directly.** Direct edits are automatically reverted.

Edit `scene/staging-scene.json` instead, then promote it.

## Quick Start

```bash
# 1. Copy current scene to staging (optional - starts from current state)
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
├── scene.json              ← Live scene (API/UI only, auto-reverts direct edits)
├── scene.backup.json       ← Auto-backup before promotions
└── UNAUTHORIZED_EDIT_REVERTED.md  ← Created if you edit scene.json directly
```

## API Reference

All endpoints are on the dev server (default `http://localhost:5173`).

### Copy Scene to Staging

```bash
curl -X POST http://localhost:5173/__copy-to-staging
```

Copies `scene.json` → `staging-scene.json`. Use this to start editing from the current scene state without reading the file into context.

**Response:**
```json
{ "ok": true, "message": "Copied 15 objects from scene.json to staging-scene.json" }
```

### Promote Staging to Live

```bash
npm run promote-staging
# or
curl -X POST http://localhost:5173/__promote-staging
```

Validates `staging-scene.json` and if valid, copies it to `scene.json`. The viewport auto-reloads.

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
  -d '[{"name": "cube", "type": "box", "position": [0,0,0], "rotation": [0,0,0], "scale": [1,1,1], "material": {"color": "#ff0000", "metalness": 0.5, "roughness": 0.5}}]'
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
# 1. Start from current scene
curl -X POST http://localhost:5173/__copy-to-staging

# 2. Edit staging-scene.json - add your new objects

# 3. Promote
curl -X POST http://localhost:5173/__promote-staging
```

### Creating a New Scene from Scratch

```bash
# 1. Write empty array or new scene to staging
echo '[]' > scene/staging-scene.json
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
[
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
```

**Required fields:** `name`, `type`, `position`, `rotation`, `scale`

**Optional fields:** `parent`, `material` (and complex geometry fields)

**Geometry types:** `box`, `sphere`, `cylinder`, `cone`, `torus`, `plane`, `capsule`, `circle`, `ring`, `dodecahedron`, `icosahedron`, `octahedron`, `tetrahedron`, `torusKnot`, `group`, `lathe`, `extrude`, `shape`, `tube`, `polyhedron`

For full format details, see `docs/tsp-format.md`.

For shader material examples, see `public/tsp/animatedHeart.tsp`.

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

## Why This Workflow?

1. **Validation** - Staging is validated before going live, preventing broken scenes
2. **Safety** - Live scene can't be corrupted by invalid edits
3. **Backup** - Auto-backup before each promotion allows recovery
4. **Collaboration** - User UI changes and AI changes don't conflict
