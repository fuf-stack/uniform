import { expect, it } from 'vitest';

import v, { array, number, object, refineArray, string } from 'src';

it('array refinement unique checks if elements are unique', () => {
  const schema = {
    arrayField: refineArray(array(string()))({
      unique: true,
    }),
  };
  const result = v(schema).validate({
    arrayField: ['one', 'two', 'three', 'one'],
  });
  expect(result).toStrictEqual({
    success: false,
    data: null,
    errors: {

      arrayField: {
        '3': [
          {
            code: 'custom',
            message: 'Element already exists',
            params: {
              code: 'not_unique',
            },
          },
        ],
        _errors: [
          {
            code: 'not_unique',
            message: 'Array elements are not unique',
            type: 'array',
          },
        ],
      },
    },
  });
});

it('array refinement unique + mapFn checks if elements are unique on objects', () => {
  const schema = {
    arrayField: refineArray(array(object({ name: string(), id: number() })))({
      unique: {
        mapFn: (val) => {
          return val.id;
        },
      },
    }),
  };
  const result = v(schema).validate({
    arrayField: [
      { name: 'one', id: 1 },
      { name: 'two', id: 2 },
      { name: 'three', id: 3 },
      { name: 'four', id: 1 },
    ],
  });

  expect(result).toStrictEqual({
    success: false,
    data: null,
    errors: {

      arrayField: {
        '3': [
          {
            code: 'custom',
            message: 'Element already exists',
            params: {
              code: 'not_unique',
            },
          },
        ],
        _errors: [
          {
            code: 'not_unique',
            message: 'Array elements are not unique',
            type: 'array',
          },
        ],
      },
    },
  });
});

it('array refinement unique + mapFn checks if elements are unique on deeply nested objects', () => {
  const schema = {
    arrayField: refineArray(
      array(
        object({
          name: string(),
          data: object({
            fieldA: string().optional(),
            fieldB: string(),
          }).optional(),
        }),
      ),
    )({
      unique: {
        mapFn: (val) => {
          return val?.data?.fieldB;
        },
      },
    }),
  };
  const result = v(schema).validate({
    arrayField: [
      { name: 'one', data: { fieldA: 'test', fieldB: 'not-unique' } },
      { name: 'two', data: { fieldB: 'not-unique' } },
      { name: 'three' },
    ],
  });

  expect(result).toStrictEqual({
    success: false,
    data: null,
    errors: {

      arrayField: {
        '1': [
          {
            code: 'custom',
            message: 'Element already exists',
            params: {
              code: 'not_unique',
            },
          },
        ],
        _errors: [
          {
            code: 'not_unique',
            message: 'Array elements are not unique',
            type: 'array',
          },
        ],
      },
    },
  });
});

it('array refinement unique + mapFn + elementErrorPath allows adding error to subfield', () => {
  const schema = {
    arrayField: refineArray(
      array(
        object({
          name: string(),
          data: object({
            fieldA: string().optional(),
            fieldB: string(),
          }).optional(),
        }),
      ),
    )({
      unique: {
        mapFn: (val) => {
          return val?.data?.fieldB;
        },
        elementErrorPath: ['fieldB'],
      },
    }),
  };
  const result = v(schema).validate({
    arrayField: [
      { name: 'one', data: { fieldA: 'test', fieldB: 'not-unique' } },
      { name: 'two', data: { fieldB: 'not-unique' } },
    ],
  });

  expect(result).toStrictEqual({
    success: false,
    data: null,
    errors: {

      arrayField: {
        1: {

          fieldB: [
            {
              code: 'custom',
              message: 'Element already exists',
              params: {
                code: 'not_unique',
              },
            },
          ],
        },
        _errors: [
          {
            code: 'not_unique',
            message: 'Array elements are not unique',
            type: 'array',
          },
        ],
      },
    },
  });
});
