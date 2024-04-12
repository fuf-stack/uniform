import { describe, expect, it } from 'vitest';

import v, { json, jsonObject } from 'src';

const literalsData = ['some string', 100, 100.1, true, null];
const jsonObjectData = {
  name: 'John',
  age: 30,
  car: { year: 1999, brand: 'Audi' },
};
const jsonArrayData = [...literalsData, jsonObjectData];

describe('json', () => {
  literalsData.forEach((value) => {
    it(`accepts json literal ${value}`, () => {
      const schema = { jsonField: json() };
      const result = v(schema).validate({ jsonField: value });
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data', { jsonField: value });
      expect(result).toHaveProperty('errors', null);
    });
  });

  it('accepts json arrays', () => {
    const schema = { jsonField: json() };
    const result = v(schema).validate({ jsonField: jsonArrayData });
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('data', { jsonField: jsonArrayData });
    expect(result).toHaveProperty('errors', null);
  });

  it('accepts json objects', () => {
    const schema = { jsonField: json() };
    const result = v(schema).validate({ jsonField: jsonObjectData });
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('data', { jsonField: jsonObjectData });
    expect(result).toHaveProperty('errors', null);
  });
});

describe('jsonObject', () => {
  literalsData.forEach((value) => {
    it(`rejects json literal ${value}`, () => {
      const schema = { jsonObjectField: jsonObject() };
      const result = v(schema).validate({ jsonObjectField: value });
      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('data', null);
      expect(result).toHaveProperty(
        'errors.jsonObjectField[0].message',
        'Invalid json object',
      );
    });
  });

  it('rejects json arrays', () => {
    const schema = { jsonObjectField: jsonObject() };
    const result = v(schema).validate({ jsonObjectField: jsonArrayData });
    expect(result).toHaveProperty('success', false);
    expect(result).toHaveProperty('data', null);
    expect(result).toHaveProperty('errors.jsonObjectField[0].message');
  });

  it('accepts json objects', () => {
    const schema = { jsonObjectField: jsonObject() };
    const result = v(schema).validate({ jsonObjectField: jsonObjectData });
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('data', { jsonObjectField: jsonObjectData });
    expect(result).toHaveProperty('errors', null);
  });
});
