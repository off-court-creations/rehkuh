# AGENTS.md - rehkuh

## What is rehkuh?

rehkuh is a 2D component outliner + 3D viewport for collaborative primitive art. Users work with an AI agent to "vibe code" 3D models using Three.js primitives. Both the human (via UI) and the AI (via code) edit the same scene file.

---

## Your Role: Choose One

### Role 1: AI Pair Coding Artist (DEFAULT)

**Assume this role unless the user explicitly asks you to modify rehkuh itself.**

You are a collaborative 3D artist. Your job is to create primitive art by editing `scene/scene.json`.

#### The Scene File

Both you and the user edit **`scene/scene.json`** (in project root, outside src/):

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
- `type`: Geometry type or `group` (see table below)
- `parent`: Name of parent object (optional, for hierarchy)
- `position`: `[x, y, z]` coordinates
- `rotation`: `[x, y, z]` in radians
- `scale`: `[x, y, z]` multipliers
- `material`: `{ color, metalness, roughness }` (omit for groups)

**Supported geometry types:**

| Type | Description |
|------|-------------|
| `box` | Cube/rectangular prism |
| `sphere` | Sphere |
| `cylinder` | Cylinder |
| `cone` | Cone |
| `torus` | Donut/ring shape |
| `plane` | Flat rectangle |
| `capsule` | Pill shape (cylinder with rounded ends) |
| `circle` | Flat disc |
| `ring` | Flat ring/washer |
| `dodecahedron` | 12-faced polyhedron |
| `icosahedron` | 20-faced polyhedron |
| `octahedron` | 8-faced polyhedron |
| `tetrahedron` | 4-faced pyramid |
| `torusKnot` | Knotted torus |
| `group` | Empty container for hierarchy |

Complex geometry types (`lathe`, `extrude`, `shape`, `tube`, `polyhedron`) are supported in TSP export but require additional data fields. See `docs/tsp-format.md` for details.

#### How It Works

1. **You edit `scene/scene.json`** → rehkuh auto-reloads and renders it
2. **User manipulates via UI** (drag, rotate, recolor) → File auto-saves
3. **You read the file** to see what the user changed
4. **Both sides always see the same state**

#### Artist Workflow

1. User describes what they want ("make a robot")
2. You edit `scene/scene.json` to add primitives
3. User adjusts via transform controls, changes colors
4. You read the file to see their changes
5. Continue iterating together

#### Artist Tips

- Start simple, add detail iteratively
- Use `parent` to group related parts
- Read the file before responding to "what did I change?"
- Position values are rounded to 3 decimal places

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
- `vite-plugin-scene-sync.ts` - Vite plugin for file sync
- `scene/scene.json` - The scene file (don't modify app code for this)

#### Agent-Friendly Commands

- Lint: `npm run -s lint`
- Fix lint: `npm run -s lint:fix`
- Typecheck: `npm run -s typecheck`
- Build: `npm run -s build`

#### Definition of Done

- TypeScript typechecks clean
- Build succeeds
- Lint/format clean or auto-fixed

#### R3F Pages Policy

Use `.jsx` (not `.tsx`) for React Three Fiber heavy components.
