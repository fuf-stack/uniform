import type { Meta, StoryObj } from '@storybook/react';

import Tooltip, { tooltipPlacementOptions } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'pixels/Tooltip',
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'tooltip content',
    children: 'hover me',
  },
};

export const Delay: Story = {
  args: {
    content: 'I took 1 second',
    children: '1000 ms delay',
    delay: 1000,
  },
};

export const CloseDelay: Story = {
  args: {
    content: 'I will go in 3s',
    children: '3000 ms close delay',
    closeDelay: 3000,
  },
};

export const AllPlacements: Story = {
  render: (args) => (
    <>
      {tooltipPlacementOptions.map((placement) => (
        <div key={placement} className="mb-12">
          <Tooltip placement={placement} {...args}>
            {placement}
          </Tooltip>
        </div>
      ))}
    </>
  ),
  args: {
    content: 'tooltip content',
  },
};
