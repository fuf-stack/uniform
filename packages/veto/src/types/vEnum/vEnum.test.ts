import { expect, it } from 'vitest';

import v, { vEnum } from 'src';

it('rejects invalid enum value', () => {
  const schema = { enumField: vEnum(['ONE', 'TWO']) };
  const result = v(schema).validate({ enumField: 'THREE' });
  expect(result).toStrictEqual({
    success: false,
    data: null,
    errors: {

      enumField: [
        {
          code: 'invalid_enum_value',
          message:
            "Invalid enum value. Expected 'ONE' | 'TWO', received 'THREE'",
          options: ['ONE', 'TWO'],
          received: 'THREE',
        },
      ],
    },
  });
});

it('accepts valid enum value', () => {
  const schema = { enumField: vEnum(['ONE', 'TWO']) };
  const result = v(schema).validate({ enumField: 'TWO' });
  expect(result).toStrictEqual({
    success: true,
    data: {
      enumField: 'TWO',
    },
    errors: null,
  });
});
