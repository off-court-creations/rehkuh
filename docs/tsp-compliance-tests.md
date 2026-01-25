# TSP 1.0.0 Compliance Test Suite

Test files to validate TSP format implementation. Each file tests specific spec requirements.

---

## Geometry Tests

### Simple Geometries (14 types)

- [ ] `geo-box.tsp` - Box with default args + custom segments (boxWidthSegments, boxHeightSegments, boxDepthSegments)
- [ ] `geo-sphere.tsp` - Sphere with partial params (phiStart, phiLength, thetaStart, thetaLength) - hemisphere, wedge
- [ ] `geo-cylinder.tsp` - Cylinder variants: tapered, open-ended, partial theta, hexagonal prism
- [ ] `geo-cone.tsp` - Cone variants: pyramid (radialSegments=4), open-ended, partial
- [ ] `geo-torus.tsp` - Torus variants: C-shape (arc < 2π), thick blob, square tube
- [ ] `geo-plane.tsp` - Plane with subdivisions
- [ ] `geo-capsule.tsp` - Capsule with custom segments
- [ ] `geo-circle.tsp` - Circle variants: hexagon, pac-man (partial theta)
- [ ] `geo-ring.tsp` - Ring variants: arc segment, thin halo
- [ ] `geo-platonic.tsp` - All 4 platonic solids: tetrahedron, octahedron, dodecahedron, icosahedron (with detail levels)
- [ ] `geo-torusknot.tsp` - TorusKnot with various p/q values (2,3), (3,5), (2,5)

### Complex Geometries (5 types)

- [ ] `geo-lathe.tsp` - Lathe with various profiles: vase, wine glass, chess piece
- [ ] `geo-extrude.tsp` - Extrude with bevel options: heart, star, text-like shape
- [ ] `geo-shape.tsp` - Flat 2D shapes: triangle, custom polygon, shape with holes
- [ ] `geo-tube.tsp` - Tube along curves: catmullRom, cubicBezier, quadraticBezier, line
- [ ] `geo-polyhedron.tsp` - Custom polyhedron with raw vertices/indices

---

## Material Tests

### Standard Material

- [ ] `mat-standard-basic.tsp` - color, metalness, roughness only
- [ ] `mat-standard-emissive.tsp` - emissive color + intensity
- [ ] `mat-standard-transparent.tsp` - opacity, transparent flag
- [ ] `mat-standard-sides.tsp` - front, back, double sided rendering

### Physical Material

- [ ] `mat-physical-clearcoat.tsp` - Car paint effect (clearcoat + clearcoatRoughness)
- [ ] `mat-physical-sheen.tsp` - Velvet/fabric (sheen, sheenRoughness, sheenColor)
- [ ] `mat-physical-transmission.tsp` - Glass (transmission, thickness, ior)
- [ ] `mat-physical-attenuation.tsp` - Colored glass (attenuationColor, attenuationDistance)
- [ ] `mat-physical-iridescence.tsp` - Soap bubble (iridescence, iridescenceIOR, iridescenceThicknessRange)
- [ ] `mat-physical-anisotropy.tsp` - Brushed metal (anisotropy, anisotropyRotation)
- [ ] `mat-physical-dispersion.tsp` - Prism effect (dispersion)
- [ ] `mat-physical-specular.tsp` - Specular channel (specularIntensity, specularColor, reflectivity)
- [ ] `mat-physical-combined.tsp` - Diamond: transmission + ior + dispersion

### Shader Material

- [ ] `mat-shader-basic.tsp` - Simple color uniform
- [ ] `mat-shader-animated.tsp` - Time-based animation (time uniform with animated: true)
- [ ] `mat-shader-uniforms.tsp` - All uniform types: float, int, bool, color, vec2, vec3, vec4, mat3, mat4
- [ ] `mat-shader-blending.tsp` - All blend modes: normal, additive, subtractive, multiply
- [ ] `mat-shader-depth.tsp` - depthWrite, depthTest combinations

---

## Animation Tests

### Basic Animations

- [ ] `anim-position.tsp` - Position keyframes with linear interpolation
- [ ] `anim-scale.tsp` - Scale keyframes with smooth interpolation
- [ ] `anim-quaternion.tsp` - Rotation via quaternion (90°, 180°, 360° rotations)
- [ ] `anim-visible.tsp` - Visibility toggle with discrete interpolation

### Interpolation Modes

- [ ] `anim-interp-linear.tsp` - Linear interpolation (constant speed)
- [ ] `anim-interp-smooth.tsp` - Smooth/spline interpolation (ease in/out)
- [ ] `anim-interp-discrete.tsp` - Step interpolation (instant jumps)

### Complex Animations

- [ ] `anim-multi-track.tsp` - Multiple tracks on same object (position + rotation)
- [ ] `anim-multi-object.tsp` - Same clip animating multiple objects
- [ ] `anim-multi-clip.tsp` - Multiple animation clips in one file
- [ ] `anim-hierarchy.tsp` - Animated parent with static children (transform inheritance)
- [ ] `anim-long-duration.tsp` - Long animation (60+ seconds, many keyframes)

---

## Structure Tests

### Object Hierarchy

- [ ] `struct-flat.tsp` - All objects at root level (no parenting)
- [ ] `struct-deep.tsp` - Deep hierarchy (5+ levels of nesting)
- [ ] `struct-wide.tsp` - Wide hierarchy (parent with 20+ children)
- [ ] `struct-groups.tsp` - Group objects as transform containers
- [ ] `struct-mixed.tsp` - Mix of groups and meshes in hierarchy

### Reference Integrity

- [ ] `struct-material-shared.tsp` - Multiple objects sharing same material key
- [ ] `struct-geometry-shared.tsp` - Multiple objects sharing same geometry key
- [ ] `struct-material-unique.tsp` - Each object has unique material

### Metadata

- [ ] `meta-minimal.tsp` - Only required metadata fields
- [ ] `meta-full.tsp` - All metadata fields including optional (author, copyright, title, description, prerelease)

---

## Validation Tests (Expected to Fail)

### Invalid Files

- [ ] `invalid-json.tsp` - Malformed JSON
- [ ] `invalid-missing-metadata.tsp` - Missing required metadata
- [ ] `invalid-missing-version.tsp` - Missing version field
- [ ] `invalid-bad-uuid.tsp` - Invalid UUID format in object id
- [ ] `invalid-orphan-parent.tsp` - Parent references non-existent object
- [ ] `invalid-cycle.tsp` - Circular parent reference (A → B → A)
- [ ] `invalid-missing-geometry.tsp` - Non-group object without geometry
- [ ] `invalid-missing-material.tsp` - Non-group object without material
- [ ] `invalid-bad-material-ref.tsp` - Material key not in materials dictionary
- [ ] `invalid-bad-geometry-ref.tsp` - Geometry key not in geometries dictionary
- [ ] `invalid-group-with-geometry.tsp` - Group object with geometry property
- [ ] `invalid-root-with-parent.tsp` - Object in roots array has non-null parent
- [ ] `invalid-anim-bad-target.tsp` - Animation track targets non-existent object
- [ ] `invalid-anim-times.tsp` - Animation times not strictly increasing
- [ ] `invalid-anim-values-length.tsp` - Animation values length doesn't match times × components

---

## Benchmark Tests

### Performance / Stress

- [ ] `bench-1k-objects.tsp` - 1,000 objects (mixed types)
- [ ] `bench-10k-objects.tsp` - 10,000 objects
- [ ] `bench-100-materials.tsp` - 100 unique materials
- [ ] `bench-complex-geometry.tsp` - High-segment geometries (sphere with 128×128)
- [ ] `bench-large-animation.tsp` - Animation with 1,000+ keyframes
- [ ] `bench-many-clips.tsp` - 50+ animation clips

---

## Round-Trip Tests

Files to test export → import → export consistency:

- [ ] `roundtrip-simple.tsp` - Basic scene, verify lossless round-trip
- [ ] `roundtrip-complex.tsp` - Complex scene with all features
- [ ] `roundtrip-shaders.tsp` - Shader materials preserved correctly
- [ ] `roundtrip-animations.tsp` - Animations with UUID ↔ name conversion

---

## Example Scenes (Showcase)

- [ ] `example-robot.tsp` - Simple robot from spec appendix
- [ ] `example-chess-piece.tsp` - Lathe geometry showcase
- [ ] `example-glass-objects.tsp` - Physical material transmission showcase
- [ ] `example-animated-character.tsp` - Animated hierarchy showcase
- [ ] `example-procedural-city.tsp` - Many objects, shared geometries/materials

---

## Test File Location

```
tests/
└── tsp-compliance/
    ├── geometry/
    ├── materials/
    ├── animations/
    ├── structure/
    ├── validation/
    ├── benchmark/
    ├── roundtrip/
    └── examples/
```

## Running Tests

```bash
# Validate all test files
npm run test:tsp-compliance

# Validate specific category
npm run test:tsp-compliance -- --category=geometry

# Generate benchmark report
npm run test:tsp-benchmark
```
