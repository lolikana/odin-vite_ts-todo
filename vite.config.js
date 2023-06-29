/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        register: path.resolve(__dirname, 'register/index.html'),
        login: path.resolve(__dirname, 'login/index.html')
      }
    },
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
        replacement: path.resolve(__dirname, 'src')
      },
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/client/scripts/components')
      },
      {
        find: '@helpers',
        replacement: path.resolve(__dirname, 'src/client/scripts/helpers')
      },
      {
        find: '@libs',
        replacement: path.resolve(__dirname, 'src/libs')
      },
      {
        find: '@__tests__',
        replacement: path.resolve(__dirname, '__tests__')
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
