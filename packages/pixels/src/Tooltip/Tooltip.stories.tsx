import type { Meta, StoryObj } from '@storybook/react';

import Tooltip, { PlacementOptions } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'pixels/Tooltip',
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: StoryObj<typeof Tooltip> = {
  args: {
    content: 'tooltip content',
    children: 'hover me',
  },
};

export const somePositions: Story = {
  render: (args) => (
    <>
      {['top', 'left', 'right', 'bottom'].map((position) => (
        <div key={position} className="mb-12">
          <Tooltip placement={position} defaultOpen {...args}>
            {position}
          </Tooltip>
        </div>
      ))}
    </>
  ),
  args: {
    content: 'tooltip content',
  },
};

export const allPositions: Story = {
  render: (args) => (
    <>
      {PlacementOptions.map((placement) => (
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
