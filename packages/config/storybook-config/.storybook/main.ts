import sharedConfig, { StorybookConfig } from '../main';

const config: StorybookConfig = {
  ...sharedConfig,
  stories: [
    '../../../pixels/src/**/*.stories.@(ts|tsx)',
    '../../../uniform/src/**/*.stories.@(ts|tsx)',
  ],
};

export default config;
