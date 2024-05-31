import type { Meta, StoryObj } from '@storybook/react';

import { FaEnvelope } from 'react-icons/fa';

import { action } from '@storybook/addon-actions';
import { expect, userEvent, within } from '@storybook/test';

import { SubmitButton } from '@fuf-stack/uniform';

// import v, * as vt from '@fuf-stack/veto';

import Form from '../Form';
import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'uniform/Input',
  component: Input,
  decorators: [
    (Story, { parameters }) => (
      <Form {...(parameters?.formProps || {})} onSubmit={action('onSubmit')}>
        <Story />
        <div className="mt-4 flex justify-end">
          <SubmitButton />
        </div>
      </Form>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    name: 'inputField',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Some Label',
    name: 'inputField',
  },
};

export const WithInitialValue: Story = {
  // parameters: { formProps: { initialValues: { inputField: 'initial value' } } },
  args: {
    name: 'inputField',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('inputfield');
    const inputValue = input.getAttribute('value');
    await expect(inputValue).toBe('initial value');
  },
};

export const Required: Story = {
  // parameters: {
  //   formProps: {
  //     validation: v({
  //       inputField: vt.string(),
  //     }),
  //   },
  // },
  args: {
    label: 'Input Field',
    name: 'inputField',
  },
};

export const Disabled: Story = {
  // parameters: {
  //   formProps: {
  //     validation: v({
  //       inputField: vt.string(),
  //     }),
  //   },
  // },
  args: {
    label: 'Input Field',
    name: 'inputField',
    disabled: true,
  },
};

export const Invalid: Story = {
  // parameters: {
  //   formProps: {
  //     validation: v({
  //       inputField: vt
  //         .string()
  //         .regex(
  //           /^[a-z0-9\s]+$/i,
  //           'Must only contain alphanumeric characters and spaces.',
  //         )
  //         .min(2)
  //         .optional(),
  //     }),
  //   },
  // },
  args: {
    label: 'InvalidField',
    name: 'inputField',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('inputfield');
    await userEvent.type(input, 'invälid', {
      delay: 100,
    });
    const inputInvalid = input.getAttribute('aria-invalid');
    await expect(inputInvalid).toBe('true');
  },
};

export const WithSelect: Story = {
  args: {
    name: 'inputField',
    startContent: <FaEnvelope />,
    endContent: (
      <select
        className="border-0 bg-transparent text-small text-default-400 outline-none"
        id="currency"
        name="currency"
      >
        <option>@ger.win.int.kn.</option>
        <option>@corp.int.kn</option>
        <option>@usa.win.int.kn</option>
      </select>
    ),
  },
};
