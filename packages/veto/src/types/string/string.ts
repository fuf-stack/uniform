import type { ZodString } from 'src/zodResolved';

import { z } from 'src/zodResolved';

type VStringOptions = {
  /** min string length, defaults to 1 */
  min: number;
};

export type VString = ZodString;

export default (options?: VStringOptions): VString =>
  z
    // see: https://zod.dev/?id=strings
    .string()
    // expect strings to be at least 1 char long by default
    .min(options?.min || options?.min === 0 ? options.min : 1);
