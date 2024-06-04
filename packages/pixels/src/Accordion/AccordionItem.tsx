import type { AccordionItemProps as NextAccordionItemProps } from '@nextui-org/accordion';

import { AccordionItem as NextAccordionItem } from '@nextui-org/accordion';

export interface AccordionItemProps extends NextAccordionItemProps {}

/**
 * Accordion item component based on [NextUI Accordion](https://nextui.org/docs/components/accordion)
 */
// const AccordionItem = (props: AccordionItemProps) => (
//   // eslint-disable-next-line react/jsx-props-no-spreading
//   <NextAccordionItem {...props} />
// );

// INFO: currently we can only re-export the nextui component,
// because otherwise the ref passing causes errors when
// the component is wrapped

/**
 * Accordion item component based on [NextUI Accordion](https://nextui.org/docs/components/accordion)
 */
export default NextAccordionItem;
