import { z } from 'zod';

export type VStringOptions = {
  /** min string length, defaults to 1 */
  min: number;
};

export const string = (options?: VStringOptions) =>
  z
    // see: https://zod.dev/?id=strings
    .string()
    // expect strings to be at least 1 char long by default
    .min(options?.min || options?.min === 0 ? options.min : 1);

export type VString = typeof string;

/** when used with refine or superRefine */
export type VStringRefined<Options = undefined> = (
  options?: Options,
) => z.ZodEffects<ReturnType<VString>, string, string>;
