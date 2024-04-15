import { expect, it } from 'vitest';

// TODO: not sure why we have to import veto src here
import v, * as vt from '@fuf-stack/veto/src/index';

import { recursiveFieldKeySearch } from './useFormContext';

it('required flat', () => {
  const validation = v({
    name: vt.string(),
  });
  const fieldName = ['name']; // `arrayField[0].name`;
  const result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(true);
});

it('optional flat', () => {
  const validation = v({
    name: vt.string().optional(),
  });
  const fieldName = ['name']; // `arrayField[0].name`;
  const result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(false);
});

it('optional nullable', () => {
  const validation = v({
    name: vt.string().optional().nullable(),
  });
  const fieldName = ['name']; // `arrayField[0].name`;
  const result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(false);
});

it('nullable optional', () => {
  const validation = v({
    name: vt.string().nullable().optional(),
  });
  const fieldName = ['name']; // `arrayField[0].name`;
  const result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(false);
});

it('required object with optional field', () => {
  const validation = v({
    object: vt.object({ name: vt.string().optional() }),
  });

  // field in the object is optional
  let fieldName = ['object', 'name'];
  let result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(false);

  // object required
  fieldName = ['object'];
  result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(true);
});

it('optional object with required field', () => {
  const validation = v({
    object: vt.object({ name: vt.string() }).optional(),
  });

  // field in the object is required
  let fieldName = ['object', 'name'];
  let result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(true);

  // object is optional
  fieldName = ['object'];
  result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(false);
});

it('required array with optional field', () => {
  const validation = v({
    arrayField: vt
      .object({
        name: vt.string().optional(),
      })
      .array(),
  });

  // field in the array is optional
  let fieldName = ['arrayField', 'name'];
  let result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(false);

  // array is required
  fieldName = ['arrayField'];
  result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(true);
});

it('optional array with required field', () => {
  const validation = v({
    arrayField: vt
      .object({
        name: vt.string(),
      })
      .array()
      .optional(),
  });

  // field in the array is required
  let fieldName = ['arrayField', 'name'];
  let result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(true);

  // array is optional
  fieldName = ['arrayField'];
  result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(false);
});

it('not found', () => {
  const validation = v({
    name: vt.string(),
  });
  const fieldName = ['waitWhat']; // `arrayField[0].name`;
  const result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(null);
});

it('refine array with required fields in object', () => {
  const validation = v({
    refineArray: vt.refineArray(vt.array(vt.object({ name: vt.string() })))({
      unique: {
        elementMessage: 'Contains duplicate places',
        mapFn: (val) => {
          return val?.place;
        },
        elementErrorPath: ['place'],
      },
    }),
  });

  // field in the array is required
  let fieldName = ['refineArray', 'name'];
  let result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(true);

  // object required
  fieldName = ['refineArray'];
  result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(true);
});

it('Intersection with fieldName', () => {
  const validation = v({
    test: vt
      .and(
        vt.object({ left: vt.string() }),
        vt.object({ right: vt.number().optional() }),
      )
      .optional(),
  });

  let fieldName = ['test', 'left'];
  let result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(true);

  fieldName = ['test', 'right'];
  result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(false);

  fieldName = ['test'];
  result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(false);
});

it('Intersection v1', () => {
  const validation = v(
    vt.and(
      vt.object({ left: vt.string() }),
      vt.object({ right: vt.number().optional() }),
    ),
  );
  // field in the array is required
  let fieldName = ['left'];
  let result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(true);

  // object required
  fieldName = ['right'];
  result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(false);
});

it('Intersection v2', () => {
  const validation1 = vt.object({
    nameUri: vt.string().optional(),
  });

  const validation2 = vt.object({
    name: vt
      .string()
      .max(256)
      .regex(
        /^[0-9a-z ]+$/i,
        'Name can only contain alphanumeric characters and spaces',
      ),
    description: vt.string({ min: 0 }).max(256),
  });

  const validation = v(vt.and(validation2, validation1));

  let fieldName = ['nameUri'];
  let result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(false);

  fieldName = ['name'];
  result = recursiveFieldKeySearch(validation.schema, fieldName);
  expect(result).toBe(true);
});
