import type { AccordionProps as NextAccordionProps } from '@nextui-org/accordion';
import type { DividerProps } from '@nextui-org/divider';
import type { ReactNode } from 'react';

import {
  AccordionItem,
  Accordion as NextAccordion,
} from '@nextui-org/accordion';

export interface AccordionItemProps {
  /** Content of the accordion item */
  children: ReactNode;
  /** Disables the accordion item */
  disabled?: boolean;
  /** Accordion item title */
  title: ReactNode;
}

export interface AccordionProps {
  /** Props for AccordionItems, will render the accordion items programmatically */
  accordionItems?: AccordionItemProps[];
  /** Render accordion items directly as children */
  children?: NextAccordionProps['children'];
  /** CSS class name */
  className?: string;
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
  className = '',
  defaultSelectedKeys = [],
  disabled = false,
  disabledKeys = [],
  disallowEmptySelection = false,
  dividerProps = {},
  onSelectionChange = undefined,
  selectionMode = 'multiple',
  showDivider = true,
  variant = 'light',
}: AccordionProps) => {
  return (
    <NextAccordion
      className={className}
      defaultSelectedKeys={defaultSelectedKeys}
      disabledKeys={disabledKeys}
      disallowEmptySelection={disallowEmptySelection}
      dividerProps={dividerProps}
      isDisabled={disabled}
      onSelectionChange={onSelectionChange}
      selectionMode={selectionMode}
      showDivider={showDivider}
      variant={variant}
    >
      {accordionItems.map((item, index) => (
        <AccordionItem
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          isDisabled={disabled || item?.disabled}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...item}
        />
      ))}
    </NextAccordion>
  );
};

export default Accordion;
