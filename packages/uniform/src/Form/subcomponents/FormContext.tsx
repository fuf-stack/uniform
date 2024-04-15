import type { VetoInstance } from '@fuf-stack/veto';
import type { FormProviderProps as HookFormProviderProps } from 'react-hook-form';

import React from 'react';
import { FormProvider as HookFormProvider } from 'react-hook-form';

export const ValidationSchemaContext = React.createContext<
  VetoInstance | undefined
>(undefined);

interface FormProviderProps
  extends HookFormProviderProps<Record<string, any>, any, undefined> {
  /** veto validation schema */
  validation?: VetoInstance;
}

/** Provides the veto validation context to the form */
const FormProvider = ({
  children,
  validation = undefined,
  ...hookFormProps
}: FormProviderProps) => {
  return (
    <ValidationSchemaContext.Provider value={validation}>
      <HookFormProvider {...hookFormProps}>{children}</HookFormProvider>
    </ValidationSchemaContext.Provider>
  );
};

export default FormProvider;
