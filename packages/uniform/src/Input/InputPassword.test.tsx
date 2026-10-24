import type { InputProps } from './Input';

import { describe, expect, it, vi } from 'vitest';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { string, veto } from '@fuf-stack/veto';

import Form from '../Form';
import { useFormContext } from '../hooks/useFormContext';
import Input from './Input';

const ResetButton = () => {
  const { reset } = useFormContext();
  return (
    <button type="button" onClick={() => reset()}>
      Reset
    </button>
  );
};

const setup = (props: Partial<InputProps> = {}) => {
  const onSubmit = vi.fn();
  render(
    <Form
      debug={{ disable: true }}
      initialValues={{ password: 'Initial_123' }}
      onSubmit={onSubmit}
      validation={veto({ password: string().min(8) })}
    >
      <Input
        debounceDelay={0}
        name="password"
        label="Password"
        type="password"
        {...props}
      />
      <button type="submit">Submit</button>
      <ResetButton />
    </Form>,
  );
  return { onSubmit, input: screen.getByTestId('password') };
};

describe('Password input visibility', () => {
  it('toggles masking without submitting or changing the registered value', async () => {
    const { input, onSubmit } = setup();
    expect(input).toHaveAttribute('type', 'password');
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle).toHaveAttribute('aria-controls', input.id);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    input.focus();
    fireEvent.mouseDown(toggle);
    fireEvent.click(toggle);
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('Initial_123');
    expect(toggle).toHaveAccessibleName('Hide password');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0][0]).toEqual({ password: 'Initial_123' });
  });

  it('keeps user updates and validation working while revealed', async () => {
    const { input, onSubmit } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    fireEvent.change(input, { target: { value: 'short' } });
    fireEvent.blur(input);
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: 'Updated_123' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0][0]).toEqual({ password: 'Updated_123' });
  });

  it('remasks and restores the initial value on reset', async () => {
    const { input } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    fireEvent.change(input, { target: { value: 'Updated_123' } });
    fireEvent.click(screen.getByText('Reset'));
    await waitFor(() => expect(input).toHaveValue('Initial_123'));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('remasks when reused with another field name or input type', () => {
    const renderField = (
      name: string,
      type: InputProps['type'] = 'password',
    ) => (
      <Form debug={{ disable: true }} onSubmit={vi.fn()}>
        <Input name={name} type={type} />
      </Form>
    );
    const { rerender } = render(renderField('firstPassword'));
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(screen.getByTestId('firstpassword')).toHaveAttribute('type', 'text');
    rerender(renderField('secondPassword'));
    expect(screen.getByTestId('secondpassword')).toHaveAttribute(
      'type',
      'password',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    rerender(renderField('secondPassword', 'number'));
    expect(
      screen.queryByRole('button', { name: 'Hide password' }),
    ).not.toBeInTheDocument();
    rerender(renderField('secondPassword'));
    expect(screen.getByTestId('secondpassword')).toHaveAttribute(
      'type',
      'password',
    );
  });

  it('supports opting out and leaves text inputs without a toggle', () => {
    const { input } = setup({ hidePasswordToggle: true });
    expect(input).toHaveAttribute('type', 'password');
    expect(
      screen.queryByRole('button', { name: 'Show password' }),
    ).not.toBeInTheDocument();
  });

  it('does not add a toggle to ordinary inputs', () => {
    setup({ type: undefined });
    expect(
      screen.queryByRole('button', { name: 'Show password' }),
    ).not.toBeInTheDocument();
  });

  it('disables the toggle with the input', () => {
    const { input } = setup({ disabled: true });
    expect(input).toBeDisabled();
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle).toBeDisabled();
    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('preserves custom content beside separate clear and reveal buttons', async () => {
    const onClear = vi.fn();
    const { input } = setup({
      clearable: true,
      endContent: <span>Custom content</span>,
      onClear,
    });
    expect(screen.getByText('Custom content')).toBeVisible();
    const clear = screen.getByRole('button', { name: 'clear input' });
    const reveal = screen.getByRole('button', { name: 'Show password' });
    expect(clear.contains(reveal)).toBe(false);
    fireEvent.click(reveal);
    fireEvent.click(clear);
    await waitFor(() => expect(input).toHaveValue(''));
    expect(input).toHaveAttribute('type', 'password');
    expect(onClear).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole('button', { name: 'clear input' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show password' })).toBeVisible();
  });

  it('preserves Escape-to-clear for clearable password inputs', async () => {
    const onClear = vi.fn();
    const { input } = setup({ clearable: true, onClear });
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    fireEvent.keyDown(input, { key: 'Escape' });
    await waitFor(() => expect(input).toHaveValue(''));
    expect(input).toHaveAttribute('type', 'password');
    expect(onClear).toHaveBeenCalledOnce();
  });
});
