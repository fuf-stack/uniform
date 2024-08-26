import type { ReactNode } from 'react';

import { ScrollShadow } from '@nextui-org/scroll-shadow';

import { cn } from '@fuf-stack/pixel-utils';

export interface ScrollShadowProps {
  /** child components */
  children?: ReactNode;
  /** CSS class name */
  className?: string | string[];
  /** content of the scroll box */
  testId?: string;
}

/**
 * Scroll Shadow component based on [NextUI Scroll Shadow](https://nextui.org/docs/components/scroll-shadow)
 */
export default ({
  children = null,
  className = undefined,
  testId = undefined,
}: ScrollShadowProps) => (
  <ScrollShadow className={cn(className)} data-testId={testId}>
    {children}
  </ScrollShadow>
);
