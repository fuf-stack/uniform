// import types
import type {
  ZodEffects as VetoEffects,
  RefinementCtx as VRefinementCtx,
} from 'zod';
import type {
  VetoError,
  VetoInput,
  VetoInstance,
  VetoRawShape,
  VetoSchema,
  VetoSuccess,
  VetoTypeAny,
  vInfer,
} from './veto';

// import veto
import veto from './veto';

// export typescript types
export type {
  VetoEffects,
  VetoError,
  VetoInput,
  VetoInstance,
  VetoRawShape,
  VetoSchema,
  VetoSuccess,
  VetoTypeAny,
  vInfer,
  VRefinementCtx,
};

// export veto validator types
export * from './types/and/and';
export * from './types/any/any';
export * from './types/array/array';
export * from './types/boolean/boolean';
export * from './types/discriminatedUnion/discriminatedUnion';
export * from './types/json/json';
export * from './types/literal/literal';
export * from './types/nativeEnum/nativeEnum';
export * from './types/number/number';
export * from './types/object/object';
export * from './types/record/record';
export * from './types/string/string';
export * from './types/vEnum/vEnum';

export default veto;
