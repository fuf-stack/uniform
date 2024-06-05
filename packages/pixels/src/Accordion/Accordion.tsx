import type { DividerProps } from '@nextui-org/divider';
import type { VariantProps } from '@nextui-org/theme';
import type { ReactNode } from 'react';

import {
  Accordion as NextAccordion,
  AccordionItem as NextAccordionItem,
} from '@nextui-org/accordion';

import { tv, variantsToClassNames } from '../utils';

// card styling variants
// see: https://nextui.org/docs/components/accordion#accordion-item-slots
export const accordionVariants = tv({
  slots: {
    base: '',
    content: '',
    heading: '',
    indicator: '',
    startContent: '',
    subtitle: '',
    title: '',
    titleWrapper: '',
    trigger: '',
    // outer accordion wrapper
    wrapper: '',
  },
  variants: {
    indicatorLeft: {
      true: {
        content: 'pl-7',
        indicator: '-rotate-180 data-[open=true]:-rotate-90',
        trigger: 'flex-row-reverse',
      },
    },
  },
});

export interface AccordionItemProps {
  /** Content of the accordion item */
  children: ReactNode;
  /** Disables the accordion item */
  disabled?: boolean;
  /** Accordion item title */
  title: ReactNode;
  /** Accordion item subtitle */
  subtitle?: ReactNode;
}

type AccordionVariantProps = VariantProps<typeof accordionVariants>;
type AccordionVariantSlots = Partial<
  Record<keyof ReturnType<typeof accordionVariants>, string>
>;

export interface AccordionProps extends AccordionVariantProps {
  /** Props for AccordionItems, will render the accordion items programmatically */
  accordionItems?: AccordionItemProps[];
  /** CSS class name */
  className?: string | AccordionVariantSlots;
  /** Array of keys for the AccordionItem(s) to be expanded by default */
  defaultSelectedKeys?: undefined | 'all' | Iterable<number | string>;
  /** Disables the Accordion */
  disabled?: boolean;
  /** Array of keys for the AccordionItems to disable */
  disabledKeys?: Iterable<number | string>;
  /** Force always one AccordionItem to be open. */
  disallowEmptySelection?: boolean;
  /** props for styling the Divider */
  dividerProps?: DividerProps;
  /** Hide the expanded/collapsed indicator icon */
  hideIndicator?: boolean;
  /** Callback function for when a Accordion Item is expanded or collapsed */
  onSelectionChange?: (keys: 'all' | Iterable<number | string>) => unknown;
  /** Set whether multiple or only a single AccordionItems can be expanded */
  selectionMode?: 'single' | 'multiple';
  /** Enable or disable the divider between each AccordionItem */
  showDivider?: boolean;
  /** Style variant of the Accordion */
  variant?: 'light' | 'shadow' | 'bordered' | 'splitted';
}

/**
 * Accordion component based on [NextUI Accordion](https://nextui.org/docs/components/accordion)
 */
const Accordion = ({
  accordionItems = [],
  className = undefined,
  defaultSelectedKeys = [],
  disabled = false,
  disabledKeys = [],
  disallowEmptySelection = false,
  dividerProps = {},
  indicatorLeft = false,
  onSelectionChange = undefined,
  selectionMode = 'multiple',
  showDivider = true,
  variant = 'light',
  // @ts-expect-error we allow also children, this is somehow required when used in astro
  children = undefined,
}: AccordionProps) => {
  // itemClasses from className slots
  const variants = accordionVariants({ indicatorLeft });
  const { wrapper, ...itemClasses } = variantsToClassNames(
    variants,
    className,
    'wrapper',
  );

  return (
    <NextAccordion
      className={wrapper}
      defaultSelectedKeys={defaultSelectedKeys}
      disabledKeys={disabledKeys}
      disallowEmptySelection={disallowEmptySelection}
      dividerProps={dividerProps}
      isDisabled={disabled}
      itemClasses={itemClasses}
      onSelectionChange={onSelectionChange}
      selectionMode={selectionMode}
      showDivider={showDivider}
      variant={variant}
    >
      {accordionItems.map((item, index) => (
        <NextAccordionItem
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          isDisabled={disabled || item?.disabled}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...item}
        />
      ))}
      {children}
    </NextAccordion>
  );
};

export default Accordion;
