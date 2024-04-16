import type { ButtonProps } from '@fuf-stack/pixels/Button';
import type { ReactNode } from 'react';

import cn from 'classnames';

import Button from '@fuf-stack/pixels/Button';

import { slugify } from '../helpers';
import { useFormContext } from '../hooks';

export interface SubmitButtonProps {
  /** child components */
  children?: ReactNode;
  /** CSS class name */
  className?: string | string[];
  /** color of the button */
  color?: ButtonProps['color'];
  /** If set loading animation is shown */
  loading?: boolean;
  /** function called when the button is pressed. */
  onClick?: ButtonProps['onClick'];
  /** HTML data-testid attribute used in e2e tests */
  testId?: string;
}

/**
 * From SubmitButton
 */
const SubmitButton = ({
  children = 'Submit',
  className = undefined,
  color = 'success',
  loading = false,
  onClick = undefined,
  testId = 'form_submit_button',
}: SubmitButtonProps) => {
  const {
    formState: { isValid, isSubmitting, isValidating },
  } = useFormContext();

  return (
    <Button
      className={cn(className)}
      color={color}
      testId={slugify(testId)}
      disabled={!isValid || isSubmitting || isValidating}
      loading={loading}
      onClick={onClick}
      type="submit"
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
