module.exports = {
  // uniform
  'packages/uniform/**/*.{ts}': ['eslint', 'vitest related --run'],
  // config packages
  'packages/config/**/*.{js,ts}': ['eslint'],
  // other filetypes
  '*.{md,mdx,yaml,yml}': ['prettier --write'],
};
