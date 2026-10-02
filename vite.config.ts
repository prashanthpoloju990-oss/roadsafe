import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { handleEmergencyApi } from './src/server/emergencyApi.ts';

const emergencyApiPlugin = (): Plugin => ({
  name: 'emergency-api-middleware',
  configureServer(server) {
    server.middlewares.use(handleEmergencyApi);
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), emergencyApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
