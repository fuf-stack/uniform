// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  // we use dts-bundle-generator to generate types (see dtsbundle.config.js)
  dts: false,
  entry: ['src', '!src/**/*.test.*'],
  format: ['cjs', 'esm'],
  sourcemap: true,
});
