import { z } from 'zod';

// eslint-disable-next-line prefer-destructuring
export const number = z.number;

export type VNumber = typeof number;

/** when used with refine or superRefine */
export type VNumberRefined<Options = undefined> = (
  options?: Options,
) => z.ZodEffects<ReturnType<VNumber>, string, string>;
