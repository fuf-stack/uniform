import type { Meta, StoryObj } from '@storybook/react';

import Tooltip, { tooltipPlacementOptions } from './Tooltip';

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
