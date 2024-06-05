export { tv } from 'tailwind-variants';

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
