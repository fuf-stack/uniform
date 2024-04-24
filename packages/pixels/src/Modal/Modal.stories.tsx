import type { Meta, StoryObj } from '@storybook/react';
import type { ModalProps } from './Modal';

import { useState } from 'react';

import { expect, userEvent, within } from '@storybook/test';

import Button from '../Button';
import Modal, { modalVariants } from './Modal';
import { longContent } from './storyData';

const meta: Meta<typeof Modal> = {
  title: 'pixels/Modal',
  component: Modal,
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: Object.keys(modalVariants.variants.size),
    },
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)} testId="modal_trigger">
          Open Modal
        </Button>
        <Modal {...args} isOpen={open} onClose={() => setOpen(false)} />
      </>
    );
  },
};

export default meta;
type Story = StoryObj<ModalProps>;

const openModal: Story['play'] = async ({ canvasElement }) => {
  const body = within(canvasElement?.parentElement as HTMLElement);
  const canvas = within(canvasElement);
  const trigger = canvas.getByTestId('modal_trigger');
  await userEvent.click(trigger);
  expect(body.getByTestId('modal')).toBeTruthy();
};

export const Default: Story = {
  args: {
    header: 'Modal Header',
    children: 'Modal Content',
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    header: 'Modal Header',
    children: 'Modal Content',
    footer: <Button>Some Action</Button>,
  },
};

export const ScrollLongContent: Story = {
  args: {
    header: 'Modal Header',
    children: longContent,
  },
  play: openModal,
};

export const CustomStyles: Story = {
  args: {
    header: 'Custom Styles',
    children: 'This is very custom!',
    className: {
      body: 'py-6',
      backdrop: 'bg-[#292f46]/50 backdrop-opacity-40',
      base: 'border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]',
      header: 'border-b-[1px] border-[#292f46]',
      footer: 'border-t-[1px] border-[#292f46]',
      closeButton: 'hover:bg-white/5 active:bg-white/10',
    },
  },
  play: openModal,
};

export const AllSizes: Story = {
  args: {
    header: 'Size',
  },
  render: (args) => (
    <>
      {Object.keys(modalVariants.variants.size).map((size) => {
        const [content, setContent] = useState<string | JSX.Element | false>(
          false,
        );
        return (
          <div key={size} className="mt-2">
            <Button
              onClick={() => setContent(`short ${size} content`)}
              className="mr-2"
            >
              {size}
            </Button>
            <Button onClick={() => setContent(longContent)}>
              {size} scroll
            </Button>
            <Modal
              {...args}
              header={`Size ${size} Modal`}
              isOpen={!!content}
              onClose={() => setContent(false)}
              size={size as ModalProps['size']}
            >
              {content}
            </Modal>
          </div>
        );
      })}
    </>
  ),
  argTypes: {
    // do not show size in controls table
    size: {
      table: {
        disable: true,
      },
    },
  },
};
