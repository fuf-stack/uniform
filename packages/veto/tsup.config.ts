// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  // INFO: we have added zod as a devDep and run tsup with --dts-resolve
  // in order to resolve the zod types to fix:
  // The inferred type of * cannot be named without a reference to */node_modules/zod .
  // This is likely not portable. A type annotation is necessary.
  // see: https://github.com/microsoft/TypeScript/issues/47663
  // see: https://github.com/quadristan/ts-indirect-type-reference-bug
  dts: true,
  entry: ['src', '!src/**/*.test.*'],
  format: ['cjs', 'esm'],
  sourcemap: true,
});
