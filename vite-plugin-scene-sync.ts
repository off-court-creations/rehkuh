import type { Plugin, ViteDevServer } from "vite";
import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  readdirSync,
  unlinkSync,
} from "fs";
import { join, dirname, basename, extname } from "path";
import chokidar from "chokidar";
import { createHash } from "crypto";
import { validateSceneFile, validateParentReferences, validateAnimationTargets } from "./src/schemas/scene";

const SCENE_DIR = join(process.cwd(), "scene");
const SCENE_PATH = join(SCENE_DIR, "scene.json");
const STAGING_PATH = join(SCENE_DIR, "staging-scene.json");
const BACKUP_PATH = join(SCENE_DIR, "scene.backup.json");
const WARNING_PATH = join(SCENE_DIR, "UNAUTHORIZED_EDIT_REVERTED.md");
const SHADERS_DIR = join(process.cwd(), "shaders");
const STAGING_SHADERS_DIR = join(SHADERS_DIR, "staging");
const SHADER_WARNING_PATH = join(SHADERS_DIR, "UNAUTHORIZED_EDIT_REVERTED.md");

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

const SHADER_WARNING_CONTENT = `# ⚠️ UNAUTHORIZED SHADER EDIT DETECTED AND REVERTED

**DO NOT EDIT live shader files directly!**

Your edit to a shader file in \`shaders/\` was automatically reverted because direct edits are not allowed.

## Correct Workflow

1. **Edit shaders in \`shaders/staging/\`** (not directly in \`shaders/\`)
2. **Reference the shader** in \`scene/staging-scene.json\` with \`"shaderName": "yourShader"\`
3. **Promote** by running:
   \`\`\`bash
   npm run promote-staging
   \`\`\`

## Why?

- Shader files in \`shaders/\` are **live** - used by the viewport
- Direct edits bypass validation and can break rendering
- The staging workflow ensures shaders are validated before going live

## Directory Structure

| Directory | Purpose | Who edits it |
|-----------|---------|--------------|
| \`shaders/staging/\` | Your working shaders | YOU (AI or human) |
| \`shaders/\` | Live shaders | Promote only |
| \`shaders/_template.*\` | Templates | Reference only |

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

  // Track live shader content hashes to detect unauthorized edits
  const liveShaderHashes = new Map<string, string>();
  const ignoreNextShaderChange = new Set<string>();

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

      // Ensure shaders directories exist
      if (!existsSync(SHADERS_DIR)) {
        mkdirSync(SHADERS_DIR, { recursive: true });
      }
      if (!existsSync(STAGING_SHADERS_DIR)) {
        mkdirSync(STAGING_SHADERS_DIR, { recursive: true });
      }

      // Initialize hashes for existing live shader files (excluding templates)
      try {
        const files = readdirSync(SHADERS_DIR);
        for (const file of files) {
          if (file.startsWith("_")) continue; // Skip templates
          if (!file.endsWith(".vert") && !file.endsWith(".frag")) continue;
          const filePath = join(SHADERS_DIR, file);
          try {
            const content = readFileSync(filePath, "utf-8");
            liveShaderHashes.set(file, hashContent(content));
          } catch {
            // File might not exist or be readable
          }
        }
        if (liveShaderHashes.size > 0) {
          console.log(
            `[scene-sync] Initialized ${liveShaderHashes.size} live shader hashes`
          );
        }
      } catch {
        // Directory might not exist yet
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

        // Allow template edits without blocking
        if (fileName.startsWith("_")) {
          console.log(`[scene-sync] Template shader changed: ${fileName}`);
          return;
        }

        // Check if this is an authorized change (from promote)
        if (ignoreNextShaderChange.has(fileName)) {
          ignoreNextShaderChange.delete(fileName);
          console.log(`[scene-sync] Shader promoted: ${fileName}`);

          // Update hash and notify clients
          try {
            const content = readFileSync(filePath, "utf-8");
            liveShaderHashes.set(fileName, hashContent(content));
            if (server) {
              server.ws.send({
                type: "custom",
                event: "shader-changed",
                data: { shaderName, shaderType, content },
              });
            }
          } catch (err) {
            console.error("[scene-sync] Error reading shader file:", err);
          }
          return;
        }

        // Unauthorized edit detected - revert it
        const storedHash = liveShaderHashes.get(fileName);
        if (storedHash) {
          try {
            const newContent = readFileSync(filePath, "utf-8");
            const newHash = hashContent(newContent);

            if (newHash !== storedHash) {
              console.warn(
                `\x1b[31m[scene-sync] UNAUTHORIZED SHADER EDIT DETECTED!\x1b[0m ${fileName}`
              );
              console.warn(
                "[scene-sync] Use shaders/staging/ + promote-staging workflow instead."
              );

              // Write warning file
              const warningWithTimestamp = SHADER_WARNING_CONTENT.replace(
                "__TIMESTAMP__",
                new Date().toISOString()
              );
              writeFileSync(SHADER_WARNING_PATH, warningWithTimestamp, "utf-8");
              console.warn(
                "[scene-sync] Created shaders/UNAUTHORIZED_EDIT_REVERTED.md - READ THIS FILE!"
              );

              // Find the staged version or use template to revert
              const stagingPath = join(STAGING_SHADERS_DIR, fileName);
              if (existsSync(stagingPath)) {
                const stagingContent = readFileSync(stagingPath, "utf-8");
                ignoreNextShaderChange.add(fileName);
                writeFileSync(filePath, stagingContent, "utf-8");
                liveShaderHashes.set(fileName, hashContent(stagingContent));
                console.log(`[scene-sync] Reverted ${fileName} to staging version.`);
              } else {
                // No staging version - just prevent the notification
                console.warn(
                  `[scene-sync] No staging version to revert to. Manual fix required.`
                );
              }
            }
          } catch (err) {
            console.error("[scene-sync] Error handling shader change:", err);
          }
        } else {
          // New file added directly - block it
          console.warn(
            `\x1b[31m[scene-sync] UNAUTHORIZED SHADER ADDED!\x1b[0m ${fileName}`
          );
          console.warn(
            "[scene-sync] Add shaders via shaders/staging/ + promote-staging workflow."
          );

          // Write warning file
          const warningWithTimestamp = SHADER_WARNING_CONTENT.replace(
            "__TIMESTAMP__",
            new Date().toISOString()
          );
          writeFileSync(SHADER_WARNING_PATH, warningWithTimestamp, "utf-8");

          // Delete the unauthorized file
          try {
            unlinkSync(filePath);
            console.log(`[scene-sync] Removed unauthorized shader: ${fileName}`);
          } catch (err) {
            console.error("[scene-sync] Failed to remove unauthorized shader:", err);
          }
        }
      });

      shaderWatcher.on("add", (filePath) => {
        const fileName = basename(filePath);
        const shaderName = fileName.replace(/\.(vert|frag)$/, "");
        const shaderType = extname(filePath).slice(1) as "vert" | "frag";

        // Allow templates
        if (fileName.startsWith("_")) {
          console.log(`[scene-sync] Template shader added: ${fileName}`);
          return;
        }

        // Check if this is an authorized add (from promote)
        if (ignoreNextShaderChange.has(fileName)) {
          ignoreNextShaderChange.delete(fileName);
          console.log(`[scene-sync] Shader promoted (new): ${fileName}`);

          try {
            const content = readFileSync(filePath, "utf-8");
            liveShaderHashes.set(fileName, hashContent(content));
            if (server) {
              server.ws.send({
                type: "custom",
                event: "shader-changed",
                data: { shaderName, shaderType, content },
              });
            }
          } catch (err) {
            console.error("[scene-sync] Error reading shader file:", err);
          }
          return;
        }

        // Unauthorized add - delete it
        console.warn(
          `\x1b[31m[scene-sync] UNAUTHORIZED SHADER ADDED!\x1b[0m ${fileName}`
        );
        console.warn(
          "[scene-sync] Add shaders via shaders/staging/ + promote-staging workflow."
        );

        const warningWithTimestamp = SHADER_WARNING_CONTENT.replace(
          "__TIMESTAMP__",
          new Date().toISOString()
        );
        writeFileSync(SHADER_WARNING_PATH, warningWithTimestamp, "utf-8");

        try {
          unlinkSync(filePath);
          console.log(`[scene-sync] Removed unauthorized shader: ${fileName}`);
        } catch (err) {
          console.error("[scene-sync] Failed to remove unauthorized shader:", err);
        }
      });

      // Watch staging shaders directory for .vert and .frag files
      // These are edited by AI and promoted to production shaders
      const stagingShaderWatcher = chokidar.watch(
        [join(STAGING_SHADERS_DIR, "*.vert"), join(STAGING_SHADERS_DIR, "*.frag")],
        {
          persistent: true,
          ignoreInitial: true,
          awaitWriteFinish: {
            stabilityThreshold: 100,
            pollInterval: 50,
          },
        }
      );

      stagingShaderWatcher.on("change", (filePath) => {
        const fileName = basename(filePath);
        const shaderName = fileName.replace(/\.(vert|frag)$/, "");
        const shaderType = extname(filePath).slice(1) as "vert" | "frag";

        console.log(`[scene-sync] Staging shader changed: ${shaderName}.${shaderType}`);

        try {
          const content = readFileSync(filePath, "utf-8");
          if (server) {
            server.ws.send({
              type: "custom",
              event: "staging-shader-changed",
              data: {
                shaderName,
                shaderType,
                content,
              },
            });
          }
        } catch (err) {
          console.error("[scene-sync] Error reading staging shader file:", err);
        }
      });

      stagingShaderWatcher.on("add", (filePath) => {
        const fileName = basename(filePath);
        const shaderName = fileName.replace(/\.(vert|frag)$/, "");
        const shaderType = extname(filePath).slice(1) as "vert" | "frag";

        console.log(`[scene-sync] Staging shader added: ${shaderName}.${shaderType}`);

        try {
          const content = readFileSync(filePath, "utf-8");
          if (server) {
            server.ws.send({
              type: "custom",
              event: "staging-shader-changed",
              data: {
                shaderName,
                shaderType,
                content,
              },
            });
          }
        } catch (err) {
          console.error("[scene-sync] Error reading staging shader file:", err);
        }
      });

      // Cleanup on server close
      srv.httpServer?.on("close", () => {
        watcher.close();
        shaderWatcher.close();
        stagingShaderWatcher.close();
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
            res.end(JSON.stringify({ objects: [] }));
          }
        } else {
          res.writeHead(405);
          res.end();
        }
      });

      // Reset all scene json files and shader files
      // POST /__reset-scene-files
      srv.middlewares.use("/__reset-scene-files", (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405);
          res.end();
          return;
        }

        try {
          const emptyScene = JSON.stringify({ objects: [] }, null, 2);
          const newHash = hashContent(emptyScene);
          lastWrittenHash = newHash;
          ignoreNextChange = true;

          writeFileSync(SCENE_PATH, emptyScene, "utf-8");
          writeFileSync(STAGING_PATH, emptyScene, "utf-8");
          writeFileSync(BACKUP_PATH, emptyScene, "utf-8");

          // Clear shader files (except templates)
          const clearShaderDir = (dir: string) => {
            if (!existsSync(dir)) return;
            const files = readdirSync(dir);
            for (const file of files) {
              // Keep template files
              if (file.startsWith("_template")) continue;
              // Only delete .vert and .frag files
              if (file.endsWith(".vert") || file.endsWith(".frag")) {
                try {
                  unlinkSync(join(dir, file));
                } catch {
                  // Ignore errors for individual files
                }
              }
            }
          };

          clearShaderDir(SHADERS_DIR);
          clearShaderDir(STAGING_SHADERS_DIR);

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

      // Staging Shader API endpoint - GET /__staging-shader/:shaderName returns { vert, frag }
      // For AI preview - reads from shaders/staging/ instead of shaders/
      srv.middlewares.use("/__staging-shader", (req, res) => {
        if (req.method !== "GET") {
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

        const vertPath = join(STAGING_SHADERS_DIR, `${shaderName}.vert`);
        const fragPath = join(STAGING_SHADERS_DIR, `${shaderName}.frag`);

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

      // Create shader files from template in staging - POST /__create-shader with { name }
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

            // Create in staging directory
            const vertPath = join(STAGING_SHADERS_DIR, `${name}.vert`);
            const fragPath = join(STAGING_SHADERS_DIR, `${name}.frag`);

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
              console.log(`[scene-sync] Created staging shader: ${name}.vert`);
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
              console.log(`[scene-sync] Created staging shader: ${name}.frag`);
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
              // Mark as authorized before writing
              ignoreNextShaderChange.add(`${shaderName}.vert`);
              const vertPath = join(SHADERS_DIR, `${shaderName}.vert`);
              writeFileSync(vertPath, vert, "utf-8");
            }

            if (frag !== undefined) {
              // Mark as authorized before writing
              ignoreNextShaderChange.add(`${shaderName}.frag`);
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

      // Staging shader write API endpoint - POST /__staging-shader-write/:shaderName with { vert, frag }
      // For AI to write shader files to shaders/staging/
      srv.middlewares.use("/__staging-shader-write", (req, res) => {
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
              const vertPath = join(STAGING_SHADERS_DIR, `${shaderName}.vert`);
              writeFileSync(vertPath, vert, "utf-8");
              console.log(`[scene-sync] Wrote staging shader: ${shaderName}.vert`);
            }

            if (frag !== undefined) {
              const fragPath = join(STAGING_SHADERS_DIR, `${shaderName}.frag`);
              writeFileSync(fragPath, frag, "utf-8");
              console.log(`[scene-sync] Wrote staging shader: ${shaderName}.frag`);
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
          const parentValidation = validateParentReferences(validation.data.objects);
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

          // Validate animation targets
          const animationValidation = validateAnimationTargets(
            validation.data.objects,
            validation.data.animations
          );
          if (!animationValidation.success) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                ok: false,
                error: `Animation validation failed: ${animationValidation.error}`,
              })
            );
            return;
          }

          // Validate and collect shader materials that reference external files
          const shaderNames = new Set<string>();
          for (const obj of validation.data.objects) {
            const mat = obj.material;
            if (mat && mat.type === "shader" && mat.shaderName) {
              shaderNames.add(mat.shaderName);
            }
          }

          // Check that all referenced staging shaders exist
          const missingShaders: string[] = [];
          for (const shaderName of shaderNames) {
            const vertPath = join(STAGING_SHADERS_DIR, `${shaderName}.vert`);
            const fragPath = join(STAGING_SHADERS_DIR, `${shaderName}.frag`);
            const missingFiles: string[] = [];
            if (!existsSync(vertPath)) {
              missingFiles.push(`${shaderName}.vert`);
            }
            if (!existsSync(fragPath)) {
              missingFiles.push(`${shaderName}.frag`);
            }
            if (missingFiles.length > 0) {
              missingShaders.push(...missingFiles);
            }
          }

          if (missingShaders.length > 0) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                ok: false,
                error: `Missing staging shader files in shaders/staging/: ${missingShaders.join(", ")}`,
              })
            );
            return;
          }

          // Copy staging shaders to production shaders directory
          for (const shaderName of shaderNames) {
            const stagingVertPath = join(STAGING_SHADERS_DIR, `${shaderName}.vert`);
            const stagingFragPath = join(STAGING_SHADERS_DIR, `${shaderName}.frag`);
            const prodVertPath = join(SHADERS_DIR, `${shaderName}.vert`);
            const prodFragPath = join(SHADERS_DIR, `${shaderName}.frag`);

            try {
              // Mark these files as authorized before writing
              ignoreNextShaderChange.add(`${shaderName}.vert`);
              ignoreNextShaderChange.add(`${shaderName}.frag`);

              copyFileSync(stagingVertPath, prodVertPath);
              copyFileSync(stagingFragPath, prodFragPath);
              console.log(`[scene-sync] Copied shader: ${shaderName}`);
            } catch (copyErr) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  ok: false,
                  error: `Failed to copy shader ${shaderName}: ${copyErr}`,
                })
              );
              return;
            }
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

          const shaderCount = shaderNames.size;
          const animCount = validation.data.animations?.length ?? 0;
          const shaderMsg = shaderCount > 0 ? `, ${shaderCount} shader(s)` : "";
          const animMsg = animCount > 0 ? `, ${animCount} animation clip(s)` : "";
          console.log(
            `[scene-sync] Promoted ${validation.data.objects.length} objects${shaderMsg}${animMsg} from staging`
          );

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              ok: true,
              message: `Promoted ${validation.data.objects.length} objects${shaderMsg}${animMsg} from staging to scene`,
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
            if (parsed && Array.isArray(parsed.objects)) {
              objectCount = parsed.objects.length;
            }
          } catch {
            // Non-fatal
          }

          // Copy shaders from production to staging (excluding templates)
          let shaderCount = 0;
          if (existsSync(SHADERS_DIR)) {
            const files = readdirSync(SHADERS_DIR);
            for (const file of files) {
              // Skip templates and non-shader files
              if (file.startsWith("_")) continue;
              if (!file.endsWith(".vert") && !file.endsWith(".frag")) continue;

              const srcPath = join(SHADERS_DIR, file);
              const destPath = join(STAGING_SHADERS_DIR, file);
              copyFileSync(srcPath, destPath);

              // Count unique shaders (each has .vert and .frag)
              if (file.endsWith(".vert")) shaderCount++;
            }
          }

          const shaderMsg =
            shaderCount > 0 ? ` and ${shaderCount} shader(s)` : "";
          console.log(
            `[scene-sync] Copied ${objectCount} objects${shaderMsg} from scene to staging`
          );

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              ok: true,
              message: `Copied ${objectCount} objects${shaderMsg} to staging`,
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
              res.end(JSON.stringify({ objects: [] }));
            }
          } catch {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ objects: [] }));
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
