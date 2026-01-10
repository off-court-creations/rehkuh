# Scope: MeshPhysicalMaterial Advanced Channels for TSP Format

**Status:** Scoping Document
**Version:** 1.0 (no schema version bump required)
**Date:** 2026-01-09

---

## Executive Summary

This document scopes the addition of MeshPhysicalMaterial's advanced PBR channels to the TSP file format. The goal is to enable export of physically-based materials with clearcoat, sheen, transmission, iridescence, anisotropy, and specular control while maintaining backward compatibility with existing TSP files.

**Scope constraint:** No texture/map support. All properties are scalar or color values only.

---

## Current State Analysis

### What TSP Currently Supports

The `TSPStandardMaterial` schema currently supports these MeshStandardMaterial properties:

| Property | Type | Supported | Notes |
|----------|------|-----------|-------|
| `color` | hex string | Yes | Base albedo color |
| `metalness` | 0-1 | Yes | Metal vs dielectric |
| `roughness` | 0-1 | Yes | Surface microsurface roughness |
| `emissive` | hex string | Yes (optional) | Self-illumination color |
| `emissiveIntensity` | 0-1 | Yes (optional) | Emissive strength |
| `opacity` | 0-1 | Yes (optional) | Alpha value |
| `transparent` | boolean | Yes (optional) | Enable alpha blending |
| `side` | enum | Yes (optional) | "front", "back", "double" |

### What's Missing

MeshPhysicalMaterial extends MeshStandardMaterial with 7 major feature channels. None of these scalar/color properties are currently supported in TSP.

---

## MeshPhysicalMaterial Channel Inventory

### 1. Clearcoat Channel
*Purpose: Simulates clear lacquer coating (car paint, wet surfaces, varnished wood)*

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `clearcoat` | float | 0-1 | 0 | Intensity of clear coat layer |
| `clearcoatRoughness` | float | 0-1 | 0 | Roughness of clear coat layer |

**Use Cases:** Automotive paint, wet surfaces, lacquered furniture, phone screens, nail polish

### 2. Sheen Channel
*Purpose: Soft velvet-like reflection at grazing angles (fabric, cloth, felt)*

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `sheen` | float | 0-1 | 0 | Intensity of sheen layer |
| `sheenRoughness` | float | 0-1 | 1 | Roughness of sheen |
| `sheenColor` | color | hex | "#ffffff" | Tint of sheen highlight |

**Use Cases:** Velvet, felt, cloth, carpet, peach fuzz, soft toys

### 3. Transmission Channel
*Purpose: Physically-based transparency with refraction (glass, liquid, gems)*

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `transmission` | float | 0-1 | 0 | Amount of light transmitted |
| `thickness` | float | 0+ | 0 | Thickness for attenuation (world units) |
| `attenuationColor` | color | hex | "#ffffff" | Color tint as light passes through |
| `attenuationDistance` | float | 0+ | Infinity | Distance at which attenuation color is fully applied |

**Use Cases:** Glass, water, gems, wax, jade, amber, ice, jelly, soap

### 4. IOR (Index of Refraction)
*Purpose: Controls Fresnel effect and refraction angle*

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `ior` | float | 1.0-2.333 | 1.5 | Index of refraction |

**Common IOR Values:**
- Air: 1.0
- Water: 1.33
- Glass: 1.5
- Diamond: 2.42 (clamped to 2.333)
- Plastic: 1.46

**Use Cases:** All transparent materials, also affects non-transmissive materials' Fresnel

### 5. Specular Channel
*Purpose: Independent control of specular reflections*

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `specularIntensity` | float | 0-1 | 1 | Strength of specular reflection |
| `specularColor` | color | hex | "#ffffff" | Tint of specular reflection |
| `reflectivity` | float | 0-1 | 0.5 | Controls F0 (overrides ior-based calculation) |

**Use Cases:** Skin, layered materials, artistic control over highlights

### 6. Iridescence Channel
*Purpose: Thin-film interference effects (soap bubbles, oil slicks, beetles)*

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `iridescence` | float | 0-1 | 0 | Intensity of iridescence effect |
| `iridescenceIOR` | float | 1.0-2.333 | 1.3 | IOR of thin film layer |
| `iridescenceThicknessRange` | vec2 | [min, max] nm | [100, 400] | Thickness range in nanometers |

**Use Cases:** Soap bubbles, oil slicks, beetle shells, peacock feathers, abalone shells, CDs

### 7. Anisotropy Channel
*Purpose: Directional roughness (brushed metal, hair, satin)*

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `anisotropy` | float | 0-1 | 0 | Strength of anisotropic effect |
| `anisotropyRotation` | float | 0-2π | 0 | Rotation of anisotropy direction (radians) |

**Use Cases:** Brushed metal, hair/fur, satin, vinyl records, machined surfaces

### 8. Dispersion
*Purpose: Chromatic aberration in transmissive materials*

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `dispersion` | float | 0+ | 0 | Amount of chromatic dispersion |

**Use Cases:** Diamonds, prisms, crystal, cut glass

---

## Additional Properties

These MeshPhysicalMaterial properties are also useful without textures:

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `envMapIntensity` | float | 0+ | 1 | Environment reflection intensity |
| `flatShading` | boolean | - | false | Use flat shading instead of smooth |

---

## Property Summary Table

Total of **21 new properties** across all channels:

| Channel | Properties | Count |
|---------|-----------|-------|
| Clearcoat | `clearcoat`, `clearcoatRoughness` | 2 |
| Sheen | `sheen`, `sheenRoughness`, `sheenColor` | 3 |
| Transmission | `transmission`, `thickness`, `attenuationColor`, `attenuationDistance` | 4 |
| IOR | `ior` | 1 |
| Specular | `specularIntensity`, `specularColor`, `reflectivity` | 3 |
| Iridescence | `iridescence`, `iridescenceIOR`, `iridescenceThicknessRange` | 3 |
| Anisotropy | `anisotropy`, `anisotropyRotation` | 2 |
| Dispersion | `dispersion` | 1 |
| Other | `envMapIntensity`, `flatShading` | 2 |
| **Total** | | **21** |

---

## Proposed TSP Schema Extensions

### Material Type Discriminator

To enable MeshPhysicalMaterial alongside MeshStandardMaterial:

```typescript
type: "standard" | "physical" | "shader"
```

When `type` is `"physical"`, the full MeshPhysicalMaterial channel set becomes available.

### Schema Addition: TSPPhysicalMaterial

```typescript
interface TSPPhysicalMaterial {
  type: "physical";

  // Base properties (inherited from standard)
  color: string;              // Required, hex
  metalness: number;          // Required, 0-1
  roughness: number;          // Required, 0-1
  emissive?: string;          // Hex color
  emissiveIntensity?: number; // 0+
  opacity?: number;           // 0-1
  transparent?: boolean;
  side?: "front" | "back" | "double";

  // Clearcoat channel
  clearcoat?: number;         // 0-1
  clearcoatRoughness?: number; // 0-1

  // Sheen channel
  sheen?: number;             // 0-1
  sheenRoughness?: number;    // 0-1
  sheenColor?: string;        // Hex color

  // Transmission channel
  transmission?: number;      // 0-1
  thickness?: number;         // World units, 0+
  attenuationColor?: string;  // Hex color
  attenuationDistance?: number; // World units, 0+ (Infinity = no attenuation)

  // IOR
  ior?: number;               // 1.0-2.333

  // Specular channel
  specularIntensity?: number; // 0-1
  specularColor?: string;     // Hex color
  reflectivity?: number;      // 0-1

  // Iridescence channel
  iridescence?: number;       // 0-1
  iridescenceIOR?: number;    // 1.0-2.333
  iridescenceThicknessRange?: [number, number]; // [min, max] in nanometers

  // Anisotropy channel
  anisotropy?: number;        // 0-1
  anisotropyRotation?: number; // Radians

  // Dispersion
  dispersion?: number;        // 0+

  // Other
  envMapIntensity?: number;   // 0+
  flatShading?: boolean;
}
```

---

## Material Key Generation

The current material key format is:
```
mat_{color}_{metalness*100}_{roughness*100}
```

For physical materials with many properties, this becomes unwieldy. Proposed approach:

### Content Hash

```typescript
function generateMaterialKey(material: MaterialProps): string {
  if (material.type === "physical") {
    // Generate hash of all non-default properties
    const hash = hashObject(material);
    return `mat_physical_${hash.slice(0, 12)}`;
  }
  // ... existing logic for standard materials
}
```

This ensures materials with identical properties share the same key while keeping keys reasonably short.

---

## Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `src/types.ts` | Add `PhysicalMaterialProps` interface, update `MaterialProps` union |
| `src/schemas/tsp.ts` | Add `TSPPhysicalMaterialSchema`, update `TSPMaterialSchema` union |
| `src/schemas/base.ts` | Add `Vector2Schema` if not present (for iridescenceThicknessRange) |
| `src/export/tspExporter.ts` | Handle physical material export, hash-based key generation |
| `src/export/tspImporter.ts` | Handle physical material import, instantiate `MeshPhysicalMaterial` |
| `src/components/editor/SceneObject.jsx` | Update material creation to use `MeshPhysicalMaterial` when type is physical |
| `docs/tsp-format.md` | Document new material type and all properties |

### Estimated Scope

~400 lines of code changes total.

---

## Zod Schema

```typescript
// Physical material schema (no texture support)
export const TSPPhysicalMaterialSchema = z.object({
  type: z.literal("physical"),

  // Base properties
  color: HexColorSchema,
  metalness: z.number().min(0).max(1),
  roughness: z.number().min(0).max(1),
  emissive: HexColorSchema.optional(),
  emissiveIntensity: z.number().min(0).optional(),
  opacity: z.number().min(0).max(1).optional(),
  transparent: z.boolean().optional(),
  side: TSPMaterialSideSchema.optional(),

  // Clearcoat
  clearcoat: z.number().min(0).max(1).optional(),
  clearcoatRoughness: z.number().min(0).max(1).optional(),

  // Sheen
  sheen: z.number().min(0).max(1).optional(),
  sheenRoughness: z.number().min(0).max(1).optional(),
  sheenColor: HexColorSchema.optional(),

  // Transmission
  transmission: z.number().min(0).max(1).optional(),
  thickness: z.number().min(0).optional(),
  attenuationColor: HexColorSchema.optional(),
  attenuationDistance: z.number().min(0).optional(),

  // IOR
  ior: z.number().min(1).max(2.333).optional(),

  // Specular
  specularIntensity: z.number().min(0).max(1).optional(),
  specularColor: HexColorSchema.optional(),
  reflectivity: z.number().min(0).max(1).optional(),

  // Iridescence
  iridescence: z.number().min(0).max(1).optional(),
  iridescenceIOR: z.number().min(1).max(2.333).optional(),
  iridescenceThicknessRange: z.tuple([z.number(), z.number()]).optional(),

  // Anisotropy
  anisotropy: z.number().min(0).max(1).optional(),
  anisotropyRotation: z.number().optional(),

  // Dispersion
  dispersion: z.number().min(0).optional(),

  // Other
  envMapIntensity: z.number().min(0).optional(),
  flatShading: z.boolean().optional(),
});

// Updated material union
export const TSPMaterialSchema = z.union([
  TSPStandardMaterialSchema,
  TSPPhysicalMaterialSchema,
  TSPShaderMaterialSchema,
]);
```

---

## Backward Compatibility

### Reading Old Files

Old files without `type` field default to `"standard"`:
```typescript
if (!material.type || material.type === "standard") {
  // MeshStandardMaterial
}
```

### Writing Old-Compatible Files

When a physical material uses only standard properties, it can optionally be exported as standard for maximum compatibility:
```typescript
function isEffectivelyStandardMaterial(mat: PhysicalMaterialProps): boolean {
  return (
    mat.clearcoat === undefined &&
    mat.sheen === undefined &&
    mat.transmission === undefined &&
    mat.iridescence === undefined &&
    mat.anisotropy === undefined &&
    mat.dispersion === undefined &&
    mat.specularIntensity === undefined &&
    mat.specularColor === undefined
    // ... etc
  );
}
```

---

## Example TSP Files

### Glass Sphere

```json
{
  "version": "1.0",
  "metadata": {
    "name": "glass_sphere",
    "created": "2026-01-09T12:00:00Z",
    "generator": "rehkuh"
  },
  "materials": {
    "mat_physical_a1b2c3d4e5f6": {
      "type": "physical",
      "color": "#ffffff",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 0.5,
      "ior": 1.5,
      "attenuationColor": "#ffffff",
      "attenuationDistance": 1
    }
  },
  "geometries": {
    "sphere": { "type": "sphere", "args": [0.5, 64, 64] }
  },
  "objects": [
    {
      "id": "glass-ball",
      "name": "Glass Ball",
      "type": "sphere",
      "geometry": "sphere",
      "material": "mat_physical_a1b2c3d4e5f6",
      "position": [0, 1, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 1, 1],
      "parent": null,
      "visible": true
    }
  ],
  "roots": ["glass-ball"]
}
```

### Car Paint

```json
{
  "version": "1.0",
  "metadata": {
    "name": "car_body",
    "created": "2026-01-09T12:00:00Z",
    "generator": "rehkuh"
  },
  "materials": {
    "mat_physical_b2c3d4e5f6a7": {
      "type": "physical",
      "color": "#0066cc",
      "metalness": 0.9,
      "roughness": 0.15,
      "clearcoat": 1.0,
      "clearcoatRoughness": 0.03
    }
  },
  "geometries": {
    "box": { "type": "box", "args": [1, 1, 1] }
  },
  "objects": [
    {
      "id": "car-panel",
      "name": "Car Panel",
      "type": "box",
      "geometry": "box",
      "material": "mat_physical_b2c3d4e5f6a7",
      "position": [0, 0.5, 0],
      "rotation": [0, 0, 0],
      "scale": [2, 0.5, 1],
      "parent": null,
      "visible": true
    }
  ],
  "roots": ["car-panel"]
}
```

### Velvet Fabric

```json
{
  "version": "1.0",
  "metadata": {
    "name": "velvet_cushion",
    "created": "2026-01-09T12:00:00Z",
    "generator": "rehkuh"
  },
  "materials": {
    "mat_physical_c3d4e5f6a7b8": {
      "type": "physical",
      "color": "#8b0000",
      "metalness": 0,
      "roughness": 0.9,
      "sheen": 0.8,
      "sheenRoughness": 0.3,
      "sheenColor": "#ff6666"
    }
  },
  "geometries": {
    "box": { "type": "box", "args": [1, 1, 1] }
  },
  "objects": [
    {
      "id": "cushion",
      "name": "Velvet Cushion",
      "type": "box",
      "geometry": "box",
      "material": "mat_physical_c3d4e5f6a7b8",
      "position": [0, 0.25, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 0.5, 1],
      "parent": null,
      "visible": true
    }
  ],
  "roots": ["cushion"]
}
```

### Soap Bubble (Iridescence + Transmission)

```json
{
  "version": "1.0",
  "metadata": {
    "name": "soap_bubble",
    "created": "2026-01-09T12:00:00Z",
    "generator": "rehkuh"
  },
  "materials": {
    "mat_physical_d4e5f6a7b8c9": {
      "type": "physical",
      "color": "#ffffff",
      "metalness": 0,
      "roughness": 0,
      "transmission": 0.98,
      "thickness": 0.001,
      "ior": 1.33,
      "iridescence": 1,
      "iridescenceIOR": 1.3,
      "iridescenceThicknessRange": [100, 400]
    }
  },
  "geometries": {
    "sphere": { "type": "sphere", "args": [0.5, 64, 64] }
  },
  "objects": [
    {
      "id": "bubble",
      "name": "Soap Bubble",
      "type": "sphere",
      "geometry": "sphere",
      "material": "mat_physical_d4e5f6a7b8c9",
      "position": [0, 1, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 1, 1],
      "parent": null,
      "visible": true
    }
  ],
  "roots": ["bubble"]
}
```

### Brushed Metal (Anisotropy)

```json
{
  "version": "1.0",
  "metadata": {
    "name": "brushed_steel",
    "created": "2026-01-09T12:00:00Z",
    "generator": "rehkuh"
  },
  "materials": {
    "mat_physical_e5f6a7b8c9d0": {
      "type": "physical",
      "color": "#c0c0c0",
      "metalness": 1,
      "roughness": 0.3,
      "anisotropy": 0.8,
      "anisotropyRotation": 0
    }
  },
  "geometries": {
    "cylinder": { "type": "cylinder", "args": [0.5, 0.5, 1, 64] }
  },
  "objects": [
    {
      "id": "metal-rod",
      "name": "Brushed Steel Rod",
      "type": "cylinder",
      "geometry": "cylinder",
      "material": "mat_physical_e5f6a7b8c9d0",
      "position": [0, 0.5, 0],
      "rotation": [0, 0, 0],
      "scale": [0.5, 2, 0.5],
      "parent": null,
      "visible": true
    }
  ],
  "roots": ["metal-rod"]
}
```

### Diamond (Dispersion + Transmission)

```json
{
  "version": "1.0",
  "metadata": {
    "name": "diamond",
    "created": "2026-01-09T12:00:00Z",
    "generator": "rehkuh"
  },
  "materials": {
    "mat_physical_f6a7b8c9d0e1": {
      "type": "physical",
      "color": "#ffffff",
      "metalness": 0,
      "roughness": 0,
      "transmission": 1,
      "thickness": 1,
      "ior": 2.333,
      "dispersion": 0.1
    }
  },
  "geometries": {
    "octahedron": { "type": "octahedron", "args": [0.5, 0] }
  },
  "objects": [
    {
      "id": "diamond",
      "name": "Diamond",
      "type": "octahedron",
      "geometry": "octahedron",
      "material": "mat_physical_f6a7b8c9d0e1",
      "position": [0, 1, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 1, 1],
      "parent": null,
      "visible": true
    }
  ],
  "roots": ["diamond"]
}
```

---

## Performance Considerations

### Transmission Materials

`transmission > 0` requires an additional render pass. Three.js handles this automatically, but it impacts performance. Consider documenting this in the TSP format spec as a performance note.

### Material Instance Sharing

Physical materials with identical properties should share instances. The content hash approach enables this automatically - materials with the same hash get the same key and are deduplicated.

---

## Testing Strategy

### Unit Tests

1. Schema validation for all property combinations
2. Material key generation consistency (same properties = same hash)
3. Import/export round-trip integrity
4. Type guard functions (`isPhysicalMaterial`, etc.)

### Visual Tests

1. Each channel in isolation (clearcoat only, sheen only, etc.)
2. Channel combinations (glass with iridescence, car paint with anisotropy)
3. Comparison against Three.js editor output
4. Edge cases (ior at limits, full transmission, etc.)

### Compatibility Tests

1. Old TSP files load correctly (no `type` field = standard)
2. Physical materials with only base properties work
3. Missing optional properties use correct Three.js defaults

---

## Conclusion

This scope document provides a complete specification for adding MeshPhysicalMaterial's scalar/color properties to the TSP format. All 7 advanced channels are fully usable without texture support, enabling high-quality materials like glass, car paint, fabric, iridescent surfaces, and brushed metal.

**Summary:**
- 21 new properties across 8 categories
- No texture/map support (out of scope)
- Backward compatible (type discriminator, optional properties)
- ~400 lines of implementation
- Schema version remains 1.0
