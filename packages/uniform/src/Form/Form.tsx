import type { VetoInstance } from '@fuf-stack/veto';
import type { ReactNode } from 'react';
import type { FieldValues, SubmitHandler } from 'react-hook-form';

import { cn } from '@fuf-stack/pixel-utils';

import { slugify } from '../helpers';
import FormProvider from './subcomponents/FormContext';
import FormDebugViewer from './subcomponents/FormDebugViewer';

export interface FormProps {
  /** form children */
  children: ReactNode | ReactNode[];
  /** CSS class name */
  className?: string | string[];
  /** initial form values */
  initialValues?: FieldValues;
  /** name of the form */
  name?: string;
  /** form submit handler */
  onSubmit: SubmitHandler<FieldValues>;
  /** HTML data-testid attribute used in e2e tests */
  testId?: string;
  /** veto validation schema */
  validation?: VetoInstance;
  /** when the validation should be triggered */
  validationTrigger?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

/**
 * Form component that has to wrap every uniform
 */
const Form = ({
  children,
  className = undefined,
  initialValues = undefined,
  name = undefined,
  onSubmit,
  testId = undefined,
  validation = undefined,
  validationTrigger = 'all',
}: FormProps) => {
  return (
    <FormProvider
      initialValues={initialValues}
      onSubmit={onSubmit}
      validation={validation}
      validationTrigger={validationTrigger}
    >
      {({ handleSubmit }) => (
        <div className="flex w-full flex-row justify-between gap-6">
          <form
            className={cn('flex-grow', className)}
            data-testid={slugify(testId || name || '')}
            name={name}
            onSubmit={handleSubmit}
          >
            {children}
          </form>
          <FormDebugViewer className="w-96 flex-shrink" />
        </div>
      )}
    </FormProvider>
  );
};

export default Form;
