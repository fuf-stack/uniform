export default {
  // Run related unit tests once for all staged component and validation files.
  // Storybook browser tests run separately through pnpm test:storybook.
  'packages/{atelier,megapixels,pixels,uniform,veto}/**/*.{js,ts,tsx}': [
    'vitest related --run --project=!@repo/storybook-config*',
    'eslint',
  ],
  'packages/{pixel-motion,pixel-utils}/**/*.{js,ts,tsx}': ['eslint'],
  // config packages
  'packages/config/**/*.{js,ts}': ['eslint'],
  // other filetypes
  '*.{json,md,mdx,yaml,yml}': ['prettier --write'],
};
