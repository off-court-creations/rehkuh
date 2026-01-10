#!/usr/bin/env npx tsx
/**
 * Copies scene.json to staging-scene.json so the AI can edit from current state.
 *
 * Usage:
 *   npx tsx scripts/copy-to-staging.ts
 *   npm run copy-to-staging
 *
 * Exit codes:
 *   0 - Success
 *   1 - File read/write error
 */

import "dotenv/config";
import { copyFileSync, existsSync } from "fs";
import { join } from "path";

const SCENE_DIR = join(process.cwd(), "scene");
const SCENE_PATH = join(SCENE_DIR, "scene.json");
const STAGING_PATH = join(SCENE_DIR, "staging-scene.json");

function copyToStaging(): { success: boolean; message: string } {
  if (!existsSync(SCENE_PATH)) {
    return {
      success: false,
      message: `Scene file not found: ${SCENE_PATH}`,
    };
  }

  try {
    copyFileSync(SCENE_PATH, STAGING_PATH);
  } catch (err) {
    return {
      success: false,
      message: `Failed to copy to staging: ${err}`,
    };
  }

  return {
    success: true,
    message: "Copied scene.json → staging-scene.json",
  };
}

async function tryApiCopy(): Promise<{
  success: boolean;
  message: string;
} | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);

    const candidatePorts = process.env.VITE_PORT
      ? [process.env.VITE_PORT]
      : ["5178", "5173"];

    for (const port of candidatePorts) {
      try {
        const res = await fetch(`http://localhost:${port}/__copy-to-staging`, {
          method: "POST",
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const data = (await res.json()) as {
          ok?: boolean;
          message?: string;
          error?: string;
        };
        if (data.ok) {
          return { success: true, message: data.message || "Copied via API" };
        }
        return { success: false, message: data.error || "API copy failed" };
      } catch {
        // try next port
      }
    }

    clearTimeout(timeout);
    return null;
  } catch {
    return null;
  }
}

(async () => {
  const apiResult = await tryApiCopy();
  if (apiResult !== null) {
    if (apiResult.success) {
      console.log(`✓ ${apiResult.message}`);
      process.exit(0);
    } else {
      console.error(`✗ ${apiResult.message}`);
      process.exit(1);
    }
  }

  const result = copyToStaging();
  if (result.success) {
    console.log(`✓ ${result.message}`);
    process.exit(0);
  } else {
    console.error(`✗ ${result.message}`);
    process.exit(1);
  }
})();
