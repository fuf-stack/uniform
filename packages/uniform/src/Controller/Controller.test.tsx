/* eslint-disable react/jsx-props-no-spreading */
import { describe, expect, it, vi } from 'vitest';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { veto } from '@fuf-stack/veto';
import * as vt from '@fuf-stack/veto';

import '@testing-library/jest-dom/vitest';

import { Form } from '../Form';
import Controller from './Controller';

const defaultOnSubmit = vi.fn();

describe.skip('Controller', () => {
  describe('value conversion', () => {
    it('should convert empty string to null in form state', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();

      render(
        <Form onSubmit={onSubmit} testId="test_form">
          <Controller
            name="test"
            render={({ field }) => (
              <input data-testid="test_input" {...field} />
            )}
          />
        </Form>,
      );

      const input = screen.getByTestId('test_input');
      const form = screen.getByTestId('test_form');

      await user.clear(input);
      await user.click(input);
      await user.tab(); // trigger blur

      form.submit();

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ test: null }),
          expect.anything(),
        );
      });
    });

    it('should convert null to empty string in UI', () => {
      render(
        <Form
          onSubmit={defaultOnSubmit}
          initialValues={{ test: null }}
          data-testid="test-form"
        >
          <Controller
            name="test"
            render={({ field }) => (
              <input data-testid="test_input" {...field} />
            )}
          />
        </Form>,
      );

      const input = screen.getByTestId('test_input');
      expect(input).toHaveValue('');
    });

    it('should handle number input conversion', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();

      render(
        <Form
          onSubmit={onSubmit}
          validation={veto({
            test: vt.number(),
          })}
          data-testid="test-form"
        >
          <Controller
            name="test"
            render={({ field }) => (
              <input type="number" data-testid="test_input" {...field} />
            )}
          />
        </Form>,
      );

      const input = screen.getByTestId('test_input');
      const form = screen.getByTestId('test-form');

      await user.type(input, '42');
      await user.tab(); // trigger blur

      form.submit();

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ test: 42 }),
          expect.anything(),
        );
      });
    });
  });

  describe('validation', () => {
    it('should handle required validation', async () => {
      const user = userEvent.setup();

      render(
        <Form
          onSubmit={defaultOnSubmit}
          validation={veto({
            test: vt.string(),
          })}
        >
          <Controller
            name="test"
            render={({ field, fieldState }) => (
              <input
                data-testid="test_input"
                aria-invalid={!!fieldState.error}
                {...field}
              />
            )}
          />
        </Form>,
      );

      const input = screen.getByTestId('test_input');
      await user.clear(input);
      await user.tab(); // trigger blur

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should validate regex pattern', async () => {
      const user = userEvent.setup();

      render(
        <Form
          onSubmit={defaultOnSubmit}
          validation={veto({
            test: vt.string().regex(/^[a-z0-9\s]+$/i),
          })}
        >
          <Controller
            name="test"
            render={({ field, fieldState }) => (
              <input
                data-testid="test_input"
                aria-invalid={!!fieldState.error}
                {...field}
              />
            )}
          />
        </Form>,
      );

      const input = screen.getByTestId('test_input');
      await user.type(input, 'invälid');
      await user.tab(); // trigger blur

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  describe('form integration', () => {
    it('should handle initial values', () => {
      render(
        <Form
          onSubmit={defaultOnSubmit}
          initialValues={{ test: 'initial value' }}
        >
          <Controller
            name="test"
            render={({ field }) => (
              <input data-testid="test_input" {...field} />
            )}
          />
        </Form>,
      );

      const input = screen.getByTestId('test_input');
      expect(input).toHaveValue('initial value');
    });

    it('should handle disabled state', () => {
      render(
        <Form onSubmit={defaultOnSubmit}>
          <Controller
            name="test"
            render={({ field }) => (
              <input data-testid="test_input" disabled {...field} />
            )}
          />
        </Form>,
      );

      const input = screen.getByTestId('test_input');
      expect(input).toHaveAttribute('disabled');
    });
  });
});
