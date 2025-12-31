import type { Plugin, ViteDevServer } from "vite";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import chokidar from "chokidar";
import { createHash } from "crypto";

const SCENE_PATH = join(process.cwd(), "scene/scene.json");

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

      // Cleanup on server close
      srv.httpServer?.on("close", () => {
        watcher.close();
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
    },
  };
}
