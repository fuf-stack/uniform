import type { TVClassName, TVProps } from '@fuf-stack/pixel-utils';
import type { ReactNode } from 'react';

import {
  Breadcrumbs as NextBreadcrumb,
  BreadcrumbItem as NextBreadcrumbItem,
} from '@nextui-org/breadcrumbs';

import { tv, variantsToClassNames } from '@fuf-stack/pixel-utils';

// breadcrumb styling variants
// see: https://nextui.org/docs/components/breadcrumbs#breadcrumbitem-props
export const breadcrumbVariants = tv({
  slots: {
    wrapper: '', // base slot of breadcrumbs
    list: '', // list slot of breadcrumbs
    separator: '',
    item: '',
    base: '', // base for item slot
  },
});

export interface BreadcrumbItemProps {
  /** Content of the breadcrumb item */
  children: ReactNode;
  /** Disables the breadcrumb item */
  disabled?: boolean;
  /** content displayed before the children */
  startContent?: ReactNode;
  /** content displayed after the children */
  endContent?: ReactNode;
}

type VariantProps = TVProps<typeof breadcrumbVariants>;
type ClassName = TVClassName<typeof breadcrumbVariants>;

export interface BreadcrumbProps extends VariantProps {
  /** Props for breadcrumbItem, will render the breadcrumb items programmatically */
  breadcrumbItems?: BreadcrumbItemProps[];
  /** CSS class name */
  className?: ClassName;
  /** color of the active BreadcrumbItem */
  color?:
    | 'foreground'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  /** Disables the Breadcrumb animation */
  disableAnimation?: boolean;
  /** hides the separator between items */
  hideSeparator?: boolean;
  /** disables all items */
  disabled?: boolean;
  /** Maximum number of items to show without "..." in between */
  maxItems?: number;
  /** Radius of the Breadcrumb */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Separator between items */
  separator?: ReactNode;
  /** Size of the Breadcrumb */
  size?: 'sm' | 'md' | 'lg';
  /** Style variant of the Breadcrumbs */
  variant?: 'solid' | 'bordered' | 'light';
}

/**
 * Breadcrumb component based on [NextUI Breadcrumbs](https://nextui.org/docs/components/breadcrumbs)
 */
const Breadcrumb = ({
  breadcrumbItems = [],
  className: _className = undefined,
  color = 'foreground',
  disableAnimation = false,
  disabled = false,
  hideSeparator = false,
  maxItems = undefined,
  radius = 'none',
  separator = undefined,
  size = 'md',
  variant = 'light',
}: BreadcrumbProps) => {
  // itemClasses from className slots
  const variants = breadcrumbVariants({});
  const classNames = variantsToClassNames(variants, _className, 'wrapper');

  return (
    <NextBreadcrumb
      classNames={{ base: classNames.wrapper, list: classNames.list }}
      color={color}
      disableAnimation={disableAnimation}
      hideSeparator={hideSeparator}
      isDisabled={disabled}
      itemClasses={classNames}
      maxItems={maxItems}
      radius={radius}
      separator={separator}
      size={size}
      variant={variant}
    >
      {breadcrumbItems.map((item, index) => (
        <NextBreadcrumbItem
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          isDisabled={disabled || item?.disabled}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...item}
        />
      ))}
    </NextBreadcrumb>
  );
};

export default Breadcrumb;
