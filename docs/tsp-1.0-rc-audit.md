# TSP 1.0 RC Readiness Audit (rehkuh)

_Status: working doc_

**Audit date:** 2026-01-25  
**Spec audited:** `docs/tsp-format.md` (**Version:** `0.10.0`, **Last Updated:** 2026-01-14)  
**App audited:** rehkuh (**package version:** `0.1.0`)

This document is an exhaustive “spec ↔ implementation” conformance audit to answer:

- “Are we close to a 1.0 RC?”
- “What are the blockers vs. polish?”
- “What decisions do we need to make to freeze 1.0?”

It includes a concrete, prioritized checklist for cutting a `1.0.0-rc.N`.

---

## Scope

### Spec (normative target)

- `docs/tsp-format.md`

### Implementation surfaces audited

- **Schema / validation:** `src/schemas/tsp.ts`
- **Type model:** `src/types.ts`
- **Export:** `src/export/tspExporter.ts`
- **Import:** `src/export/tspImporter.ts`, `src/components/editor/EditorToolbar.tsx` (uses `validateTSPFile`)
- **Runtime rendering:** `src/components/editor/SceneObject.jsx`, `src/components/editor/Viewport.jsx`
- **Animation binding:** `src/animation/animationCompiler.ts`
- **Shader file loading / caching:** `src/store/sceneStore.ts`, `src/pages/editor/Editor.tsx`
- **Fixtures / examples:** `benchmarks/*.tsp`, references in docs

Non-goals:

- Designing a binary or packed variant
- Performance benchmarking beyond what’s needed for conformance decisions
- Formal JSON Schema publication (though recommended for 1.0)

---

## Executive Summary

### What’s already “1.0-shaped”

- The **top-level TSP shape** (`metadata/materials/geometries/objects/roots/animations?`) exists in code and docs.
- Exporter emits `metadata.version: "0.10.0"` and produces a single file containing dictionaries + instance objects.
- Import path validates a TSP-ish structure (via Zod) and can load into the editor.
- The spec already contains: RFC2119 keywords, validation rules, versioning policy, security considerations, and appendices.

### What blocks a credible 1.0 RC today (P0)

1. **Spec ↔ implementation mismatches** that change semantics/visual output:
   - Material `side` defaults (spec says `"front"`, renderer/UI behave as `"double"`).
   - Mesh `castShadow` default (spec says `true`, renderer defaults `false`).
   - Lathe geometry defaults/args (spec default segments `32`, renderer hard-codes `12` and ignores args).
2. **Spec-required semantic validation is missing** in importer validator:
   - Reference integrity (material/geometry keys, roots, parents).
   - Object ID uniqueness + parent cycle checks.
   - Conditional requirements (e.g., non-group objects must have `geometry` and `material`).
3. **Spec has internal inconsistencies / RC friction:**
   - It claims SemVer, but constrains `metadata.version` to `^\d+\.\d+\.\d+$`, which forbids `1.0.0-rc.1`.
   - It recommends `tsp:` object naming for PropertyBinding, but Three.js binding name regex does not allow `:`.
4. **Docs/fixtures drift:**
   - `public/tsp/animatedHeart.tsp` is referenced but missing.
   - `benchmarks/*.tsp` are **legacy** and do not match current spec shape; they would fail current import validation.

### What’s “nice but not strictly required” for an RC (P1/P2)

- Built-in uniforms like `resolution` (spec says SHOULD; implementation does not).
- Shader `blending` option (spec says valid values; code/types/schema don’t support).
- Full forward-compat round-tripping of unknown members (current Zod parsing strips unknown keys).
- Resource limit enforcement and shader compilation guardrails (spec recommends; not enforced).

---

## Conformance Matrix (high-level)

Legend:

- ✅ Implemented and aligned
- ⚠️ Implemented but mismatched (spec or code needs change)
- ❌ Not implemented (spec says it exists)
- 🧩 Implemented extension (code supports something spec doesn’t document)

| Area | Spec | Zod Schema | Export | Import | Renderer | UI |
|---|---:|---:|---:|---:|---:|---:|
| Top-level structure | ✅ | ✅ | ✅ | ✅ | n/a | n/a |
| Metadata required fields | ✅ | ⚠️ (weak validation) | ✅ | (ignored) | n/a | n/a |
| Standard materials | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ⚠️ |
| Physical materials | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| Shader materials | ✅ | ⚠️ | ⚠️ | ✅ | ⚠️ | ⚠️ |
| Uniform types/value validation | ✅ | ❌ | ✅ | ✅ | ⚠️ | ❌ |
| Geometry coverage | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ✅ |
| Object fields + defaults | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ⚠️ |
| Roots semantics | ✅ | ❌ | ✅ | ❌ | n/a | n/a |
| Animations | ✅ | ⚠️ | ⚠️ | ⚠️ | ✅ (scene) | ✅ |
| Version handling | ✅ | ❌ | ✅ | ❌ | n/a | n/a |

---

## Detailed Findings

### 1) Top-level document structure

**Spec:** `metadata`, `materials`, `geometries`, `objects`, `roots` REQUIRED; `animations` OPTIONAL.  
**Implementation:** `TSPFileSchema` matches this shape.

**Gaps / mismatches**

- **Legacy fixtures** (`benchmarks/*.tsp`) do not conform:
  - They include a top-level `version` sibling of `metadata` and a different `metadata` shape (no `id`, no `generatorVersion`, etc.).
  - Current import path (`validateTSPFile` + `TSPFileSchema`) would reject these.
  - Decision: update fixtures to current shape or explicitly label them “legacy / pre-spec”.

---

### 2) Metadata object

#### 2.1 Required fields

**Spec requires:** `version` (semver), `id` (UUID v4), `created` (ISO8601 with tz), `generator`, `generatorVersion` (semver).  
**Exporter:** always emits these (`exportToTSP`).

**Schema gaps (validation too weak)**

- `metadata.version`: schema is `z.string()` (does not enforce semver or prerelease policy).
- `metadata.created`: schema is `z.string()` (does not enforce ISO 8601).
- `metadata.generator`: schema is `z.string()` (does not enforce non-empty).
- `metadata.generatorVersion`: schema is `z.string()` (does not enforce semver).
- `metadata.id`: schema uses `z.string().uuid()`, which accepts any UUID variant, not strictly v4.

**Impact**

- Bad metadata can pass validation on import.
- Makes “1.0 RC” claims weaker because the consumer doesn’t actually enforce the spec’s normative constraints.

**Recommended RC actions**

- Decide **version string policy** (see Versioning section): allow prerelease like `1.0.0-rc.1` or not.
- Enforce agreed policy in schema (and document it in spec).
- Enforce UUID v4 for `metadata.id` if that remains a MUST.

---

### 3) Materials

This section audits **spec fields**, **schema validation**, **export/import preservation**, and **runtime behavior**.

#### 3.1 Standard material

| Field | Spec | Schema (`src/schemas/tsp.ts`) | Export | Import | Renderer | Notes |
|---|---|---|---|---|---|---|
| `type` | OPTIONAL (`"standard"` or absent) | ✅ | ✅ | ✅ | ✅ | Aligned. |
| `color` | REQUIRED hex | ✅ | ✅ | ✅ | ✅ | Aligned. |
| `metalness` | REQUIRED 0..1 | ✅ | ✅ | ✅ | ✅ | Aligned. |
| `roughness` | REQUIRED 0..1 | ✅ | ✅ | ✅ | ✅ | Aligned. |
| `emissive` | OPTIONAL hex | ✅ | ✅ | ✅ | ✅ | Aligned. |
| `emissiveIntensity` | OPTIONAL `>= 0` | ⚠️ schema caps to `<= 1` | ✅ | ✅ | ✅ | **Mismatch:** spec allows >1, schema+UI imply 0..1. Decide. |
| `opacity` | OPTIONAL 0..1 | ✅ | ✅ | ✅ | ✅ | Aligned. |
| `transparent` | OPTIONAL | ✅ | ✅ | ✅ | ✅ | Aligned. |
| `side` | OPTIONAL default `"front"` | ⚠️ | ✅ | ✅ | ⚠️ | **Mismatch:** renderer/UI default to `"double"`. Decide + align. |

**Renderer mismatch:** Standard material default side is effectively `double` when absent.

**UI mismatch:** Standard material UI selects default `side: "double"` when unset.

**RC decision needed**

- Pick one:
  - **Option A (spec drives):** default `side = "front"` for portability; change renderer/UI defaults to front.
  - **Option B (implementation drives):** default `side = "double"` for “primitive art” ergonomics; update spec defaults to `"double"`.

#### 3.2 Physical material

The spec includes base optional fields (`emissive`, `opacity`, `transparent`, `side`, etc.) plus advanced channels.

Current state across the stack:

- **TSP type model** (`TSPPhysicalMaterial` in `src/types.ts`) includes base fields.
- **Zod schema** includes base fields.
- **Scene editor’s physical material model** (`PhysicalMaterialProps` in `src/types.ts`) does **not** include the base fields.
- **Importer** converts TSP physical → scene physical and **drops** base fields.
- **Renderer** builds `THREE.MeshPhysicalMaterial` but currently hard-codes `side: DoubleSide` and does not set `transparent/opacity/emissive`.
- **UI** appears to edit only a subset of physical channels.

| Field group | Spec | Schema | Export | Import | Renderer | Notes |
|---|---|---|---|---|---|---|
| base: `emissive`, `opacity`, `transparent`, `side` | ✅ | ✅ | ❌ (not representable in scene physical) | ❌ | ❌ | **Gap:** either add these to scene model or remove them from spec’s 1.0 scope. |
| channels: clearcoat/sheens/transmission/ior/specular/iridescence/anisotropy/dispersion | ✅ | ✅ | ✅ | ✅ | ✅ | Mostly present, but verify defaults + UI coverage. |
| `envMapIntensity`, `flatShading` | ✅ | ✅ | ✅ | ✅ | ✅ | Supported. |

**RC decision needed**

- Decide whether **TSP 1.0** is “what Three.js can do” or “what rehkuh can round-trip faithfully”.
  - If **portable Three.js format**, implement missing base fields in scene model + renderer + UI (or at least preserve them on import/export even if UI hides them).
  - If **rehkuh-first**, drop base fields from the 1.0 spec (or mark them as “reserved / MAY be ignored” with explicit conformance language).

#### 3.3 Shader material

| Field | Spec | Schema | Export | Import | Renderer | Notes |
|---|---|---|---|---|---|---|
| `type:"shader"` | ✅ | ✅ | ✅ | ✅ | ✅ | Aligned. |
| `vertex` / `fragment` | REQUIRED valid GLSL | ⚠️ (allows empty string) | ⚠️ (uses cached `vertex/fragment`) | ✅ | ⚠️ | Export depends on shader caching; spec implies non-empty. |
| `uniforms` | REQUIRED | ✅ | ✅ | ✅ | ✅ | Uniforms passed through. |
| `transparent` / `side` / `depthWrite` / `depthTest` | OPTIONAL | ✅ | ✅ | ✅ | ⚠️ | Side default mismatch (“double” vs spec “front”). |
| `blending` | OPTIONAL with enum values | ❌ | ❌ | ❌ | ❌ | **Spec claims support; code/types/schema do not.** Decide. |

**Shader code caching risk (export)**

Exporter inlines `material.vertex/material.fragment`. This is OK if the editor reliably loads shader files into these fields:

- `sceneStore` loads shader files into `material.vertex/material.fragment` on scene load.
- HMR handler updates them when shader files change.

But the export contract is still implicit. For 1.0:

- Either guarantee “vertex/fragment MUST be present when exporting”, or
- Make exporter read from shader files directly when `shaderName` is set.

#### 3.4 Uniforms

**Spec uniform types include:** `float`, `int`, `bool`, `color`, `vec2`, `vec3`, `vec4`, **`mat3`, `mat4`**.  
**Implementation supports:** `float`, `int`, `bool`, `color`, `vec2`, `vec3`, `vec4`.

Gaps:

- ❌ `mat3`/`mat4` not supported in types/schema/renderer.
- ⚠️ Value validation is too permissive:
  - `int` is not validated as integer.
  - `color` value is not validated as hex.
  - `vec2/3/4` value arrays are not validated for exact length.
- 🧩 Implementation has extra uniform fields not in spec:
  - `min`, `max`, `step` (UI hints) exist in schema/types but are undocumented in spec.

**Built-in uniforms**

Spec says consumers SHOULD automatically provide:

- `time` (float)
- `resolution` (vec2)
- `modelMatrix`, `viewMatrix`, `projectionMatrix` (mat4)

Implementation:

- `time`: updated per-frame **only if** the uniform exists, is marked `animated: true`, and is literally named `"time"`.
- `resolution`: not provided/updated.
- `modelMatrix/viewMatrix/projectionMatrix`: provided implicitly by Three.js built-ins, but not as “user uniforms”.

**RC decision needed**

- Update spec language to match reality:
  - Either “consumers MAY provide `time/resolution`” (weaker) or implement `resolution` + clearer time behavior (stronger).
- Decide whether `mat3/mat4` uniform types are actually in scope for 1.0.

---

### 4) Geometries

#### 4.1 Geometry type coverage (by pipeline stage)

**Simple geometries** (box, sphere, cylinder, cone, torus, plane, capsule, circle, ring, dodecahedron, icosahedron, octahedron, tetrahedron, torusKnot):

- ✅ Exporter supports shared + per-instance overrides.
- ✅ Importer supports reading override fields.
- ✅ Renderer uses override fields.
- ✅ Schema supports fields (though constraints are sometimes looser than spec).

**Complex geometries** (lathe, extrude, shape, tube, polyhedron):

- ✅ Exporter writes complex geometry data fields.
- ✅ Importer reads them.
- ⚠️ Renderer sometimes hard-codes defaults that disagree with spec.
- ⚠️ Schema does not enforce “required fields by type” (lathe needs `points`, etc.).

#### 4.2 Conditional required fields (not enforced)

Spec says:

- `lathe` requires `points`
- `extrude` requires `shape`
- `shape` requires `shape`
- `tube` requires `path`
- `polyhedron` requires `vertices` + `indices`

Current `TSPGeometrySchema` is a single object with everything optional, so invalid definitions can pass import validation and then render as fallback cubes.

**RC action:** switch to a discriminated union by `type` (or add `.superRefine` conditional rules).

#### 4.3 Lathe geometry mismatch

Spec:

- Allows `args: [segments, phiStart, phiLength]`, default `[32, 0, 2π]`.

Renderer:

- Uses `THREE.LatheGeometry(..., 12, 0, 2π)` (hard-coded segments `12`) and ignores any `args`.

**RC decision needed**

- Either implement args support (and align default segments to 32), or update spec to match the chosen defaults and representation.

#### 4.4 Shape holes command support mismatch

Spec allows holes to be full shape definitions with the same command set (including arc/ellipse variants).

Renderer’s `buildShapeFromPath`:

- Main `commands` supports `moveTo`, `lineTo`, `bezierCurveTo`, `quadraticCurveTo`, `arc`, `absarc`, `ellipse`, `absellipse`.
- `holes` path currently supports only `moveTo`, `lineTo`, `bezierCurveTo`, `quadraticCurveTo` (no arc/ellipse).

**RC action:** either implement arc/ellipse for holes or document the restriction in spec.

#### 4.5 Extrude options mismatch (spec vs implementation)

Spec lists extrude options and defaults; implementation supports those options, but:

- Renderer default depth for missing `extrudeOptions` is `0.5` (spec says default `1`).
- 🧩 Implementation supports `extrudePath` (via `TSPExtrudeOptionsSchema` + renderer), but spec does not mention it.

**RC decision needed**

- Either add `extrudePath` to spec (recommended if you keep it), or remove/disable it for 1.0.
- Align default depth behavior.

#### 4.6 Polyhedron args mismatch (spec vs implementation)

Spec allows optional `args: [radius, detail]`.  
Renderer always uses `radius=1`, `detail=0` and ignores args.

**RC action:** implement args support or remove args from spec 1.0.

---

### 5) Objects array

#### 5.1 Object IDs (UUID v4)

Spec: `objects[].id` MUST be UUID v4.

Schema gap:

- `TSPObjectSchema.id` is `z.string().min(1)` (does not enforce UUID at all).

**Impact**

- Invalid IDs can pass import validation.
- Animation targets are validated as UUID, but object IDs are not, creating inconsistent constraints.

#### 5.2 Conditional required fields (mesh vs group)

Spec: for non-group objects, `geometry` and `material` are required.

Schema gap:

- `geometry` and `material` are optional for all objects (no conditional requirement).

Importer behavior:

- If missing, the object gets a default material and may lack geometry info; behavior diverges from “reject invalid file”.

#### 5.3 Optional fields in spec not supported

Spec lists:

- `renderOrder` (default 0)
- `frustumCulled` (default true)

Implementation:

- Not present in types/schema/export/import/renderer.
- Import validation strips them (Zod object defaults to stripping unknown keys).

**RC decision needed**

- Either implement these fields or remove them from the 1.0 spec.

#### 5.4 Shadow defaults mismatch

Spec default:

- `castShadow: true` for meshes
- `receiveShadow: true` for meshes

Renderer default:

- `castShadow` defaults to **false**
- `receiveShadow` defaults to **true**

Exporter:

- Emits `castShadow/receiveShadow` only when explicitly set on the scene object.

**Impact**

- Two consumers implementing the spec will render different shadow behavior than rehkuh for the same file.

**RC decision needed**

- Pick a default and make spec + renderer consistent.

#### 5.5 Object naming for animation binding (spec bug)

Spec Section 10.7 suggests:

- `object.name = "tsp:" + tspObject.id`

Implementation (`animationCompiler.ts`) notes:

- Three.js PropertyBinding node-name regex does **not** allow `:`.
- rehkuh uses `tsp_${objectName}` today.

**RC action**

- Update spec recommendation to a valid PropertyBinding node name (e.g., `tsp_${id}`).
- Decide whether binding should be by `id` (safer) or by `name` (human-readable but collision-prone).

---

### 6) Roots array

Spec requires semantic validation:

1. Every root must reference an existing object id.
2. Every referenced object must have `parent: null`.
3. Every object with `parent: null` SHOULD be present in roots.

Implementation:

- Exporter emits roots computed from `parentId === null`.
- Importer ignores `roots` entirely (derives roots from `parent` at runtime).
- Schema does not validate roots at all (no refinement to object IDs or parent null consistency).

**RC decision needed**

- Either make `roots` normative and validated, or treat it as redundant/hint-only and document importer behavior.

---

### 7) Animations object

#### 7.1 Schema coverage

Schema supports:

- `path`: `position|scale|quaternion|visible`
- `interpolation`: `linear|smooth|discrete`
- `times` strictly increasing + min length 1
- `values` length equals `times.length * components`

Schema gaps:

- `values` type is not conditioned on `path`:
  - `visible` should be boolean[], but schema allows number[].
  - `position/scale/quaternion` should be number[], but schema allows boolean[].
- `target` must be UUID, but schema does not verify that the UUID exists in `objects[]`.

#### 7.2 Export/import behavior

- Export converts scene animation targets (names) to UUIDs via name→id map.
  - If a scene clip references a missing name, exporter falls back to the original string (non-UUID), which would violate spec.
- Import converts UUID targets to scene names via id→name map.
  - If missing, importer falls back to original UUID string (invalid in scene format).

**RC action**

- Tighten export/import behavior:
  - Prefer failing validation / refusing export when targets don’t resolve.
  - Add schema-level refinement: track target must exist in `objects[]`.

---

### 8) Validation & error handling

Spec says consumers MUST validate:

- JSON validity (done)
- Required members (partially done)
- Type correctness (partially done)
- Reference integrity (NOT done)
- Constraint satisfaction (partially done)

Current `validateTSPFile`:

- Uses Zod and returns multiple issues with JSON-ish paths.
- Does **not** implement semantic checks (ref integrity, unique IDs, cycle detection, conditional required fields).
- Strips unknown keys by default (Zod “strip” behavior), which can:
  - Help with “ignore unknown members”, but
  - Break forward-compat “load and re-save without losing new fields”.

**RC decision needed**

- Decide whether rehkuh is a “strict consumer” (reject invalid) or “lenient consumer” (best-effort rendering).
- Decide whether to preserve unknown keys for round-trip compatibility.

---

### 9) Versioning policy (RC friction)

Spec says:

- `metadata.version` uses SemVer.
- But also says it MUST match `^\d+\.\d+\.\d+$`, which forbids prerelease tags (`-rc.1`).

Implementation:

- Exporter emits hard-coded `"0.10.0"`.
- Import does not enforce major/minor compatibility rules.

**RC decision needed**

- For a “draft RC for 1.0 spec”, you likely want `1.0.0-rc.1` (or similar).
  - Update spec to allow SemVer prereleases and builds.
  - Add explicit consumer behavior for prereleases (accept? warn?).

---

### 10) Security & resource limits

Spec discusses:

- Shader code safety (GPU hangs)
- Geometry resource exhaustion
- Recommended limits

Implementation:

- No explicit guardrails beyond normal Three/WebGL behavior.
- No explicit limits on segments, object count, shader length, etc.

**RC recommendation**

- For 1.0 spec, it’s enough to:
  - Keep the Security Considerations section.
  - Add a “consumers MAY impose limits” stance.
- For 1.0 *implementation* hardening, consider:
  - Optional import-time limits (configurable).
  - Shader source length maximum.

---

### 11) Docs, examples, and fixtures

#### 11.1 Missing referenced example

`docs/tsp-format.md` and `AGENTS.md` reference:

- `public/tsp/animatedHeart.tsp`

But repo currently contains no `public/tsp` directory and no such file.

**RC action**

- Either restore/add the referenced file, or update docs to point to a real example.

#### 11.2 Legacy benchmark fixtures

`benchmarks/*.tsp` appear to be generated by an older format revision:

- top-level `version` field
- metadata lacking required fields

**RC action**

- Update or remove, or add `benchmarks/README.md` stating they are legacy and not spec-compliant.

---

## 1.0 RC Checklist

This checklist is phrased as “Definition of Done for `1.0.0-rc.1`”.

### P0 — Must have before calling it a 1.0 RC

**Spec correctness (internal consistency)**

- [x] Decide whether `metadata.version` supports SemVer prerelease/build → **Decision: Stable semver only + separate `prerelease` field**
- [x] Update spec regex/examples accordingly → **Added `metadata.prerelease` optional field**
- [x] Fix spec's PropertyBinding recommendation (`tsp:` is invalid for Three.js node names) → **Changed to `tsp_` (underscore)**

**Spec ↔ implementation alignment (semantics)**

- [x] Decide and align material `side` default (`front` vs `double`) → **Decision: `"front"` (portable)**
  - [x] spec defaults - already `"front"`
  - [x] renderer defaults - updated to `FrontSide`
  - [x] UI defaults - updated to `"front"`
- [x] Decide and align mesh `castShadow` default → **Decision: `false` (performance)**; spec updated
- [x] LatheGeometry: implement args support `[segments, phiStart, phiLength]` with defaults `[32, 0, 2π]`
- [x] PolyhedronGeometry: implement args support `[radius, detail]` with defaults `[1, 0]`

**Validation (semantic rules)**

- [x] Enforce UUID v4 for `objects[].id` (and `metadata.id`)
- [x] Enforce object id uniqueness
- [x] Enforce parent reference integrity + cycle detection
- [x] Enforce roots integrity (references existing objects with `parent: null`)
- [x] Enforce mesh-vs-group conditional requirements:
  - [x] non-group MUST have `geometry` and `material`
  - [x] group MUST NOT have them
- [x] Enforce `animations.*.tracks[].target` references existing object IDs
- [x] Enforce `values` type based on `path` (bool[] only for `visible`, number[] for others)
- [x] Enforce required geometry fields by `type` (lathe/extrude/shape/tube/polyhedron)

**Docs/fixtures hygiene**

- [x] Fix missing `public/tsp/animatedHeart.tsp` reference → **Removed references from docs**
- [x] Address `benchmarks/*.tsp` legacy shape → **Added `benchmarks/README.md` labeling as legacy**

### P1 — Strongly recommended for RC quality

**Uniforms**

- [x] Decide whether `mat3`/`mat4` uniform types are in 1.0 (either implement or remove from spec). → **Decision: Implement for 1.0 RC**
  - [x] Added to Zod schema with length validation (9 for mat3, 16 for mat4)
  - [x] Added to TypeScript types
  - [x] Added to renderer (parseUniformValue)
- [x] Align uniform value validation:
  - [x] `color` must be hex → Added regex validation `^#[0-9a-fA-F]{6}$`
  - [x] `int` must be integer → Added `.int()` validation
  - [x] `vecN` arrays must be exact length → Added tuple validation
- [x] Decide whether `min/max/step` are part of the 1.0 spec → **Decision: `min`/`max` specced, `step` removed**
  - [x] Documented `min`/`max` in spec as UI hints
  - [x] Removed `step` from schema and types

**Shader built-ins**

- [x] Decide whether `resolution` is required/recommended; implement if staying "SHOULD". → **Implemented**
  - [x] Renderer updates `resolution` uniform per-frame when present
  - [x] Clarified behavior in spec documentation

**Physical material base fields**

- [x] Decide whether physical base fields are in 1.0 scope → **Decision: Yes, add to scene model and renderer**
  - [x] Added base fields to `PhysicalMaterialProps` type
  - [x] Updated TSP importer to copy base fields
  - [x] Updated renderer to apply base fields to `MeshPhysicalMaterial`

**Unknown-member strategy**

- [x] Decide whether unknown keys should be preserved for round-trip forward compatibility → **Decision: Yes, added `.passthrough()` to all schemas**

### P2 — Nice-to-have / post-1.0

- [ ] Shader `blending` support (spec currently lists it; implementation does not).
- [ ] Import-time resource limits + configurable caps.
- [ ] Publish a formal JSON Schema and/or a reference test suite.
- [ ] A “golden corpus” of example `.tsp` files:
  - minimal scene
  - each geometry type
  - each material type (standard/physical/shader)
  - animations
  - stress cases (large object counts, large segments)

---

## Open Decisions (to resolve before 1.0)

**Resolved decisions:**

1. **Default rendering semantics**: ✅
   - `side` default: **`"front"`** (portable)
   - `castShadow` default: **`false`** (performance)
2. **Strict vs lenient consumption**: ✅ **Strict** (reject invalid files)
3. **Scope definition**: ✅ **Three.js portable** (preserve unknown fields)
4. **Versioning & prereleases**: ✅ **Stable semver + separate `prerelease` field**
5. **Forward compatibility**: ✅ **Preserve unknown fields** (added `.passthrough()` to schemas)
3. **Scope definition**:
   - Is TSP “Three.js portable” (superset) or “rehkuh round-trippable” (subset)?
4. **Versioning & prereleases**:
   - Do we allow `1.0.0-rc.1` in `metadata.version`?
5. **Forward compatibility**:
   - Should a 1.0 consumer preserve unknown fields when re-exporting?

