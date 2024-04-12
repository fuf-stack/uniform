import sharedConfig, { StorybookConfig } from 'storybook-config/main';

const config: StorybookConfig = {
  ...sharedConfig,
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
};

export default config;
