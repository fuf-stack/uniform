import type { PopoverProps as NextPopoverProps } from '@nextui-org/popover';
import type { ReactNode } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover';
import cn from 'classnames';
import createDebug from 'debug';

const debug = createDebug('component:Popover');

export interface PopoverProps {
  /** child components */
  children?: ReactNode;
  /** CSS class name */
  className?: string | string[];
  /** content of the popover */
  content: ReactNode;
  /** HTML data-testid attribute used in e2e tests */
  contentTestId?: string;
  /** placement of the popover relative to its trigger reference */
  placement?: NextPopoverProps['placement'];
  /** use as controlled component  */
  openControlled?: { open: boolean; setOpen: (open: boolean) => void };
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
  placement = 'top',
  openControlled = undefined,
  testId = undefined,
  title = undefined,
}: PopoverProps) => {
  debug('Popover');

  return (
    <Popover
      placement={placement}
      radius="sm"
      showArrow
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
        <div className="max-h-[80vh] overflow-y-auto">
          {title && (
            <div>
              {title}
              <hr />
            </div>
          )}
          {content}
        </div>
      </PopoverContent>
    </Popover>
  );
};
