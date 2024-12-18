/* eslint-disable import/prefer-default-export */

/**
 * String markers used to preserve null, false, and 0 values during JSON processing
 */
const nullString = '__NULL__';
const falseString = '__FALSE__';
const zeroString = '__ZERO__';

/**
 * Converts marker strings back to their original null/falsy values when processing arrays
 */
export const fromNullishString = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  switch (value) {
    case nullString:
      return null;
    case falseString:
      return false;
    case zeroString:
      return 0;
    default:
      return value;
  }
};

/**
 * Converts null/falsy values to marker strings for JSON processing
 */
export const toNullishString = (value: unknown): unknown => {
  if (value === null || value === '') return nullString;
  if (value === false) return falseString;
  if (value === 0) return zeroString;
  return value;
};

/**
 * Recursively removes nullish fields (empty strings and null values) from objects while preserving arrays.
 * This function is particularly useful for cleaning up form data before validation.
 *
 * @param obj - The object to clean up
 * @returns A new object with all nullish fields removed from nested objects
 *
 * @example
 * // Simple object
 * const form = {
 *   name: 'John',
 *   email: '',
 *   age: 30,
 *   address: null
 * };
 * removeNullishFields(form);
 * // Result: { name: 'John', age: 30 }
 *
 * @example
 * // Nested object with arrays
 * const complexForm = {
 *   user: {
 *     name: 'John',
 *     contacts: ['', null, '555-0123'],  // Arrays are preserved as-is
 *     details: {
 *       address: null,
 *       email: ''
 *     }
 *   }
 * };
 * removeNullishFields(complexForm);
 * // Result: {
 * //   user: {
 * //     name: 'John',
 * //     contacts: ['', null, '555-0123'],
 * //     details: {}
 * //   }
 * // }
 *
 * @remarks
 * - Only removes empty strings ('') and null values
 * - Preserves other falsy values (0, false, undefined)
 * - Arrays are kept intact with their original values
 * - Only processes plain objects (not arrays, Maps, Sets, etc.)
 * - Creates a new object, does not modify the input
 */
export const removeNullishFields = (obj: Record<string, unknown>) => {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      // Handle arrays - convert special string values
      if (Array.isArray(value)) {
        return value.map(toNullishString);
      }

      if (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        return Object.fromEntries(
          Object.entries(value).filter(([_, v]) => v !== '' && v !== null),
        );
      }
      return value;
    }),
  );
};

export const toValidationState = (obj: Record<string, unknown>) => {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      // Handle arrays - convert special string values back to actual values
      if (Array.isArray(value)) {
        return value.map(fromNullishString);
      }

      if (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        return Object.fromEntries(
          Object.entries(value).filter(([_, v]) => v !== '' && v !== null),
        );
      }
      return value;
    }),
  );
};
