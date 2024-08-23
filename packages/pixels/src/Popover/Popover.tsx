import type { PopoverProps as NextPopoverProps } from '@nextui-org/popover';
import type { ReactNode } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover';

import { cn } from '@fuf-stack/pixel-utils';

import ScrollShadow from '../ScrollShadow/ScrollShadow';

export interface PopoverProps {
  /** child components */
  children?: ReactNode;
  /** CSS class name */
  className?: string | string[];
  /** content of the popover */
  content: ReactNode;
  /** HTML data-testid attribute used in e2e tests */
  contentTestId?: string;
  /** popover footer */
  footer?: ReactNode;
  /** use as controlled component  */
  openControlled?: { open: boolean; setOpen: (open: boolean) => void };
  /** placement of the popover relative to its trigger reference */
  placement?: NextPopoverProps['placement'];
  /** The container element in which the overlay portal will be placed. */
  portalContainer?: NextPopoverProps['portalContainer'];
  /** Whether to block scrolling outside the popover */
  shouldBlockScroll?: boolean;
  /** HTML data-testid attribute used in e2e tests */
  testId?: string;
  /** popover title */
  title?: ReactNode;
}

/**
 * Popover component based on [NextUI Card](https://nextui.org/docs/components/popover)
 */
export default ({
  children = null,
  className = undefined,
  content,
  contentTestId = undefined,
  footer = undefined,
  openControlled = undefined,
  placement = 'top',
  portalContainer = undefined,
  shouldBlockScroll = undefined,
  testId = undefined,
  title = undefined,
}: PopoverProps) => {
  return (
    <Popover
      classNames={{ content: 'p-0' }}
      placement={placement}
      portalContainer={portalContainer}
      radius="sm"
      shouldBlockScroll={shouldBlockScroll}
      showArrow
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...(openControlled
        ? { isOpen: openControlled.open, onOpenChange: openControlled.setOpen }
        : {})}
    >
      <PopoverTrigger className={cn(className)} data-testid={testId}>
        {/* NOTE: type and aria properties are injected by PopoverTrigger */}
        {/* eslint-disable-next-line react/button-has-type */}
        <button>{children}</button>
      </PopoverTrigger>
      <PopoverContent data-testid={contentTestId}>
        <div className="flex max-h-[80vh] flex-col">
          {title && (
            <div className="px-2.5 py-1">
              {title}
              <hr />
            </div>
          )}
          <ScrollShadow className="px-2.5 py-1">{content}</ScrollShadow>
          {footer && (
            <div className="px-2.5 py-1">
              <hr />
              {footer}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
