import type { Meta, StoryObj } from '@storybook/react-vite';
import type FieldCard from './FieldCard';

import edgeCaseDecorator from '@repo/storybook-config/edge-case-decorator';
import { expect, userEvent, within } from 'storybook/test';

import { object, string, veto } from '@fuf-stack/veto';

import Input from '../Input';
import meta from './FieldCard.stories';

const edgeCaseMeta: Meta<typeof FieldCard> = {
  ...meta,
  title: 'uniform/FieldCard/Edge Cases',
  decorators: [...(meta.decorators ?? []), edgeCaseDecorator],
};

export default edgeCaseMeta;
type Story = StoryObj<typeof FieldCard>;

// =============================================================================
// EDGE CASES
// =============================================================================

const validationOptionalNickname = veto({
  user: object({
    username: string().min(3, 'Username must be at least 3 characters'),
    nickname: string().optional(),
  }),
});

/**
 * Edge case: Touching an optional field should NOT trigger error styling.
 *
 * The card should only show errors when:
 * - A required field is touched and invalid, or
 * - An object-level error exists and any field is touched
 *
 * Touching just an optional empty field? No danger styling.
 */
export const EdgeCaseOptionalFieldTouched: Story = {
  name: 'Optional Field Touch',
  parameters: {
    edgeCaseDescription:
      'Touching an empty optional field must not mark its card or untouched required siblings as invalid.',
    formProps: { validation: validationOptionalNickname },
  },
  args: {
    name: 'user',
    label: 'User Profile',
    children: (
      <>
        <Input label="Username" name="user.username" />
        <Input label="Nickname (optional)" name="user.nickname" />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const fieldCardLabel = canvas.getByRole('heading', {
      name: /user profile/i,
    });

    // Touch ONLY the optional nickname field
    const nicknameInput = canvas.getByTestId('user_nickname');
    await userEvent.click(nicknameInput);
    await userEvent.tab();

    // Wait a moment for validation
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    // Card should NOT be danger - optional field has no error
    expect(fieldCardLabel).not.toHaveClass('text-danger');

    // No errors should be visible
    expect(canvas.queryByTestId('user_nickname_error')).not.toBeInTheDocument();
    expect(canvas.queryByTestId('user_username_error')).not.toBeInTheDocument();
    expect(canvas.queryByTestId('user_error')).not.toBeInTheDocument();
  },
};
