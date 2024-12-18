/* eslint-disable import/no-extraneous-dependencies */

import type { PluginsConfig } from 'tailwindcss/types/config';

import { nextui } from '@nextui-org/theme';

const plugins: Partial<PluginsConfig> = [
  // see: https://nextui.org/docs/guide/installation#tailwind-css-setup-1
  nextui({}),
];

export default plugins;
