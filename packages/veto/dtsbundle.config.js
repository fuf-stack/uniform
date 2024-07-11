/** @type import('dts-bundle-generator/config-schema').BundlerConfig */
const config = {
  compilationOptions: {
    preferredConfigPath: './tsconfig.json',
  },
  entries: [
    {
      filePath: './src/index.ts',
      outFile: './dist/index.d.ts',
      output: {
        noBanner: true,
      },
      libraries: {
        // inline zod types to prevent
        // The inferred type of ` cannot be named without a reference to */node_modules/zod .
        // This is likely not portable. A type annotation is necessary.
        // see: https://github.com/microsoft/TypeScript/issues/47663
        // see: https://github.com/quadristan/ts-indirect-type-reference-bug
        // inlinedLibraries: ['zod'],
      },
    },
  ],
};

module.exports = config;
