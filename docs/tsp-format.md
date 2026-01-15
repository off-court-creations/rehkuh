# TSP File Format Specification

**Version:** 0.10.0
**Status:** Draft
**Last Updated:** 2026-01-14
**Maintainer:** 0xbenc

---

## Abstract

TSP (Three Shaded Primitive) is a JSON-based file format for representing 3D scenes composed of geometric primitives. It is designed for portability, human readability, and efficient loading into WebGL-based renderers, particularly Three.js and React Three Fiber applications.

This document defines the structure, semantics, and validation requirements for TSP files.

---

## Table of Contents

1. [Status of This Document](#1-status-of-this-document)
2. [Terminology](#2-terminology)
3. [File Format Basics](#3-file-format-basics)
4. [Document Structure](#4-document-structure)
5. [Metadata Object](#5-metadata-object)
6. [Materials Object](#6-materials-object)
7. [Geometries Object](#7-geometries-object)
8. [Objects Array](#8-objects-array)
9. [Roots Array](#9-roots-array)
10. [Animations Object](#10-animations-object)
11. [Validation and Error Handling](#11-validation-and-error-handling)
12. [Security Considerations](#12-security-considerations)
13. [Versioning Policy](#13-versioning-policy)
14. [References](#14-references)
15. [Appendix A: Complete Example](#appendix-a-complete-example)
16. [Appendix B: Geometry Use Cases](#appendix-b-geometry-use-cases)
17. [Appendix C: Material Recipes](#appendix-c-material-recipes)
18. [Appendix D: Animation Examples](#appendix-d-animation-examples)
19. [Revision History](#revision-history)

---

## 1. Status of This Document

This specification is currently in **Draft** status. The format is stable for production use, but minor additions and clarifications may occur before reaching version 1.0.

Implementers SHOULD expect backward-compatible additions in minor version increments. Breaking changes will only occur in major version increments and will be documented in the [Revision History](#revision-history).

---

## 2. Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119][rfc2119].

### Definitions

- **TSP file**: A file conforming to this specification.
- **Producer**: Software that generates TSP files.
- **Consumer**: Software that reads and interprets TSP files.
- **Object**: A scene entity, either a mesh (geometry + material) or a group (transform container).
- **Root object**: An object with no parent.
- **Geometry**: A mathematical description of a 3D shape.
- **Material**: A description of surface appearance and shading behavior.
- **Uniform**: A shader parameter that remains constant across all vertices/fragments in a single draw call.

---

## 3. File Format Basics

### 3.1 File Extension

TSP files MUST use the `.tsp` file extension.

### 3.2 MIME Type

The RECOMMENDED MIME type for TSP files is `application/vnd.tsp+json`. In the absence of server configuration, `application/json` is acceptable.

### 3.3 Character Encoding

TSP files MUST be encoded in UTF-8 without a byte order mark (BOM).

### 3.4 JSON Conformance

TSP files MUST be valid JSON as defined by [RFC 8259][rfc8259]. Producers SHOULD output minified JSON for production use and MAY output formatted JSON for debugging purposes.

### 3.5 Numeric Precision

Floating-point values SHOULD be serialized with no more than 6 significant decimal digits. Consumers MUST accept any valid JSON number representation.

### 3.6 File Size

This specification does not impose file size limits. Producers and consumers MAY impose implementation-specific limits and SHOULD document them.

---

## 4. Document Structure

A TSP file MUST be a JSON object containing the following top-level members:

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `metadata` | object | REQUIRED | File and authorship information |
| `materials` | object | REQUIRED | Material definitions dictionary |
| `geometries` | object | REQUIRED | Geometry definitions dictionary |
| `objects` | array | REQUIRED | Scene object instances |
| `roots` | array | REQUIRED | IDs of root-level objects |
| `animations` | object | OPTIONAL | Animation clip definitions dictionary |

Consumers MUST ignore unrecognized top-level members. Producers MUST NOT emit unrecognized top-level members.

### 4.1 Structural Diagram

```
TSPFile
├── metadata: Metadata
├── materials: { [key: string]: Material }
├── geometries: { [key: string]: Geometry }
├── objects: Object[]
├── roots: string[]
└── animations?: { [key: string]: AnimationClip }
```

---

## 5. Metadata Object

The `metadata` object provides identification and attribution information.

### 5.1 Required Members

| Member | Type | Description |
|--------|------|-------------|
| `version` | string | TSP format version (semver). MUST match pattern `^\d+\.\d+\.\d+$` |
| `id` | string | Unique file identifier. MUST be a valid UUID v4 |
| `created` | string | Creation timestamp. MUST be ISO 8601 format with timezone |
| `generator` | string | Name of the producing software |
| `generatorVersion` | string | Version of the producing software (semver) |

### 5.2 Optional Members

| Member | Type | Default | Description |
|--------|------|---------|-------------|
| `author` | string | `null` | Author or creator name |
| `copyright` | string | `null` | Copyright notice or license identifier (e.g., "CC BY 4.0") |
| `title` | string | `null` | Human-readable title for the scene |
| `description` | string | `null` | Extended description of the scene content |

### 5.3 Example

```json
{
  "metadata": {
    "version": "0.9.1",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "created": "2026-01-14T12:00:00Z",
    "generator": "rehkuh",
    "generatorVersion": "0.1.0",
    "author": "Artist Name",
    "copyright": "CC BY 4.0"
  }
}
```

---

## 6. Materials Object

The `materials` object is a dictionary mapping material keys to material definitions. Each key MUST be a non-empty string. Each value MUST be a valid material definition.

### 6.1 Material Key Conventions

Producers SHOULD use the following key naming conventions to enable deduplication:

| Material Type | Key Pattern | Example |
|---------------|-------------|---------|
| Standard | `mat_{color}_{metalness*100}_{roughness*100}` | `mat_ff0000_50_30` |
| Physical | `mat_physical_{hash}` | `mat_physical_a1b2c3d4` |
| Shader | `mat_shader_{shaderName}` | `mat_shader_hologram` |

Consumers MUST NOT rely on key naming conventions for material type inference. The `type` field is authoritative.

### 6.2 Material Type Discrimination

Materials are distinguished by the `type` member:

| `type` Value | Material Type | Three.js Equivalent |
|--------------|---------------|---------------------|
| `undefined` or `"standard"` | Standard Material | `MeshStandardMaterial` |
| `"physical"` | Physical Material | `MeshPhysicalMaterial` |
| `"shader"` | Shader Material | `ShaderMaterial` |

For backward compatibility, consumers MUST treat materials without a `type` member as Standard Materials.

---

### 6.3 Standard Material

Standard Materials represent basic PBR (Physically Based Rendering) surfaces.

#### 6.3.1 Required Members

| Member | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `color` | string | Valid hex color | Base color. MUST match pattern `^#[0-9a-fA-F]{6}$` |
| `metalness` | number | 0.0 to 1.0 | Metallic factor |
| `roughness` | number | 0.0 to 1.0 | Roughness factor |

#### 6.3.2 Optional Members

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `type` | string | — | `"standard"` | Type discriminator |
| `emissive` | string | `"#000000"` | Valid hex color | Emissive color |
| `emissiveIntensity` | number | `0` | >= 0 | Emissive strength multiplier |
| `opacity` | number | `1` | 0.0 to 1.0 | Surface opacity |
| `transparent` | boolean | `false` | — | Enable alpha blending |
| `side` | string | `"front"` | `"front"`, `"back"`, `"double"` | Which faces to render |

#### 6.3.3 Example

```json
{
  "mat_ff0000_50_30": {
    "color": "#ff0000",
    "metalness": 0.5,
    "roughness": 0.3,
    "emissive": "#330000",
    "emissiveIntensity": 0.2
  }
}
```

---

### 6.4 Physical Material

Physical Materials extend Standard Materials with advanced PBR features including clearcoat, sheen, transmission, iridescence, and anisotropy.

#### 6.4.1 Required Members

| Member | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `type` | string | `"physical"` | Type discriminator. MUST be `"physical"` |
| `color` | string | Valid hex color | Base color |
| `metalness` | number | 0.0 to 1.0 | Metallic factor |
| `roughness` | number | 0.0 to 1.0 | Roughness factor |

#### 6.4.2 Base Optional Members

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `emissive` | string | `"#000000"` | Valid hex color | Emissive color |
| `emissiveIntensity` | number | `0` | >= 0 | Emissive strength |
| `opacity` | number | `1` | 0.0 to 1.0 | Surface opacity |
| `transparent` | boolean | `false` | — | Enable alpha blending |
| `side` | string | `"front"` | `"front"`, `"back"`, `"double"` | Render side |
| `envMapIntensity` | number | `1` | >= 0 | Environment map intensity |
| `flatShading` | boolean | `false` | — | Use flat shading |

#### 6.4.3 Clearcoat Channel

Simulates a thin transparent layer over the base material (car paint, wet surfaces, varnished wood).

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `clearcoat` | number | `0` | 0.0 to 1.0 | Clearcoat layer intensity |
| `clearcoatRoughness` | number | `0` | 0.0 to 1.0 | Clearcoat roughness |

#### 6.4.4 Sheen Channel

Simulates soft, velvety reflection (fabric, velvet, felt).

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `sheen` | number | `0` | 0.0 to 1.0 | Sheen intensity |
| `sheenRoughness` | number | `1` | 0.0 to 1.0 | Sheen roughness |
| `sheenColor` | string | `"#ffffff"` | Valid hex color | Sheen tint |

#### 6.4.5 Transmission Channel

Simulates light passing through the material (glass, water, gems).

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `transmission` | number | `0` | 0.0 to 1.0 | Light transmission amount |
| `thickness` | number | `0` | >= 0 | Volume thickness for attenuation |
| `attenuationColor` | string | `"#ffffff"` | Valid hex color | Absorption tint |
| `attenuationDistance` | number | `Infinity` | > 0 | Distance for full attenuation |

#### 6.4.6 Index of Refraction

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `ior` | number | `1.5` | 1.0 to 2.333 | Index of refraction |

Reference IOR values: Air = 1.0, Water = 1.33, Glass = 1.5, Diamond = 2.42 (clamped to 2.333).

#### 6.4.7 Specular Channel

Controls specular reflection appearance (skin, layered materials).

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `specularIntensity` | number | `1` | 0.0 to 1.0 | Specular reflection strength |
| `specularColor` | string | `"#ffffff"` | Valid hex color | Specular tint |
| `reflectivity` | number | `0.5` | 0.0 to 1.0 | F0 reflectance at normal incidence |

#### 6.4.8 Iridescence Channel

Simulates thin-film interference (soap bubbles, oil slicks, beetle shells).

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `iridescence` | number | `0` | 0.0 to 1.0 | Iridescence intensity |
| `iridescenceIOR` | number | `1.3` | 1.0 to 2.333 | Thin film IOR |
| `iridescenceThicknessRange` | array | `[100, 400]` | [min, max], values >= 0 | Film thickness in nanometers |

#### 6.4.9 Anisotropy Channel

Simulates directional surface structure (brushed metal, hair, satin).

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `anisotropy` | number | `0` | 0.0 to 1.0 | Anisotropic intensity |
| `anisotropyRotation` | number | `0` | Any | Rotation angle in radians |

#### 6.4.10 Dispersion

Simulates chromatic dispersion (prisms, diamonds, cut glass).

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `dispersion` | number | `0` | >= 0 | Dispersion amount |

#### 6.4.11 Example

```json
{
  "mat_physical_glass": {
    "type": "physical",
    "color": "#ffffff",
    "metalness": 0,
    "roughness": 0,
    "transmission": 1,
    "thickness": 0.5,
    "ior": 1.5,
    "transparent": true
  }
}
```

---

### 6.5 Shader Material

Shader Materials allow custom GLSL vertex and fragment shaders with configurable uniforms.

#### 6.5.1 Required Members

| Member | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `type` | string | `"shader"` | Type discriminator. MUST be `"shader"` |
| `vertex` | string | Valid GLSL | Vertex shader source code |
| `fragment` | string | Valid GLSL | Fragment shader source code |
| `uniforms` | object | See [6.5.3](#653-uniforms-object) | Uniform definitions |

#### 6.5.2 Optional Members

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `transparent` | boolean | `false` | — | Enable alpha blending |
| `side` | string | `"front"` | `"front"`, `"back"`, `"double"` | Render side |
| `depthWrite` | boolean | `true` | — | Write to depth buffer |
| `depthTest` | boolean | `true` | — | Test against depth buffer |
| `blending` | string | `"normal"` | See below | Blend mode |

Valid `blending` values: `"normal"`, `"additive"`, `"subtractive"`, `"multiply"`.

#### 6.5.3 Uniforms Object

The `uniforms` object maps uniform names to uniform definitions. Each uniform definition MUST contain:

| Member | Type | Description |
|--------|------|-------------|
| `type` | string | Uniform data type |
| `value` | varies | Initial value |

Optional uniform members:

| Member | Type | Default | Description |
|--------|------|---------|-------------|
| `animated` | boolean | `false` | Hint that this uniform changes per frame |

#### 6.5.4 Uniform Types

| Type | JSON Value Type | GLSL Type | Example Value |
|------|-----------------|-----------|---------------|
| `float` | number | `float` | `0.5` |
| `int` | number (integer) | `int` | `3` |
| `bool` | boolean | `bool` | `true` |
| `color` | string (hex) | `vec3` | `"#ff0000"` |
| `vec2` | array [x, y] | `vec2` | `[0.5, 0.5]` |
| `vec3` | array [x, y, z] | `vec3` | `[1.0, 0.0, 0.0]` |
| `vec4` | array [x, y, z, w] | `vec4` | `[1.0, 0.0, 0.0, 1.0]` |
| `mat3` | array (9 numbers) | `mat3` | Column-major order |
| `mat4` | array (16 numbers) | `mat4` | Column-major order |

#### 6.5.5 Built-in Uniforms

Consumers SHOULD automatically provide these uniforms when present in shader code:

| Uniform | Type | Description |
|---------|------|-------------|
| `time` | float | Elapsed time in seconds |
| `resolution` | vec2 | Viewport dimensions in pixels |
| `modelMatrix` | mat4 | Object-to-world transform |
| `viewMatrix` | mat4 | World-to-camera transform |
| `projectionMatrix` | mat4 | Camera projection matrix |

#### 6.5.6 Example

```json
{
  "mat_shader_hologram": {
    "type": "shader",
    "vertex": "varying vec2 vUv;\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
    "fragment": "uniform vec3 baseColor;\nuniform float time;\nvarying vec2 vUv;\nvoid main() {\n  float scanline = sin(vUv.y * 100.0 + time * 5.0) * 0.1 + 0.9;\n  gl_FragColor = vec4(baseColor * scanline, 0.8);\n}",
    "uniforms": {
      "baseColor": { "type": "color", "value": "#00ffff" },
      "time": { "type": "float", "value": 0, "animated": true }
    },
    "transparent": true
  }
}
```

---

## 7. Geometries Object

The `geometries` object is a dictionary mapping geometry keys to geometry definitions.

### 7.1 Geometry Key Conventions

Producers SHOULD use the following key naming conventions:

| Geometry | Default Key | Custom Key Pattern |
|----------|-------------|-------------------|
| Simple primitives | Type name (e.g., `"box"`) | `{type}_{hash}` |
| Complex geometries | `{type}_{hash}` | `{type}_{hash}` |

Consumers MUST treat geometry keys as opaque identifiers.

### 7.2 Common Geometry Members

All geometry definitions MUST include:

| Member | Type | Description |
|--------|------|-------------|
| `type` | string | Geometry type identifier |

All geometry definitions MAY include:

| Member | Type | Description |
|--------|------|-------------|
| `args` | array | Positional constructor arguments |

---

### 7.3 Simple Geometries

Simple geometries are parameterized primitives with optional customization.

#### 7.3.1 Geometry Types and Default Arguments

| Type | Constructor Arguments | Default Values |
|------|----------------------|----------------|
| `box` | `[width, height, depth]` | `[1, 1, 1]` |
| `sphere` | `[radius, widthSegments, heightSegments]` | `[0.5, 32, 32]` |
| `cylinder` | `[radiusTop, radiusBottom, height, radialSegments]` | `[0.5, 0.5, 1, 32]` |
| `cone` | `[radius, height, radialSegments]` | `[0.5, 1, 32]` |
| `torus` | `[radius, tube, radialSegments, tubularSegments]` | `[0.5, 0.2, 16, 32]` |
| `plane` | `[width, height]` | `[1, 1]` |
| `capsule` | `[radius, length, capSegments, radialSegments]` | `[0.5, 1, 4, 8]` |
| `circle` | `[radius, segments]` | `[0.5, 32]` |
| `ring` | `[innerRadius, outerRadius, thetaSegments]` | `[0.25, 0.5, 32]` |
| `dodecahedron` | `[radius, detail]` | `[0.5, 0]` |
| `icosahedron` | `[radius, detail]` | `[0.5, 0]` |
| `octahedron` | `[radius, detail]` | `[0.5, 0]` |
| `tetrahedron` | `[radius, detail]` | `[0.5, 0]` |
| `torusKnot` | `[radius, tube, tubularSegments, radialSegments, p, q]` | `[0.5, 0.15, 64, 8, 2, 3]` |

---

### 7.4 Box Geometry

#### 7.4.1 Optional Members

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `boxWidthSegments` | number | `1` | >= 1, integer | Subdivisions along X axis |
| `boxHeightSegments` | number | `1` | >= 1, integer | Subdivisions along Y axis |
| `boxDepthSegments` | number | `1` | >= 1, integer | Subdivisions along Z axis |

#### 7.4.2 Example

```json
{
  "box_subdivided": {
    "type": "box",
    "args": [1, 1, 1],
    "boxWidthSegments": 4,
    "boxHeightSegments": 4,
    "boxDepthSegments": 4
  }
}
```

---

### 7.5 Sphere Geometry

#### 7.5.1 Optional Members

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `sphereWidthSegments` | number | `32` | >= 3, integer | Horizontal segments |
| `sphereHeightSegments` | number | `32` | >= 2, integer | Vertical segments |
| `spherePhiStart` | number | `0` | >= 0 | Horizontal start angle (radians) |
| `spherePhiLength` | number | `2π` | > 0 | Horizontal sweep angle (radians) |
| `sphereThetaStart` | number | `0` | >= 0 | Vertical start angle (radians) |
| `sphereThetaLength` | number | `π` | > 0 | Vertical sweep angle (radians) |

#### 7.5.2 Example

```json
{
  "sphere_hemisphere": {
    "type": "sphere",
    "args": [0.5, 32, 32],
    "sphereThetaLength": 1.5708
  }
}
```

---

### 7.6 Cylinder Geometry

#### 7.6.1 Optional Members

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `cylinderRadiusTop` | number | `0.5` | >= 0 | Top radius |
| `cylinderRadiusBottom` | number | `0.5` | >= 0 | Bottom radius |
| `cylinderRadialSegments` | number | `32` | >= 3, integer | Circumference segments |
| `cylinderHeightSegments` | number | `1` | >= 1, integer | Height segments |
| `cylinderOpenEnded` | boolean | `false` | — | Remove end caps |
| `cylinderThetaStart` | number | `0` | >= 0 | Start angle (radians) |
| `cylinderThetaLength` | number | `2π` | > 0 | Sweep angle (radians) |

#### 7.6.2 Example

```json
{
  "cylinder_hexprism": {
    "type": "cylinder",
    "args": [0.5, 0.5, 1, 32],
    "cylinderRadialSegments": 6
  }
}
```

---

### 7.7 Cone Geometry

#### 7.7.1 Optional Members

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `coneRadius` | number | `0.5` | >= 0 | Base radius |
| `coneRadialSegments` | number | `32` | >= 3, integer | Circumference segments |
| `coneHeightSegments` | number | `1` | >= 1, integer | Height segments |
| `coneOpenEnded` | boolean | `false` | — | Remove base cap |
| `coneThetaStart` | number | `0` | >= 0 | Start angle (radians) |
| `coneThetaLength` | number | `2π` | > 0 | Sweep angle (radians) |

#### 7.7.2 Example

```json
{
  "cone_pyramid": {
    "type": "cone",
    "args": [0.5, 1, 32],
    "coneRadialSegments": 4
  }
}
```

---

### 7.8 Torus Geometry

#### 7.8.1 Optional Members

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `torusRadius` | number | `0.5` | > 0 | Ring radius (center to tube center) |
| `torusTube` | number | `0.2` | > 0 | Tube radius |
| `torusRadialSegments` | number | `16` | >= 3, integer | Tube cross-section segments |
| `torusTubularSegments` | number | `32` | >= 3, integer | Ring segments |
| `torusArc` | number | `2π` | > 0 | Arc angle (radians) |

#### 7.8.2 Example

```json
{
  "torus_arc": {
    "type": "torus",
    "args": [0.5, 0.2, 16, 32],
    "torusArc": 4.71239
  }
}
```

---

### 7.9 Plane Geometry

#### 7.9.1 Optional Members

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `planeWidthSegments` | number | `1` | >= 1, integer | Width subdivisions |
| `planeHeightSegments` | number | `1` | >= 1, integer | Height subdivisions |

#### 7.9.2 Example

```json
{
  "plane_grid": {
    "type": "plane",
    "args": [10, 10],
    "planeWidthSegments": 20,
    "planeHeightSegments": 20
  }
}
```

---

### 7.10 Capsule Geometry

#### 7.10.1 Optional Members

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `capsuleRadius` | number | `0.5` | > 0 | Capsule radius |
| `capsuleLength` | number | `1` | >= 0 | Cylindrical section length |
| `capsuleCapSegments` | number | `4` | >= 1, integer | Cap hemisphere segments |
| `capsuleRadialSegments` | number | `8` | >= 3, integer | Circumference segments |

#### 7.10.2 Example

```json
{
  "capsule_smooth": {
    "type": "capsule",
    "args": [0.5, 1, 4, 8],
    "capsuleCapSegments": 8,
    "capsuleRadialSegments": 16
  }
}
```

---

### 7.11 Circle Geometry

#### 7.11.1 Optional Members

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `circleRadius` | number | `0.5` | > 0 | Circle radius |
| `circleSegments` | number | `32` | >= 3, integer | Number of segments |
| `circleThetaStart` | number | `0` | >= 0 | Start angle (radians) |
| `circleThetaLength` | number | `2π` | > 0 | Arc angle (radians) |

#### 7.11.2 Example

```json
{
  "circle_hexagon": {
    "type": "circle",
    "args": [0.5, 32],
    "circleSegments": 6
  }
}
```

---

### 7.12 Ring Geometry

#### 7.12.1 Optional Members

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `ringInnerRadius` | number | `0.25` | >= 0 | Inner radius |
| `ringOuterRadius` | number | `0.5` | > innerRadius | Outer radius |
| `ringThetaSegments` | number | `32` | >= 3, integer | Circumference segments |
| `ringPhiSegments` | number | `1` | >= 1, integer | Radial segments |
| `ringThetaStart` | number | `0` | >= 0 | Start angle (radians) |
| `ringThetaLength` | number | `2π` | > 0 | Arc angle (radians) |

#### 7.12.2 Example

```json
{
  "ring_partial": {
    "type": "ring",
    "args": [0.25, 0.5, 32],
    "ringThetaLength": 4.71239
  }
}
```

---

### 7.13 Platonic Solid Geometries

The following geometries share the same parameter structure.

#### 7.13.1 Dodecahedron

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `dodecaRadius` | number | `0.5` | > 0 | Circumscribed sphere radius |
| `dodecaDetail` | number | `0` | >= 0, integer | Subdivision level |

#### 7.13.2 Icosahedron

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `icosaRadius` | number | `0.5` | > 0 | Circumscribed sphere radius |
| `icosaDetail` | number | `0` | >= 0, integer | Subdivision level |

#### 7.13.3 Octahedron

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `octaRadius` | number | `0.5` | > 0 | Circumscribed sphere radius |
| `octaDetail` | number | `0` | >= 0, integer | Subdivision level |

#### 7.13.4 Tetrahedron

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `tetraRadius` | number | `0.5` | > 0 | Circumscribed sphere radius |
| `tetraDetail` | number | `0` | >= 0, integer | Subdivision level |

---

### 7.14 Torus Knot Geometry

#### 7.14.1 Optional Members

| Member | Type | Default | Constraints | Description |
|--------|------|---------|-------------|-------------|
| `torusKnotRadius` | number | `0.5` | > 0 | Overall radius |
| `torusKnotTube` | number | `0.15` | > 0 | Tube radius |
| `torusKnotTubularSegments` | number | `64` | >= 3, integer | Segments along tube |
| `torusKnotRadialSegments` | number | `8` | >= 3, integer | Tube cross-section segments |
| `torusKnotP` | number | `2` | integer | Winds around rotational axis |
| `torusKnotQ` | number | `3` | integer | Winds around interior circle |

#### 7.14.2 Example

```json
{
  "torusKnot_complex": {
    "type": "torusKnot",
    "args": [0.5, 0.15, 64, 8, 2, 3],
    "torusKnotP": 3,
    "torusKnotQ": 5
  }
}
```

---

### 7.15 Complex Geometries

Complex geometries require additional structural data beyond simple parameters.

#### 7.15.1 Lathe Geometry

Revolves a 2D profile curve around the Y axis.

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `type` | string | REQUIRED | MUST be `"lathe"` |
| `points` | array | REQUIRED | Array of `[x, y]` coordinate pairs defining the profile |
| `args` | array | OPTIONAL | `[segments, phiStart, phiLength]`, defaults `[32, 0, 2π]` |

Example:
```json
{
  "lathe_vase": {
    "type": "lathe",
    "points": [[0, -0.5], [0.3, -0.4], [0.4, 0], [0.3, 0.4], [0.1, 0.5]],
    "args": [32, 0, 6.283185]
  }
}
```

#### 7.15.2 Extrude Geometry

Extrudes a 2D shape along the Z axis with optional bevel.

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `type` | string | REQUIRED | MUST be `"extrude"` |
| `shape` | object | REQUIRED | Shape definition (see [7.16](#716-shape-definitions)) |
| `extrudeOptions` | object | OPTIONAL | Extrusion parameters |

Extrude options:

| Member | Type | Default | Description |
|--------|------|---------|-------------|
| `depth` | number | `1` | Extrusion depth |
| `bevelEnabled` | boolean | `true` | Enable beveling |
| `bevelThickness` | number | `0.2` | Bevel depth |
| `bevelSize` | number | `0.1` | Bevel extent from shape |
| `bevelOffset` | number | `0` | Bevel offset from shape |
| `bevelSegments` | number | `3` | Bevel curve segments |
| `steps` | number | `1` | Extrusion segments |

Example:
```json
{
  "extrude_heart": {
    "type": "extrude",
    "shape": {
      "commands": [
        { "op": "moveTo", "x": 0, "y": 0.5 },
        { "op": "bezierCurveTo", "cp1x": 0.5, "cp1y": 0.5, "cp2x": 0.5, "cp2y": 0, "x": 0, "y": -0.5 },
        { "op": "bezierCurveTo", "cp1x": -0.5, "cp1y": 0, "cp2x": -0.5, "cp2y": 0.5, "x": 0, "y": 0.5 }
      ]
    },
    "extrudeOptions": {
      "depth": 0.2,
      "bevelEnabled": true,
      "bevelThickness": 0.05,
      "bevelSize": 0.03,
      "bevelSegments": 2
    }
  }
}
```

#### 7.15.3 Shape Geometry

Creates a flat 2D shape from path commands.

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `type` | string | REQUIRED | MUST be `"shape"` |
| `shape` | object | REQUIRED | Shape definition (see [7.16](#716-shape-definitions)) |

Example:
```json
{
  "shape_triangle": {
    "type": "shape",
    "shape": {
      "commands": [
        { "op": "moveTo", "x": 0, "y": 0 },
        { "op": "lineTo", "x": 1, "y": 0 },
        { "op": "lineTo", "x": 0.5, "y": 1 }
      ]
    }
  }
}
```

#### 7.15.4 Tube Geometry

Creates a tube along a 3D curve.

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `type` | string | REQUIRED | MUST be `"tube"` |
| `path` | object | REQUIRED | 3D curve definition (see [7.17](#717-3d-curve-definitions)) |
| `tubeRadius` | number | OPTIONAL | Tube radius (default: `0.1`) |
| `tubeTubularSegments` | number | OPTIONAL | Length segments (default: `64`) |
| `tubeRadialSegments` | number | OPTIONAL | Cross-section segments (default: `8`) |
| `tubeClosed` | boolean | OPTIONAL | Close the tube loop (default: `false`) |

Example:
```json
{
  "tube_path": {
    "type": "tube",
    "path": {
      "curveType": "catmullRom",
      "points": [[0, 0, 0], [1, 1, 0], [2, 0, 0], [3, 1, 0]],
      "closed": false
    },
    "tubeRadius": 0.1,
    "tubeTubularSegments": 64,
    "tubeRadialSegments": 8
  }
}
```

#### 7.15.5 Polyhedron Geometry

Creates a custom polyhedron from raw vertex and index data.

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `type` | string | REQUIRED | MUST be `"polyhedron"` |
| `vertices` | array | REQUIRED | Flat array of vertex coordinates `[x1, y1, z1, x2, y2, z2, ...]` |
| `indices` | array | REQUIRED | Flat array of face indices (triangles) |
| `args` | array | OPTIONAL | `[radius, detail]`, defaults `[1, 0]` |

Example:
```json
{
  "polyhedron_custom": {
    "type": "polyhedron",
    "vertices": [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1],
    "indices": [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1],
    "args": [1, 0]
  }
}
```

---

### 7.16 Shape Definitions

Shape definitions describe 2D paths for ShapeGeometry and ExtrudeGeometry.

#### 7.16.1 Shape Object

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `commands` | array | REQUIRED | Array of path commands |
| `holes` | array | OPTIONAL | Array of shape definitions for cutouts |

#### 7.16.2 Path Commands

| Command | Required Fields | Optional Fields | Description |
|---------|-----------------|-----------------|-------------|
| `moveTo` | `x`, `y` | — | Move pen to position |
| `lineTo` | `x`, `y` | — | Line to position |
| `bezierCurveTo` | `cp1x`, `cp1y`, `cp2x`, `cp2y`, `x`, `y` | — | Cubic bezier curve |
| `quadraticCurveTo` | `cpx`, `cpy`, `x`, `y` | — | Quadratic bezier curve |
| `arc` | `x`, `y`, `radius`, `startAngle`, `endAngle` | `clockwise` | Arc (relative to current position) |
| `absarc` | `x`, `y`, `radius`, `startAngle`, `endAngle` | `clockwise` | Arc (absolute coordinates) |
| `ellipse` | `x`, `y`, `xRadius`, `yRadius`, `startAngle`, `endAngle` | `clockwise`, `rotation` | Ellipse (relative) |
| `absellipse` | `x`, `y`, `xRadius`, `yRadius`, `startAngle`, `endAngle` | `clockwise`, `rotation` | Ellipse (absolute) |

All commands MUST include an `op` field specifying the command type.

---

### 7.17 3D Curve Definitions

3D curves define paths for TubeGeometry.

#### 7.17.1 Catmull-Rom Spline

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `curveType` | string | REQUIRED | MUST be `"catmullRom"` |
| `points` | array | REQUIRED | Array of `[x, y, z]` control points |
| `closed` | boolean | OPTIONAL | Close the curve loop (default: `false`) |
| `tension` | number | OPTIONAL | Curve tension (default: `0.5`) |

#### 7.17.2 Cubic Bezier Curve

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `curveType` | string | REQUIRED | MUST be `"cubicBezier"` |
| `v0` | array | REQUIRED | Start point `[x, y, z]` |
| `v1` | array | REQUIRED | First control point `[x, y, z]` |
| `v2` | array | REQUIRED | Second control point `[x, y, z]` |
| `v3` | array | REQUIRED | End point `[x, y, z]` |

#### 7.17.3 Quadratic Bezier Curve

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `curveType` | string | REQUIRED | MUST be `"quadraticBezier"` |
| `v0` | array | REQUIRED | Start point `[x, y, z]` |
| `v1` | array | REQUIRED | Control point `[x, y, z]` |
| `v2` | array | REQUIRED | End point `[x, y, z]` |

#### 7.17.4 Line Curve

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `curveType` | string | REQUIRED | MUST be `"line"` |
| `v1` | array | REQUIRED | Start point `[x, y, z]` |
| `v2` | array | REQUIRED | End point `[x, y, z]` |

---

## 8. Objects Array

The `objects` array contains all scene objects. Each object is either a mesh (visible geometry) or a group (transform container).

### 8.1 Required Members

| Member | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | string | Valid UUID v4 | Unique object identifier |
| `name` | string | Non-empty | Human-readable name |
| `type` | string | Valid type | Geometry type or `"group"` |
| `position` | array | `[x, y, z]` | Local position |
| `rotation` | array | `[x, y, z]` | Euler rotation in radians (XYZ order) |
| `scale` | array | `[x, y, z]` | Scale multipliers |
| `parent` | string \| null | Valid ID or null | Parent object ID |
| `visible` | boolean | — | Visibility flag |

### 8.2 Conditional Members

For mesh objects (type is not `"group"`):

| Member | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `geometry` | string | Valid geometry key | Reference to geometry definition |
| `material` | string | Valid material key | Reference to material definition |

### 8.3 Optional Members

| Member | Type | Default | Description |
|--------|------|---------|-------------|
| `castShadow` | boolean | `true` | Mesh casts shadows |
| `receiveShadow` | boolean | `true` | Mesh receives shadows |
| `userData` | object | `{}` | Arbitrary custom data |
| `renderOrder` | number | `0` | Explicit render ordering |
| `frustumCulled` | boolean | `true` | Enable frustum culling |

### 8.4 Validation Rules

1. Every `id` MUST be unique within the objects array.
2. Every `parent` value MUST be either `null` or reference an existing object `id`.
3. The parent-child graph MUST NOT contain cycles.
4. For non-group objects, `geometry` MUST reference a key in the `geometries` object.
5. For non-group objects, `material` MUST reference a key in the `materials` object.

### 8.5 Example

```json
{
  "objects": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "robot",
      "type": "group",
      "position": [0, 0, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 1, 1],
      "parent": null,
      "visible": true
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "robot_head",
      "type": "box",
      "geometry": "box",
      "material": "mat_888888_30_70",
      "position": [0, 1.5, 0],
      "rotation": [0, 0, 0],
      "scale": [0.8, 0.8, 0.8],
      "parent": "550e8400-e29b-41d4-a716-446655440001",
      "visible": true,
      "castShadow": true,
      "receiveShadow": true
    }
  ]
}
```

---

## 9. Roots Array

The `roots` array lists the IDs of all root-level objects (objects with `parent: null`).

### 9.1 Validation Rules

1. Every element MUST be a string matching an object `id`.
2. Every referenced object MUST have `parent: null`.
3. Every object with `parent: null` SHOULD be present in `roots`.

### 9.2 Example

```json
{
  "roots": ["550e8400-e29b-41d4-a716-446655440001"]
}
```

---

## 10. Animations Object

The `animations` object is an OPTIONAL dictionary mapping animation keys to animation clip definitions. Animation clips define keyframe-based animations that can be played back using Three.js's `AnimationMixer` system.

### 10.1 Animation Key Conventions

Producers SHOULD use descriptive key names for animation clips:

| Pattern | Example |
|---------|---------|
| `clip_{name}` | `clip_idle`, `clip_walk`, `clip_bounce` |
| `{name}` | `idle`, `walk`, `bounce` |

Consumers MUST treat animation keys as opaque identifiers.

### 10.2 Animation Clip Schema

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `name` | string | REQUIRED | Human-readable clip name |
| `duration` | number | OPTIONAL | Clip duration in seconds. Defaults to max track time |
| `tracks` | array | REQUIRED | Array of animation tracks |

### 10.3 Animation Track Schema

| Member | Type | Required | Description |
|--------|------|----------|-------------|
| `target` | string | REQUIRED | Object UUID to animate. MUST reference an existing object `id` |
| `path` | string | REQUIRED | Property path to animate (see below) |
| `interpolation` | string | REQUIRED | Interpolation mode (see below) |
| `times` | array | REQUIRED | Keyframe times in seconds |
| `values` | array | REQUIRED | Keyframe values (flat array) |

### 10.4 Property Paths

| Path | Components | Value Format | Three.js Track Type |
|------|------------|--------------|---------------------|
| `"position"` | 3 (vec3) | `[x, y, z, ...]` | `VectorKeyframeTrack` |
| `"scale"` | 3 (vec3) | `[x, y, z, ...]` | `VectorKeyframeTrack` |
| `"quaternion"` | 4 (quat) | `[x, y, z, w, ...]` | `QuaternionKeyframeTrack` |
| `"visible"` | 1 (bool) | `[true/false, ...]` | `BooleanKeyframeTrack` |

### 10.5 Interpolation Modes

| Value | Three.js Constant | Description |
|-------|-------------------|-------------|
| `"linear"` | `InterpolateLinear` | Linear interpolation between keyframes |
| `"smooth"` | `InterpolateSmooth` | Smooth/spline interpolation (cubic) |
| `"discrete"` | `InterpolateDiscrete` | Step interpolation (instant transitions) |

### 10.6 Track Validation Rules

1. `times` array MUST contain at least one element.
2. `times` values MUST be strictly increasing.
3. `values.length` MUST equal `times.length * components` (3 for vec3, 4 for quat, 1 for bool).
4. `target` MUST reference an existing object `id` in the `objects` array.
5. Quaternion values SHOULD be normalized. Consumers MAY normalize on load.

### 10.7 Object Naming for Track Binding

To enable Three.js's `PropertyBinding` system to target objects, consumers SHOULD assign deterministic names derived from TSP object IDs:

```javascript
// Recommended naming pattern
object.name = "tsp:" + tspObject.id;

// Track name pattern for PropertyBinding
trackName = object.name + "." + path;
// e.g., "tsp:550e8400-e29b-41d4-a716-446655440001.position"
```

### 10.8 Example

```json
{
  "animations": {
    "clip_bounce": {
      "name": "bounce",
      "duration": 2.0,
      "tracks": [
        {
          "target": "550e8400-e29b-41d4-a716-446655440001",
          "path": "position",
          "interpolation": "smooth",
          "times": [0, 0.5, 1.0, 1.5, 2.0],
          "values": [
            0, 0.5, 0,
            0, 2.0, 0,
            0, 0.5, 0,
            0, 2.0, 0,
            0, 0.5, 0
          ]
        },
        {
          "target": "550e8400-e29b-41d4-a716-446655440001",
          "path": "quaternion",
          "interpolation": "linear",
          "times": [0, 2.0],
          "values": [0, 0, 0, 1, 0, 0.707, 0, 0.707]
        }
      ]
    }
  }
}
```

### 10.9 Resource Limits

To prevent resource exhaustion, consumers SHOULD enforce the following limits:

| Parameter | Recommended Maximum |
|-----------|---------------------|
| Keyframes per track | 10,000 |
| Tracks per clip | 1,000 |
| Clips per scene | 100 |
| Total animation duration | 3,600 seconds (1 hour) |

---

## 11. Validation and Error Handling

### 11.1 Validation Requirements

Consumers MUST validate the following before processing a TSP file:

1. **JSON validity**: The file MUST be valid JSON.
2. **Required members**: All required members MUST be present at each level.
3. **Type correctness**: All values MUST match their specified types.
4. **Reference integrity**: All material, geometry, and parent references MUST resolve.
5. **Constraint satisfaction**: All numeric constraints MUST be satisfied.

### 11.2 Error Handling

When validation fails, consumers SHOULD:

1. Report all validation errors, not just the first encountered.
2. Include the JSON path to the invalid value.
3. Include the expected constraint and actual value.
4. Reject the entire file rather than attempting partial loading.

### 11.3 Unknown Members

| Context | Behavior |
|---------|----------|
| Top-level members | Consumers MUST ignore unknown members |
| Material properties | Consumers SHOULD ignore unknown members |
| Geometry properties | Consumers SHOULD ignore unknown members |
| Object properties | Consumers SHOULD ignore unknown members |
| Uniform types | Consumers MAY reject unknown types or ignore the uniform |

This policy enables forward compatibility with future specification versions.

### 11.4 Default Values

When optional members are absent, consumers MUST use the default values specified in this document.

---

## 12. Security Considerations

### 12.1 Shader Code Execution

TSP files containing Shader Materials include executable GLSL code. Consumers MUST:

1. Execute shader code only within the GPU context (WebGL/WebGPU).
2. Not attempt to execute shader code on the CPU.
3. Be aware that malicious shaders may cause GPU hangs or excessive resource consumption.

Consumers MAY implement:

1. Shader validation before compilation.
2. Timeouts for shader compilation.
3. Resource limits for shader execution.

### 12.2 Resource Exhaustion

TSP files may specify geometries with arbitrarily high segment counts. Consumers SHOULD:

1. Impose reasonable limits on segment parameters.
2. Validate total vertex/face counts before allocation.
3. Implement timeouts for geometry generation.

Recommended limits:

| Parameter Type | Recommended Maximum |
|----------------|---------------------|
| Total segments per geometry | 1,000,000 |
| Total objects per scene | 100,000 |
| Total materials per scene | 10,000 |
| Shader source length | 100,000 characters |

### 12.3 Path Traversal

TSP files do not include file system paths. Consumers MUST NOT interpret any string values as file paths without explicit user action.

### 12.4 UUID Predictability

The `id` fields use UUID v4, which should be generated using cryptographically secure random number generators. Producers MUST NOT use predictable or sequential UUIDs.

---

## 13. Versioning Policy

### 13.1 Version Number Format

The `metadata.version` field uses Semantic Versioning 2.0.0 ([semver.org][semver]):

```
MAJOR.MINOR.PATCH
```

### 13.2 Compatibility Guarantees

| Version Change | Compatibility |
|----------------|---------------|
| PATCH (0.9.0 → 0.9.1) | Fully backward and forward compatible |
| MINOR (0.9.x → 0.10.0) | Backward compatible; new optional features |
| MAJOR (0.x.x → 1.0.0) | Breaking changes possible |

### 13.3 Consumer Version Handling

Consumers SHOULD:

1. Accept files with matching MAJOR version.
2. Accept files with lesser MINOR version (older files).
3. Accept files with greater MINOR version, ignoring unknown features.
4. Reject files with different MAJOR version, or warn the user.

### 13.4 Producer Version Handling

Producers MUST:

1. Set `metadata.version` to the specification version they implement.
2. Not emit features from newer specification versions.

---

## 14. References

### 14.1 Normative References

- **[RFC 2119]** Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, March 1997. https://www.rfc-editor.org/rfc/rfc2119

- **[RFC 8259]** Bray, T., Ed., "The JavaScript Object Notation (JSON) Data Interchange Format", STD 90, RFC 8259, December 2017. https://www.rfc-editor.org/rfc/rfc8259

- **[RFC 4122]** Leach, P., Mealling, M., and R. Salz, "A Universally Unique IDentifier (UUID) URN Namespace", RFC 4122, July 2005. https://www.rfc-editor.org/rfc/rfc4122

- **[ISO 8601]** ISO 8601:2004, "Data elements and interchange formats — Information interchange — Representation of dates and times".

- **[Semantic Versioning]** Preston-Werner, T., "Semantic Versioning 2.0.0". https://semver.org/

### 14.2 Informative References

- **[Three.js Documentation]** Three.js Geometry Classes. https://threejs.org/docs/#api/en/geometries/BoxGeometry

- **[WebGL Specification]** Khronos Group, "WebGL Specification". https://www.khronos.org/registry/webgl/specs/latest/

- **[GLSL Specification]** Khronos Group, "The OpenGL Shading Language". https://www.khronos.org/registry/OpenGL/specs/gl/GLSLangSpec.4.60.pdf

---

## Appendix A: Complete Example

*This appendix is informative.*

The following is a complete, valid TSP file demonstrating multiple features:

```json
{
  "metadata": {
    "version": "0.9.1",
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "created": "2026-01-14T15:30:00Z",
    "generator": "rehkuh",
    "generatorVersion": "0.1.0",
    "author": "Example Author",
    "copyright": "CC0 1.0",
    "title": "Simple Robot",
    "description": "A basic robot made from primitives"
  },
  "materials": {
    "mat_4a90d9_20_80": {
      "color": "#4a90d9",
      "metalness": 0.2,
      "roughness": 0.8
    },
    "mat_333333_80_20": {
      "color": "#333333",
      "metalness": 0.8,
      "roughness": 0.2
    },
    "mat_physical_glass": {
      "type": "physical",
      "color": "#ffffff",
      "metalness": 0,
      "roughness": 0,
      "transmission": 0.9,
      "ior": 1.5,
      "transparent": true
    }
  },
  "geometries": {
    "box": { "type": "box", "args": [1, 1, 1] },
    "sphere": { "type": "sphere", "args": [0.5, 32, 32] },
    "cylinder": { "type": "cylinder", "args": [0.5, 0.5, 1, 32] }
  },
  "objects": [
    {
      "id": "00000000-0000-0000-0000-000000000001",
      "name": "robot",
      "type": "group",
      "position": [0, 0, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 1, 1],
      "parent": null,
      "visible": true
    },
    {
      "id": "00000000-0000-0000-0000-000000000002",
      "name": "body",
      "type": "box",
      "geometry": "box",
      "material": "mat_4a90d9_20_80",
      "position": [0, 1, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 1.5, 0.6],
      "parent": "00000000-0000-0000-0000-000000000001",
      "visible": true,
      "castShadow": true,
      "receiveShadow": true
    },
    {
      "id": "00000000-0000-0000-0000-000000000003",
      "name": "head",
      "type": "sphere",
      "geometry": "sphere",
      "material": "mat_333333_80_20",
      "position": [0, 2.2, 0],
      "rotation": [0, 0, 0],
      "scale": [0.7, 0.7, 0.7],
      "parent": "00000000-0000-0000-0000-000000000001",
      "visible": true,
      "castShadow": true,
      "receiveShadow": true
    },
    {
      "id": "00000000-0000-0000-0000-000000000004",
      "name": "visor",
      "type": "box",
      "geometry": "box",
      "material": "mat_physical_glass",
      "position": [0, 2.25, 0.3],
      "rotation": [0, 0, 0],
      "scale": [0.5, 0.15, 0.1],
      "parent": "00000000-0000-0000-0000-000000000001",
      "visible": true,
      "castShadow": false,
      "receiveShadow": false
    }
  ],
  "roots": ["00000000-0000-0000-0000-000000000001"]
}
```

---

## Appendix B: Geometry Use Cases

*This appendix is informative.*

### B.1 Sphere Geometry

| Configuration | Result |
|---------------|--------|
| `spherePhiLength < 2π` | Vertical slice (orange wedge) |
| `sphereThetaLength < π` | Dome or bowl |
| Both partial | Dome section |

### B.2 Cylinder Geometry

| Configuration | Result |
|---------------|--------|
| `cylinderRadiusTop ≠ cylinderRadiusBottom` | Tapered cylinder / frustum |
| `cylinderRadiusTop = 0` | Cone shape |
| `cylinderOpenEnded = true` | Tube / pipe |
| `cylinderThetaLength < 2π` | Partial cylinder |
| `cylinderRadialSegments = 6` | Hexagonal prism |

### B.3 Cone Geometry

| Configuration | Result |
|---------------|--------|
| `coneOpenEnded = true` | Hollow cone / funnel |
| `coneThetaLength < 2π` | Pie slice |
| `coneRadialSegments = 4` | Pyramid |

### B.4 Torus Geometry

| Configuration | Result |
|---------------|--------|
| `torusArc < 2π` | C-shape, horseshoe |
| `torusTube > torusRadius` | Thick blob |
| `torusRadialSegments = 3` | Triangular cross-section |
| `torusRadialSegments = 4` | Square tube |

### B.5 Circle Geometry

| Configuration | Result |
|---------------|--------|
| `circleThetaLength < 2π` | Pie slice / pac-man |
| `circleSegments = 3` | Triangle |
| `circleSegments = 4` | Diamond |
| `circleSegments = 6` | Hexagon |

### B.6 Ring Geometry

| Configuration | Result |
|---------------|--------|
| `ringInnerRadius = 0` | Filled disc |
| `ringThetaLength < 2π` | Arc segment |
| Inner ≈ Outer radius | Thin halo |

### B.7 Platonic Solids

| Geometry | Detail = 0 | Detail > 0 |
|----------|------------|------------|
| Tetrahedron | 4-face pyramid (D4) | Smoothed |
| Octahedron | 8-face diamond (D8) | Smoothed |
| Dodecahedron | 12-face (D12) | Smoothed |
| Icosahedron | 20-face (D20) | Geodesic sphere |

### B.8 Torus Knot

| p, q Values | Result |
|-------------|--------|
| 2, 3 | Classic trefoil knot |
| 3, 2 | Alternate trefoil |
| 2, 5 | Complex winding |
| 3, 4 | Star-like pattern |

---

## Appendix C: Material Recipes

*This appendix is informative.*

### C.1 Physical Material Recipes

| Effect | Key Properties |
|--------|----------------|
| Clear glass | `transmission: 1`, `roughness: 0`, `ior: 1.5` |
| Frosted glass | `transmission: 1`, `roughness: 0.3`, `ior: 1.5` |
| Water | `transmission: 1`, `ior: 1.33`, `attenuationColor: "#88ccff"` |
| Diamond | `transmission: 1`, `ior: 2.333`, `dispersion: 0.05` |
| Car paint | `clearcoat: 1`, `clearcoatRoughness: 0.1`, `metalness: 0.9` |
| Velvet | `sheen: 1`, `sheenRoughness: 0.8`, `sheenColor: "#..."` |
| Soap bubble | `iridescence: 1`, `transmission: 0.9`, `thickness: 0.001` |
| Brushed metal | `metalness: 1`, `anisotropy: 1`, `anisotropyRotation: 0` |
| Skin | `specularIntensity: 0.5`, `roughness: 0.6` |

### C.2 Common IOR Values

| Material | IOR Value |
|----------|-----------|
| Air | 1.0 |
| Water | 1.33 |
| Glass | 1.5 |
| Crystal | 2.0 |
| Diamond | 2.42 (use 2.333) |

---

## Appendix D: Animation Examples

*This appendix is informative.*

### D.1 Position Bounce

```json
{
  "animations": {
    "clip_bounce": {
      "name": "bounce",
      "tracks": [
        {
          "target": "00000000-0000-0000-0000-000000000001",
          "path": "position",
          "interpolation": "smooth",
          "times": [0, 0.5, 1.0],
          "values": [0, 0.5, 0, 0, 2.0, 0, 0, 0.5, 0]
        }
      ]
    }
  }
}
```

### D.2 Rotation with Quaternion

Rotate 90 degrees around Y axis over 1 second:

```json
{
  "animations": {
    "clip_rotate": {
      "name": "rotate90",
      "tracks": [
        {
          "target": "00000000-0000-0000-0000-000000000001",
          "path": "quaternion",
          "interpolation": "linear",
          "times": [0, 1.0],
          "values": [0, 0, 0, 1, 0, 0.7071, 0, 0.7071]
        }
      ]
    }
  }
}
```

### D.3 Visibility Toggle (Blink)

```json
{
  "animations": {
    "clip_blink": {
      "name": "blink",
      "tracks": [
        {
          "target": "00000000-0000-0000-0000-000000000001",
          "path": "visible",
          "interpolation": "discrete",
          "times": [0, 0.5, 1.0, 1.5, 2.0],
          "values": [true, false, true, false, true]
        }
      ]
    }
  }
}
```

### D.4 Combined Animation

Multiple properties animated together:

```json
{
  "animations": {
    "clip_combined": {
      "name": "jump_and_spin",
      "duration": 2.0,
      "tracks": [
        {
          "target": "00000000-0000-0000-0000-000000000001",
          "path": "position",
          "interpolation": "smooth",
          "times": [0, 0.5, 1.0, 1.5, 2.0],
          "values": [
            0, 0, 0,
            0, 2, 0,
            0, 0, 0,
            0, 2, 0,
            0, 0, 0
          ]
        },
        {
          "target": "00000000-0000-0000-0000-000000000001",
          "path": "quaternion",
          "interpolation": "linear",
          "times": [0, 2.0],
          "values": [0, 0, 0, 1, 0, 1, 0, 0]
        }
      ]
    }
  }
}
```

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 0.10.0 | 2026-01-14 | Added optional `animations` object for keyframe-based animations (Section 10). |
| 0.9.2 | 2026-01-14 | Added optional `title` and `description` metadata fields. |
| 0.9.1 | 2026-01-14 | Document reformatted as formal specification. Added security considerations, versioning policy, validation requirements, and appendices. No format changes. |
| 0.9.0 | 2026-01-09 | Initial public draft. Core format with standard, physical, and shader materials. Simple and complex geometry support. |

---

[rfc2119]: https://www.rfc-editor.org/rfc/rfc2119
[rfc8259]: https://www.rfc-editor.org/rfc/rfc8259
[semver]: https://semver.org/
