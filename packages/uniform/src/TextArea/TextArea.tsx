import type { ReactNode } from 'react';

import { Controller } from 'react-hook-form';

import { Textarea as NextTextArea } from '@nextui-org/input';

import { cn } from '@fuf-stack/pixel-utils';

import { useFormContext } from '../hooks';
import { FieldCopyTestIdButton } from '../partials/FieldCopyTestIdButton';
import { FieldValidationError } from '../partials/FieldValidationError';

export interface TextAreaProps {
  /** Child components. The content of the textarea. */
  children?: ReactNode;
  /** CSS class name */
  className?: string;
  /** Determines if the TextArea is disabled or not. */
  disabled?: boolean;
  /** Label displayed above the TextArea. */
  label?: ReactNode;
  /** Name the TextArea is registered at in HTML forms (react-hook-form). */
  name: string;
  /** placeholder for the textArea content. */
  placeholder?: string;
  /** Id to grab element in internal tests. */
  testId?: string;
}

/**
 * TextArea component based on [NextUI TextArea](https://nextui.org/docs/components/textarea)
 */
const TextArea = ({
  children = null,
  className = undefined,
  disabled = false,
  label = undefined,
  name,
  placeholder = ' ',
  testId: _testId = undefined,
}: TextAreaProps) => {
  const { control, debugMode, getFieldState } = useFormContext();
  const { error, invalid, required, testId } = getFieldState(name, _testId);

  const showTestIdCopyButton = debugMode === 'debug-testids';
  const showLabel = label || showTestIdCopyButton;

  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      render={({
        field: { disabled: isDisabled, onChange, onBlur, value, ref },
      }) => {
        return (
          <NextTextArea
            className={cn(className)}
            classNames={{
              inputWrapper: 'group-data-[focus=true]:border-focus',
            }}
            data-testid={testId}
            errorMessage={error && <FieldValidationError error={error} />}
            isDisabled={isDisabled}
            isRequired={required}
            isInvalid={invalid}
            label={
              showLabel && (
                <>
                  {label}
                  {showTestIdCopyButton && (
                    <FieldCopyTestIdButton testId={testId} />
                  )}
                </>
              )
            }
            labelPlacement="outside"
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            variant="bordered"
          >
            {children}
          </NextTextArea>
        );
      }}
    />
  );
};

export default TextArea;
