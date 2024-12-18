import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { veto } from '@fuf-stack/veto';
import * as vt from '@fuf-stack/veto';

import '@testing-library/jest-dom/vitest';

import Form from './Form';

describe('Form', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(
        <Form onSubmit={() => {}}>
          <div data-testid="child">child content</div>
        </Form>,
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should apply className', () => {
      render(
        <Form onSubmit={() => {}} className="custom-class">
          <div>content</div>
        </Form>,
      );

      const form = screen.getByTestId('');
      expect(form).toHaveClass('custom-class', 'flex-grow');
    });

    it('should apply multiple classNames', () => {
      render(
        <Form onSubmit={() => {}} className={['class1', 'class2']}>
          <div>content</div>
        </Form>,
      );

      const form = screen.getByTestId('');
      expect(form).toHaveClass('class1', 'class2', 'flex-grow');
    });

    it('should set form name', () => {
      render(
        <Form onSubmit={() => {}} name="test-form">
          <div>content</div>
        </Form>,
      );

      const form = screen.getByTestId('test_form');
      expect(form).toHaveAttribute('name', 'test-form');
    });

    it('should set testId', () => {
      render(
        <Form onSubmit={() => {}} testId="test-form-id">
          <div>content</div>
        </Form>,
      );

      expect(screen.getByTestId('test_form_id')).toBeInTheDocument();
    });

    it('should generate testId from name if testId not provided', () => {
      render(
        <Form onSubmit={() => {}} name="Test Form Name">
          <div>content</div>
        </Form>,
      );

      expect(screen.getByTestId('test_form_name')).toBeInTheDocument();
    });

    it('should not render FormDebugViewer in test environment', () => {
      render(
        <Form onSubmit={() => {}}>
          <div>content</div>
        </Form>,
      );

      const formWrapper = screen.getByTestId('').parentElement;
      expect(formWrapper?.children).toHaveLength(1);
    });
  });

  describe('form handling', () => {
    it('should call onSubmit when form is submitted', async () => {
      const handleSubmit = vi.fn();
      const user = userEvent.setup();

      render(
        <Form onSubmit={handleSubmit}>
          <button type="submit">Submit</button>
        </Form>,
      );

      await user.click(screen.getByRole('button'));
      expect(handleSubmit).toHaveBeenCalled();
    });

    it('should handle initial values', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      const initialValues = { test: 'initial' };

      render(
        <Form onSubmit={handleSubmit} initialValues={initialValues}>
          <input name="test" data-testid="input" />
          <button type="submit">Submit</button>
        </Form>,
      );

      await user.click(screen.getByRole('button'));
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining(initialValues),
        expect.anything(),
      );
    });
  });

  describe('validation', () => {
    it('should validate according to validation schema', async () => {
      const handleSubmit = vi.fn();
      const user = userEvent.setup();

      render(
        <Form
          onSubmit={handleSubmit}
          validation={veto({
            test: vt.string().min(3),
          })}
        >
          <input name="test" data-testid="input" />
          <button type="submit">Submit</button>
        </Form>,
      );

      const input = screen.getByTestId('input');
      await user.type(input, 'ab');
      await user.click(screen.getByRole('button'));

      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('should respect validation trigger setting', async () => {
      const handleSubmit = vi.fn();
      const user = userEvent.setup();

      render(
        <Form
          onSubmit={handleSubmit}
          validation={veto({
            test: vt.string().min(3),
          })}
          validationTrigger="onSubmit"
        >
          <input name="test" data-testid="input" />
          <button type="submit">Submit</button>
        </Form>,
      );

      const input = screen.getByTestId('input');
      await user.type(input, 'ab');
      await user.tab();
      await user.click(screen.getByRole('button'));

      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  describe('debug mode', () => {
    it('should not render debug viewer when debug.disable is true', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <Form onSubmit={() => {}} debug={{ disable: true }}>
          <div>content</div>
        </Form>,
      );

      const formWrapper = screen.getByTestId('').parentElement;
      expect(formWrapper?.children).toHaveLength(1);

      process.env.NODE_ENV = originalEnv;
    });
  });
});
