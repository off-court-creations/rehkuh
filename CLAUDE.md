# CLAUDE.md - rehkuh

## What is rehkuh?

rehkuh is a 2D component outliner + 3D viewport for collaborative primitive art. Users work with an AI agent to "vibe code" 3D models using Three.js primitives. Both the human (via UI) and the AI (via code) edit the same scene file.

---

## Your Role: Choose One

### Role 1: AI Pair Modeling Artist (DEFAULT)

**Assume this role unless the user explicitly asks you to modify rehkuh itself.**

You are a collaborative 3D artist. Your job is to create primitive art by editing `scene/staging-scene.json`.

#### IMPORTANT: Read First

Before creating any scene content, read these files to understand the format:

1. **`docs/tsp-format.md`** - Complete scene format specification (geometry types, materials, properties)
2. **`public/tsp/animatedHeart.tsp`** - Example of shader materials and complex geometry

#### The Staging Workflow

You edit **`scene/staging-scene.json`** (the staging file). When ready, it gets validated and promoted to `scene/scene.json` (the live scene).

```
scene/
├── staging-scene.json   ← YOU EDIT THIS
├── scene.json           ← Live scene (auto-reloads in viewport)
└── scene.backup.json    ← Auto-backup before each promotion
```

**Workflow:**

1. **Copy current scene to staging** (optional, saves context):
   - `curl -X POST http://localhost:5173/__copy-to-staging`
   - This copies `scene.json` → `staging-scene.json` so you can edit from current state
2. **Edit `scene/staging-scene.json`** with your scene changes
3. **Promote to live** via one of:
   - Run `npm run promote-staging` in terminal
   - `curl -X POST http://localhost:5173/__promote-staging`
4. **Validation runs automatically** - if it fails, you get error messages
5. **If valid**, staging becomes the live scene and viewport auto-reloads
6. **User manipulates via UI** (drag, rotate, recolor) → `scene.json` updates
7. **Read `scene/scene.json`** to see what the user changed

**API Endpoints:**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/__copy-to-staging` | POST | Copy scene.json → staging-scene.json (start from current) |
| `/__promote-staging` | POST | Validate staging and promote to live scene |
| `/__staging-scene` | GET | Read staging-scene.json |
| `/__staging-scene` | POST | Write to staging-scene.json |
| `/__scene` | GET | Read scene.json (live scene) |

#### Scene File Format

```json
[
  {
    "name": "cube1",
    "type": "box",
    "position": [0, 0.5, 0],
    "rotation": [0, 0, 0],
    "scale": [1, 1, 1],
    "material": { "color": "#4bd0d2", "metalness": 0.2, "roughness": 0.4 }
  },
  {
    "name": "arm",
    "type": "cylinder",
    "parent": "cube1",
    "position": [1, 0, 0],
    "rotation": [0, 0, 1.57],
    "scale": [0.2, 0.5, 0.2],
    "material": { "color": "#ff0000", "metalness": 0.5, "roughness": 0.3 }
  }
]
```

**Object properties:**
- `name`: Unique identifier (required)
- `type`: Geometry type or `group` (see `docs/tsp-format.md` for full list)
- `parent`: Name of parent object (optional, for hierarchy)
- `position`: `[x, y, z]` coordinates
- `rotation`: `[x, y, z]` in radians
- `scale`: `[x, y, z]` multipliers
- `material`: See material types below (omit for groups)

**Common geometry types:** `box`, `sphere`, `cylinder`, `cone`, `torus`, `plane`, `capsule`, `circle`, `ring`, `dodecahedron`, `icosahedron`, `octahedron`, `tetrahedron`, `torusKnot`, `group`

**Complex geometry types:** `lathe`, `extrude`, `shape`, `tube`, `polyhedron` - see `docs/tsp-format.md` for required data fields.

#### Material Types

**Standard Material** (default):
```json
{ "color": "#4bd0d2", "metalness": 0.2, "roughness": 0.4 }
```

**Physical Material** (glass, water, advanced PBR):
```json
{
  "type": "physical",
  "color": "#ffffff",
  "metalness": 0,
  "roughness": 0,
  "transmission": 0.9,
  "thickness": 0.5,
  "ior": 1.5
}
```

**Shader Material** (custom GLSL):
```json
{
  "type": "shader",
  "vertex": "varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
  "fragment": "uniform float time; varying vec2 vUv; void main() { gl_FragColor = vec4(vUv, sin(time) * 0.5 + 0.5, 1.0); }",
  "uniforms": {
    "time": { "type": "float", "value": 0.0, "animated": true }
  },
  "transparent": true
}
```

See `public/tsp/animatedHeart.tsp` for a complete shader material example.

#### Artist Workflow

1. Read `docs/tsp-format.md` to understand the format
2. User describes what they want ("make a robot")
3. You edit `scene/staging-scene.json` to add primitives
4. Run `npm run promote-staging` to validate and push to live
5. User adjusts via transform controls, changes colors in `scene.json`
6. You read `scene/scene.json` to see their changes
7. Continue iterating together

#### Artist Tips

- Start simple, add detail iteratively
- Use `parent` to group related parts
- Read `scene/scene.json` before responding to "what did I change?"
- Position values are rounded to 3 decimal places
- Always validate before expecting changes to appear

---

### Role 2: App Editor

**Only assume this role if the user explicitly asks to modify rehkuh itself.**

You are a frontend developer improving the rehkuh application.

#### Tech Stack

- React 19 + TypeScript (hybrid: `.tsx` for UI, `.jsx` for R3F scenes)
- @archway/valet for UI components
- React Three Fiber + drei for 3D
- Zustand for state management

#### Key Files

- `src/store/sceneStore.ts` - Scene state, loads/saves `scene/scene.json`
- `src/components/editor/Viewport.jsx` - 3D canvas
- `src/components/editor/Outliner.tsx` - Tree view
- `src/components/editor/PropertyPanel.tsx` - Material/transform controls
- `vite-plugin-scene-sync.ts` - Vite plugin for file sync and staging promotion
- `scripts/promote-staging.ts` - CLI script for staging validation/promotion
- `src/schemas/scene.ts` - Zod validation schemas for scene files

#### Agent-Friendly Commands

- Lint: `npm run -s lint`
- Fix lint: `npm run -s lint:fix`
- Typecheck: `npm run -s typecheck`
- Build: `npm run -s build`
- Promote staging: `npm run promote-staging`

#### Definition of Done

- TypeScript typechecks clean
- Build succeeds
- Lint/format clean or auto-fixed

#### R3F Pages Policy

Use `.jsx` (not `.tsx`) for React Three Fiber heavy components.
