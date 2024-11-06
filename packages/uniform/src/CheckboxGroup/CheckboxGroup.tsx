import type { TVClassName, TVProps } from '@fuf-stack/pixel-utils';

import { Controller } from 'react-hook-form';

import {
  Checkbox,
  CheckboxGroup as NextCheckboxGroup,
} from '@nextui-org/checkbox';

import { tv, variantsToClassNames } from '@fuf-stack/pixel-utils';

import { slugify } from '../helpers';
import { useFormContext } from '../hooks';
import { FieldCopyTestIdButton } from '../partials/FieldCopyTestIdButton';
import { FieldValidationError } from '../partials/FieldValidationError';

export const checkboxGroupVariants = tv({
  slots: {
    base: 'group', // Needs group for group-data condition
    errorMessage: 'text-tiny',
    itemBase: '',
    itemIcon: '',
    itemLabel: 'text-sm',
    itemWrapper: '',
    // See NextUI styles for group-data condition, e.g.: https://github.com/nextui-org/nextui/blob/main/packages/core/theme/src/components/select.ts
    label:
      'text-sm text-foreground subpixel-antialiased group-data-[invalid=true]:!text-danger',
    wrapper: '',
  },
});

type VariantProps = TVProps<typeof checkboxGroupVariants>;
type ClassName = TVClassName<typeof checkboxGroupVariants>;

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

export interface CheckboxGroupProps extends VariantProps {
  /** CSS class name. ClassName: string | { buttons?: string | { base?: string; active?: string }; base?: string;} */
  className?: ClassName;
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
  const { control, debugMode, getFieldState } = useFormContext();
  const { error, invalid, required, testId } = getFieldState(name, _testId);

  const showTestIdCopyButton = debugMode === 'debug-testids';
  const showLabel = label || showTestIdCopyButton;

  const variants = checkboxGroupVariants();
  const classNames = variantsToClassNames(variants, className, 'base');

  const itemClassName = {
    base: classNames.itemBase,
    wrapper: classNames.itemWrapper,
    icon: classNames.itemIcon,
    label: classNames.itemLabel,
  };
  const itemGroupClassName = {
    base: classNames.base,
    wrapper: classNames.wrapper,
    label: classNames.label,
  };

  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      render={({ field: { onChange, value, ref, onBlur } }) => {
        return (
          <NextCheckboxGroup
            name={name}
            classNames={itemGroupClassName}
            data-testid={testId}
            // See NextUI styles for group-data condition (data-invalid), e.g.: https://github.com/nextui-org/nextui/blob/main/packages/components/select/src/use-select.ts
            data-invalid={invalid}
            errorMessage={
              error && (
                <FieldValidationError
                  error={error}
                  className={classNames.errorMessage}
                />
              )
            }
            isDisabled={disabled}
            isInvalid={invalid}
            isRequired={required}
            label={
              showLabel && (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <label>
                  {label}
                  {showTestIdCopyButton && (
                    <FieldCopyTestIdButton testId={testId} />
                  )}
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
                  data-invalid={invalid}
                  classNames={itemClassName}
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
