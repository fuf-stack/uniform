import { expect, it } from 'vitest';

import v, { object, string } from 'src';

it('rejects non-object value', () => {
  const schema = { objectField: object({ key: string() }) };
  const result = v(schema).validate({
    objectField: ['some string'],
  });
  expect(result).toStrictEqual({
    success: false,
    data: null,
    errors: {
      _errors: [],
      objectField: [
        {
          code: 'invalid_type',
          expected: 'object',
          message: 'Expected object, received array',
          received: 'array',
        },
      ],
    },
  });
});
