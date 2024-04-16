import type { Meta, StoryObj } from '@storybook/react';
import type { ModalProps } from './Modal';

import { Fragment, useState } from 'react';

import Modal, { modalSizeOptions } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'pixels/Modal',
  component: Modal,
};

export default meta;
type Story = StoryObj<ModalProps>;

export const Default: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    const toggleOpen = () => {
      setOpen(!open);
    };
    return (
      <>
        <button type="button" onClick={toggleOpen}>
          trigger
        </button>
        <Modal
          {...args}
          isOpen={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          children
        </Modal>
      </>
    );
  },
  args: {
    title: 'Modal Title',
  },
};

export const AllSizesTemplate: Story = {
  args: {
    title: 'Size',
  },
  render: (args) => (
    <>
      {modalSizeOptions.map((size) => {
        const [open, setOpen] = useState(false);
        const toggleOpen = () => {
          setOpen(!open);
        };
        return (
          <Fragment key={size}>
            <button type="button" onClick={toggleOpen}>
              {size}
            </button>
            <Modal
              {...args}
              size={size}
              isOpen={open}
              onClose={() => {
                setOpen(false);
              }}
            >
              {size}
            </Modal>
          </Fragment>
        );
      })}
    </>
  ),
  name: 'All sizes',
  argTypes: {
    // do not show size in controls table
    size: {
      table: {
        disable: true,
      },
    },
  },
};
