import { Controller } from 'react-hook-form';

import {
  Checkbox,
  CheckboxGroup as NextCheckboxGroup,
} from '@nextui-org/checkbox';

import { slugify } from '../helpers';
import { useFormContext } from '../hooks';
import { FieldCopyTestIdButton } from '../partials/FieldCopyTestIdButton';
import { FieldValidationError } from '../partials/FieldValidationError';

export type CheckboxGroupOption = {
  /** option label */
  label?: React.ReactNode;
  /** option value */
  value: string;
  /** disables the option */
  disabled?: boolean;
  /** HTML data-testid attribute of the option */
  testId?: string;
};

export interface CheckboxGroupProps {
  /** CSS class name. ClassName: string | { buttons?: string | { base?: string; active?: string }; base?: string;} */
  className?: string;
  /** label displayed above the Checkboxes */
  label?: React.ReactNode;
  /** Name the Field is registered on the form. */
  name: string;
  /** Checkboxes that should be displayed. */
  options: CheckboxGroupOption[];
  /** sets all buttons disabled */
  disabled?: boolean;
  /** id for internal testing. */
  testId?: string;
}

/**
 * CheckboxGroup component based on [NextUI CheckboxGroup](https://nextui.org/docs/components/checkbox-group)
 */
const CheckboxGroup = ({
  className = undefined,
  label = undefined,
  options,
  disabled = false,
  name,
  testId: _testId = undefined,
}: CheckboxGroupProps) => {
  const { getFieldState, control } = useFormContext();
  const { error, invalid, required, testId } = getFieldState(name, _testId);

  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      render={({ field: { onChange, value, ref, onBlur } }) => {
        return (
          <NextCheckboxGroup
            className={className}
            data-testid={testId}
            errorMessage={error && <FieldValidationError error={error} />}
            isDisabled={disabled}
            isInvalid={invalid}
            isRequired={required}
            label={
              label && (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <label
                  className={`text-bold text-ellipsis text-small ${invalid ? 'text-danger' : 'text-foreground-500'}`}
                >
                  {label}
                  <FieldCopyTestIdButton testId={testId} />
                </label>
              )
            }
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(options.length === 1
              ? {
                  value: [value].filter((v) => v !== undefined),
                  onChange: (newValue) => onChange(newValue && newValue[0]),
                }
              : {
                  onChange,
                  value,
                })}
            onBlur={onBlur}
            ref={ref}
          >
            {options?.map((option) => {
              return (
                <Checkbox
                  key={`index_${option.value}`}
                  isDisabled={disabled || option.disabled}
                  value={option?.value}
                  data-testid={slugify(
                    `${testId}_option_${option?.testId || option?.value}`,
                  )}
                >
                  {option?.label}
                </Checkbox>
              );
            })}
          </NextCheckboxGroup>
        );
      }}
    />
  );
};

export default CheckboxGroup;
