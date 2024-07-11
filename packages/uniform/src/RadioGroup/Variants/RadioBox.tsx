import type { RadioProps as NextRadioProps } from '@nextui-org/radio';
import type { ReactNode } from 'react';

import { useRadio } from '@nextui-org/radio';
import { VisuallyHidden } from '@react-aria/visually-hidden';

import { cn } from '@fuf-stack/pixel-utils';

interface RadioProps extends NextRadioProps {
  /** icon for the option */
  icon?: ReactNode;
}

export const RadioBox = ({ icon = undefined, ...props }: RadioProps) => {
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
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...getBaseProps()}
      className={cn(
        'group inline-flex flex-auto cursor-pointer items-center justify-between gap-4 rounded-lg border-2 border-default p-4 hover:bg-content2 data-[selected=true]:border-primary',
        {
          // disabled styles
          'pointer-events-none opacity-disabled': isDisabled,
        },
      )}
    >
      <VisuallyHidden>
        {/* eslint-disable-next-line react/jsx-props-no-spreading  */}
        <input {...getInputProps()} />
      </VisuallyHidden>
      {/* eslint-disable-next-line react/jsx-props-no-spreading  */}
      <span {...getWrapperProps()}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading  */}
        <span {...getControlProps()} />
      </span>
      {icon}
      <div
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...getLabelWrapperProps()}
        className={cn(getLabelWrapperProps().className, 'grow')}
      >
        {/* eslint-disable-next-line react/jsx-props-no-spreading  */}
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
