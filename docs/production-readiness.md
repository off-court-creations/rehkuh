# Production Readiness Checklist

Status: **In Progress**

## Medium Priority Issues

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
- [x] Replace `console.warn` with `showError()` in TSP import
- [ ] Evaluate bundle size optimization strategy
- [ ] Test error scenarios: network failures, missing files, invalid JSON
- [ ] Run integration tests with slow/failing network conditions
