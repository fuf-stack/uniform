import { z } from 'zod';

type VStringOptions = {
  /** min string length, defaults to 1 */
  min: number;
};

const vString = (options?: VStringOptions) =>
  z
    // see: https://zod.dev/?id=strings
    .string()
    // expect strings to be at least 1 char long by default
    .min(options?.min || options?.min === 0 ? options.min : 1);

export type VString = typeof vString;

export default vString;
