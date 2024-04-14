import type { Meta, StoryObj } from '@storybook/react';

import { FaBars } from 'react-icons/fa';

import Menu from './Menu';

const meta: Meta<typeof Menu> = {
  title: 'pixels/Menu',
  component: Menu,
};

export default meta;
type Story = StoryObj<typeof Menu>;

const menuItems = [
  {
    key: 'section',
    label: 'Section',
    items: [
      {
        icon: <FaBars />,
        key: 'itemWithIcon',
        label: 'Item with icon',
        onClick: () => {},
      },
      {
        description: 'description text',
        key: 'itemWithDescription',
        label: 'Item With Description',
        onClick: () => {},
      },
    ],
  },
  {
    key: 'itemDisabled',
    label: 'Item Disabled',
    onClick: () => {},
    disabled: true,
  },
  {
    className: 'text-red-500',
    key: 'itemCss',
    label: 'Item with CSS class',
    onClick: () => {},
  },
];

export const Default: Story = {
  args: {
    children: 'trigger',
    items: menuItems,
  },
};

export const WithoutTrigger: Story = {
  args: {
    items: menuItems,
  },
};
