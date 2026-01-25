# rehkuh

**rehkuh** (Vulcan for "three" 🖖🏻) defines the **TSP (Three Shaded Primitive)** file format and provides a reference importer, viewer, and exporter built for human-AI collaborative 3D modeling.

## What is TSP?

TSP is a JSON-based file format for representing 3D scenes composed of geometric primitives. Designed for portability, human readability, and efficient loading into WebGL-based renderers—particularly Three.js and React Three Fiber applications.

**Key features:**
- Standard, Physical, and custom Shader materials
- 15+ primitive geometry types plus complex geometries (lathe, extrude, tube, polyhedron)
- Keyframe animation support
- Material and geometry deduplication for efficient storage
- Full validation specification

**Deliberate constraints:**
- No textures
  - color and shaders only
- No arbitrary mesh data
  - primitives and parametric shapes only
  - **no human-made models** with edge loops
- No external asset references
  - fully self-contained files

See [TSP File Format Specification](docs/tsp-format.md) for the complete spec.

## What is rehkuh?

rehkuh is the **reference implementation** for TSP—a web-based 3D editor where humans and AI agents collaborate on primitive art.

- **Viewport:** Real-time 3D preview with React Three Fiber
- **Outliner:** Hierarchical object tree with selection
- **Property Panel:** Transform and material editing
- **Importer:** Load `.tsp` files into the editor
- **Exporter:** Save scenes as validated `.tsp` files

### AI Co-Modeling ("Vibe Modeling")

rehkuh is designed for pair-modeling with an LLM—the same way you'd pair-code. The AI edits scene files directly while the human manipulates objects in the viewport. Both work on the same scene in real-time.

**Workflow:**
1. AI edits `scene/staging-scene.json`
2. AI promotes changes via `npm run promote-staging`
3. Human adjusts positions/colors in the viewport
4. AI reads `scene/scene.json` to see human changes
5. Iterate together

See [AI Scene Editing Guide](docs/ai-scene-editing.md) for the complete workflow.

## Quickstart

```bash
npm install
npm run dev          # Start the editor
```

## Documentation

| Document | Description |
|----------|-------------|
| [TSP File Format Specification](docs/tsp-format.md) | Complete TSP format spec (geometry, materials, animations) |
| [JSON Scene Format](docs/json-scene-format.md) | Internal editing format (simplified for AI/human editing) |
| [AI Scene Editing Guide](docs/ai-scene-editing.md) | Practical guide for AI agents |

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run typecheck        # TypeScript check
npm run lint             # ESLint check
npm run promote-staging  # FOR AI | Validate and promote staging scene to live
```

## Project Structure

```
scene/
├── staging-scene.json   # AI edits this
├── scene.json           # Live scene (viewport renders this)
└── scene.backup.json    # Auto-backup before promotions

shaders/
├── staging/             # AI writes shaders here
└── *.vert, *.frag       # Live shaders

docs/
├── tsp-format.md        # TSP specification
├── json-scene-format.md # Internal format spec
└── ai-scene-editing.md  # AI workflow guide
```

## License

MIT

## Contributors

0xbenc
