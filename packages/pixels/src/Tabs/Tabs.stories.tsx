import type { Meta, StoryObj } from '@storybook/react';

import Tabs from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Pixels/Tabs',
  component: Tabs,
} as Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {};

export const WithTabs: Story = {
  args: {
    tabs: [
      {
        id: 'tab1',
        label: 'Tab 1',
        content: 'Content 1',
      },
      {
        id: 'tab2',
        label: 'Tab 2',
        content: 'Content 2',
      },
    ],
  },
};

export const ManyTabs10: Story = {
  args: {
    className: {
      base: 'w-72',
      tabList: '',
      tab: '',
      tabContent: '',
      cursor: '',
      panel: '',
    },
    tabs: [
      {
        id: 'tab1',
        label: 'Tab 1',
        content: 'Content 1',
      },
      {
        id: 'tab2',
        label: 'Tab 2',
        content: 'Content 2',
      },
      {
        id: 'tab3',
        label: 'Tab 3',
        content: 'Content 3',
      },
      {
        id: 'tab4',
        label: 'Tab 4',
        content: 'Content 4',
      },
      {
        id: 'tab5',
        label: 'Tab 5',
        content: 'Content 5',
      },
      {
        id: 'tab6',
        label: 'Tab 6',
        content: 'Content 6',
      },
      {
        id: 'tab7',
        label: 'Tab 7',
        content: 'Content 7',
      },
      {
        id: 'tab8',
        label: 'Tab 8',
        content: 'Content 8',
      },
      {
        id: 'tab9',
        label: 'Tab 9',
        content: 'Content 9',
      },
      {
        id: 'tab10',
        label: 'Tab 10',
        content: 'Content 10',
      },
    ],
  },
};
