import type { Meta, StoryObj } from '@storybook/react';

import Json from './Json';

const meta: Meta<typeof Json> = {
  title: 'pixels/Json',
  component: Json,
};

export default meta;
type Story = StoryObj<typeof Json>;

const testObject = {
  aList: [1, 2, 3],
  anObject: { bool: true, number: 123, null: null, string: 'a string' },
};

// TODO: Some weird glitching behavior in storybook.
export const AsJsonString: Story = {
  args: {
    value: JSON.stringify(testObject, null, 2),
  },
};

export const AsObject: Story = {
  args: {
    value: testObject,
  },
};

export const DefaultCollapsed: Story = {
  args: {
    collapsed: true,
    value: testObject,
  },
};

export const InvalidJson: Story = {
  args: {
    value: 'this is a string, not a Json',
  },
};
