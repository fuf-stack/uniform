import { expect, it } from 'vitest';

import { removeNullishFields } from './nullishFields'; // Adjust the import path as needed

it('should remove empty strings and null values from objects', () => {
  const input = {
    name: 'John',
    email: '',
    age: 30,
    address: null,
    phone: '555-0123',
  };

  const expected = {
    name: 'John',
    age: 30,
    phone: '555-0123',
  };

  expect(removeNullishFields(input)).toEqual(expected);
});

it('should handle nested objects', () => {
  const input = {
    user: {
      name: 'John',
      details: {
        email: '',
        address: null,
        contact: {
          phone: '555-0123',
          fax: '',
        },
      },
    },
  };

  const expected = {
    user: {
      name: 'John',
      details: {
        contact: {
          phone: '555-0123',
        },
      },
    },
  };

  expect(removeNullishFields(input)).toEqual(expected);
});

it('TODO: should preserve arrays with their original values', () => {
  const input = {
    names: ['John', '', 'Jane', null],
    scores: [100, null, 95, ''],
    data: {
      values: ['', null, 'test', ''],
    },
  };

  const expected = {
    names: ['John', '__NULL__', 'Jane', '__NULL__'],
    scores: [100, '__NULL__', 95, '__NULL__'],
    data: {
      values: ['__NULL__', '__NULL__', 'test', '__NULL__'],
    },
  };

  expect(removeNullishFields(input)).toEqual(expected);
});

it('should preserve falsy values that are not empty strings or null', () => {
  const input = {
    zero: 0,
    false: false,
    undefined,
    empty: '',
    nullValue: null,
  };

  const expected = {
    zero: 0,
    false: false,
    undefined,
  };

  expect(removeNullishFields(input)).toEqual(expected);
});

it('should handle empty objects', () => {
  const input = {};
  const expected = {};

  expect(removeNullishFields(input)).toEqual(expected);
});

it('should handle objects with all nullish values', () => {
  const input = {
    field1: '',
    field2: null,
    field3: {
      nested1: '',
      nested2: null,
    },
  };

  const expected = {
    field3: {},
  };

  expect(removeNullishFields(input)).toEqual(expected);
});
