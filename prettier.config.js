/* eslint-disable import/no-extraneous-dependencies */

const prettierConfig = require('@fuf-stack/eslint-config-fuf/prettier');

/** @type {import('prettier').Config} */
module.exports = prettierConfig({
  tailwindConfig: 'packages/config/tailwind-config/tailwind.config.ts',
  workspacePackagePrefix: '@fuf-stack',
});
