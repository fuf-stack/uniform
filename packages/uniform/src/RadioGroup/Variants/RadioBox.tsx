import type { RadioProps as NextRadioProps } from '@nextui-org/radio';
import type { ReactNode } from 'react';

import { useRadio } from '@nextui-org/radio';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import classNames from 'classnames';

interface RadioProps extends NextRadioProps {
  icon?: ReactNode;
}

export const RadioBox = ({ icon = undefined, ...props }: RadioProps) => {
  // TODO: define props
  const {
    children,
    Component,
    description,
    getBaseProps,
    getControlProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getWrapperProps,
    isDisabled,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={classNames(
        'group inline-flex flex-auto cursor-pointer items-center justify-between gap-4 rounded-lg border-2 border-default p-4 hover:bg-content2 data-[selected=true]:border-primary',
        {
          // disabled styles
          'pointer-events-none opacity-disabled': isDisabled,
        },
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      {icon}
      <div
        {...getLabelWrapperProps()}
        className={classNames(getLabelWrapperProps().className, 'grow')}
      >
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">
            {description}
          </span>
        )}
      </div>
    </Component>
  );
};

export default RadioBox;
