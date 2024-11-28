import { describe, expect, it } from 'vitest';

import v, { json, jsonObject } from 'src';

// Test data
const literalsData = [
  'some string',
  // Empty string
  '',
  100,
  // Zero
  0,
  // Negative number
  -100,
  100.1,
  // Both boolean values
  true,
  false,
  null,
];

const jsonObjectData = {
  name: 'John',
  age: 30,
  isStudent: false,
  car: {
    year: 1999,
    brand: 'Audi',
    features: ['GPS', 'Leather', null],
    owner: {
      since: 2020,
      isLeased: false,
    },
  },
  hobbies: ['reading', 123, null, { type: 'sports', frequency: 'weekly' }],
  nested: {
    level1: {
      level2: {
        level3: 'deeply nested',
      },
    },
  },
};

const jsonArrayData = [
  ...literalsData,
  jsonObjectData,
  [1, 2, ['nested', 'array']],
  { key: [1, { nested: 'value' }] },
];

describe('json validator', () => {
  describe('validation of invalid types', () => {
    const invalidValues = [
      { value: undefined, name: 'undefined' },
      { value: Symbol('test'), name: 'symbol' },
      { value: () => {}, name: 'function' },
      { value: new Date(), name: 'date object' },
    ];

    invalidValues.forEach(({ value, name }) => {
      it(`rejects ${name}`, () => {
        const schema = { jsonField: json() };
        const result = v(schema).validate({ jsonField: value });
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('data', null);
        expect(result.errors).toBeTruthy();
      });
    });
  });

  describe('validation of literals', () => {
    literalsData.forEach((value) => {
      it(`accepts json literal: ${JSON.stringify(value)}`, () => {
        const schema = { jsonField: json() };
        const result = v(schema).validate({ jsonField: value });
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('data.jsonField', value);
        expect(result).toHaveProperty('errors', null);
      });
    });
  });

  describe('validation of arrays', () => {
    it('accepts empty arrays', () => {
      const schema = { jsonField: json() };
      const result = v(schema).validate({ jsonField: [] });
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data.jsonField', []);
      expect(result).toHaveProperty('errors', null);
    });

    it('accepts nested arrays', () => {
      const nestedArray = [1, [2, [3, ['deep']]]];
      const schema = { jsonField: json() };
      const result = v(schema).validate({ jsonField: nestedArray });
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data.jsonField', nestedArray);
      expect(result).toHaveProperty('errors', null);
    });

    it('accepts mixed-type arrays', () => {
      const schema = { jsonField: json() };
      const result = v(schema).validate({ jsonField: jsonArrayData });
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data.jsonField', jsonArrayData);
      expect(result).toHaveProperty('errors', null);
    });
  });

  describe('validation of objects', () => {
    it('accepts empty objects', () => {
      const schema = { jsonField: json() };
      const result = v(schema).validate({ jsonField: {} });
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data.jsonField', {});
      expect(result).toHaveProperty('errors', null);
    });

    it('accepts deeply nested objects', () => {
      const schema = { jsonField: json() };
      const result = v(schema).validate({ jsonField: jsonObjectData });
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data.jsonField', jsonObjectData);
      expect(result).toHaveProperty('errors', null);
    });

    it('accepts objects with mixed-type values', () => {
      const mixedObject = {
        string: 'value',
        number: 123,
        bool: true,
        null: null,
        array: [1, 'two', { three: 3 }],
        nested: { a: { b: { c: 'deep' } } },
      };
      const schema = { jsonField: json() };
      const result = v(schema).validate({ jsonField: mixedObject });
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data.jsonField', mixedObject);
      expect(result).toHaveProperty('errors', null);
    });
  });

  describe('nesting levels', () => {
    it('respects maximum nesting level parameter', () => {
      const deeplyNested = {
        l1: { l2: { l3: { l4: { l5: 'too deep' } } } },
      };
      const schema = { jsonField: json(3) }; // Only 3 levels allowed
      const result = v(schema).validate({ jsonField: deeplyNested });
      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('data', null);
      expect(result.errors).toBeTruthy();
    });
  });
});

describe('jsonObject validator', () => {
  describe('validation of non-objects', () => {
    it('rejects undefined', () => {
      const schema = { jsonObjectField: jsonObject() };
      const result = v(schema).validate({ jsonField: undefined });
      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('data', null);
      expect(result).toHaveProperty(
        'errors.jsonObjectField._errors[0].message',
        'Field is required',
      );
    });

    const nonObjects = [...literalsData, [], [1, 2, 3], new Date()];

    nonObjects.forEach((value) => {
      it(`rejects non-object value: ${JSON.stringify(value)}`, () => {
        const schema = { jsonObjectField: jsonObject() };
        const result = v(schema).validate({ jsonObjectField: value });
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('data', null);
        expect(result).toHaveProperty(
          'errors.jsonObjectField._errors[0].message',
          'Invalid json object',
        );
      });
    });
  });

  describe('validation of valid objects', () => {
    it('accepts empty objects', () => {
      const schema = { jsonObjectField: jsonObject() };
      const result = v(schema).validate({ jsonObjectField: {} });
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data.jsonObjectField', {});
      expect(result).toHaveProperty('errors', null);
    });

    it('accepts complex nested objects', () => {
      const schema = { jsonObjectField: jsonObject() };
      const result = v(schema).validate({ jsonObjectField: jsonObjectData });
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data.jsonObjectField', jsonObjectData);
      expect(result).toHaveProperty('errors', null);
    });

    it('accepts objects with array values', () => {
      const objectWithArrays = {
        simpleArray: [1, 2, 3],
        mixedArray: [1, 'two', { three: 3 }],
        nestedArrays: [1, [2, [3, [4]]]],
      };
      const schema = { jsonObjectField: jsonObject() };
      const result = v(schema).validate({ jsonObjectField: objectWithArrays });
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data.jsonObjectField', objectWithArrays);
      expect(result).toHaveProperty('errors', null);
    });
  });

  describe('nesting levels', () => {
    it('respects maximum nesting level parameter', () => {
      const deeplyNested = {
        l1: { l2: { l3: { l4: { l5: 'too deep' } } } },
      };
      const schema = { jsonObjectField: jsonObject(3) }; // Only 3 levels allowed
      const result = v(schema).validate({ jsonObjectField: deeplyNested });
      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('data', null);
      expect(result.errors).toBeTruthy();
    });
  });
});
