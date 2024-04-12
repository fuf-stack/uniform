import type { Meta, StoryObj } from '@storybook/react';
import type { ButtonProps } from './Button';

import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'pixels/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
    testId: 'some-test-id',
  },
};

export const Disabled: StoryObj<typeof Button> = {
  args: {
    children: 'Button',
    disabled: true,
  },
};

export const Loading: StoryObj<typeof Button> = {
  args: {
    children: 'Button',
    loading: true,
  },
};

export const AllColors: StoryObj<typeof Button> = {
  render: () => (
    <>
      {['default', 'primary', 'secondary', 'success', 'warning', 'danger'].map(
        (color) => (
          <div key={color} style={{ marginTop: '10px' }}>
            <Button color={color as ButtonProps['color']}>{color}</Button>
          </div>
        ),
      )}
    </>
  ),
};

export const AllSizes: StoryObj<typeof Button> = {
  render: () => (
    <>
      {['sm', 'md', 'lg'].map((size) => (
        <div key={size} style={{ marginTop: '10px' }}>
          <Button size={size as ButtonProps['size']}>{size}</Button>
        </div>
      ))}
    </>
  ),
};

export const AllVariants: StoryObj<typeof Button> = {
  render: () => (
    <>
      {['solid', 'bordered', 'light', 'flat', 'faded', 'shadow', 'ghost'].map(
        (variant) => (
          <div key={variant} style={{ marginTop: '10px' }}>
            <Button variant={variant as ButtonProps['variant']}>
              {variant}
            </Button>
          </div>
        ),
      )}
    </>
  ),
};
