import type { ZodType } from 'zod';

import { z } from 'zod';

// see: https://zod.dev/?id=json-type

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

type Literal = z.infer<typeof literalSchema>;
export type JsonObject = { [key: string]: JsonAll };
export type JsonAll = Literal | JsonObject | JsonAll[];

export const json: () => ZodType<JsonAll> = () =>
  z.lazy(() => z.union([literalSchema, z.array(json()), z.record(json())]));

export type VJson = typeof json;

/**
 * JSON, but only objects
 * @see: https://www.w3schools.com/js/js_json_objects.asp
 */
export const jsonObject = () =>
  z.record(json(), { invalid_type_error: 'Invalid json object' });

export type VJsonObject = typeof jsonObject;
