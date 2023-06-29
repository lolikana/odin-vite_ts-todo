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
  plugins: [
    {
      name: 'rewrite-middleware',
      configureServer(serve) {
        serve.middlewares.use((req, _res, next) => {
          if (req.url.startsWith('/register')) {
            req.url = '/register/index.html';
          }
          if (req.url.startsWith('/login')) {
            req.url = '/login/index.html';
          }
          next();
        });
      }
    }
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['node_modules', './__tests__/renderIndexHTML.ts']
  },
  server: {
    port: 4000
  }
});
