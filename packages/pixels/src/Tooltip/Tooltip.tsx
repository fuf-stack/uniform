import type { TVClassName, TVProps } from '@fuf-stack/pixel-utils';
import type { ReactNode } from 'react';

import { Tooltip as NextTooltip } from '@nextui-org/tooltip';

import { tv, variantsToClassNames } from '@fuf-stack/pixel-utils';

// tooltip variants
export const tooltipVariants = tv({
  slots: {
    base: '',
    content: '',
  },
});

type VariantProps = TVProps<typeof tooltipVariants>;
type ClassName = TVClassName<typeof tooltipVariants>;

export const tooltipPlacementOptions = [
  'top',
  'bottom',
  'left',
  'right',
] as const;
export type TooltipPlacement = (typeof tooltipPlacementOptions)[number];

export interface TooltipProps extends VariantProps {
  /** trigger child components */
  children: ReactNode;
  /** CSS class name */
  className?: ClassName;
  /** placement padding in px */
  containerPadding?: number;
  /** content displayed in the tooltip */
  content: ReactNode;
  /** open overlay initially when uncontrolled */
  defaultOpen?: boolean;
  /** handler that is called when the overlay's open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** placement if the tooltip */
  placement?: TooltipPlacement;
}

/**
 * Tooltip component based on [NextUI Tooltip](https://nextui.org/docs/components/tooltip)
 */
const Tooltip = ({
  children,
  className: _className = undefined,
  content,
  placement = 'top',
  defaultOpen = false,
  onOpenChange = undefined,
  containerPadding = 0,
}: TooltipProps) => {
  // classNames from slots
  const variants = tooltipVariants();
  const classNames = variantsToClassNames(variants, _className, 'base');

  return (
    <NextTooltip
      classNames={classNames}
      containerPadding={containerPadding}
      content={content}
      defaultOpen={defaultOpen}
      onClick={(e) => e.preventDefault()}
      onOpenChange={onOpenChange}
      placement={placement}
      shouldFlip
      showArrow
    >
      <span className="cursor-pointer">{children}</span>
    </NextTooltip>
  );
};

export default Tooltip;
