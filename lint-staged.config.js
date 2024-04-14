module.exports = {
  // pixels
  // 'packages/pixels/**/*.{js,ts,tsx}': ['eslint', 'vitest related --run'],
  // uniform
  'packages/uniform/**/*.{js,ts,tsx}': ['eslint', 'vitest related --run'],
  // veto
  'packages/veto/**/*.{js,ts,tsx}': ['eslint', 'vitest related --run'],
  // config packages
  'packages/config/**/*.{js,ts}': ['eslint'],
  // other filetypes
  '*.{md,mdx,yaml,yml}': ['prettier --write'],
};
