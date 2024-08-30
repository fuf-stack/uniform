import type { Meta, StoryObj } from '@storybook/react';
import type { BreadcrumbProps } from './Breadcrumb';

import Breadcrumb from './Breadcrumb';

// TODO: register actions

const meta: Meta<typeof Breadcrumb> = {
  title: 'pixels/Breadcrumb',
  component: Breadcrumb,
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

const breadcrumbItems = [
  {
    children: 'Home',
  },
  {
    children: 'Music',
  },
  {
    children: 'Artist',
  },
  {
    children: 'Album',
  },
  {
    children: 'Song',
  },
];

export const Default: Story = {
  args: {
    breadcrumbItems,
  },
};

export const WithSeparator: Story = {
  args: {
    breadcrumbItems,
    separator: '/',
  },
};

export const WithMaxItems: Story = {
  args: {
    breadcrumbItems,
    maxItems: 3,
  },
};

export const AllVariants: Story = {
  args: {
    breadcrumbItems,
  },
  render: (args) => (
    <div>
      {['solid', 'bordered', 'light'].map((variant) => (
        <>
          <span className="mb-2">{variant}:</span>
          <Breadcrumb
            {...args}
            key={variant}
            className="mb-12"
            variant={variant as BreadcrumbProps['variant']}
          />
        </>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  args: {
    breadcrumbItems,
  },
  render: (args) => (
    <div>
      {['sm', 'md', 'lg'].map((size) => (
        <>
          <span className="mb-2">{size}:</span>
          <Breadcrumb
            {...args}
            key={size}
            className="mb-12"
            size={size as BreadcrumbProps['size']}
          />
        </>
      ))}
    </div>
  ),
};

export const AllUnderlines: Story = {
  args: {
    breadcrumbItems,
  },
  render: (args) => (
    <div>
      {['none', 'active', 'hover', 'focus', 'always'].map((underline) => (
        <>
          <span className="mb-2">{underline}:</span>
          <Breadcrumb
            {...args}
            key={underline}
            className="mb-12"
            underline={underline as BreadcrumbProps['underline']}
          />
        </>
      ))}
    </div>
  ),
};
