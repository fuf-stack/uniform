import type { ReactNode } from 'react';

import { Input as NextInput } from '@nextui-org/input';

import { cn } from '@fuf-stack/pixel-utils';

import { Controller } from '../Controller';
import { useFormContext } from '../hooks';
import { FieldCopyTestIdButton } from '../partials/FieldCopyTestIdButton';
import { FieldValidationError } from '../partials/FieldValidationError';

export interface InputProps {
  /** CSS class name */
  className?: string;
  /** input field is disabled */
  disabled?: boolean;
  /** added content to the end of the input Field. */
  endContent?: ReactNode;
  /** form field label (set to false to disable label) */
  label?: string | false;
  /** form field name */
  name: string;
  /** form field placeholder */
  placeholder?: string;
  /** content added to the start of the input field */
  startContent?: ReactNode;
  /** HTML data-testid attribute used in e2e tests */
  testId?: string;
  /** allows disentangled display and form values for a field */
  transformValue?: {
    /** transforms the formValue of the field to the display value of the field */
    displayValue: (value: string | number) => string | number;
    /** transforms the displayValue of the field to the form value of the field */
    formValue: (value: string) => string | number;
  };
  /** input type */
  type?: 'number' | 'password';
}

/**
 * Input component based on [NextUI Input](https://nextui.org/docs/components/input)
 */
const Input = ({
  className = undefined,
  disabled = false,
  endContent = undefined,
  label = undefined,
  name,
  placeholder = ' ',
  startContent = undefined,
  testId: _testId = undefined,
  transformValue = undefined,
  type = undefined,
}: InputProps) => {
  const { control, debugMode, getFieldState } = useFormContext();
  const { error, invalid, required, testId } = getFieldState(name, _testId);

  const showTestIdCopyButton = debugMode === 'debug-testids';
  const showLabel = label || showTestIdCopyButton;

  return (
    <Controller
      control={control}
      disabled={disabled}
      name={name}
      render={({
        field: { disabled: isDisabled, onChange, onBlur, value, ref },
      }) => {
        return (
          <NextInput
            className={cn(className)}
            classNames={{
              inputWrapper: 'group-data-[focus=true]:border-focus',
            }}
            data-testid={testId}
            endContent={endContent}
            errorMessage={error && <FieldValidationError error={error} />}
            isDisabled={isDisabled}
            isInvalid={invalid}
            isRequired={required}
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
            name={name}
            onBlur={onBlur}
            onChange={
              type === 'number'
                ? (e) => {
                    onChange(Number(e.target.value));
                  }
                : (e) =>
                    onChange(
                      transformValue && transformValue.formValue
                        ? transformValue.formValue(e.target.value)
                        : e.target.value,
                    )
            }
            placeholder={placeholder}
            radius="sm"
            ref={ref}
            startContent={startContent}
            type={type}
            value={
              transformValue && transformValue.displayValue
                ? transformValue.displayValue(value)
                : value
            }
            variant="bordered"
          />
        );
      }}
    />
  );
};

export default Input;
