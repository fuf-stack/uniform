import type { ReactNode } from 'react';

import { Controller } from 'react-hook-form';

import { Input as NextInput } from '@nextui-org/input';
import cn from 'classnames';

import { useFormContext } from '../hooks';
import FieldCopyTestIdButton from '../partials/FieldCopyTestIdButton';
import FieldValidationError from '../partials/FieldValidationError';

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
  type = undefined,
}: InputProps) => {
  const { control, getFieldState } = useFormContext();
  const { error, invalid, required, testId } = getFieldState(name, _testId);

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
              inputWrapper: 'group-data-[focus=true]:border-primary',
            }}
            data-testid={testId}
            endContent={endContent}
            errorMessage={error && <FieldValidationError error={error} />}
            isDisabled={isDisabled}
            isInvalid={invalid}
            isRequired={required}
            label={
              <>
                {label}
                <FieldCopyTestIdButton testId={testId} />
              </>
            }
            labelPlacement="outside"
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholder}
            radius="sm"
            ref={ref}
            startContent={startContent}
            type={type}
            value={value}
            variant="bordered"
          />
        );
      }}
    />
  );
};

export default Input;
