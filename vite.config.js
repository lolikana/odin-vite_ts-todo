import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    outDir: 'dist',
    sourcemap: 'inline',
    minify: 'esbuild',
    manifest: true
  },
  server: {
    port: 3000
  }
});
