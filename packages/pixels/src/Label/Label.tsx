import type { ChipProps } from '@nextui-org/chip';
import type { ReactNode } from 'react';

import { Chip as NextLabel } from '@nextui-org/chip';
import cn from 'classnames';

export interface LabelProps {
  /** content of the label */
  children: ReactNode;
  /** CSS class name */
  className?: string;
  /** color of the label */
  color?: ChipProps['color'];
  /** element to be rendered in the right side of the label */
  endContent?: ChipProps['endContent'];
  /** size of the label */
  size?: ChipProps['size'];
  /** element to be rendered in the left side of the label */
  startContent?: ChipProps['startContent'];
}

/**
 * Label component based on [NextUI Chip](https://nextui.org/docs/components/chip)
 */
const Label = ({
  children,
  className = undefined,
  color = 'default',
  endContent = undefined,
  size = 'md',
  startContent = undefined,
}: LabelProps) => (
  <NextLabel
    className={cn(className)}
    color={color}
    endContent={endContent}
    size={size}
    startContent={startContent}
  >
    {children}
  </NextLabel>
);

export default Label;
