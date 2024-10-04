import type { VetoInstance } from '@fuf-stack/veto';
import type { ReactNode } from 'react';
import type { FieldValues, SubmitHandler } from 'react-hook-form';

import React, { useMemo, useState } from 'react';
import { FormProvider as HookFormProvider, useForm } from 'react-hook-form';

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

/**
 * The `UniformContext` provides the form submission state (`canSubmit`) and the ability to control
 * submission behavior (`setCanSubmit`). Additionally, it may provide an optional `validation` schema
 * (from Veto) for form validation purposes.
 *
 * This context is used by components that need to control or be aware of the form submission state,
 * or that require access to the validation schema for managing validation logic.
 *
 * The context's default value is `undefined` until provided by the `FormProvider` component.
 */
export const UniformContext = React.createContext<
  | {
      /** Whether the form can be submitted */
      canSubmit: boolean;
      /** Function to update the form's submission state (enabled/disabled) */
      setCanSubmit: React.Dispatch<React.SetStateAction<boolean>>;
      /** Optional Veto validation schema instance for form validation */
      validation?: VetoInstance;
    }
  | undefined
>(undefined);

// Define props for the FormProvider component, extending HookForm's props
interface FormProviderProps {
  /** children form render function */
  children: (childProps: {
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  }) => ReactNode;
  /** initial form values */
  initialValues?: FieldValues;
  /** form submit handler */
  onSubmit: SubmitHandler<FieldValues>;
  /** Veto validation schema instance */
  validation?: VetoInstance;
  /** when the validation should be triggered */
  validationTrigger: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

/**
 * FormProvider component provides both:
 * 1. The veto validation schema context
 * 2. The form submission control context
 */
const FormProvider: React.FC<FormProviderProps> = ({
  children,
  initialValues = undefined,
  onSubmit,
  validation = undefined,
  validationTrigger,
}) => {
  // Local state to control if form can be submitted
  const [canSubmit, setCanSubmit] = useState(true);

  // Memoize the context value to prevent re-renders
  const contextValue = useMemo(
    () => ({ canSubmit, setCanSubmit, validation }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canSubmit],
  );

  // Initialize react hook form
  const methods = useForm({
    defaultValues: initialValues,
    // add validation config when validation schema provided
    ...(validation
      ? {
          // set rhf mode
          // see: https://react-hook-form.com/docs/useform#mode
          mode: validationTrigger,
          resolver: async (values) => {
            const { data, errors, ...rest } = await validation.validateAsync(
              removeNullishFields(values),
            );
            // https://github.com/react-hook-form/resolvers/blob/master/zod/src/zod.ts
            return { values: data || {}, errors: errors || {}, ...rest };
          },
        }
      : {}),
  });

  // Create submit handler
  const handleSubmit = async (e?: React.BaseSyntheticEvent) => {
    if (!canSubmit) {
      console.warn(
        '[FormProvider] form submit was canceled canSubmit is false...',
      );
      return;
    }
    await methods.handleSubmit(onSubmit)(e);
  };

  return (
    <UniformContext.Provider value={contextValue}>
      {/* Spread all hook form props into HookFormProvider */}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <HookFormProvider {...methods}>
        {children({ handleSubmit })}
      </HookFormProvider>
    </UniformContext.Provider>
  );
};

export default FormProvider;
