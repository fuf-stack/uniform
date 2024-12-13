import type { Meta, StoryObj } from '@storybook/react';
import type { ModalProps } from './Modal';

import { useArgs } from '@storybook/preview-api';
import { expect, userEvent, waitFor, within } from '@storybook/test';

import { Button } from '../Button';
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
};

export default meta;
type Story = StoryObj<ModalProps>;

const Template: Story['render'] = (args, { canvasElement }) => {
  const [{ isOpen }, setArgs] = useArgs();

  const onClick = () => setArgs({ isOpen: true });
  const onClose = () => setArgs({ isOpen: false });

  return (
    <>
      <Button onClick={onClick} testId="modal_trigger">
        Open Modal
      </Button>
      <Modal
        {...args}
        isOpen={isOpen}
        portalContainer={canvasElement}
        onClose={onClose}
      />
    </>
  );
};

export const Default: Story = {
  args: {
    header: 'Modal Header',
    children: 'Modal Content',
  },
  render: Template,
};

export const WithHeaderAndFooter: Story = {
  args: {
    header: 'Modal Header',
    children: 'Modal Content',
    footer: <Button>Some Action</Button>,
  },
  render: Template,
};

const playOpenModal: Story['play'] = async ({ canvasElement, canvas }) => {
  // const canvas = within(canvasElement);

  // open modal
  const trigger = canvas.getByTestId('modal_trigger');
  await userEvent.click(trigger);

  // wait for modal to be visible
  await waitFor(
    () => {
      const modal = canvas.getByTestId('modal');
      expect(modal).toBeVisible();
    },
    { timeout: 5000 },
  );
};

export const ScrollLongContent: Story = {
  args: {
    header: 'Modal Header',
    children: longContent,
  },
  render: Template,
  // TODO: tests are failing
  // play: playOpenModal,
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
  render: Template,
  // TODO: tests are failing
  // play: playOpenModal,
};

const AllSizesTemplate: Story['render'] = (args) => {
  const [{ isOpen, content, size: currentSize }, setArgs] = useArgs();
  return (
    <>
      {Object.keys(modalVariants.variants.size).map((size) => {
        return (
          <div key={size} className="mt-2">
            <Button
              onClick={() =>
                setArgs({
                  isOpen: true,
                  size,
                  content: `short ${size} content`,
                })
              }
              className="mr-2"
            >
              {size}
            </Button>
            <Button
              onClick={() =>
                setArgs({ isOpen: true, size, content: longContent })
              }
            >
              {size} scroll
            </Button>
            <Modal
              {...args}
              header={`Size ${size} Modal`}
              isOpen={isOpen}
              onClose={() => setArgs({ isOpen: false })}
              size={currentSize}
            >
              {content}
            </Modal>
          </div>
        );
      })}
    </>
  );
};

export const AllSizes: Story = {
  args: {
    header: 'Size',
  },
  render: AllSizesTemplate,
  argTypes: {
    // do not show size in controls table
    size: {
      table: {
        disable: true,
      },
    },
  },
};

export const WithCustomHeader: Story = {
  args: {
    header: <div className="text-2xl">Custom Header</div>,
    children: 'Modal Content',
  },
  render: Template,
};

export const WithNoHeader: Story = {
  args: {
    // header: <div className="text-2xl">Custom Header</div>,
    children: 'Modal Content',
  },
  render: Template,
};
