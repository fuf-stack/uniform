import type { Meta, StoryObj } from '@storybook/react';

import ScrollShadow from './ScrollShadow';

const meta: Meta<typeof ScrollShadow> = {
  title: 'pixels/ScrollShadow',
  component: ScrollShadow,
};

export default meta;
type Story = StoryObj<typeof ScrollShadow>;

export const Default: Story = {
  args: {
    className: 'w-[300px] h-[400px]',
    children: (
      <>
        {/* eslint-disable-next-line prefer-spread */}
        {Array.apply(null, Array(100)).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i}>too much content</div>
        ))}
      </>
    ),
  },
};
