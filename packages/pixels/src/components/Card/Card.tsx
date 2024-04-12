import type { ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';

import {
  Card as NextCard,
  CardBody as NextCardBody,
  CardFooter as NextCardFooter,
  CardHeader as NextCardHeader,
} from '@nextui-org/card';
import { Divider as NextDivider } from '@nextui-org/divider';
import createDebug from 'debug';
import { tv } from 'tailwind-variants';

const debug = createDebug('component:Card');

// card styling variants
export const cardVariants = tv({
  slots: {
    base: 'border border-slate-300',
    body: '',
    divider: 'my-0 bg-slate-300',
    footer: '',
    header: 'text-base font-semibold',
  },
});

type CardVariantProps = VariantProps<typeof cardVariants>;
type CardVariantSlots = Partial<
  Record<keyof ReturnType<typeof cardVariants>, string>
>;

export interface CardProps extends CardVariantProps {
  /** child components */
  children?: ReactNode;
  /** CSS class name */
  className?: string | CardVariantSlots;
  /** footer content */
  footer?: ReactNode;
  /** header content */
  header?: ReactNode;
  /** HTML data-testid attribute used in e2e tests */
  testId?: string;
}

/**
 * Card component based on [NextUI Card](https://nextui.org/docs/components/card)
 */
const Card = ({
  children = null,
  className = undefined,
  testId = undefined,
  header = undefined,
  footer = undefined,
}: CardProps) => {
  debug('Card', { className, testId });
  const {
    base: baseSlot,
    body: bodySlot,
    divider: dividerSlot,
    footer: footerSlot,
    header: headerSlot,
  } = cardVariants();

  return (
    <NextCard
      data-testid={testId && `card_${testId}`}
      className={baseSlot({
        className: typeof className === 'object' ? className.base : className,
      })}
      fullWidth
      radius="sm"
      shadow="none"
    >
      {header && (
        <>
          <NextCardHeader
            data-testid={testId && `card_header_${testId}`}
            className={headerSlot({
              className: typeof className === 'object' && className.header,
            })}
          >
            {header}
          </NextCardHeader>
          <NextDivider
            className={dividerSlot({
              className: typeof className === 'object' && className.divider,
            })}
          />
        </>
      )}
      <NextCardBody
        data-testid={testId && `card_body_${testId}`}
        className={bodySlot({
          className: typeof className === 'object' && className.body,
        })}
      >
        {children}
      </NextCardBody>
      {footer && (
        <>
          <NextDivider
            className={dividerSlot({
              className: typeof className === 'object' && className.divider,
            })}
          />
          <NextCardFooter
            data-testid={testId && `card_footer_${testId}`}
            className={footerSlot({
              className: typeof className === 'object' && className.footer,
            })}
          >
            {footer}
          </NextCardFooter>
        </>
      )}
    </NextCard>
  );
};

export default Card;
