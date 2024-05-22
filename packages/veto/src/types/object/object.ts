import type { ZodRawShape } from 'zod';

import { z } from 'zod';

/** strict object that */
export const object = <T extends ZodRawShape>(schema: T) =>
  z
    // see: https://zod.dev/?id=objects
    .object(schema)
    // expect objects to be strict (disallow unknown keys)
    .strict();

export type VObject = typeof object;
