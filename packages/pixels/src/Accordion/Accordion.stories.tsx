import type { Meta, StoryObj } from '@storybook/react';
import type { AccordionProps } from './Accordion';

import Accordion from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'pixels/Accordion',
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const accordionItems = [
  { title: '1.', children: <div>First item</div> },
  { title: '2.', children: <div>Second item</div> },
  { title: '3.', children: <div>Third item</div> },
];

export const Default: Story = {
  args: {
    accordionItems,
  },
};

export const WithSubtitle: Story = {
  args: {
    className: 'w-96',
    accordionItems: [
      { title: '1.', children: <div>First item</div>, subtitle: 'Subtitle' },
      { title: '2.', children: <div>Second item</div>, subtitle: 'Subtitle' },
      { title: '3.', children: <div>Third item</div>, subtitle: 'Subtitle' },
    ],
  },
};
export const AllVariants: Story = {
  args: {
    className: 'mb-12',
    accordionItems,
  },
  render: (args) => (
    <div className="w-96">
      {['light', 'shadow', 'bordered', 'splitted'].map((variant) => (
        <Accordion
          key={variant}
          {...args}
          variant={variant as AccordionProps['variant']}
        />
      ))}
    </div>
  ),
};

export const Multi: Story = {
  args: {
    className: 'w-96',
    selectionMode: 'multiple',
    accordionItems,
  },
};

export const AllDisabled: Story = {
  args: {
    className: 'w-96',
    disabled: true,
    accordionItems,
  },
};
export const SomeDisabled: Story = {
  args: {
    className: 'w-96',
    disabledKeys: ['1'],
    accordionItems: [
      { title: '1.', children: <div>First item</div>, disabled: true },
      { title: '2.', children: <div>Second item</div> },
      { title: '3.', children: <div>Third item</div> },
    ],
  },
};

export const DefaultOpen: Story = {
  args: {
    className: 'w-96',
    defaultSelectedKeys: ['1'],
    accordionItems,
  },
};

export const NoDivider: Story = {
  args: {
    className: 'w-96',
    showDivider: false,
    accordionItems,
  },
};
