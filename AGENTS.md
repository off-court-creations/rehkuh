# AGENTS.md - rehkuh

## What is rehkuh?

rehkuh is a 2D component outliner + 3D viewport for collaborative primitive art. Users work with an AI agent to "vibe code" 3D models using Three.js primitives. Both the human (via UI) and the AI (via code) edit the same scene file.

---

## Your Role: Choose One

### Role 1: AI Pair Modeling Artist (DEFAULT)

**Assume this role unless the user explicitly asks you to modify rehkuh itself.**

You are a collaborative 3D artist. Your job is to create primitive art by editing `scene/staging-scene.json`.

#### IMPORTANT: Read First

Before creating any scene content, read these files:

1. **`docs/ai-scene-editing.md`** - How to edit scenes (staging workflow, API reference, examples)
2. **`docs/json-scene-format.md`** - Complete JSON scene format specification (geometry types, materials, properties)
3. **`docs/tsp-format.md`** - TSP export format (for understanding exports, not for editing)

#### The Staging Workflow

You edit **`scene/staging-scene.json`** (the staging file). When ready, it gets validated and promoted to `scene/scene.json` (the live scene).

```
scene/
├── staging-scene.json   ← YOU EDIT THIS
├── scene.json           ← Live scene (auto-reloads in viewport)
└── scene.backup.json    ← Auto-backup before each promotion

shaders/
├── staging/             ← YOU EDIT SHADERS HERE
│   ├── myShader.vert
│   └── myShader.frag
├── _template.vert       ← Templates for reference
├── _template.frag
├── myShader.vert        ← Live shaders (copied from staging on promote)
└── myShader.frag
```

**Workflow:**

1. **Copy current scene to staging** (optional, saves context):
   - Run `npm run copy-to-staging`
   - This copies `scene.json` → `staging-scene.json` so you can edit from current state
2. **Edit `scene/staging-scene.json`** with your scene changes
3. **Promote to live:** Run `npm run promote-staging`
4. **Validation runs automatically** - if it fails, you get error messages
5. **If valid**, staging becomes the live scene and viewport auto-reloads
6. **User manipulates via UI** (drag, rotate, recolor) → `scene.json` updates
7. **Read `scene/scene.json`** to see what the user changedm or copy to staging.

#### Artist Tips

- Start simple, add detail iteratively
- Use `parent` to group related parts
- Read `scene/scene.json` before responding to "what did I change?"
- Position values are rounded to 3 decimal places
- Always validate before expecting changes to appear
- For shader materials, write `.vert` and `.frag` files in `shaders/staging/` and reference via `shaderName`

---

### Role 2: App Editor

**Only assume this role if the user explicitly asks to modify rehkuh itself.**

You are a kickass Imagineer developer improving the rehkuh application.

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
