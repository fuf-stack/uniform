import type { TVClassName, TVProps } from '@fuf-stack/pixel-utils';
import type { Props } from 'react-select';

import { useState } from 'react';
import { Controller } from 'react-hook-form';
import ReactSelect, { components } from 'react-select';

import { useSelect } from '@nextui-org/select';

import { cn, tv, variantsToClassNames } from '@fuf-stack/pixel-utils';

import { useFormContext } from '../hooks';
import { FieldCopyTestIdButton } from '../partials/FieldCopyTestIdButton';
import { FieldValidationError } from '../partials/FieldValidationError';

export const selectVariants = tv({
  slots: {
    base: '',
    clearIndicator:
      'rounded-md p-1 text-foreground-500 hover:cursor-pointer hover:bg-default-200 hover:text-foreground-800',
    control:
      'rounded-lg border-2 border-default-200 shadow-sm !duration-150 transition-background hover:border-default-400 motion-reduce:transition-none',
    control_focused: 'border-primary hover:border-primary',
    crossIcon: '',
    downChevron: '',
    dropdownIndicator:
      'rounded-md p-1 text-foreground-500 hover:cursor-pointer hover:bg-default-200 hover:text-black',
    group: '',
    groupHeading: 'mb-1 ml-3 mt-2 text-sm text-foreground-500',
    indicatorsContainer: 'gap-1 p-1',
    indicatorSeparator: 'bg-default-300',
    input: 'py-0.5 pl-1',
    loadingIndicator: '',
    loadingMessage: '',
    menu: 'mt-2 rounded-xl border border-default-200 bg-background p-1 shadow-lg',
    menuList: '',
    // ensure menu has same z-index as modal so it is visible when rendered in modal
    // see: https://github.com/nextui-org/nextui/blob/main/packages/core/theme/src/components/modal.ts (see z-50)
    menuPortal: '!z-50',
    multiValue: 'items-center gap-1.5 rounded bg-default-100 py-0.5 pl-2 pr-1',
    multiValueContainer: '',
    multiValueLabel: 'py-0.5 leading-6',
    multiValueRemove:
      'rounded text-default-500 hover:cursor-pointer hover:border-default-300 hover:text-default-800',
    noOptionsMessage: 'rounded-sm p-2 text-foreground-500',
    option: 'rounded px-3 py-2 hover:cursor-pointer',
    option_selected: 'bg-default-300',
    option_focused: 'bg-default-100 active:bg-default-200',
    placeholder: 'py-0.5 pl-1 text-foreground-500',
    selectContainer: '',
    singleValue: '!ml-1 !leading-7',
    valueContainer: 'gap-1 p-1',
  },
  variants: {
    invalid: {
      true: {
        control: 'border-danger hover:border-danger',
      },
    },
  },
});

type SelectOption = {
  /** option label */
  label?: React.ReactNode;
  /** option value */
  value: string;
};

type VariantProps = TVProps<typeof selectVariants>;
type ClassName = TVClassName<typeof selectVariants>;

export interface SelectProps extends VariantProps {
  /** CSS class name */
  className?: ClassName; // string;
  /** Determine if the  */
  clearable?: boolean;
  /** Set the select to disabled state. */
  disabled?: boolean;
  /** Filter Select Options */
  filterOption?:
    | undefined
    | ((option?: SelectOption, inputValue?: string) => boolean);
  /** The value of the search input */
  inputValue?: string;
  /** Label that should be associated with the select. */
  label?: React.ReactNode;
  /** Set the select to a loading state. */
  loading?: boolean;
  /** switch between single and multi select mode. */
  multiSelect?: boolean;
  /** The name for the Select component, used by react-hook-form */
  name: string;
  /** Placeholder that is displayed when nothing is selected */
  placeholder?: string;
  /** The options for the Select component */
  options: SelectOption[];
  /** Handle change events on the input */
  onInputChange?: Props['onInputChange'];
  /** HTML data-testid attribute used in e2e tests */
  testId?: string;
}

const InputComponent: typeof components.Input = (props) => {
  // @ts-expect-error data-testid is not a default prop
  // eslint-disable-next-line react/prop-types, react/destructuring-assignment
  const testId = `${props.selectProps['data-testid']}_input`;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <components.Input data-testid={testId} {...props} />;
};

const OptionComponent: typeof components.Option = (props) => {
  // @ts-expect-error data-testid is not a default prop
  // eslint-disable-next-line react/prop-types, react/destructuring-assignment
  const testId = `${props.selectProps['data-testid']}_option_${props?.data?.testId ?? props?.data?.value}`;
  return (
    <div data-testid={testId}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <components.Option {...props} />
    </div>
  );
};

const DropdownIndicatorComponent: typeof components.DropdownIndicator = (
  props,
) => {
  // @ts-expect-error data-testid is not a default prop
  // eslint-disable-next-line react/prop-types
  const testId = props?.selectProps['data-testid'] as string;
  return (
    <div data-testid={`${testId}_dropdown`}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <components.DropdownIndicator {...props} />
    </div>
  );
};

/** Select component based on [NextUI Select](https://nextui.org/docs/components/select) and [React-Select](https://react-select.com/home) */
const Select = ({
  className = undefined,
  clearable = true,
  disabled = false,
  filterOption = undefined,
  inputValue = undefined,
  label: _label = undefined,
  loading = false,
  multiSelect = false,
  name,
  onInputChange = undefined,
  options,
  placeholder = undefined,
  testId: _testId = undefined,
}: SelectProps) => {
  const { control, getFieldState } = useFormContext();
  const { error, invalid, required, testId } = getFieldState(name, _testId);

  const [isFocused, setIsFocused] = useState(false);

  const variants = selectVariants({ invalid });
  const classNames = variantsToClassNames(variants, className, 'base');

  const {
    label,
    getBaseProps,
    getLabelProps,
    getTriggerProps,
    getValueProps,
    getMainWrapperProps,
    getHelperWrapperProps,
    getErrorMessageProps,
  } = useSelect({
    isLoading: loading,
    isInvalid: invalid,
    isRequired: required,
    isDisabled: disabled,
    errorMessage: JSON.stringify(error),
    label: _label,
    labelPlacement: 'outside',
    placeholder: ' ',
    children: [],
    classNames,
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        field: { onChange, value, ref, onBlur },
      }) => (
        <div
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...getBaseProps()}
          className={cn(classNames.base, 'group mt-2')}
          data-testid={testId}
        >
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <div {...getMainWrapperProps()}>
            <div className="relative">
              {label && (
                <label
                  htmlFor={`react-select-${name}-input`}
                  className={cn(
                    getLabelProps()
                      .className.replace('absolute', 'relative')
                      .replace('block', ''),
                    '!pointer-events-auto bottom-2 ml-1',
                  )}
                >
                  {label}
                  <FieldCopyTestIdButton testId={testId} />
                </label>
              )}
              <ReactSelect
                aria-errormessage=""
                aria-invalid={invalid}
                // Does not affect the testId of the select, but is needed to pass it to sub-components
                data-testid={`${testId}_select`}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...() => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
                  const { className: _className, ...rest } = getTriggerProps();
                  return rest;
                }}
                aria-labelledby={
                  getTriggerProps()['aria-labelledby']?.split(' ')[1]
                }
                classNames={{
                  control: () =>
                    cn(classNames.control, {
                      [classNames.control_focused]: isFocused && !invalid,
                    }),
                  placeholder: () => classNames.placeholder,
                  input: () => classNames.input,
                  valueContainer: () => classNames.valueContainer,
                  singleValue: () =>
                    cn(classNames.singleValue, `${getValueProps().className}`),
                  multiValue: () => classNames.multiValue,
                  multiValueLabel: () =>
                    cn(
                      classNames.multiValueLabel,
                      `${getValueProps().className}`,
                    ),
                  multiValueRemove: () => classNames.multiValueRemove,
                  indicatorsContainer: () => classNames.indicatorsContainer,
                  clearIndicator: () => classNames.clearIndicator,
                  indicatorSeparator: () => classNames.indicatorSeparator,
                  dropdownIndicator: () => classNames.dropdownIndicator,
                  menu: () => classNames.menu,
                  groupHeading: () => classNames.groupHeading,
                  option: ({
                    isFocused: optionIsFocused,
                    isSelected: optionIsSelected,
                  }) =>
                    cn(classNames.option, {
                      [classNames.option_focused]: optionIsFocused,
                      [classNames.option_selected]: optionIsSelected,
                    }),
                  noOptionsMessage: () => classNames.noOptionsMessage,
                  menuPortal: () => classNames.menuPortal,
                }}
                components={{
                  Input: InputComponent,
                  Option: OptionComponent,
                  DropdownIndicator: DropdownIndicatorComponent,
                }}
                filterOption={filterOption}
                instanceId={name}
                inputValue={inputValue}
                isClearable={clearable}
                isDisabled={disabled}
                isLoading={loading}
                isMulti={multiSelect}
                options={options}
                placeholder={placeholder}
                unstyled
                onChange={(option) => {
                  if (multiSelect) {
                    const transformedOptions: string[] = [];
                    // @ts-expect-error in this case option is an array.
                    option?.forEach((o: { value: string }) => {
                      transformedOptions.push(o.value);
                    });
                    onChange(transformedOptions);
                  } else {
                    // @ts-expect-error in this case option is of type SelectOption and has the property value.
                    onChange(option && option.value);
                  }
                }}
                onInputChange={onInputChange}
                // attach menu modal or body so it works in card and modal
                menuPortalTarget={
                  (document.getElementById('modal_body')?.parentNode
                    ?.parentNode as HTMLElement) || document.body
                }
                value={options.find((option) => option.value === value)}
                onBlur={(_e) => {
                  setIsFocused(false);
                  return onBlur();
                }}
                onFocus={(_e) => {
                  setIsFocused(true);
                }}
                name={name}
                ref={ref}
              />
            </div>
            {error && (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <div {...getHelperWrapperProps()}>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <div {...getErrorMessageProps()}>
                  <FieldValidationError error={error} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default Select;
