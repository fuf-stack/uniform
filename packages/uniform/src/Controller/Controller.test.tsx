/* eslint-disable react/jsx-props-no-spreading */

import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { veto } from '@fuf-stack/veto';
import * as vt from '@fuf-stack/veto';

import { Form } from '../Form';
import Controller from './Controller';

describe('Controller', () => {
  describe('render function behavior', () => {
    it('should pass disabled state to render function', () => {
      const renderFn = vi
        .fn()
        .mockImplementation(({ field }) => <input {...field} />);

      render(
        <Form onSubmit={() => {}}>
          <Controller name="test" disabled render={renderFn} />
        </Form>,
      );

      const { field } = renderFn.mock.calls[0][0];
      expect(field.disabled).toBe(true);
    });

    it('should pass field props to render function', () => {
      const renderFn = vi
        .fn()
        .mockImplementation(({ field }) => <input {...field} />);

      render(
        <Form onSubmit={() => {}}>
          <Controller name="test" render={renderFn} />
        </Form>,
      );

      const { field } = renderFn.mock.calls[0][0];
      expect(field).toEqual({
        name: 'test',
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: expect.any(Function),
        value: undefined,
      });
    });
  });

  describe('value handling', () => {
    it('should provide initial value as undefined', () => {
      const renderFn = vi
        .fn()
        .mockImplementation(({ field }) => (
          <input data-testid="test_input" {...field} />
        ));

      render(
        <Form onSubmit={() => {}}>
          <Controller name="test" render={renderFn} />
        </Form>,
      );

      const { field } = renderFn.mock.calls[0][0];
      expect(field.value).toBeUndefined();
    });

    it('should pass provided initial value', () => {
      const renderFn = vi
        .fn()
        .mockImplementation(({ field }) => (
          <input data-testid="test_input" {...field} />
        ));

      render(
        <Form onSubmit={() => {}} initialValues={{ test: 'initial value' }}>
          <Controller name="test" render={renderFn} />
        </Form>,
      );

      const { field } = renderFn.mock.calls[0][0];
      expect(field.value).toBe('initial value');
    });

    it('should handle value changes', async () => {
      const renderFn = vi
        .fn()
        .mockImplementation(({ field }) => (
          <input data-testid="test_input" {...field} />
        ));

      render(
        <Form onSubmit={() => {}} initialValues={{ test: '' }}>
          <Controller name="test" render={renderFn} />
        </Form>,
      );

      const input = screen.getByTestId('test_input');
      await userEvent.type(input, 'new value');
      await userEvent.tab();

      const latestCall = renderFn.mock.lastCall?.[0];
      expect(latestCall.field.value).toBe('new value');
    });

    it('should handle number input change', async () => {
      const renderFn = vi
        .fn()
        .mockImplementation(({ field }) => (
          <input type="number" data-testid="test_input" {...field} />
        ));

      render(
        <Form
          onSubmit={() => {}}
          validation={veto({
            test: vt.number(),
          })}
          initialValues={{ test: '' }}
        >
          <Controller name="test" render={renderFn} />
        </Form>,
      );

      const input = screen.getByTestId('test_input');
      await userEvent.type(input, '42');
      await userEvent.tab();

      const latestCall = renderFn.mock.lastCall?.[0];
      expect(latestCall.field.value).toBe('42');
    });
  });

  describe('validation', () => {
    it('should handle required validation', async () => {
      const renderFn = vi
        .fn()
        .mockImplementation(({ field, fieldState }) => (
          <input
            data-testid="test_input"
            aria-invalid={!!fieldState.error}
            {...field}
          />
        ));

      render(
        <Form
          onSubmit={() => {}}
          validation={veto({
            test: vt.string(),
          })}
        >
          <Controller name="test" render={renderFn} />
        </Form>,
      );

      const input = screen.getByTestId('test_input');
      await userEvent.clear(input);
      await userEvent.tab();

      const latestCall = renderFn.mock.lastCall?.[0];
      expect(latestCall.fieldState.error).toBeTruthy();
    });

    it('should validate regex pattern', async () => {
      const renderFn = vi
        .fn()
        .mockImplementation(({ field, fieldState }) => (
          <input
            data-testid="test_input"
            aria-invalid={!!fieldState.error}
            {...field}
          />
        ));

      render(
        <Form
          onSubmit={() => {}}
          validation={veto({
            test: vt.string().regex(/^[a-z0-9\s]+$/i),
          })}
        >
          <Controller name="test" render={renderFn} />
        </Form>,
      );

      const input = screen.getByTestId('test_input');
      await userEvent.type(input, 'invälid');
      await userEvent.tab();

      const latestCall = renderFn.mock.lastCall?.[0];
      expect(latestCall.fieldState.error).toBeTruthy();
    });

    it('should provide validation status', async () => {
      const renderFn = vi
        .fn()
        .mockImplementation(({ field, fieldState }) => (
          <input
            data-testid="test_input"
            aria-invalid={!!fieldState.error}
            {...field}
          />
        ));

      render(
        <Form
          onSubmit={() => {}}
          validation={veto({
            test: vt.string().min(3),
          })}
        >
          <Controller name="test" render={renderFn} />
        </Form>,
      );

      const input = screen.getByTestId('test_input');

      // Invalid input
      await userEvent.type(input, 'ab');
      await userEvent.tab();

      let latestCall = renderFn.mock.lastCall?.[0];
      expect(latestCall.fieldState.invalid).toBe(true);

      // Valid input
      await userEvent.clear(input);
      await userEvent.type(input, 'valid');
      await userEvent.tab();

      latestCall = renderFn.mock.lastCall?.[0];
      expect(latestCall.fieldState.invalid).toBe(false);
    });
  });
});
