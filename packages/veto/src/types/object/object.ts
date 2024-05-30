import type { VetoEffects, VetoRawShape } from 'src/types';
import type { object as looseObject, strictObject } from 'zod';

import { z } from 'zod';

/**
 * strict object
 * @see https://zod.dev/?id=strict
 */
export const object = <T extends VetoRawShape>(schema: T): VObjectSchema<T> =>
  z
    .object(schema)
    // expect objects to be strict (disallow unknown keys)
    .strict();

export type VObject = typeof object;
export type VObjectSchema<T extends VetoRawShape> = ReturnType<
  typeof strictObject<T>
>;

/** when used with refine or superRefine */
export type VObjectRefined<T extends VetoRawShape> = VetoEffects<
  VObjectSchema<T>
>;

/**
 * loose object
 * @see https://zod.dev/?id=objects
 */
export const objectLoose = <T extends VetoRawShape>(
  schema: T,
): VObjectLooseSchema<T> => z.object(schema);

export type VObjectLoose = typeof objectLoose;
export type VObjectLooseSchema<T extends VetoRawShape> = ReturnType<
  typeof looseObject<T>
>;

/** when used with refine or superRefine */
export type VObjectLooseRefined<T extends VetoRawShape> = VetoEffects<
  VObjectLooseSchema<T>
>;
