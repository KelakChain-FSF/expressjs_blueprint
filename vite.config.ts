/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    includeSource: ['src/**/*.{js,ts}'],
    include: [
      'tests/**/*.ts',
      'src/**/*.spec.{js,ts}'
    ],
    exclude: [
      'node_modules',
      'dist'
    ],
    
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    target: 'esnext',
    format: 'esm',
  }
});
