// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: [
    'src',
    '!src/**/__snapshots__/**',
    '!src/**/*.module.css',
    '!src/**/*.stories.*',
    '!src/**/*.test.*',
  ],
  format: ['cjs', 'esm'],
  loader: {
    // for css modules
    // see: https://github.com/egoist/tsup/issues/536
    '.css': 'local-css',
  },
  sourcemap: true,
});
