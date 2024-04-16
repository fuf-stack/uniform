import type { VetoInstance } from '@fuf-stack/veto';
import type { ReactNode } from 'react';
import type { FieldValues, SubmitHandler } from 'react-hook-form';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import cn from 'classnames';

import { slugify } from '../helpers';
import FormProvider from './subcomponents/FormContext';
import FormDebugViewer from './subcomponents/FormDebugViewer';

/**
 * recursively removes all fields that are null or undefined before
 * the form data is passed to the veto validation function
 */
export const removeNullishFields = (obj: Record<string, unknown>) => {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      return value === null ? undefined : value;
    }),
  );
};

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
  validationTrigger?:
    | 'onChange'
    | 'onBlur'
    | 'onSubmit'
    | 'onTouched'
    | 'all'
    | 'all-instant';
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
  const methods = useForm(
    validation
      ? {
          defaultValues: initialValues,
          resolver: async (values) => {
            const { data, errors, ...rest } = await validation.validateAsync(
              removeNullishFields(values),
          );
            // https://github.com/react-hook-form/resolvers/blob/master/zod/src/zod.ts
            return { values: data || {}, errors: errors || {}, ...rest };
          },
          // set rhf mode
          // see: https://react-hook-form.com/docs/useform#mode
          mode: validationTrigger === 'all-instant' ? 'all' : validationTrigger,
        }
      : {
          defaultValues: initialValues,
        },
  );

  useEffect(
    () => {
      if (validationTrigger === 'all-instant') {
        methods.trigger();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validationTrigger],
  );

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods} validation={validation}>
      <div className="flex w-full flex-row justify-between gap-6">
        <form
          className={cn('flex-grow', className)}
          data-testid={slugify(testId || name || '')}
          name={name}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          {children}
        </form>
        <FormDebugViewer className="w-96 flex-shrink" />
      </div>
    </FormProvider>
  );
};

export default Form;
