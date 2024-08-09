import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setupFiles/window-matchMedia.ts'],
  },
  esbuild: {
    target: 'es2017',
  },
});
