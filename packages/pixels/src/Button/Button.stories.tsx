import type { Meta, StoryObj } from '@storybook/react';
import type { ButtonProps } from './Button';

import { FaEnvelope } from 'react-icons/fa';

import Button, { buttonVariants } from './Button';

const meta: Meta<typeof Button> = {
  title: 'pixels/Button',
  component: Button,
  argTypes: {
    color: {
      control: { type: 'radio' },
      options: Object.keys(buttonVariants.variants.color),
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {},
};

export const Basic: Story = {
  args: {
    children: 'Button',
    testId: 'some-test-id',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Button',
    disabled: true,
  },
};

export const IconOnly: Story = {
  args: {
    icon: <FaEnvelope />,
    children: undefined,
  },
};

export const Loading: Story = {
  args: {
    children: 'Button',
    loading: true,
  },
};

export const DisabledAnimation: Story = {
  args: {
    children: 'Button',
    disableAnimation: true,
  },
};

export const AllColors: Story = {
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

export const AllSizes: Story = {
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

export const AllVariants: Story = {
  render: (args) => (
    <>
      {['solid', 'bordered', 'light', 'flat', 'faded', 'shadow', 'ghost'].map(
        (variant) => (
          <div key={variant} style={{ marginTop: '10px' }}>
            <Button variant={variant as ButtonProps['variant']} {...args}>
              {variant}
            </Button>
          </div>
        ),
      )}
    </>
  ),
};
