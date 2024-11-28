import type {
  RefinementCtx,
  SafeParseSuccess,
  ZodEffects,
  ZodError,
  ZodErrorMap,
  ZodIssueCode,
  ZodNullable,
  ZodObject,
  ZodOptional,
  ZodRawShape,
  ZodTypeAny,
} from 'zod';

export type VetoRawShape = { [k: string]: VetoTypeAny };

export type VetoTypeAny = ZodTypeAny;

export type VetoNullable<T extends VetoTypeAny> = ZodNullable<T>;

export type VetoOptional<T extends VetoTypeAny> = ZodOptional<T>;

export type VetoObject<T extends ZodRawShape> = ZodObject<
  T,
  'strict',
  VetoTypeAny
>;

export declare type Input<T extends VetoTypeAny> = T['_input'];
export declare type Output<T extends VetoTypeAny> = T['_output'];

export type VetoEffects<T extends VetoTypeAny> = ZodEffects<
  T,
  Output<T>,
  Input<T>
>;

export type VetoRefinementCtx = RefinementCtx;

/** veto schema types */

export type VetoErrorMap = ZodErrorMap;

export type VetoSchema = VetoRawShape | VetoTypeAny;

export type VetoOptions = {
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

export type VetoFormattedError = { [k: string]: VetoFieldError[] } & {
  _errors?: VetoFieldError[];
};

export type VetoError = {
  success: false;
  data: null;
  errors: VetoFormattedError;
};

export type VetoUnformattedError = ZodError<VetoInput>;
