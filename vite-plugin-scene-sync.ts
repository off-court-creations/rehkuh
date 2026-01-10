import type { Plugin, ViteDevServer } from "vite";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname, basename, extname } from "path";
import chokidar from "chokidar";
import { createHash } from "crypto";

const SCENE_PATH = join(process.cwd(), "scene/scene.json");
const SHADERS_DIR = join(process.cwd(), "shaders");

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

      // Initialize lastWrittenHash from current file
      try {
        const currentContent = readFileSync(SCENE_PATH, "utf-8");
        lastWrittenHash = hashContent(currentContent);
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

          // Only notify if content actually changed from what we know
          if (newHash !== lastWrittenHash) {
            console.log("[scene-sync] External change detected, notifying clients");
            lastWrittenHash = newHash;

            if (server) {
              server.ws.send({
                type: "custom",
                event: "scene-changed",
              });
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
    },
  };
}
