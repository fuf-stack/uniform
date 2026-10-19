import type { InputProps as HeroInputProps } from '@heroui/input';

import { forwardRef, useState } from 'react';
import { FaEye, FaEyeSlash, FaXmark } from 'react-icons/fa6';

import { Input as HeroInput } from '@heroui/input';

import { cn } from '@fuf-stack/pixel-utils';

import { useWatchFormReset } from '../hooks/useWatchFormReset';

interface InputPasswordProps extends Omit<
  HeroInputProps,
  'type' | 'value' | 'name' | 'isClearable' | 'onClear'
> {
  clearable: boolean;
  name: string;
  onClear: () => void;
  hidePasswordToggle: boolean;
  testId: string;
  value: string;
}

/** Keeps password presentation separate from form registration and validation. */
const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  (
    {
      classNames = undefined,
      clearable,
      endContent = undefined,
      isDisabled = false,
      name,
      onClear,
      onKeyDown = undefined,
      hidePasswordToggle,
      testId,
      value,
      ...inputProps
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Reset visibility before rendering a reused field with new props.
    // Switching away from type=password unmounts this component altogether.
    const [previousPasswordField, setPreviousPasswordField] = useState({
      name,
      hidePasswordToggle,
    });
    if (
      previousPasswordField.name !== name ||
      previousPasswordField.hidePasswordToggle !== hidePasswordToggle
    ) {
      setPreviousPasswordField({ name, hidePasswordToggle });
      setIsPasswordVisible(false);
    }
    useWatchFormReset({
      onReset: () => {
        setIsPasswordVisible(false);
      },
    });

    const clearValue = () => {
      onClear();
      setIsPasswordVisible(false);
    };

    // HeroUI wraps endContent inside its clear button. Keep clear and reveal as
    // sibling buttons so custom content and the toggle never become nested buttons.
    const passwordEndContent = !hidePasswordToggle ? (
      <span className="inline-flex shrink-0 items-center gap-2">
        {endContent}
        {clearable && !!value ? (
          <button
            aria-label="clear input"
            className={cn(
              'rounded-sm p-1 text-default-400 outline-none focus-visible:ring-2 focus-visible:ring-focus',
              classNames?.clearButton,
            )}
            disabled={isDisabled}
            onClick={clearValue}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            type="button"
          >
            <FaXmark aria-hidden="true" />
          </button>
        ) : null}
        <button
          aria-controls={testId}
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isPasswordVisible}
          className="rounded-sm p-1 text-default-400 outline-none focus-visible:ring-2 focus-visible:ring-focus"
          data-testid={`${testId}_password_toggle`}
          disabled={isDisabled}
          onClick={() => {
            setIsPasswordVisible((visible) => {
              return !visible;
            });
          }}
          // Preserve input focus for pointer activation and normal keyboard focus.
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          type="button"
        >
          {isPasswordVisible ? (
            <FaEyeSlash aria-hidden="true" />
          ) : (
            <FaEye aria-hidden="true" />
          )}
        </button>
      </span>
    ) : (
      endContent
    );

    const clearableProps: Pick<HeroInputProps, 'isClearable' | 'onClear'> =
      clearable && hidePasswordToggle
        ? { isClearable: true, onClear: clearValue }
        : {};

    return (
      <HeroInput
        {...inputProps}
        {...clearableProps}
        ref={ref}
        classNames={classNames}
        endContent={passwordEndContent}
        isDisabled={isDisabled}
        name={name}
        onKeyDown={
          !hidePasswordToggle && clearable
            ? (event) => {
                onKeyDown?.(event);
                if (
                  !event.defaultPrevented &&
                  event.key === 'Escape' &&
                  value &&
                  !isDisabled
                ) {
                  event.preventDefault();
                  clearValue();
                }
              }
            : onKeyDown
        }
        type={!hidePasswordToggle && isPasswordVisible ? 'text' : 'password'}
        value={value}
      />
    );
  },
);

InputPassword.displayName = 'InputPassword';

export default InputPassword;
