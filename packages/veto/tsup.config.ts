// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: {
    entry: './src/index.ts',
    // Ensures the d.ts file includes resolved type definitions
    // this way zod types are bundled correctly (zod has to be dev dep) and prevents:
    // The inferred type of * cannot be named without a reference to */node_modules/zod .
    // This is likely not portable. A type annotation is necessary.
    // see: https://github.com/microsoft/TypeScript/issues/47663
    // see: https://github.com/quadristan/ts-indirect-type-reference-bug
    resolve: true,
  },
  entry: ['src', '!src/**/*.test.*'],
  format: ['cjs', 'esm'],
  sourcemap: true,
});
