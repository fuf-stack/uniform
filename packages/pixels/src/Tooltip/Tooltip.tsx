import type { ReactNode } from 'react';

import { Tooltip as NextTooltip } from '@nextui-org/tooltip';
import cn from 'classnames';

export const PlacementOptions = ['top', 'bottom', 'left', 'right'] as const;
export type Placement = (typeof PlacementOptions)[number];

export interface TooltipProps {
  /** trigger child components */
  children: ReactNode;
  /** CSS class name */
  className?: string;
  /** placement padding in px */
  containerPadding?: number;
  /** content displayed in the tooltip */
  content: ReactNode;
  /** open overlay initially when uncontrolled */
  defaultOpen?: boolean;
  /** handler that is called when the overlay's open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** placement if the tooltip */
  placement?: Placement;
}

/**
 * Tooltip component based on [NextUI Tooltip](https://nextui.org/docs/components/tooltip)
 */
const Tooltip = ({
  children,
  className = undefined,
  content,
  placement = 'top',
  defaultOpen = false,
  onOpenChange = undefined,
  containerPadding = 0,
}: TooltipProps) => (
  <NextTooltip
    className={cn(className)}
    containerPadding={containerPadding}
    content={content}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    placement={placement}
    shouldFlip
    showArrow
  >
    <span className="cursor-pointer">{children}</span>
  </NextTooltip>
);

export default Tooltip;
