import { z } from 'zod';

type MakeElementsUniqueOptions =
  | true
  | {
      /** custom error method in single element is not unique (element) */
      elementMessage?: string;
      /** a custom error (sub-)path that allows creating the element is not unique error on a sub field */
      elementErrorPath?: string[];
      /** helper to transform array elements before comparing them */
      mapFn?: (arg: any) => any;
      /** custom error method in case elements are not unique (global) */
      message?: string;
    };

/** Refinement to make array elements unique */
const makeElementsUnique = (options: MakeElementsUniqueOptions) => {
  return <T extends z.ZodTypeAny>(data: T[], ctx: z.RefinementCtx) => {
    const mapFn = (options !== true && options?.mapFn) || ((x) => x);
    // add error to (second) duplicate array element
    const dataMapped = data.map(mapFn);

    // find indexes of (second) duplicate elements in array
    const duplicateIndexes = dataMapped
      .map((elementMapped, i) => {
        const hasPreviousDuplicate = !!dataMapped.find(
          (otherMappedElement, otherI) => {
            if (
              // is same element (no duplicate)
              i === otherI ||
              // only return duplicate with higher index (second duplicate in array)
              i < otherI ||
              // check if elements are duplicates
              JSON.stringify(elementMapped) !==
                JSON.stringify(otherMappedElement)
            ) {
              return false;
            }
            // it is a (later) duplicate in array
            return true;
          },
        );
        return hasPreviousDuplicate ? i : false;
      })
      .filter((index) => index !== false) as number[];
    // add element errors
    duplicateIndexes.forEach((i) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          (options !== true && options?.elementMessage) ||
          'Element already exists',
        params: { code: 'not_unique' },
        // add element path
        path: [i, ...((options !== true && options?.elementErrorPath) || [])],
      });
    });
    // add global _error to array
    if (duplicateIndexes.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          (options !== true && options?.message) ||
          'Array elements are not unique',
        params: { type: 'array', code: 'not_unique' },
      });
    }
  };
};

type ArrayRefinements = {
  unique: MakeElementsUniqueOptions;
};

export const refineArray = <T extends z.ZodArray<z.ZodTypeAny, 'many'>>(
  schema: T,
) => {
  type Element = T['element'];

  return (
    refinements: ArrayRefinements,
  ): z.ZodEffects<T, Element['_output'][], Element['_input'][]> => {
    let _schema;

    // add unique refinement
    if (refinements.unique) {
      _schema = schema.superRefine(makeElementsUnique(refinements.unique));
    }

    // @ts-expect-error not sure here
    return _schema;
  };
};

export default z.array;
