import type { Plugin, ViteDevServer } from "vite";
import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
  copyFileSync,
} from "fs";
import { join, dirname, basename, extname } from "path";
import chokidar from "chokidar";
import { createHash } from "crypto";
import { validateSceneFile, validateParentReferences } from "./src/schemas/scene";

const SCENE_DIR = join(process.cwd(), "scene");
const SCENE_PATH = join(SCENE_DIR, "scene.json");
const STAGING_PATH = join(SCENE_DIR, "staging-scene.json");
const BACKUP_PATH = join(SCENE_DIR, "scene.backup.json");
const WARNING_PATH = join(SCENE_DIR, "UNAUTHORIZED_EDIT_REVERTED.md");
const SHADERS_DIR = join(process.cwd(), "shaders");

const WARNING_CONTENT = `# ⚠️ UNAUTHORIZED EDIT DETECTED AND REVERTED

**DO NOT EDIT \`scene.json\` DIRECTLY!**

Your edit to \`scene.json\` was automatically reverted because direct edits are not allowed.

## Correct Workflow

1. **Edit \`staging-scene.json\`** (not \`scene.json\`)
2. **Validate and promote** by running:
   \`\`\`bash
   npm run promote-staging
   # or
   curl -X POST http://localhost:5173/__promote-staging
   \`\`\`

## Why?

- \`scene.json\` is the **live scene** that the viewport renders
- Direct edits bypass validation and can corrupt the scene
- The staging workflow ensures your changes are validated before going live
- UI changes (drag/rotate/recolor) go through the API and are allowed

## Files

| File | Purpose | Who edits it |
|------|---------|--------------|
| \`staging-scene.json\` | Your working copy | YOU (AI or human) |
| \`scene.json\` | Live scene | API/UI only |
| \`scene.backup.json\` | Auto-backup | System only |

This file was created at: __TIMESTAMP__
`;


// Simple hash function to compare content
const hashContent = (content: string): string => {
  return createHash("md5").update(content).digest("hex");
};

export function sceneSyncPlugin(): Plugin {
  let server: ViteDevServer | null = null;

  // Track content we've written to ignore our own saves
  let lastWrittenHash: string | null = null;
  let ignoreNextChange = false;

  return {
    name: "scene-sync",
    configureServer(srv) {
      server = srv;

      // Ensure scene directory exists
      const sceneDir = dirname(SCENE_PATH);
      if (!existsSync(sceneDir)) {
        mkdirSync(sceneDir, { recursive: true });
      }

      // Initialize lastWrittenHash from current file and ensure backup exists
      try {
        const currentContent = readFileSync(SCENE_PATH, "utf-8");
        lastWrittenHash = hashContent(currentContent);

        // Create initial backup if none exists (so we can revert unauthorized edits)
        if (!existsSync(BACKUP_PATH)) {
          copyFileSync(SCENE_PATH, BACKUP_PATH);
          console.log("[scene-sync] Created initial backup of scene.json");
        }
      } catch {
        lastWrittenHash = null;
      }

      // Use chokidar for reliable cross-platform file watching
      const watcher = chokidar.watch(SCENE_PATH, {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 100,
          pollInterval: 50,
        },
      });

      watcher.on("change", () => {
        // Skip if we're ignoring this change (our own write)
        if (ignoreNextChange) {
          ignoreNextChange = false;
          console.log("[scene-sync] Ignoring self-triggered change");
          return;
        }

        try {
          const newContent = readFileSync(SCENE_PATH, "utf-8");
          const newHash = hashContent(newContent);

          // If content changed and it wasn't us, REVERT the change
          if (newHash !== lastWrittenHash) {
            console.warn(
              "\x1b[31m[scene-sync] UNAUTHORIZED EDIT DETECTED!\x1b[0m Direct edits to scene.json are not allowed."
            );
            console.warn(
              "[scene-sync] Use staging-scene.json + promote-staging workflow instead."
            );

            // Write warning file for AI agents to see
            const warningWithTimestamp = WARNING_CONTENT.replace(
              "__TIMESTAMP__",
              new Date().toISOString()
            );
            writeFileSync(WARNING_PATH, warningWithTimestamp, "utf-8");
            console.warn(
              "[scene-sync] Created UNAUTHORIZED_EDIT_REVERTED.md - READ THIS FILE!"
            );

            // Restore from backup if available
            if (existsSync(BACKUP_PATH)) {
              try {
                const backupContent = readFileSync(BACKUP_PATH, "utf-8");
                ignoreNextChange = true;
                writeFileSync(SCENE_PATH, backupContent, "utf-8");
                lastWrittenHash = hashContent(backupContent);
                console.log(
                  "[scene-sync] Reverted to backup. Edit staging-scene.json instead."
                );
              } catch (restoreErr) {
                console.error("[scene-sync] Failed to restore backup:", restoreErr);
              }
            } else {
              // No backup - restore to what we last knew
              console.warn(
                "[scene-sync] No backup available, change persists but clients not notified."
              );
            }
          }
        } catch (err) {
          console.error("[scene-sync] Error reading file:", err);
        }
      });

      watcher.on("add", () => {
        console.log("[scene-sync] Scene file created");
        if (server) {
          server.ws.send({
            type: "custom",
            event: "scene-changed",
          });
        }
      });

      // Ensure shaders directory exists
      if (!existsSync(SHADERS_DIR)) {
        mkdirSync(SHADERS_DIR, { recursive: true });
      }

      // Watch shaders directory for .vert and .frag files
      const shaderWatcher = chokidar.watch(
        [join(SHADERS_DIR, "*.vert"), join(SHADERS_DIR, "*.frag")],
        {
          persistent: true,
          ignoreInitial: true,
          awaitWriteFinish: {
            stabilityThreshold: 100,
            pollInterval: 50,
          },
        }
      );

      shaderWatcher.on("change", (filePath) => {
        const fileName = basename(filePath);
        const shaderName = fileName.replace(/\.(vert|frag)$/, "");
        const shaderType = extname(filePath).slice(1) as "vert" | "frag";

        console.log(`[scene-sync] Shader changed: ${shaderName}.${shaderType}`);

        try {
          const content = readFileSync(filePath, "utf-8");
          if (server) {
            server.ws.send({
              type: "custom",
              event: "shader-changed",
              data: {
                shaderName,
                shaderType,
                content,
              },
            });
          }
        } catch (err) {
          console.error("[scene-sync] Error reading shader file:", err);
        }
      });

      shaderWatcher.on("add", (filePath) => {
        const fileName = basename(filePath);
        const shaderName = fileName.replace(/\.(vert|frag)$/, "");
        const shaderType = extname(filePath).slice(1) as "vert" | "frag";

        console.log(`[scene-sync] Shader added: ${shaderName}.${shaderType}`);

        try {
          const content = readFileSync(filePath, "utf-8");
          if (server) {
            server.ws.send({
              type: "custom",
              event: "shader-changed",
              data: {
                shaderName,
                shaderType,
                content,
              },
            });
          }
        } catch (err) {
          console.error("[scene-sync] Error reading shader file:", err);
        }
      });

      // Cleanup on server close
      srv.httpServer?.on("close", () => {
        watcher.close();
        shaderWatcher.close();
      });

      // API endpoints
      srv.middlewares.use("/__scene", (req, res) => {
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk: string) => (body += chunk));
          req.on("end", () => {
            try {
              // Calculate hash and mark to ignore the next file change
              const newHash = hashContent(body);
              lastWrittenHash = newHash;
              ignoreNextChange = true;

              writeFileSync(SCENE_PATH, body, "utf-8");
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ ok: true }));
            } catch (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
        } else if (req.method === "GET") {
          try {
            const data = readFileSync(SCENE_PATH, "utf-8");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(data);
          } catch {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end("[]");
          }
        } else {
          res.writeHead(405);
          res.end();
        }
      });

      // Reset all scene json files (scene.json, staging-scene.json, scene.backup.json)
      // POST /__reset-scene-files
      srv.middlewares.use("/__reset-scene-files", (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405);
          res.end();
          return;
        }

        try {
          const emptyScene = "[]";
          const newHash = hashContent(emptyScene);
          lastWrittenHash = newHash;
          ignoreNextChange = true;

          writeFileSync(SCENE_PATH, emptyScene, "utf-8");
          writeFileSync(STAGING_PATH, emptyScene, "utf-8");
          writeFileSync(BACKUP_PATH, emptyScene, "utf-8");

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true }));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: String(err) }));
        }
      });

      // Shader API endpoint - GET /__shader/:shaderName returns { vert, frag }
      srv.middlewares.use("/__shader", (req, res) => {
        if (req.method !== "GET") {
          res.writeHead(405);
          res.end();
          return;
        }

        // Extract shader name from URL (e.g., /__shader/terrain -> terrain)
        const url = new URL(req.url || "", "http://localhost");
        const shaderName = url.pathname.slice(1); // Remove leading /

        if (!shaderName) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Shader name required" }));
          return;
        }

        const vertPath = join(SHADERS_DIR, `${shaderName}.vert`);
        const fragPath = join(SHADERS_DIR, `${shaderName}.frag`);

        let vert = "";
        let frag = "";

        try {
          if (existsSync(vertPath)) {
            vert = readFileSync(vertPath, "utf-8");
          }
        } catch {
          // Vertex shader doesn't exist or can't be read
        }

        try {
          if (existsSync(fragPath)) {
            frag = readFileSync(fragPath, "utf-8");
          }
        } catch {
          // Fragment shader doesn't exist or can't be read
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ vert, frag }));
      });

      // Create shader files from template - POST /__create-shader with { name }
      srv.middlewares.use("/__create-shader", (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405);
          res.end();
          return;
        }

        let body = "";
        req.on("data", (chunk: string) => (body += chunk));
        req.on("end", () => {
          try {
            const { name } = JSON.parse(body);

            if (!name) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Shader name required" }));
              return;
            }

            const vertPath = join(SHADERS_DIR, `${name}.vert`);
            const fragPath = join(SHADERS_DIR, `${name}.frag`);

            // Read template files
            const templateVertPath = join(SHADERS_DIR, "_template.vert");
            const templateFragPath = join(SHADERS_DIR, "_template.frag");

            // Create vert file if it doesn't exist
            if (!existsSync(vertPath)) {
              let vertContent = "// Vertex shader for " + name + "\n";
              if (existsSync(templateVertPath)) {
                vertContent = readFileSync(templateVertPath, "utf-8");
              } else {
                vertContent += `varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
              }
              writeFileSync(vertPath, vertContent, "utf-8");
              console.log(`[scene-sync] Created shader: ${name}.vert`);
            }

            // Create frag file if it doesn't exist
            if (!existsSync(fragPath)) {
              let fragContent = "// Fragment shader for " + name + "\n";
              if (existsSync(templateFragPath)) {
                fragContent = readFileSync(templateFragPath, "utf-8");
              } else {
                fragContent += `uniform vec3 baseColor;

varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  gl_FragColor = vec4(baseColor, 1.0);
}
`;
              }
              writeFileSync(fragPath, fragContent, "utf-8");
              console.log(`[scene-sync] Created shader: ${name}.frag`);
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true }));
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      });

      // Shader write API endpoint - POST /__shader/:shaderName with { vert, frag }
      srv.middlewares.use("/__shader-write", (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405);
          res.end();
          return;
        }

        const url = new URL(req.url || "", "http://localhost");
        const shaderName = url.pathname.slice(1);

        if (!shaderName) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Shader name required" }));
          return;
        }

        let body = "";
        req.on("data", (chunk: string) => (body += chunk));
        req.on("end", () => {
          try {
            const { vert, frag } = JSON.parse(body);

            if (vert !== undefined) {
              const vertPath = join(SHADERS_DIR, `${shaderName}.vert`);
              writeFileSync(vertPath, vert, "utf-8");
            }

            if (frag !== undefined) {
              const fragPath = join(SHADERS_DIR, `${shaderName}.frag`);
              writeFileSync(fragPath, frag, "utf-8");
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true }));
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      });

      // Promote staging to scene - POST /__promote-staging
      // Validates staging-scene.json and copies to scene.json if valid
      srv.middlewares.use("/__promote-staging", (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405);
          res.end();
          return;
        }

        try {
          // Check staging file exists
          if (!existsSync(STAGING_PATH)) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                ok: false,
                error: "Staging file not found. Create scene/staging-scene.json first.",
              })
            );
            return;
          }

          // Read and parse staging file
          const rawContent = readFileSync(STAGING_PATH, "utf-8");
          let data: unknown;
          try {
            data = JSON.parse(rawContent);
          } catch (parseErr) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                ok: false,
                error: `Invalid JSON: ${parseErr}`,
              })
            );
            return;
          }

          // Validate schema
          const validation = validateSceneFile(data);
          if (!validation.success) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                ok: false,
                error: `Schema validation failed: ${validation.error}`,
              })
            );
            return;
          }

          // Validate parent references
          const parentValidation = validateParentReferences(validation.data);
          if (!parentValidation.success) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                ok: false,
                error: `Parent validation failed: ${parentValidation.error}`,
              })
            );
            return;
          }

          // Backup current scene.json
          if (existsSync(SCENE_PATH)) {
            try {
              copyFileSync(SCENE_PATH, BACKUP_PATH);
            } catch {
              // Non-fatal, continue
            }
          }

          // Write validated content to scene.json
          const formattedContent = JSON.stringify(validation.data, null, 2);
          const newHash = hashContent(formattedContent);
          lastWrittenHash = newHash;
          ignoreNextChange = true;
          writeFileSync(SCENE_PATH, formattedContent, "utf-8");

          // Notify clients to reload the scene
          if (server) {
            server.ws.send({
              type: "custom",
              event: "scene-changed",
            });
          }

          console.log(
            `[scene-sync] Promoted ${validation.data.length} objects from staging`
          );

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              ok: true,
              message: `Promoted ${validation.data.length} objects from staging to scene`,
            })
          );
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: String(err) }));
        }
      });

      // Copy scene.json to staging-scene.json - POST /__copy-to-staging
      // Allows AIs to start from current live scene without reading it
      srv.middlewares.use("/__copy-to-staging", (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405);
          res.end();
          return;
        }

        try {
          if (!existsSync(SCENE_PATH)) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                ok: false,
                error: "No scene.json exists yet.",
              })
            );
            return;
          }

          const content = readFileSync(SCENE_PATH, "utf-8");
          writeFileSync(STAGING_PATH, content, "utf-8");

          // Count objects for feedback
          let objectCount = 0;
          try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) {
              objectCount = parsed.length;
            }
          } catch {
            // Non-fatal
          }

          console.log(
            `[scene-sync] Copied ${objectCount} objects from scene to staging`
          );

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              ok: true,
              message: `Copied ${objectCount} objects from scene.json to staging-scene.json`,
            })
          );
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: String(err) }));
        }
      });

      // Read staging scene - GET /__staging-scene
      srv.middlewares.use("/__staging-scene", (req, res) => {
        if (req.method === "GET") {
          try {
            if (existsSync(STAGING_PATH)) {
              const data = readFileSync(STAGING_PATH, "utf-8");
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(data);
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end("[]");
            }
          } catch {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end("[]");
          }
        } else if (req.method === "POST") {
          // Allow writing to staging scene
          let body = "";
          req.on("data", (chunk: string) => (body += chunk));
          req.on("end", () => {
            try {
              writeFileSync(STAGING_PATH, body, "utf-8");
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ ok: true }));
            } catch (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    },
  };
}
