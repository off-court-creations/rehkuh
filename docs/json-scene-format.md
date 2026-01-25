# JSON Scene Format Specification

**Status:** Stable
**Last Updated:** 2026-01-25

---

## Abstract

The JSON Scene Format is rehkuh's internal format for scene editing and staging. It provides a simplified structure optimized for human and AI editing, with flat object arrays and name-based references. This document defines the structure, semantics, and validation requirements.

For the portable export format, see [TSP File Format Specification](./tsp-format.md).

---

## Table of Contents

1. [Terminology](#1-terminology)
2. [File Format Basics](#2-file-format-basics)
3. [Document Structure](#3-document-structure)
4. [Object Schema](#4-object-schema)
5. [Geometry Types](#5-geometry-types)
6. [Materials](#6-materials)
7. [Animations](#7-animations)
8. [Validation Rules](#8-validation-rules)
9. [Differences from TSP](#9-differences-from-tsp)
10. [References](#10-references)

---

## 1. Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119][rfc2119].

### Definitions

- **Scene file**: A file conforming to this specification (`scene.json` or `staging-scene.json`).
- **Object**: A scene entity with transform properties.
- **Root object**: An object with no parent.
- **Staging file**: The editable scene file (`staging-scene.json`) used in the editing workflow.
- **Live file**: The active scene file (`scene.json`) rendered in the viewport.

---

## 2. File Format Basics

### 2.1 File Names

| File | Purpose |
|------|---------|
| `scene/staging-scene.json` | Editable staging scene |
| `scene/scene.json` | Live scene (viewport renders this) |
| `scene/scene.backup.json` | Auto-backup before promotions |

### 2.2 Character Encoding

Scene files MUST be encoded in UTF-8 without a byte order mark (BOM).

### 2.3 JSON Conformance

Scene files MUST be valid JSON as defined by [RFC 8259][rfc8259].

### 2.4 Numeric Precision

Position values SHOULD be serialized with no more than 3 decimal digits. Consumers MUST accept any valid JSON number representation.

---

## 3. Document Structure

A scene file MUST be a JSON object containing the following top-level members:

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `objects` | array | REQUIRED | Array of scene objects |
| `title` | string | OPTIONAL | Human-readable scene title |
| `description` | string | OPTIONAL | Scene description |
| `animations` | array | OPTIONAL | Array of animation clips |

Consumers MUST ignore unrecognized top-level members.

### 3.1 Example

```json
{
  "title": "My Scene",
  "description": "A description of this scene",
  "objects": [],
  "animations": []
}
```

---

## 4. Object Schema

### 4.1 Required Members

| Member | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `name` | string | Non-empty, unique | Object identifier (used for parent references) |
| `type` | string | Valid geometry type | Geometry type or `"group"` |
| `position` | array | `[x, y, z]` | Local position |
| `rotation` | array | `[x, y, z]` | Euler rotation in radians (XYZ order) |
| `scale` | array | `[x, y, z]` | Scale multipliers |

### 4.2 Optional Members

| Member | Type | Default | Description |
|--------|------|---------|-------------|
| `parent` | string | `null` | Name of parent object |
| `material` | object | — | Inline material definition |
| `renderOrder` | integer | `0` | Explicit render ordering |
| `frustumCulled` | boolean | `true` | Enable frustum culling |

### 4.3 Parent References

Objects reference parents by **name** (not UUID). Child positions are relative to parent.

```json
{
  "objects": [
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
}
```

---

## 5. Geometry Types

### 5.1 Simple Geometries

| Type | Description |
|------|-------------|
| `box` | Box/cube (1x1x1 default) |
| `sphere` | Sphere (radius 0.5, 32x32 segments) |
| `cylinder` | Cylinder (radius 0.5, height 1) |
| `cone` | Cone (radius 0.5, height 1) |
| `torus` | Torus (radius 0.5, tube 0.2) |
| `plane` | Flat plane (1x1) |
| `capsule` | Capsule (radius 0.5, length 1) |
| `circle` | Flat circle (radius 0.5) |
| `ring` | Flat ring (inner 0.25, outer 0.5) |
| `dodecahedron` | 12-sided polyhedron |
| `icosahedron` | 20-sided polyhedron |
| `octahedron` | 8-sided polyhedron |
| `tetrahedron` | 4-sided polyhedron |
| `torusKnot` | Knot shape |
| `group` | Container with no geometry |

### 5.2 Geometry-Specific Options

#### Box

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `boxWidthSegments` | number | 1 | Segments along X axis |
| `boxHeightSegments` | number | 1 | Segments along Y axis |
| `boxDepthSegments` | number | 1 | Segments along Z axis |

#### Sphere

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `sphereWidthSegments` | number | 32 | Horizontal segments (min 3) |
| `sphereHeightSegments` | number | 32 | Vertical segments (min 2) |
| `spherePhiStart` | number | 0 | Horizontal start angle (radians) |
| `spherePhiLength` | number | 2π | Horizontal sweep angle (radians) |
| `sphereThetaStart` | number | 0 | Vertical start angle (radians) |
| `sphereThetaLength` | number | π | Vertical sweep angle (radians) |

### 5.3 Complex Geometries

| Type | Required Fields | Description |
|------|-----------------|-------------|
| `lathe` | `points` | Revolved 2D profile |
| `extrude` | `shape`, `extrudeOptions` | Extruded 2D shape |
| `shape` | `shape` | Flat 2D shape |
| `tube` | `path`, `tubeRadius`, `tubeTubularSegments`, `tubeRadialSegments`, `tubeClosed` | 3D tube along curve |
| `polyhedron` | `vertices`, `indices` | Custom mesh |

For full geometry specifications, see [TSP Format: Geometries](./tsp-format.md#7-geometries-object).

---

## 6. Materials

### 6.1 Material Type Discrimination

Materials are distinguished by the `type` member:

| `type` Value | Material Type |
|--------------|---------------|
| `undefined` or `"standard"` | Standard Material |
| `"physical"` | Physical Material |
| `"shader"` | Shader Material |

### 6.2 Standard Material

| Member | Type | Required | Constraints | Description |
|--------|------|----------|-------------|-------------|
| `color` | string | REQUIRED | `#RRGGBB` | Base color |
| `metalness` | number | REQUIRED | 0.0 to 1.0 | Metallic factor |
| `roughness` | number | REQUIRED | 0.0 to 1.0 | Roughness factor |
| `emissive` | string | OPTIONAL | `#RRGGBB` | Emissive color |
| `emissiveIntensity` | number | OPTIONAL | >= 0 | Emissive brightness |
| `opacity` | number | OPTIONAL | 0.0 to 1.0 | Transparency |
| `transparent` | boolean | OPTIONAL | — | Enable transparency |
| `side` | string | OPTIONAL | `"front"`, `"back"`, `"double"` | Render side |

### 6.3 Physical Material

Extends Standard Material with advanced PBR properties.

| Member | Type | Description |
|--------|------|-------------|
| `clearcoat` | number | Clearcoat layer intensity (0-1) |
| `clearcoatRoughness` | number | Clearcoat roughness (0-1) |
| `sheen` | number | Sheen intensity (0-1) |
| `sheenRoughness` | number | Sheen roughness (0-1) |
| `sheenColor` | string | Sheen color (hex) |
| `transmission` | number | Glass-like transparency (0-1) |
| `thickness` | number | Refraction thickness |
| `ior` | number | Index of refraction (1-2.333) |
| `iridescence` | number | Rainbow effect (0-1) |
| `anisotropy` | number | Brushed metal effect (0-1) |
| `dispersion` | number | Prismatic dispersion (0+) |

For full physical material specification, see [TSP Format: Physical Material](./tsp-format.md#64-physical-material).

### 6.4 Shader Material

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `type` | `"shader"` | REQUIRED | Type discriminator |
| `shaderName` | string | CONDITIONAL | Reference to external shader files |
| `vertex` | string | CONDITIONAL | Inline vertex shader GLSL |
| `fragment` | string | CONDITIONAL | Inline fragment shader GLSL |
| `uniforms` | object | REQUIRED | Uniform definitions |

Either `shaderName` OR both `vertex` and `fragment` MUST be provided.

#### External Shaders

When using `shaderName`, shader files are read from:
- `shaders/staging/{shaderName}.vert` (staging)
- `shaders/staging/{shaderName}.frag` (staging)

On promotion, files are copied to `shaders/` (production).

#### Uniform Types

| Type | JSON Value | GLSL Type |
|------|------------|-----------|
| `float` | number | `float` |
| `int` | integer | `int` |
| `bool` | boolean | `bool` |
| `color` | `#RRGGBB` | `vec3` |
| `vec2` | `[x, y]` | `vec2` |
| `vec3` | `[x, y, z]` | `vec3` |
| `vec4` | `[x, y, z, w]` | `vec4` |
| `mat3` | array (9) | `mat3` |
| `mat4` | array (16) | `mat4` |

For full shader material specification, see [TSP Format: Shader Material](./tsp-format.md#65-shader-material).

---

## 7. Animations

Animation clips define keyframe animations. Animations target objects by **name** (not UUID).

### 7.1 Animation Clip Schema

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `name` | string | REQUIRED | Unique clip name |
| `duration` | number | OPTIONAL | Duration in seconds |
| `tracks` | array | REQUIRED | Array of animation tracks |

### 7.2 Animation Track Schema

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `target` | string | REQUIRED | Object name to animate |
| `path` | string | REQUIRED | Property: `"position"`, `"scale"`, `"quaternion"`, `"visible"` |
| `interpolation` | string | REQUIRED | `"linear"`, `"smooth"`, `"discrete"` |
| `times` | array | REQUIRED | Keyframe times in seconds |
| `values` | array | REQUIRED | Keyframe values (flat array) |

### 7.3 Value Formats

| Path | Components | Format |
|------|------------|--------|
| `position` | 3 | `[x, y, z, ...]` |
| `scale` | 3 | `[x, y, z, ...]` |
| `quaternion` | 4 | `[x, y, z, w, ...]` |
| `visible` | 1 | `[true/false, ...]` |

`values.length` MUST equal `times.length * components`.

For full animation specification, see [TSP Format: Animations](./tsp-format.md#10-animations-object).

---

## 8. Validation Rules

### 8.1 Required Validations

1. All `name` values MUST be unique within the objects array.
2. All `parent` references MUST point to existing object names.
3. The parent-child graph MUST NOT contain cycles.
4. `position`, `rotation`, `scale` MUST be 3-number arrays.
5. `color` MUST be hex format: `#RRGGBB`.
6. `metalness`, `roughness` MUST be in range 0-1.
7. Shader materials with `shaderName` MUST have corresponding files in `shaders/staging/`.
8. Animation `target` values MUST reference existing object names.
9. Animation `times` MUST be strictly increasing.
10. Animation `values.length` MUST equal `times.length * components`.

### 8.2 Error Handling

Validation failures SHOULD report:
- The JSON path to the invalid value
- The expected constraint
- The actual value

---

## 9. Differences from TSP

| Aspect | JSON Scene | TSP |
|--------|-----------|-----|
| Purpose | Editing/staging | Export/import |
| Structure | Flat `objects` array | Nested sections with dictionaries |
| Parent refs | By name | By UUID |
| Materials | Inline per object | Deduplicated dictionary |
| Geometries | Implicit from type | Deduplicated dictionary |
| Shaders | External or inline | Always inline |
| Object IDs | Not required | Required (UUID v4) |
| Metadata | `title`, `description` only | Full metadata object |
| Animations | Target by name | Target by UUID |

The JSON scene format is optimized for editing simplicity. TSP is optimized for portability and deduplication.

---

## 10. References

### Normative References

- **[RFC 2119]** Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels". https://www.rfc-editor.org/rfc/rfc2119

- **[RFC 8259]** Bray, T., "The JavaScript Object Notation (JSON) Data Interchange Format". https://www.rfc-editor.org/rfc/rfc8259

### Related Documents

- **[TSP File Format Specification](./tsp-format.md)** - The portable export format with full geometry and material specifications.

- **[AI Scene Editing Guide](./ai-scene-editing.md)** - Practical guide for editing scenes, including workflows, recipes, and best practices.

---

[rfc2119]: https://www.rfc-editor.org/rfc/rfc2119
[rfc8259]: https://www.rfc-editor.org/rfc/rfc8259
