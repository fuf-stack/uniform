import type { Meta, StoryObj } from '@storybook/react';
import type { BadgeProps } from './Badge';

import Badge from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'pixels/Badge',
  component: Badge,
};

export default meta;
type Story = StoryObj<typeof Badge>;

const children = (
  <p>
    Some
    <br /> Content
    <br />
    Some Content
  </p>
);
const content = 42;

export const Default: Story = {
  args: {
    children,
    content,
  },
};

export const AllColors: Story = {
  args: {
    children,
    content,
  },
  render: (args: BadgeProps) => (
    <dl>
      {['default', 'primary', 'secondary', 'success', 'warning', 'danger'].map(
        (color) => (
          <div className="gap-4 pb-8 sm:grid sm:grid-cols-2">
            <dt>{color}</dt>
            <dd>
              <Badge
                key={color}
                {...args}
                color={color as BadgeProps['color']}
              />
            </dd>
          </div>
        ),
      )}
    </dl>
  ),
};

export const AllSizes: Story = {
  args: {
    children,
    content,
  },
  render: (args: BadgeProps) => (
    <dl>
      {['sm', 'md ', 'lg'].map((size) => (
        <div className="gap-4 pb-8 sm:grid sm:grid-cols-2" key={size}>
          <dt>{size}</dt>
          <dd>
            <Badge {...args} size={size as BadgeProps['size']} />
          </dd>
        </div>
      ))}
    </dl>
  ),
};

export const AllPlacements: Story = {
  args: {
    children,
    content,
  },
  render: (args: BadgeProps) => (
    <dl>
      {['top-right', 'top-left', 'bottom-right', 'bottom-left'].map(
        (placement) => (
          <div className="gap-4 pb-8 sm:grid sm:grid-cols-2" key={placement}>
            <dt>{placement}</dt>
            <dd>
              <Badge
                {...args}
                placement={placement as BadgeProps['placement']}
              />
            </dd>
          </div>
        ),
      )}
    </dl>
  ),
};
