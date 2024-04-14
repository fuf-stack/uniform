import type { Meta, StoryObj } from '@storybook/react';

import Popover from './Popover';

const meta: Meta<typeof Popover> = {
  title: 'pixels/Popover',
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    children: 'i am the trigger',
    content: 'i am the content',
  },
};

export const TooMuchContent: Story = {
  args: {
    children: 'i am the trigger',
    placement: 'right',
    content: (
      <>
        {/* eslint-disable-next-line prefer-spread */}
        {Array.apply(null, Array(100)).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i}>
            too much content
            <br />
          </div>
        ))}
      </>
    ),
    testId: 'testId42',
  },
};

export const Title: Story = {
  args: {
    title: 'i am the title',
    children: 'i am the trigger',
    content: 'i am the content',
  },
};
