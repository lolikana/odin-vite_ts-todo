/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: 'inline',
    minify: 'esbuild',
    manifest: true,
    emptyOutDir: true,
    copyPublicDir: true
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src')
      },
      {
        find: '@__tests__',
        replacement: path.resolve(__dirname, './__tests__')
      }
    ]
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['node_modules', './__tests__/renderIndexHTML.ts']
  },
  server: {
    port: 4000
  }
});
