import type { VetoSchema } from '@fuf-stack/veto';
import type { FieldError } from 'react-hook-form';

import { useContext } from 'react';
import { useFormContext as useHookFormContext } from 'react-hook-form';

import { UniformContext } from '../../Form/subcomponents/FormContext';
import { slugify } from '../../helpers';

/** Checks whether the field is an optional type by recursively checking inner types */
const recursiveSearchInnerType = (schema: VetoSchema): boolean => {
  let currentSchema = schema;

  // Loop through inner types to find the root type
  while (currentSchema?._def?.innerType) {
    currentSchema = currentSchema._def.innerType;
    if (currentSchema?._def?.typeName === 'ZodOptional') {
      // Stop recursion if optional is found
      return false;
    }
  }
  // If no optional was found, assume it's required
  return true;
};

/** Recursive search to check whether a field is required or optional */
export const recursiveFieldKeySearch = (
  schema: VetoSchema,
  path: string[],
): boolean | null => {
  const [current, ...rest] = path;

  let currentSchema = schema;

  // Handle ZodOptional schema: unwrap and continue searching
  if (schema?._def?.typeName === 'ZodOptional') {
    // @ts-expect-error not sure here
    currentSchema = schema.unwrap();
  }

  // Handle ZodEffects (transformations or validation effects)
  if (schema?._def?.typeName === 'ZodEffects') {
    // Unwrap and continue
    return recursiveFieldKeySearch(schema._def.schema, path);
  }

  // Handle ZodIntersection (intersection types)
  if (currentSchema?._def?.typeName === 'ZodIntersection') {
    return (
      (currentSchema._def.left?.schema
        ? recursiveFieldKeySearch(currentSchema._def.left.schema, path)
        : recursiveFieldKeySearch(currentSchema._def.left, path)) ||
      (currentSchema._def.right?.schema
        ? recursiveFieldKeySearch(currentSchema._def.right.schema, path)
        : recursiveFieldKeySearch(currentSchema._def.right, path))
    );
  }

  // Get the shape of an object or elements of an array schema
  // @ts-expect-error not sure here
  const shape = currentSchema?.shape ?? currentSchema?.element?.shape;

  if (shape && shape[current]) {
    if (rest.length === 0) {
      // At the end of the path, check if the field is optional
      return (
        shape[current]?._def?.typeName !== 'ZodOptional' &&
        recursiveSearchInnerType(shape[current])
      );
    }
    return recursiveFieldKeySearch(shape[current], rest);
  }

  // handle schema with element but not shape or element.shape due to for example ZodEffects
  // @ts-expect-error not sure here
  if (!!currentSchema?.element && !currentSchema?.element?.shape) {
    // @ts-expect-error not sure here
    return recursiveFieldKeySearch(currentSchema?.element, path);
  }

  // Return null if field not found
  return null;
};

/**
 * Custom hook that extends react-hook-form's useFormContext to add validation and state management.
 */
export const useFormContext = () => {
  const {
    formState,
    // https://react-hook-form.com/docs/useform/getfieldstate
    // for getFieldState a subscription to formState properties is needed!
    getFieldState: getFieldStateOrig,
    ...otherMethods
  } = useHookFormContext();

  const uniformContext = useContext(UniformContext);

  /**
   * Updated getFieldState method which returns:
   * - Whether the field is required by checking the validation schema
   * - Existing field state information (errors, etc.)
   */
  const getFieldState = (name: string, testId?: string) => {
    const fieldPath =
      typeof name === 'string' ? name.replace(/\[\d+\]/g, '').split('.') : name;

    // Check if the field is required using the validation schema
    const required =
      (uniformContext?.validation &&
        recursiveFieldKeySearch(uniformContext.validation.schema, fieldPath)) ||
      false;

    // Get the original field state (errors, etc.) from react-hook-form
    const { error, ...rest } = getFieldStateOrig(name, formState);

    return {
      ...rest,
      error: error as FieldError[] | undefined, // Ensure correct type for error
      required,
      testId: slugify(testId || name),
    };
  };

  return {
    ...otherMethods,
    ...uniformContext,
    getFieldState,
    formState,
  };
};
