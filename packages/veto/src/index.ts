// import types
import type { RefinementCtx as ZodRefinementCtx } from 'zod';
import type { VJson, VJsonObject } from './types/json/json';
import type { VObject } from './types/object/object';
import type { VString } from './types/string/string';
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

// export types
export { default as and } from './types/and/and';
export { default as any } from './types/any/any';
export { default as array, refineArray } from './types/array/array';
export { default as boolean } from './types/boolean/boolean';
export { default as discriminatedUnion } from './types/discriminatedUnion/discriminatedUnion';
export { default as json, jsonObject } from './types/json/json';
export { default as literal } from './types/literal/literal';
export { default as nativeEnum } from './types/nativeEnum/nativeEnum';
export { default as number } from './types/number/number';
export { default as object } from './types/object/object';
export { default as record } from './types/record/record';
export { default as string } from './types/string/string';
export { default as vEnum } from './types/vEnum/vEnum';

// additional zod types
type VRefinementCtx = ZodRefinementCtx;

// export ts types
export type {
  VetoError,
  VetoInput,
  VetoInstance,
  VetoRawShape,
  VetoSchema,
  VetoSuccess,
  VetoTypeAny,
  vInfer,
  VJson,
  VJsonObject,
  VObject,
  VRefinementCtx,
  VString,
};

export default veto;
