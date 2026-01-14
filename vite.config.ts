import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';
import { sceneSyncPlugin } from './vite-plugin-scene-sync';

// Plugin to copy scene and shader files for production build
// Note: scene.json comes from public/ (Vite copies it automatically)
// This plugin only handles shaders from the shaders/ directory
function copySceneFilesPlugin() {
  return {
    name: 'copy-scene-files',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const shadersDir = path.resolve(process.cwd(), 'shaders');

      // Copy shaders directory (excluding staging and templates)
      const shadersDestDir = path.join(distDir, 'shaders');
      if (fs.existsSync(shadersDir)) {
        if (!fs.existsSync(shadersDestDir)) {
          fs.mkdirSync(shadersDestDir, { recursive: true });
        }
        const files = fs.readdirSync(shadersDir);
        for (const file of files) {
          // Skip staging directory and template files
          if (file === 'staging' || file.startsWith('_')) continue;
          const srcPath = path.join(shadersDir, file);
          const stat = fs.statSync(srcPath);
          if (stat.isFile() && (file.endsWith('.vert') || file.endsWith('.frag'))) {
            fs.copyFileSync(srcPath, path.join(shadersDestDir, file));
          }
        }
        console.log('[copy-scene-files] Copied shaders to dist');
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const allowedHostsStr = env.VITE_ALLOWED_HOSTS || '';
  const allowedHosts = allowedHostsStr
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const hmrHost = env.VITE_HMR_HOST || undefined;
  const hmrProtocol = env.VITE_HMR_PROTOCOL || undefined;
  const hmrClientPort = env.VITE_HMR_CLIENT_PORT
    ? Number(env.VITE_HMR_CLIENT_PORT)
    : undefined;

  const hmr = hmrHost || hmrProtocol || hmrClientPort
    ? { host: hmrHost, protocol: hmrProtocol as 'ws' | 'wss' | undefined, clientPort: hmrClientPort }
    : undefined;

  return {
    plugins: [react(), sceneSyncPlugin(), copySceneFilesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    define: {
      // Auto-detect project path in dev mode for VS Code integration
      'import.meta.env.VITE_CWD': JSON.stringify(process.cwd()),
    },
    server: {
      host: true,
      port: env.VITE_PORT ? Number(env.VITE_PORT) : undefined,
      ...(allowedHosts.length ? { allowedHosts } : {}),
      ...(hmr ? { hmr } : {}),
    },
  };
});

