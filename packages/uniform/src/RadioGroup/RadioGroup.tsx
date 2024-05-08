import type { ReactElement, ReactNode } from 'react';

import { Controller } from 'react-hook-form';

import { ButtonGroup as NextButtonGroup } from '@nextui-org/button';
import { RadioGroup as NextRadioGroup, Radio } from '@nextui-org/radio';
import cn from 'classnames';

import { slugify } from '../helpers';
import { useFormContext } from '../hooks';
import FieldCopyTestIdButton from '../partials/FieldCopyTestIdButton';
import FieldValidationError from '../partials/FieldValidationError';
import RadioBox from './Variants/RadioBox';
import RadioButton from './Variants/RadioButton';

export interface RadioGroupOption {
  /** Description of the value. Works with variant radioBox. */
  description?: React.ReactNode;
  /** disables the option */
  disabled?: boolean;
  /** option label */
  label?: React.ReactNode;
  /** option icon */
  icon?: ReactNode;
  /** HTML data-testid attribute of the option */
  testId?: string;
  /** option value */
  value: string;
}

export interface RadioGroupProps {
  /** CSS class name */
  className?: string;
  /** Determines if the Buttons are disabled or not. */
  disabled?: boolean;
  /** determines orientation of the Buttons. */
  inline?: boolean;
  /** Label displayed next to the RadioButton. */
  label?: ReactNode;
  /** Name the RadioButtons are registered at in HTML forms (react-hook-form). */
  name: string;
  /** Radio button configuration. */
  options: RadioGroupOption[];
  /** Id to grab element in internal tests. */
  testId?: string;
  /** How the RadioGroup should look like. */
  variant?: 'default' | 'radioBox' | 'radioButton';
}

/**
 * RadioGroup component based on [NextUI RadioGroup](https://nextui.org/docs/components/radio-group)
 */
const RadioGroup = ({
  className = undefined,
  disabled = false,
  inline = false,
  label = undefined,
  name,
  options,
  testId: _testId = undefined,
  variant = 'default',
}: RadioGroupProps): ReactElement => {
  const { control, getFieldState, getValues } = useFormContext();

  const { error, invalid, required, testId } = getFieldState(name, _testId);

  return (
    <Controller
      control={control}
      disabled={disabled}
      name={name}
      render={({ field: { onChange, disabled: isDisabled, onBlur, ref } }) => {
        let RadioComponents: ReactNode;
        switch (variant) {
          case 'radioBox':
            RadioComponents = options.map((option) => (
              <RadioBox
                key={option.value}
                data-testid={slugify(
                  `${testId}_option_${option.testId || option.value}`,
                )}
                isDisabled={isDisabled || option.disabled}
                value={option.value}
                onChange={onChange}
                description={option.description}
                icon={option.icon}
              >
                {option.label ? option.label : option.value}
              </RadioBox>
            ));
            break;
          case 'radioButton':
            RadioComponents = options.map((option) => (
              <RadioButton
                key={option.value}
                data-testid={slugify(
                  `${testId}_option_${option.testId || option.value}`,
                )}
                isDisabled={isDisabled || option.disabled}
                value={option.value}
                onChange={onChange}
                // TODO: how to do the classNames properly (make selected option darker with same color)
                className={cn(
                  `${getValues()[name] !== option.value ? 'bg-opacity-50' : ''}`,
                )}
              >
                {option.label ? option.label : option.value}
              </RadioButton>
            ));
            break;
          default:
            RadioComponents = options.map((option) => (
              <Radio
                key={option.value}
                data-testid={slugify(
                  `${testId}_option_${option.testId || option.value}`,
                )}
                isDisabled={isDisabled || option.disabled}
                value={option.value}
                onChange={onChange}
              >
                {option.label ? option.label : option.value}
              </Radio>
            ));
        }

        return (
          <NextRadioGroup
            className={className}
            data-testid={testId}
            errorMessage={error && <FieldValidationError error={error} />}
            isDisabled={isDisabled}
            isInvalid={invalid}
            isRequired={required}
            label={
              label && (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <label className={`${invalid ? 'text-danger' : ''}`}>
                  {label}
                  <FieldCopyTestIdButton testId={testId} />
                </label>
              )
            }
            orientation={inline ? 'horizontal' : 'vertical'}
            onBlur={onBlur}
            onChange={onChange}
            name={name}
            ref={ref}
          >
            {variant === 'radioButton' ? (
              // TODO: NextButtonGroup uses ref to modify Button style, but we wrap it, so it does not work at the moment.
              <NextButtonGroup>{RadioComponents}</NextButtonGroup>
            ) : (
              RadioComponents
            )}
          </NextRadioGroup>
        );
      }}
    />
  );
};

export default RadioGroup;
