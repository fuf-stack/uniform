import type { VetoError } from '@fuf-stack/veto';

import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FaBug, FaBullseye } from 'react-icons/fa6';

import { cn } from '@fuf-stack/pixel-utils';
import { Button, Card, Json, useLocalStorage } from '@fuf-stack/pixels';

import { useFormContext } from '../../hooks';

interface FormDebugViewerProps {
  /** CSS class name */
  className?: string;
}

const LOCALSTORAGE_DEBUG_KEY = 'uniform:form-debug-enabled';
const LOCALSTORAGE_COPY_TEST_ID_KEY = 'uniform:form-debug-copy-test-id-enabled';

/** Renders a form debug panel with information about the current form state */
const FormDebugViewer = ({ className = undefined }: FormDebugViewerProps) => {
  const {
    watch,
    formState: { dirtyFields, isValid, isSubmitting },
    validation,
  } = useFormContext();

  const [debug, setDebug] = useLocalStorage(LOCALSTORAGE_DEBUG_KEY, false);
  const [copyTestId, setCopyTestId] = useLocalStorage(
    LOCALSTORAGE_COPY_TEST_ID_KEY,
    false,
  );

  const [validationErrors, setValidationErrors] = useState<
    VetoError['errors'] | null
  >(null);

  const formValues = watch();

  useEffect(
    () => {
      const updateValidationErrors = async () => {
        if (validation) {
          const validateResult = await validation?.validateAsync(formValues);
          setValidationErrors(validateResult?.errors);
        }
      };
      updateValidationErrors();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(formValues)],
  );

  if (!debug) {
    return (
      <Button
        ariaLabel="Enable form debug mode"
        onClick={() => setDebug(!debug)}
        className="absolute bottom-2.5 right-2.5 w-5 text-default-400"
        variant="light"
        icon={<FaBug />}
      />
    );
  }

  return (
    <Card
      className={cn(className)}
      header={
        <div className="flex w-full flex-row justify-between">
          <span className="text-lg">Debug Mode</span>
          <Button
            icon={<FaTimes className="text-danger" />}
            onClick={() => setDebug(false)}
            size="sm"
            variant="flat"
          />
        </div>
      }
    >
      <Button
        variant={copyTestId ? 'solid' : 'light'}
        icon={<FaBullseye />}
        className="mb-4 ml-auto mr-auto"
        onClick={() => setCopyTestId(!copyTestId)}
      >
        {copyTestId ? 'Hide CopyButton' : 'Show CopyButton'}
      </Button>
      <Json
        value={{
          values: formValues,
          errors: validationErrors,
          dirtyFields,
          isValid,
          isSubmitting,
        }}
      />
    </Card>
  );
};
export default FormDebugViewer;
