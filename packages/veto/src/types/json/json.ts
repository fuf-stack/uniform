import { z } from 'src/zodResolved';

// see: https://zod.dev/?id=json-type

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

type Literal = z.infer<typeof literalSchema>;
export type VJsonObject = { [key: string]: VJson };
export type VJson = Literal | VJsonObject | VJson[];

const jsonSchema: () => z.ZodType<VJson> = () =>
  z.lazy(() =>
    z.union([literalSchema, z.array(jsonSchema()), z.record(jsonSchema())]),
  );

/**
 * JSON, but only objects
 * @see: https://www.w3schools.com/js/js_json_objects.asp
 */
export const jsonObject = () =>
  z.record(jsonSchema(), { invalid_type_error: 'Invalid json object' });

export default jsonSchema;
