import type {
  RefinementCtx,
  ZodEffects,
  ZodObject,
  ZodRawShape,
  ZodTypeAny,
} from 'zod';

export interface VetoRawShape extends ZodRawShape {}

export interface VetoTypeAny extends ZodTypeAny {}

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
