import type { Meta, StoryObj } from '@storybook/react-vite';
import type { SelectProps } from './Select';

import { useState } from 'react';

import edgeCaseDecorator from '@repo/storybook-config/edge-case-decorator';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button, Card, Modal } from '@fuf-stack/pixels';

import { useFormContext } from '../hooks/useFormContext';
import Select from './Select';
import meta, { Default } from './Select.stories';

const edgeCaseMeta: Meta<typeof Select> = {
  ...meta,
  title: 'uniform/Select/Edge Cases',
  decorators: [...(meta.decorators ?? []), edgeCaseDecorator],
};

export default edgeCaseMeta;
type Story = StoryObj<typeof Select>;

const { args } = Default;

export const EdgeCaseMenuIsVisibleInCard: Story = {
  name: 'Menu Is Visible in Card',
  parameters: {
    edgeCaseDescription:
      'Opening a Select inside a card keeps its option menu visible rather than clipped by the card.',
  },
  args,
  render: (renderArgs) => {
    return (
      <Card header="Select in a Card">
        <Select {...renderArgs} />
      </Card>
    );
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement?.parentElement as HTMLElement);
    const dropdown = body.getByTestId('selectfield_select_dropdown')
      .parentElement as HTMLElement;
    await userEvent.click(dropdown, { delay: 100 });
    // The option portal is inserted before the menu transition finishes.
    // Wait for visibility so parallel browser workers do not race the animation.
    await waitFor(() => {
      expect(
        body.getByTestId('selectfield_select_option_vanilla'),
      ).toBeVisible();
    });
  },
};

export const EdgeCaseMenuIsVisibleInModal: Story = {
  name: 'Menu Is Visible in Modal',
  parameters: {
    edgeCaseDescription:
      'Opening a Select inside a modal keeps its option menu visible above the modal content.',
  },
  args,
  render: (renderArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button
          onClick={() => {
            setOpen(true);
          }}
          testId="open_modal"
        >
          Open Modal
        </Button>
        <Modal
          header="Select in a Modal"
          isOpen={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <Select {...renderArgs} />
        </Modal>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    // open modal
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId('open_modal');
    await userEvent.click(trigger, { delay: 100 });
    // open menu
    const body = within(canvasElement?.parentElement as HTMLElement);
    const dropdown = body.getByTestId('selectfield_select_dropdown')
      .parentElement as HTMLElement;
    await userEvent.click(dropdown, { delay: 100 });
    // The option portal is inserted before the modal/menu transition finishes.
    // Wait for visibility so parallel browser workers do not race the animation.
    await waitFor(() => {
      expect(
        body.getByTestId('selectfield_select_option_vanilla'),
      ).toBeVisible();
    });
  },
};

// Simulates fetched data (in real usage this would come from Relay useLazyLoadQuery)
const FETCHED_DATA: Record<string, { id: string; name: string }> = {
  secret_flavor: { id: 'secret_flavor', name: 'Secret Flavor' },
  another_secret: { id: 'another_secret', name: 'Another Secret' },
};

// Simulates a hook that fetches option data by ID (like a Relay query)
const useFetchOptionData = (value: string | null) => {
  // In real usage: const data = useLazyLoadQuery(ThingQuery, { id: value });
  // Here we simulate with a lookup
  if (!value) {
    return null;
  }
  return FETCHED_DATA[value] ?? null;
};

// Shared component to render an option label (used for both dropdown and selected)
const OptionLabel = ({ name }: { name: string }) => {
  return <span className="font-medium">{name}</span>;
};

/**
 * Wrapper component that handles fetching fallback data.
 * This demonstrates the pattern for async selects with Relay.
 */
const SelectWithFallbackFetch = ({ options, ...props }: SelectProps) => {
  const { watch } = useFormContext();
  const currentValue = watch('selectField') as string | null;

  // Check if current value is in options
  const isInOptions = options?.some((o) => {
    return o.value === currentValue;
  });

  // Fetch data for fallback value (when not in options)
  // In real usage: useLazyLoadQuery only when !isInOptions && currentValue
  const fetchedData = useFetchOptionData(
    !isInOptions && currentValue ? currentValue : null,
  );

  // Build fallback option from fetched data
  const selectedOptionFallback = fetchedData
    ? {
        label: fetchedData.name,
        // Pass extra data needed by renderOptionLabel
        node: fetchedData,
        value: fetchedData.id,
      }
    : undefined;

  return (
    <Select
      {...props}
      options={options}
      renderOptionLabel={(data) => {
        const option = data as {
          isFallback?: boolean;
          label?: string;
          node?: { name: string };
        };
        // For fallback options that we fetched, use node.name
        // For regular options from the list, use label
        const name = option.node?.name ?? option.label ?? '';
        return <OptionLabel name={name} />;
      }}
      selectedOptionFallback={selectedOptionFallback}
    />
  );
};

/**
 * Edge case: Fetching fallback option data outside renderOptionLabel.
 *
 * For async selects, when the form has an initial value (or a previously
 * selected value) that's not in the current options list:
 * 1. Watch the form value
 * 2. Check if it's in the options list
 * 3. If not, fetch the data (e.g., via Relay useLazyLoadQuery)
 * 4. Pass fetched option via selectedOption prop
 * 5. renderOptionLabel renders the same component for all options
 */
export const EdgeCaseFetchFallbackOutside: Story = {
  name: 'Fetch Fallback Outside',
  parameters: {
    edgeCaseDescription:
      'A selected value missing from the current options gets a readable label from separately fetched fallback data.',
    formProps: { initialValues: { selectField: 'secret_flavor' } },
  },
  render: (renderArgs) => {
    return <SelectWithFallbackFetch {...renderArgs} />;
  },
  args: {
    ...args,
    // Options don't include 'secret_flavor'
  },
};
