import { expect, it } from 'vitest';

import v, { nativeEnum } from 'src';

it('rejects invalid enum value', () => {
  const schema = {
    nativeEnumField: nativeEnum({ ONE: 'ONE', TWO: 'TWO' } as const),
  };
  const result = v(schema).validate({ nativeEnumField: 'THREE' });

  expect(result).toStrictEqual({
    success: false,
    data: null,
    errors: {
      _errors: [],
      nativeEnumField: [
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

it('accepts valid string enum value', () => {
  const schema = {
    nativeEnumField: nativeEnum({ ONE: 'ONE', TWO: 'TWO' } as const),
  };
  const result = v(schema).validate({ nativeEnumField: 'TWO' });
  expect(result).toStrictEqual({
    success: true,
    data: {
      nativeEnumField: 'TWO',
    },
    errors: null,
  });
});

it('accepts valid mixed enum value', () => {
  const schema = {
    nativeEnumField: nativeEnum({ ONE: 'ONE', TWO: 'TWO', THREE: 3 } as const),
  };
  const result = v(schema).validate({ nativeEnumField: 3 });
  expect(result).toStrictEqual({
    success: true,
    data: {
      nativeEnumField: 3,
    },
    errors: null,
  });
});
