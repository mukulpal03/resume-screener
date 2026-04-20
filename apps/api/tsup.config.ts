import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  target: 'node20',
  clean: true,
  bundle: true,
  noExternal: ['@repo/db'],
});
