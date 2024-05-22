import { z } from 'zod';

export type VStringOptions = {
  /** min string length, defaults to 1 */
  min: number;
};

export type VStringReturn = ReturnType<typeof z.string>;

export const string = (options?: VStringOptions): VStringReturn =>
  z
    // see: https://zod.dev/?id=strings
    .string()
    // expect strings to be at least 1 char long by default
    .min(options?.min || options?.min === 0 ? options.min : 1);

export type VString = typeof string;
