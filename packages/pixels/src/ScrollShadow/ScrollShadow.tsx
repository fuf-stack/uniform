/* eslint-disable react/require-default-props */

import type { CSSProperties, ReactNode } from 'react';

import { forwardRef } from 'react';

import { ScrollShadow as HeroScrollShadow } from '@heroui/scroll-shadow';

import { cn } from '@fuf-stack/pixel-utils';

type ScrollShadowVisibility =
  | 'auto'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'both'
  | 'none';

export interface ScrollShadowProps {
  /** child components */
  children?: ReactNode;
  /** CSS class name */
  className?: string | string[];
  /** Slot name for styling/debugging hooks */
  dataSlot?: string;
  /** Hides the scrollbar */
  hideScrollBar?: boolean;
  /** Orientation of the scroll shadow */
  orientation?: 'horizontal' | 'vertical';
  /** Shadow size in pixels */
  size?: number;
  /** Inline style overrides for the root scroll container. */
  style?: CSSProperties;
  /** HTML data-testid attribute used in e2e tests */
  testId?: string;
  /** Visibility mode for scroll shadows */
  visibility?: ScrollShadowVisibility;
}

/**
 * Scroll Shadow component based on [HeroUI Scroll Shadow](https://www.heroui.com//docs/components/scroll-shadow)
 */
export default forwardRef<HTMLDivElement, ScrollShadowProps>(
  (
    {
      children = null,
      dataSlot = undefined,
      className = undefined,
      hideScrollBar = false,
      orientation = 'vertical',
      size = 40,
      style = undefined,
      testId = undefined,
      visibility = 'auto',
    },
    ref,
  ) => {
    return (
      <HeroScrollShadow
        ref={ref}
        className={cn(className)}
        data-slot={dataSlot}
        data-testid={testId}
        hideScrollBar={hideScrollBar}
        orientation={orientation}
        size={size}
        style={style}
        visibility={visibility}
      >
        {children}
      </HeroScrollShadow>
    );
  },
);
