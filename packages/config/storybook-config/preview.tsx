/* eslint-disable import/no-extraneous-dependencies */

import type { Decorator, Preview } from '@storybook/react';

import { useEffect } from 'react';

import { UPDATE_GLOBALS } from '@storybook/core-events';
import { addons } from '@storybook/preview-api';
import { DARK_MODE_EVENT_NAME, useDarkMode } from 'storybook-dark-mode';

// see: https://github.com/hipstersmoothie/storybook-dark-mode/issues/168
const DarkModeHtmlAttributeDecorator: Decorator = (Story) => {
  const isDarkMode = useDarkMode();
  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);
  return <Story />;
};

// see: https://github.com/storybookjs/test-runner/issues/74#issuecomment-1165389157
const DisableTestRunnerDecorator: Decorator = (Story, { parameters }) => {
  if (
    parameters.testRunner?.disable === true &&
    navigator.userAgent.includes('StorybookTestRunner')
  ) {
    return <>Disabled for Test Runner</>;
  }
  return <Story />;
};

const preview: Preview = {
  decorators: [DarkModeHtmlAttributeDecorator, DisableTestRunnerDecorator],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    // show also description and default in controls panel
    controls: { expanded: true },
    backgrounds: {
      default: 'lightgray',
      values: [
        {
          name: 'lightgray',
          value: '#f5f7fa',
        },
        {
          name: 'white',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#333333',
        },
      ],
    },
    // configure dark mode
    // see: https://storybook.js.org/addons/storybook-dark-mode
    darkMode: {
      // Set the initial theme to light
      current: 'light',
      stylePreview: true,
      darkClass: 'dark',
      lightClass: 'ignore-sb-light',
    },
    layout: 'centered',
  },
};

// change background when dark mode is toggled
// see: https://www.bekk.christmas/post/2021/3/storybook-background-change-on-prop-change
const channel = addons.getChannel();

let previousIsDarkMode = false;

const darkModeToggleListener = (isDarkMode) => {
  if (previousIsDarkMode !== isDarkMode) {
    console.log('dark mode changed, setting background...', {
      isDarkMode,
    });
    previousIsDarkMode = isDarkMode;
    channel.emit(UPDATE_GLOBALS, {
      globals: {
        backgrounds: isDarkMode
          ? { name: 'dark', value: '#333333' }
          : { name: 'lightgray', value: '#f5f7fa' },
      },
    });
  }
};

channel.addListener(DARK_MODE_EVENT_NAME, darkModeToggleListener);

export default preview;

export type { Preview };
