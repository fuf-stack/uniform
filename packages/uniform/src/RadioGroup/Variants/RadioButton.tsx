import classNames from 'classnames';

import { Button } from '@fuf-stack/pixels';

interface RadioButtonProps {
  /** label of the value. */
  children: React.ReactNode;
  /** CSS class name */
  className?: string;
  /** disables the option */
  isDisabled?: boolean;
  /** Callback function. Executed if the option is clicked. */
  onChange: (...event: unknown[]) => void;
  /** value of the option. */
  value: string;
}

export const RadioButton = ({
  className = undefined,
  value,
  isDisabled = false,
  onChange,
  children,
}: RadioButtonProps) => {
  return (
    <Button
      key={`index_${value}`}
      className={classNames(className)}
      disabled={isDisabled}
      onClick={() => {
        return onChange(value);
      }}
    >
      {children}
    </Button>
  );
};

export default RadioButton;
