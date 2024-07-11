import type { Meta, StoryObj } from '@storybook/react';

import { action } from '@storybook/addon-actions';
import { userEvent, within } from '@storybook/test';

import { SubmitButton } from '@fuf-stack/uniform';
import { veto } from '@fuf-stack/veto';
import * as vt from '@fuf-stack/veto';

import { Form } from '../Form';
import Switch from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'uniform/Switch',
  component: Switch,
  decorators: [
    (Story, { parameters }) => (
      <Form
        className="min-w-60"
        onSubmit={action('onSubmit')}
        {...(parameters?.formProps || {})}
      >
        <Story />
        <div className="mt-4 flex justify-end">
          <SubmitButton />
        </div>
      </Form>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    name: 'switchField',
  },
};

export const WithInitialValue: Story = {
  parameters: {
    formProps: { initialValues: { switchField: true } },
  },
  args: {
    name: 'switchField',
  },
};

export const Disabled: Story = {
  args: {
    name: 'switchField',
    disabled: true,
  },
};

const requiredValidation = veto({
  switchField: vt.boolean(),
});

export const Required: Story = {
  parameters: { formProps: { validation: requiredValidation } },
  args: {
    label: 'switchField',
    name: 'switchField',
  },
};

const validation = veto({
  switchField: vt
    .boolean()
    .refine((value) => !value, 'I want to be switched off'),
});

export const Invalid: Story = {
  parameters: { formProps: { validation } },
  args: {
    label: 'switch',
    name: 'switchField',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('switchfield');
    await userEvent.click(input, {
      delay: 300,
    });
  },
};
