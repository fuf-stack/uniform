import type { Meta, StoryObj } from '@storybook/react';

import { action } from '@storybook/addon-actions';
import { userEvent, within } from '@storybook/test';

import { SubmitButton } from '@fuf-stack/uniform';
import { veto } from '@fuf-stack/veto';
import * as vt from '@fuf-stack/veto';

import { Form } from '../Form';
import TextArea from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'uniform/TextArea',
  component: TextArea,
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
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {
    name: 'textareaField',
  },
};

export const WithInitialValue: Story = {
  parameters: {
    formProps: {
      initialValues: {
        textareaField:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      },
    },
  },
  args: {
    name: 'textareaField',
  },
};

const requiredValidation = veto({
  textareaField: vt.string(),
});

export const Required: Story = {
  parameters: { formProps: { validation: requiredValidation } },
  args: {
    label: 'textareaField',
    name: 'textareaField',
  },
};

const validation = veto({
  textareaField: vt
    .string()
    .regex(
      /^[a-z0-9\s]+$/i,
      'Must only contain alphanumeric characters and spaces.',
    )
    .min(2),
});

export const Invalid: Story = {
  parameters: {
    formProps: { validation },
  },
  args: {
    label: 'Text Area',
    name: 'textareaField',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('textareafield');
    await userEvent.type(input, 'invälid', {
      delay: 100,
    });
  },
};
