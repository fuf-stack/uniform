/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, expect, it } from 'vitest';

import { getValue, JsonParseError } from './jsonParser';

describe('JsonParseError', () => {
  it('should create error with correct name and message', () => {
    const error = new JsonParseError('test message');
    expect(error.name).toBe('JsonParseError');
    expect(error.message).toBe('test message');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('getValue', () => {
  describe('with string input', () => {
    it('should parse valid JSON string', () => {
      const input = '{"name": "test", "value": 123}';
      const expected = { name: 'test', value: 123 };
      expect(getValue(input)).toEqual(expected);
    });

    it('should parse valid JSON array string', () => {
      const input = '[1, 2, 3]';
      const expected = [1, 2, 3];
      expect(getValue(input)).toEqual(expected);
    });

    it('should throw JsonParseError for invalid JSON string', () => {
      const input = '{ invalid json }';
      expect(() => getValue(input)).toThrow(JsonParseError);
      expect(() => getValue(input)).toThrow(/Invalid JSON string/);
    });

    it('should throw JsonParseError for malformed JSON', () => {
      const input = '{"name": "test",}'; // trailing comma
      expect(() => getValue(input)).toThrow(JsonParseError);
    });
  });

  describe('with object input', () => {
    it('should return the same object for valid object input', () => {
      const input = { name: 'test', value: 123 };
      expect(getValue(input)).toBe(input); // checking reference equality
    });

    it('should return the same array for array input', () => {
      const input = [1, 2, 3];
      expect(getValue(input)).toBe(input);
    });
  });

  describe('with null/undefined input', () => {
    it('should throw JsonParseError for null input', () => {
      expect(() => getValue(null as any)).toThrow(JsonParseError);
      expect(() => getValue(null as any)).toThrow(
        'Value cannot be null or undefined',
      );
    });

    it('should throw JsonParseError for undefined input', () => {
      expect(() => getValue(undefined as any)).toThrow(JsonParseError);
      expect(() => getValue(undefined as any)).toThrow(
        'Value cannot be null or undefined',
      );
    });
  });

  describe('with other types', () => {
    it('should throw JsonParseError for number input', () => {
      expect(() => getValue(123 as any)).toThrow(JsonParseError);
      expect(() => getValue(123 as any)).toThrow('number cannot be visualized');
    });

    it('should throw JsonParseError for boolean input', () => {
      expect(() => getValue(true as any)).toThrow(JsonParseError);
      expect(() => getValue(true as any)).toThrow(
        'boolean cannot be visualized',
      );
    });
  });
});
