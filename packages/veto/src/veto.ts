import type {
  SafeParseSuccess,
  ZodError,
  ZodErrorMap,
  ZodIssueCode,
} from 'zod';
import type { VetoObject, VetoRawShape, VetoTypeAny } from './types';

import { z } from 'zod';

export type VetoErrorMap = ZodErrorMap;

const issueCodes = z.ZodIssueCode;

// global zod error map
// see: https://zod.dev/ERROR_HANDLING?id=global-error-map
const exErrorMap: VetoErrorMap = (issue, ctx) => {
  /*
  This is where you override the various error codes
  */
  switch (issue.code) {
    case issueCodes.invalid_type:
      if (issue.received === 'undefined') {
        return { message: 'Field is required' };
      }
      return { message: ctx.defaultError };

    // improve error message of discriminated unions, when field is undefined
    case issueCodes.invalid_union_discriminator:
      // eslint-disable-next-line no-case-declarations
      const received = issue.path.reduce((acc, c) => acc && acc[c], ctx.data);
      if (received === undefined) {
        return { message: 'Field is required' };
      }
      return { message: ctx.defaultError };

    default:
      // fall back to default message!
      return { message: ctx.defaultError };
  }
};
z.setErrorMap(exErrorMap);

/** veto schema types */
export type VetoSchema = VetoRawShape | VetoTypeAny;

type VetoOptions = {
  /** optional defaults for the veto */
  defaults?: Record<string, unknown>;
};

export type VetoInput = Record<string, unknown>;

export type VetoSuccess<SchemaType> = SafeParseSuccess<SchemaType> & {
  errors: null;
};

type VetoIssueCode = ZodIssueCode;

type VetoFieldError = {
  code: VetoIssueCode;
  message: string;
};

type VetoFormattedError = { [k: string]: VetoFieldError[] } & {
  _errors?: VetoFieldError[];
};

export type VetoError = {
  success: false;
  data: null;
  errors: VetoFormattedError;
};

type VetoUnformatedError = ZodError<VetoInput>;

/**
 * Helper method that formats zod errors to desired
 * veto error format
 */
const formatError = (error: VetoUnformatedError): VetoFormattedError => {
  const errorFormatted = error.format(
    // remove path from issue
    ({ path: _path, ...issue }) => issue,
  );

  const reformatError = (
    levelError: Record<string, unknown>,
    isTopLevelError = false,
  ): any => {
    let errorCopy = JSON.parse(JSON.stringify(levelError));

    // move params of of custom errors to top level (remove params)
    if (errorCopy.code === z.ZodIssueCode.custom && errorCopy.params) {
      const { params, ...rest } = errorCopy;
      errorCopy = { ...rest, ...params };
    }

    const _isZodFieldError = () => {
      /**
       * Check if we are at the top level if the error. In this
       * case we want to keep the top level _error field for
       * global validation errors e.g.:
       *
       * {
       *    someField: { ... },
       *    // we check this top-level error
       *    _errors: [
       *      {
       *        code: 'unrecognized_keys',
       *        keys: ['unknownField'],
       *        message: "Unrecognized key(s) in object: 'unknownField'",
       *      },
       *   ],
       * }
       *
       */
      if (isTopLevelError) {
        return false;
      }

      /**
       * Check if error has zod array element error format, e.g.:
       *
       * {
       *   fieldName: {
       *     // we check this level
       *     _errors: [
       *       {
       *         code: "invalid_type",
       *         expected: "string",
       *         received: "undefined",
       *         message: "Field is required"
       *       }
       *     ]
       *   },
       *   ...
       * }
       */
      if (
        Object.keys(levelError).length !== 1 ||
        Object.keys(levelError)[0] !== '_errors' ||
        typeof levelError._errors !== 'object' ||
        !Array.isArray(levelError._errors)
      ) {
        return false;
      }

      /**
       * Check if error is a global array field error and not
       * an array element error. In this case we want to keep
       * the error level e.g.:
       *
       * {
       *   arrayField: {
       *     _errors: [
       *       {
       *         code: "too_small",
       *         minimum: 5,
       *         type: "array",
       *         inclusive: true,
       *         message: "Array must contain at least 5 element(s)"
       *       }
       *     ]
       *   }
       * }
       */
      if (
        levelError._errors[0]?.type === 'array' ||
        // custom errors have pass type as params.type
        levelError._errors[0]?.params?.type === 'array'
      ) {
        return false;
      }

      // if we end up here, the error is an array element error
      // and we want to remove the additional _error level
      return true;
    };

    // remove zod _error level zod field errors
    if (_isZodFieldError()) {
      return levelError._errors;
    }

    Object.keys(errorCopy).forEach((key) => {
      const value = errorCopy[key];
      if (!value || typeof value !== 'object') {
        return;
      }
      errorCopy[key] = Array.isArray(value)
        ? value.map((item) => reformatError(item))
        : reformatError(value);
    });

    return errorCopy;
  };

  return reformatError(errorFormatted, true);
};

const v = <T extends VetoSchema>(schema: T, options?: VetoOptions) => {
  const vSchema = schema.safeParse
    ? (schema as VetoTypeAny)
    : z
        .object(schema as VetoRawShape)
        //  If there are any unknown keys in the input always throw an error.
        // see: https://github.com/colinhacks/zod#strict
        .strict();

  type SchemaType = z.infer<typeof vSchema>;

  const validate = <InputType extends VetoInput>(
    input: InputType,
  ): VetoError | VetoSuccess<SchemaType> => {
    const result = vSchema.safeParse({
      // add defaults to input when defined
      ...(options?.defaults || {}),
      ...input,
    });
    // error result
    if (!result.success) {
      return {
        success: result.success,
        // data is alway null on error
        data: null,
        // format error to v format
        errors: formatError(result.error),
      };
    }
    // success result
    return {
      ...result,
      // error is always null on success
      errors: null,
    };
  };

  const validateAsync = async <InputType extends VetoInput>(
    input: InputType,
  ): Promise<VetoError | VetoSuccess<SchemaType>> => {
    const result = await vSchema.safeParseAsync({
      // add defaults to input when defined
      ...(options?.defaults || {}),
      ...input,
    });
    // error result
    if (!result.success) {
      return {
        success: result.success,
        // data is alway null on error
        data: null,
        // format error to v format
        errors: formatError(result.error),
      };
    }
    // success result
    return {
      ...result,
      // error is always null on success
      errors: null,
    };
  };

  return {
    schema: vSchema,
    validate,
    validateAsync,
  };
};

/** A veto instance */
export type VetoInstance = ReturnType<typeof v>;

/**
 * This TypeScript type alias vInfer defines a conditional type that
 * takes in a generic type parameter T, which can either be a schema
 * definition from the VetoSchema interface or a schema
 * instance from the VetoTypeAny interface.
 *
 * If T is a schema definition from VetoSchema, it is
 * converted into a VetoObject and its inferred type is returned
 * using the z.infer method. If T is already a VetoTypeAny schema
 * instance, then the inferred type is simply returned
 * using the z.infer method.
 *
 * The resulting inferred type returned by vInfer is a
 * TypeScript type that represents the expected shape of data
 * validated by the given schema. This ensures type safety when
 * working with ex-veto data.
 *
 * @see https://zod.dev/?id=type-inference
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type vInfer<T extends VetoSchema> =
  // wrap raw shapes with VetoObject
  T extends VetoRawShape
    ? z.infer<VetoObject<T>>
    : // just infer type when already veto object
      T extends VetoTypeAny
      ? z.infer<T>
      : never;

export default v;
