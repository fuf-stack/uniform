import type { FieldError } from 'react-hook-form';

import { useContext } from 'react';
import { useFormContext as useHookFormContext } from 'react-hook-form';

import { ValidationSchemaContext } from '../../Form/subcomponents/FormContext';
import slugify from '../../helpers/slugify';

// FIX: This fixes the problem that the innerType is not checked for optionals...
const recursiveSearchInnerType = (schema: unknown): boolean => {
  if (schema?._def?.innerType) {
    if (schema?._def?.innerType?._def?.typeName === 'ZodOptional') {
      return schema?._def?.innerType?._def?.typeName !== 'ZodOptional';
    }
    return recursiveSearchInnerType(schema?._def?.innerType);
  }
  return true;
};

// TODO: Fix problem ".optional().nullable()" is required, ".nullable().optional()" is not required...
export const recursiveFieldKeySearch = (
  schema: unknown, // TODO:
  path: string[],
): boolean | null => {
  const [current, ...rest] = path;
  // ignore optionals on the path to the desired field

  let currentSchema = schema;

  if (schema?._def?.typeName === 'ZodOptional') {
    currentSchema = schema.unwrap();
  } else if (schema?._def?.typeName === 'ZodEffects') {
    // in case of an effect, unwrap the effect and call with schema (clould be optional) and complete path.
    return recursiveFieldKeySearch(schema._def?.schema, path);
  }

  // TODO: This needs further investigation. It is nor yet completely clear how to handle intersections!
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

  // get shape of an object or objects of an array
  const shape = currentSchema?.shape ?? currentSchema?.element?.shape; // ??

  if (shape && shape[current]) {
    // currentSchema?._def.schema.unwrap()?.shape;
    if (rest.length === 0) {
      // At the end of the path check if the field is optional or required
      return (
        shape[current]?._def?.typeName !== 'ZodOptional' &&
        recursiveSearchInnerType(shape[current])
      );
    }
    return recursiveFieldKeySearch(shape[current], rest);
  }

  return null; // field not found
};

/** TODO: add description */
export const useFormContext = () => {
  const {
    // https://react-hook-form.com/docs/useform/getfieldstate
    // for getFieldState a subscription to formState properties is needed!
    formState,
    getFieldState: getFieldStateOrig,
    ...otherMethods
  } = useHookFormContext();
  const validation = useContext(ValidationSchemaContext);

  // update getFieldState
  const getFieldState = (name: string, testId?: string) => {
    const fieldPath =
      typeof name === 'string' ? name.replace(/\[\d+\]/g, '').split('.') : name;
    const required =
      recursiveFieldKeySearch(validation?.schema, fieldPath) || false;
    const { error, ...rest } = getFieldStateOrig(name, formState);
    return {
      ...rest,
      error: error as FieldError[] | undefined, // TODO: change to correct type @Hannes ;)
      required,
      testId: slugify(testId || name),
    };
  };

  return {
    ...otherMethods,
    getFieldState,
    validation,
    formState,
  };
};
