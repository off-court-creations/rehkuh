# Adding Geometry Parameters

When adding new parameters to a primitive geometry (like segments, angles, or other Three.js constructor args), you need to touch **9 files** in a specific order.

## Files Checklist

| # | File | What to add |
|---|------|-------------|
| 1 | `src/types.ts` | TypeScript interfaces (2 places) |
| 2 | `src/schemas/scene.ts` | Zod validation for scene files |
| 3 | `src/schemas/tsp.ts` | Zod validation for TSP export |
| 4 | `src/store/sceneStore.ts` | Load/save logic (3 places) |
| 5 | `src/components/editor/SceneObject.jsx` | Geometry creation + useMemo deps |
| 6 | `src/components/editor/PropertyPanel.tsx` | UI controls |
| 7 | `src/export/tspExporter.ts` | Export with custom params |
| 8 | `src/export/tspImporter.ts` | Import params from TSP |
| 9 | `docs/tsp-format.md` | Document new params in TSP spec |

## Step-by-Step

### 1. `src/types.ts`

Add to **two interfaces**:

```ts
// In SceneObject interface (~line 186)
export interface SceneObject {
  // ... existing fields ...
  // Sphere geometry params
  sphereWidthSegments?: number;
  sphereHeightSegments?: number;
}

// In TSPGeometry interface (~line 400)
export interface TSPGeometry {
  // ... existing fields ...
  // SphereGeometry params
  sphereWidthSegments?: number;
  sphereHeightSegments?: number;
}
```

### 2. `src/schemas/scene.ts`

Add Zod validation in `SceneFileObjectSchema`:

```ts
export const SceneFileObjectSchema = z.object({
  // ... existing fields ...
  // Sphere geometry params
  sphereWidthSegments: z.number().int().min(3).optional(),
  sphereHeightSegments: z.number().int().min(2).optional(),
});
```

### 3. `src/schemas/tsp.ts`

Add Zod validation in `TSPGeometrySchema`:

```ts
export const TSPGeometrySchema = z.object({
  // ... existing fields ...
  // SphereGeometry params
  sphereWidthSegments: z.number().int().min(3).optional(),
  sphereHeightSegments: z.number().int().min(2).optional(),
});
```

### 4. `src/store/sceneStore.ts`

Add to **three places**:

**a) `SceneFileObject` interface (~line 23):**
```ts
interface SceneFileObject {
  // ... existing fields ...
  sphereWidthSegments?: number;
  sphereHeightSegments?: number;
}
```

**b) `toSceneFileObjects()` function (~line 177):**
```ts
// Sphere geometry params
if (obj.sphereWidthSegments !== undefined)
  fileObj.sphereWidthSegments = obj.sphereWidthSegments;
if (obj.sphereHeightSegments !== undefined)
  fileObj.sphereHeightSegments = obj.sphereHeightSegments;
```

**c) `loadScene()` function (~line 330):**
```ts
// Sphere geometry params
if (fo.sphereWidthSegments !== undefined)
  sceneObject.sphereWidthSegments = fo.sphereWidthSegments;
if (fo.sphereHeightSegments !== undefined)
  sceneObject.sphereHeightSegments = fo.sphereHeightSegments;
```

### 5. `src/components/editor/SceneObject.jsx`

**a) Update geometry creation in the switch statement:**
```jsx
case "sphere":
  return new THREE.SphereGeometry(
    0.5,
    obj.sphereWidthSegments ?? 32,
    obj.sphereHeightSegments ?? 32,
  );
```

**b) Add to useMemo dependency array:**
```jsx
}, [
  obj?.type,
  // ... existing deps ...
  obj?.sphereWidthSegments,
  obj?.sphereHeightSegments,
  // ... rest of deps ...
]);
```

### 6. `src/components/editor/PropertyPanel.tsx`

Add UI controls (follow existing pattern for box/tube):

```tsx
{obj.type === "sphere" && (
  <>
    <Typography variant="body" sx={{ fontSize: "10px", opacity: 0.5, ... }}>
      Geometry
    </Typography>

    <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
      <Typography variant="body" sx={{ fontSize: "11px", ... }}>
        Width Segments
      </Typography>
      <input
        type="number"
        min="3"
        max="128"
        step="1"
        value={obj.sphereWidthSegments ?? 32}
        onChange={(e) => {
          const val = Math.max(3, parseInt(e.target.value) || 32);
          updateObject(primaryId, { sphereWidthSegments: val });
        }}
        style={{ width: "60px", height: "20px", ... }}
      />
    </Stack>
    {/* Repeat for other params */}
  </>
)}
```

### 7. `src/export/tspExporter.ts`

**a) Add check for custom params:**
```ts
const hasCustomSphereParams =
  obj.type === "sphere" &&
  (obj.sphereWidthSegments !== undefined ||
    obj.sphereHeightSegments !== undefined);
```

**b) Add else-if block to create unique geometry:**
```ts
} else if (hasCustomSphereParams) {
  const geoKey = `sphere_${obj.id.slice(0, 8)}`;
  const geo: TSPGeometry = { type: "sphere", args: [0.5, 32, 32] };

  if (obj.sphereWidthSegments !== undefined)
    geo.sphereWidthSegments = obj.sphereWidthSegments;
  if (obj.sphereHeightSegments !== undefined)
    geo.sphereHeightSegments = obj.sphereHeightSegments;

  geometries[geoKey] = geo;
  geometryKeyMap.set(obj.id, geoKey);
}
```

### 8. `src/export/tspImporter.ts`

Add import handling in the geometry data section:

```ts
// Sphere geometry params
if (geo.sphereWidthSegments !== undefined)
  sceneObj.sphereWidthSegments = geo.sphereWidthSegments;
if (geo.sphereHeightSegments !== undefined)
  sceneObj.sphereHeightSegments = geo.sphereHeightSegments;
```

## Verification

After all changes:

```bash
npm run typecheck   # TypeScript passes
npm run lint        # ESLint clean
npm run build       # Build succeeds
```

### 9. `docs/tsp-format.md`

Add a new section under "#### Geometries" for your geometry type options:

```markdown
#### SphereGeometry Options

Spheres support subdivision segments and partial sphere angles:

\`\`\`json
{
  "type": "sphere",
  "args": [0.5, 32, 32],
  "sphereWidthSegments": 16,
  "sphereHeightSegments": 12
}
\`\`\`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `sphereWidthSegments` | number? | 32 | Horizontal segments |
| `sphereHeightSegments` | number? | 32 | Vertical segments |
```

Include:
- JSON example showing the new fields
- Table of all fields with types, defaults, and descriptions
- Use cases section if the params enable interesting shapes

## Optional: Update Scene Format Docs

If the param is user-facing for the JSON scene format (not just TSP export), also update `docs/json-scene-format.md` with the new fields.
