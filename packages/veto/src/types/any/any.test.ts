import { expect, it } from 'vitest';

import v, { any } from 'src';

[
  'a string',
  1,
  1.1,
  true,
  false,
  [],
  ['test'],
  {},
  { test: 1 },
  null,
  undefined,
]
  // eslint-disable-next-line array-callback-return
  .map((value) => {
    it(`accepts value '${JSON.stringify(value)}'`, () => {
      const schema = { anyField: any() };
      const result = v(schema).validate({ anyField: value });
      expect(result).toMatchObject({
        success: true,
        data: { anyField: value },
        errors: null,
      });
    });
  });
