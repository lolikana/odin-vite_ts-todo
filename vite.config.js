import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: 'inline',
    minify: 'esbuild',
    manifest: true
  },
  server: {
    port: 4000
  }
});
