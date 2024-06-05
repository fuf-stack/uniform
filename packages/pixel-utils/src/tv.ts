import type { VariantProps } from '@nextui-org/theme';

export { tv } from 'tailwind-variants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TVProps<Component extends (...args: any) => any> =
  VariantProps<Component>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TVClassName<Component extends (...args: any) => any> =
  | Partial<Record<keyof ReturnType<Component>, string>>
  | string;

// converts tailwind-variants slots instance to actual classnames object
export const variantsToClassNames = <T extends Record<string, unknown>>(
  variants: T,
  className?: string | Record<string, string>,
  baseSlot?: keyof T,
): Record<keyof T, string> => {
  const classNameObj = (typeof className === 'object' && className) || {};
  // @ts-expect-error could be improved
  return Object.fromEntries(
    Object.entries(variants).map(([slot, variantFn]) => [
      slot as keyof T,
      baseSlot && slot === baseSlot
        ? // @ts-expect-error could be improved
          (variantFn({
            className:
              typeof className === 'string' ? className : classNameObj[slot],
          }) as string)
        : // @ts-expect-error could be improved
          (variantFn({ className: classNameObj[slot] }) as string),
    ]),
  );
};
