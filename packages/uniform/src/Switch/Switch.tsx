import { Controller } from 'react-hook-form';

import { useInput } from '@nextui-org/input';
import { Switch as NextSwitch } from '@nextui-org/switch';

import { useFormContext } from '../hooks';
import { FieldCopyTestIdButton } from '../partials/FieldCopyTestIdButton';
import { FieldValidationError } from '../partials/FieldValidationError';

export interface SwitchProps {
  /** CSS class name */
  className?: string;
  /** whether the select should be disabled */
  disabled?: boolean;
  /** component displayed next to the switch. */
  label?: React.ReactNode;
  /** name the field is registered under */
  name: string;
  /** HTML data-testid attribute used in e2e tests */
  testId?: string;
}

/**
 *  Switch component based on [NextUI Switch](https://nextui.org/docs/components/switch)
 */
const Switch = ({
  className = undefined,
  disabled = false,
  label: _label = undefined,
  name,
  testId: _testId = undefined,
}: SwitchProps) => {
  const { control, getFieldState } = useFormContext();
  const { error, required, testId, invalid } = getFieldState(name, _testId);

  const { label, getInputProps, getHelperWrapperProps, getErrorMessageProps } =
    useInput({
      errorMessage: JSON.stringify(error),
      isInvalid: invalid,
      isRequired: required,
      label: _label,
      labelPlacement: 'outside',
      placeholder: ' ',
    });

  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      render={({
        field: { disabled: isDisabled, value, ref, onBlur, onChange },
      }) => (
        <>
          <NextSwitch
            aria-describedby={getInputProps()['aria-describedby']}
            required={required}
            isSelected={!!value}
            className={className}
            classNames={{
              label: `text-bold block text-ellipsis text-small ${invalid ? 'text-danger' : ''}`,
            }}
            data-testid={testId}
            isDisabled={isDisabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            ref={ref}
          >
            {label}
            {!!required && !!_label && (
              <span className="!text-danger">{' \u002A'}</span>
            )}
            <FieldCopyTestIdButton testId={testId} />
          </NextSwitch>
          {error && (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <div {...getHelperWrapperProps()}>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <div {...getErrorMessageProps()}>
                <FieldValidationError error={error} />
              </div>
            </div>
          )}
        </>
      )}
    />
  );
};

export default Switch;
