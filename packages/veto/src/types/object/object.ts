import type { VetoRawShape } from 'src/types';
import type { strictObject } from 'zod';

import { z } from 'zod';

/** strict object that */
export const object = <T extends VetoRawShape>(schema: T) =>
  z
    // see: https://zod.dev/?id=objects
    .object(schema)
    // expect objects to be strict (disallow unknown keys)
    .strict();

export type VObject = typeof object;
export type VObjectSchema<T extends VetoRawShape> = ReturnType<
  typeof strictObject<T>
>;
