# ⚠️ UNAUTHORIZED EDIT DETECTED AND REVERTED

**DO NOT EDIT `scene.json` DIRECTLY!**

Your edit to `scene.json` was automatically reverted because direct edits are not allowed.

## Correct Workflow

1. **Edit `staging-scene.json`** (not `scene.json`)
2. **Validate and promote** by running:
   ```bash
   npm run promote-staging
   # or
   curl -X POST http://localhost:5173/__promote-staging
   ```

## Why?

- `scene.json` is the **live scene** that the viewport renders
- Direct edits bypass validation and can corrupt the scene
- The staging workflow ensures your changes are validated before going live
- UI changes (drag/rotate/recolor) go through the API and are allowed

## Files

| File | Purpose | Who edits it |
|------|---------|--------------|
| `staging-scene.json` | Your working copy | YOU (AI or human) |
| `scene.json` | Live scene | API/UI only |
| `scene.backup.json` | Auto-backup | System only |

This file was created at: 2026-01-10T06:53:08.325Z
