import type { VariantProps } from '@nextui-org/theme';
import type { ClassProp } from 'tailwind-variants';

import { tv as tailwindVariants } from 'tailwind-variants';

type ClassValue = string | string[];

type TVSlotProps = {
  [x: string]: string | number | undefined;
  [x: number]: string | number | undefined;
} & ClassProp<ClassValue>;

type TVFunction = {
  (slotProps?: TVSlotProps | undefined): string;
};

type TVRecord = Record<string, TVFunction>;

export const tv = tailwindVariants;

export type TVProps<T extends TVFunction> = VariantProps<T>;

export type TVClassName<T extends TVFunction> =
  | Partial<Record<keyof ReturnType<T>, ClassValue>>
  | ClassValue;

// converts tailwind-variants slots instance to actual classnames object
export const variantsToClassNames = <T extends TVRecord>(
  variants: T,
  className?: ClassValue | Record<string, ClassValue>,
  baseSlot?: keyof T,
): Record<keyof T, string> => {
  const classNames =
    typeof className === 'object' && !Array.isArray(className) ? className : {};

  return Object.entries(variants).reduce(
    (acc, [slot, variantFn]) => {
      const slotKey = slot as keyof T;
      const slotClassName =
        typeof className === 'string' || Array.isArray(className)
          ? className
          : classNames[slot];

      // @ts-expect-error not sure here
      acc[slotKey] = variantFn({
        className:
          baseSlot && slot === baseSlot ? slotClassName : classNames[slot],
      });

      return acc;
    },
    {} as Record<keyof T, string>,
  );
};
