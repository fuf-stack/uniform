import type {
  RefinementCtx,
  ZodEffects,
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
