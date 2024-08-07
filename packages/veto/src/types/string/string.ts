import type { ZodString } from 'zod';

// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

export type VStringOptions = {
  /** min string length, defaults to 1 */
  min: number;
};

export const string = (options?: VStringOptions): VStringSchema =>
  z
    // see: https://zod.dev/?id=strings
    .string()
    // expect strings to be at least 1 char long by default
    .min(options?.min || options?.min === 0 ? options.min : 1);

export type VString = typeof string;
export type VStringSchema = ZodString;

/** when used with refine or superRefine */
export type VStringRefined<Options = undefined> = (
  options?: Options,
) => z.ZodEffects<VStringSchema, string, string>;
