import type { Props } from 'react-select';

import { Controller } from 'react-hook-form';
import ReactSelect, { components } from 'react-select';

import { useSelect } from '@nextui-org/select';
import classNames from 'classnames';
import { tv } from 'tailwind-variants';

import { useFormContext } from '../hooks';
import { FieldCopyTestIdButton } from '../partials/FieldCopyTestIdButton';
import { FieldValidationError } from '../partials/FieldValidationError';

type SelectOption = {
  /** option label */
  label?: React.ReactNode;
  /** option value */
  value: string;
};

export interface SelectProps {
  /** CSS class name */
  className?: string; // string;
  /** Determine if the  */
  clearable?: boolean;
  /** Set the select to disabled state. */
  disabled?: boolean;

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

export const selectVariants = tv({
  slots: {
    clearIndicator:
      'rounded-md p-1 text-neutral-500 hover:cursor-pointer hover:bg-gray-200 hover:text-neutral-800 hover:dark:bg-default-200 hover:dark:text-default-500',
    control:
      'rounded-lg border-2 border-gray-200 shadow-sm !duration-150 transition-background hover:border-gray-400 motion-reduce:transition-none dark:border-default-200 hover:dark:border-default-400 focus:dark:border-default-400',
    crossIcon: '',
    downChevron: '',
    dropdownIndicator:
      'rounded-md p-1 text-neutral-500 hover:cursor-pointer hover:bg-gray-200 hover:text-black hover:dark:bg-default-200 hover:dark:text-default-500',
    group: '',
    groupHeading: 'mb-1 ml-3 mt-2 text-sm text-neutral-500',
    indicatorsContainer: 'gap-1 p-1',
    indicatorSeparator: 'bg-gray-300 dark:bg-default-300',
    input: 'py-0.5 pl-1',
    loadingIndicator: '',
    loadingMessage: '',
    menu: 'mt-2 rounded-xl border border-gray-200 bg-default-50 p-1 shadow-sm dark:border-gray-900 dark:bg-default-50',
    menuList: '',
    // ensure menu has same z-index as modal so it is visible when rendered in modal
    // see: https://github.com/nextui-org/nextui/blob/main/packages/core/theme/src/components/modal.ts (see z-50)
    menuPortal: '!z-50',
    multiValue:
      'items-center gap-1.5 rounded bg-gray-100 py-0.5 pl-2 pr-1 dark:bg-default-100',
    multiValueContainer: '',
    multiValueLabel: 'py-0.5 leading-6',
    multiValueRemove:
      'rounded text-neutral-500 hover:cursor-pointer hover:border-gray-300 hover:text-neutral-800 hover:dark:bg-default-200 hover:dark:text-default-500',
    noOptionsMessage:
      'rounded-sm bg-gray-50 p-2 text-neutral-500 dark:bg-default-100',
    option: 'rounded px-3 py-2 hover:cursor-pointer',
    placeholder: 'py-0.5 pl-1 text-neutral-500',
    selectContainer: '',
    singleValue: '!ml-1 !leading-7',
    valueContainer: 'gap-1 p-1',
  },
  variants: {
    invalid: {
      true: {
        control:
          'border-danger hover:border-danger dark:border-danger hover:dark:border-danger',
      },
    },
    focused: {
      true: {
        option:
          'bg-gray-100 active:bg-gray-200 dark:bg-default-100 dark:active:bg-default-200',
      },
    },
    optionSelected: {
      true: { option: 'bg-gray-300 dark:bg-default-300' },
    },
  },
});

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

  const {
    label,
    getLabelProps,
    getTriggerProps,
    getValueProps,
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
    children: [],
  });

  const {
    clearIndicator: clearIndicatorSlot,
    control: controlSlot,
    dropdownIndicator: dropdownIndicatorSlot,
    groupHeading: groupHeadingSlot,
    indicatorsContainer: indicatorContainerSlot,
    indicatorSeparator: indicatorSeparatorSlot,
    input: inputSlot,
    menu: menuSlot,
    menuPortal: menuPortalSlot,
    multiValue: multiValueSlot,
    multiValueLabel: multiValueLabelSlot,
    multiValueRemove: multiValueRemoveSlot,
    noOptionsMessage: noOptionsMessageSlot,
    option: optionSlot,
    placeholder: placeholderSlot,
    singleValue: singleValueSlot,
    valueContainer: valueContainerSlot,
  } = selectVariants({ invalid });

  return (
    <Controller
      control={control}
      name={name}
      render={({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        field: { onChange, value, ref, onBlur },
      }) => (
        <div
          className={classNames(className, 'mt-2')}
          data-testid={`${testId}_select`}
        >
          {label && (
            <label
              htmlFor={`react-select-${name}-input`} // {getTriggerProps().id}
              className={`${getLabelProps().className} !pointer-events-auto !static -mb-1 ml-1`}
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
              control: ({ isFocused }) =>
                // border focus style
                controlSlot({
                  className: !invalid && isFocused && '!border-primary',
                }),
              placeholder: () => placeholderSlot(),
              input: () => inputSlot(),
              valueContainer: () => valueContainerSlot(),
              singleValue: () =>
                singleValueSlot({
                  className: `${getValueProps().className}`,
                }),
              multiValue: () => multiValueSlot(),
              multiValueLabel: () =>
                multiValueLabelSlot({
                  className: `${getValueProps().className}`,
                }),
              multiValueRemove: () => multiValueRemoveSlot(),
              indicatorsContainer: () => indicatorContainerSlot(),
              clearIndicator: () => clearIndicatorSlot(),
              indicatorSeparator: () => indicatorSeparatorSlot(),
              dropdownIndicator: () => dropdownIndicatorSlot(),
              menu: () => menuSlot(),
              groupHeading: () => groupHeadingSlot(),
              option: ({ isFocused, isSelected }) =>
                optionSlot({
                  focused: isFocused,
                  optionSelected: isSelected,
                }),
              noOptionsMessage: () => noOptionsMessageSlot(),
              menuPortal: () => menuPortalSlot(),
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
            onBlur={onBlur}
            name={name}
            ref={ref}
          />
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
      )}
    />
  );
};

export default Select;
