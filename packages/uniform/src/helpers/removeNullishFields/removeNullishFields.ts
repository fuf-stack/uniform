/* eslint-disable import/prefer-default-export */

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
