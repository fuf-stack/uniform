import type { Meta, StoryObj } from '@storybook/react';
import type { LabelProps } from './Label';

import { FaRocket } from 'react-icons/fa6';

import Label from './Label';

const meta: Meta<typeof Label> = {
  title: 'pixels/Label',
  component: Label,
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Some Label',
  },
};

export const StartContent: Story = {
  args: {
    children: 'Some Label',
    startContent: <FaRocket />,
  },
};

export const EndContent: Story = {
  args: {
    children: 'Some Label',
    endContent: <FaRocket />,
  },
};

export const AllColors: Story = {
  render: () => (
    <>
      {['default', 'primary', 'secondary', 'success', 'warning', 'danger'].map(
        (color) => (
          <div key={color} style={{ marginTop: '10px' }}>
            <Label color={color as LabelProps['color']}>{color}</Label>
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
          <Label size={size as LabelProps['size']}>{size}</Label>
        </div>
      ))}
    </>
  ),
};
