import type { AccordionProps as NextAccordionProps } from '@nextui-org/accordion';
import type { DividerProps } from '@nextui-org/divider';
import type { AccordionItemProps } from './AccordionItem';

import {
  AccordionItem,
  Accordion as NextAccordion,
} from '@nextui-org/accordion';

export interface AccordionProps {
  /** Props for AccordionItems, will render the accordion items programmatically */
  accordionItems?: AccordionItemProps[];
  /** Render accordion items directly as children */
  children?: NextAccordionProps['children'];
  /** CSS class name */
  className?: string;
  /** Array of keys for the AccordionItem(s) to be expanded by default */
  defaultSelectedKeys: undefined | 'all' | Iterable<number | string>;
  /** Disables the Accordion */
  disabled?: boolean;
  /** Array of keys for the AccordionItems to disable */
  disabledKeys: Iterable<number | string>;
  /** Force always one AccordionItem to be open. */
  disallowEmptySelection?: boolean;
  /** props for styling the Divider */
  dividerProps?: DividerProps;
  /** Hide the expanded/collapsed indicator icon */
  hideIndicator?: boolean;
  /** Callback function for when a Accordion Item is expanded or collapsed */
  onSelectionChange: (keys: 'all' | Iterable<number | string>) => unknown;
  /** Set whether multiple or only a single AccordionItems can be expanded */
  selectionMode: 'single' | 'multiple';
  /** enable or disable the divider between each AccordionItem */
  showDivider?: boolean;
  /** style variant of the Accordion */
  variant?: 'light' | 'shadow' | 'bordered' | 'splitted';
}

/**
 * Accordion component based on [NextUI Accordion](https://nextui.org/docs/components/accordion)
 */
const Accordion = ({
  accordionItems = [],
  children = undefined,
  className = '',
  defaultSelectedKeys = [],
  disabled = false,
  disabledKeys = [],
  disallowEmptySelection = false,
  dividerProps = {},
  selectionMode = 'multiple',
  showDivider = true,
  variant = 'light',
}: AccordionProps) => {
  return (
    // @ts-expect-error not sure here
    <NextAccordion
      className={className}
      variant={variant}
      selectionMode={selectionMode}
      isDisabled={disabled}
      showDivider={showDivider}
      dividerProps={dividerProps}
      disallowEmptySelection={disallowEmptySelection}
      disabledKeys={disabledKeys}
      defaultSelectedKeys={defaultSelectedKeys}
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
      {children}
    </NextAccordion>
  );
};

export default Accordion;
