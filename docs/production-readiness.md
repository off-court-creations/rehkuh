# Production Readiness Checklist

Status: **In Progress**
Last reviewed: 2026-01-13

---

## Critical Issues

### 2. Silent Auto-Save Failures

**File:** `src/store/sceneStore.ts:432`

```typescript
.catch(() => {})  // Silently swallows all errors
```

**Problem:** Network failures during auto-save are silently ignored. Users could lose work without any notification.

**Fix:** Add proper error handling with user notification via `showError()`.

---

## High Priority Issues

### 3. Unvalidated Fetch Responses

**Files:**
- `src/store/sceneStore.ts:205-215` (shader fetches)
- `src/store/sceneStore.ts:450-451` (scene file fetch)

```typescript
const res = await fetch(`/__shader/${shaderName}`);
return await res.json();  // Could fail if res.ok is false
```

**Problem:** Fetch responses don't validate status before parsing JSON. A 404 or 500 response will throw an unhandled error during JSON parse.

**Fix:** Add `if (!res.ok)` checks before calling `res.json()`.

---

### 4. Bundle Size Warning

**Size:** Editor chunk is 1,164 kB minified (304 kB gzipped)

**Problem:** Exceeds Vite's recommended 500 kB threshold. Causes slower initial load times, especially on mobile or slow connections.

**Recommendations:**
- Lazy-load Three.js and R3F components
- Code-split the editor from the viewport
- Dynamic import Zod validation schemas

---

## Medium Priority Issues

### 5. Console Warnings Instead of User Notifications

**File:** `src/store/sceneStore.ts:694-696`

```typescript
} catch (err) {
  console.warn(`Failed to write shader ${shader.name}:`, err);
}
```

**Problem:** TSP shader import failures only log to console. Production users won't see these warnings.

**Fix:** Replace `console.warn` with `showError()` for user-facing error notification.

---

### 6. Window Type Assertions

**File:** `src/components/editor/EditorToolbar.tsx:164,248`

```typescript
window as unknown as { showDirectoryPicker?: ... }
```

**Problem:** Double type assertion through `unknown` bypasses TypeScript safety. Makes it harder to detect if the actual browser API changes.

**Better approach:** Create proper type definitions or use optional chaining with feature detection.

---

## What's Production-Ready

- TypeScript strict mode enabled
- Zod schema validation for all scene files
- ESLint + Prettier passing
- No exposed secrets in codebase
- No TODOs/FIXMEs remaining
- File watcher race conditions handled (chokidar `awaitWriteFinish`)
- Proper error boundaries with notification system
- Amplify deployment config present and correct

---

## Pre-Deployment Checklist

- [x] Fix hardcoded path in PropertyPanel.tsx
- [x] Add error handling to auto-save fetch
- [ ] Add `.ok` checks to all fetch calls
- [ ] Replace `console.warn` with `showError()` in TSP import
- [ ] Evaluate bundle size optimization strategy
- [ ] Test error scenarios: network failures, missing files, invalid JSON
- [ ] Run integration tests with slow/failing network conditions
