import { cn } from '@fuf-stack/pixel-utils';
import { Button } from '@fuf-stack/pixels';

interface RadioButtonProps {
  /** label of the value. */
  children: React.ReactNode;
  /** CSS class name */
  className?: string;
  /** disables the option */
  isDisabled?: boolean;
  /** HTML data-testid attribute of the option */
  testID?: string;
  /** Callback function. Executed if the option is clicked. */
  onChange: (...event: unknown[]) => void;
  /** value of the option. */
  value: string;
}

export const RadioButton = ({
  children,
  className = undefined,
  isDisabled = false,
  onChange,
  testID = undefined,
  value,
}: RadioButtonProps) => {
  return (
    <Button
      className={cn(className)}
      testId={testID}
      disabled={isDisabled}
      key={`index_${value}`}
      onClick={() => {
        return onChange(value);
      }}
    >
      {children}
    </Button>
  );
};

export default RadioButton;
