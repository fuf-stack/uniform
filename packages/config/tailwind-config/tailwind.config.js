/* eslint-disable import/no-extraneous-dependencies */

const { nextui } = require('@nextui-org/theme');
const path = require('path');

/**
 * nextui used components
 * @see https://nextui.org/docs/guide/installation#tailwind-css-setup-1
 *
 * all nextui components that are in use for theme
 * update with: pnpm list "@nextui-org/*" --recursive | grep @nextui-org/ | sort | uniq -u
 */
const NEXTUI_THEME_USED_COMPONENT_PATHS = [
  'autocomplete',
  'button',
  'card',
  'chip',
  'checkbox',
  'divider',
  'dropdown',
  'input',
  'modal',
  'popover',
  'radio',
  'select',
  'toggle', // switch is toggle for some reason...
  'tooltip',
  // theme is not required
].map((c) =>
  path.resolve(
    __dirname,
    `./node_modules/@nextui-org/theme/dist/components/${c}.js`,
  ),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // relative path in packages that use the config
    'src/**/*.{js,ts,jsx,tsx}',

    // workspace component package paths
    path.resolve(__dirname, '../../pixels/src/**/*.tsx'),
    path.resolve(__dirname, '../../uniform/src/**/*.tsx'),

    // nextui theme component paths
    ...NEXTUI_THEME_USED_COMPONENT_PATHS,
  ],
  // see: https://tailwindcss.com/docs/dark-mode
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {},
  // https://nextui.org/docs/guide/installation#tailwind-css-setup-1
  plugins: [nextui({})],
};
