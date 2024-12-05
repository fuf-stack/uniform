import type { VetoEffects, VetoRefinementCtx } from 'src/types';
import type { ZodString } from 'zod';

// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

export type VStringOptions = {
  /** min string length, defaults to 1 */
  min: number;
};

export const string = (options?: VStringOptions): VStringSchema =>
  z
    // see: https://zod.dev/?id=strings
    .string()
    // expect strings to be at least 1 char long by default
    .min(options?.min || options?.min === 0 ? options.min : 1);

export type VString = typeof string;
export type VStringSchema = ZodString;

/** when used with refine or superRefine */
export type VStringRefined<Options = undefined> = (
  options?: Options,
) => z.ZodEffects<VStringSchema, string, string>;

type BlacklistOptions = {
  /** Custom error message function */
  message?: (val: string) => string;
  /** Array of patterns to blacklist. Supports * wildcard */
  patterns: string[];
};

/** Refinement to blacklist certain string values */
const blacklist = (options: BlacklistOptions) => {
  return (val: string, ctx: VetoRefinementCtx) => {
    // Convert blacklist patterns to regex patterns
    const blacklistRegexes = options.patterns.map((pattern) => {
      const regexPattern = pattern
        .replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&')
        .replace(/\*/g, '.*');
      return new RegExp(`^${regexPattern}$`, 'i');
    });

    // Check for blacklist entries with regex patterns
    if (blacklistRegexes.some((regex) => regex.test(val))) {
      ctx.addIssue({
        code: 'custom',
        message: options.message
          ? options.message(val)
          : `Value '${val}' is blacklisted`,
      });
    }
  };
};

type NoConsecutiveCharactersOptions = {
  /** Characters that cannot appear consecutively */
  characters: string[];
};

/** Refinement to prevent certain consecutive characters */
const noConsecutiveCharacters = (options: NoConsecutiveCharactersOptions) => {
  return (val: string, ctx: VetoRefinementCtx) => {
    // Convert blacklist patterns to regex patterns
    const noConsecutiveSpecialCharactersRegex = new RegExp(
      `(${options.characters
        .map((char) => {
          const escaped = char.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
          return `${escaped}${escaped}`;
        })
        .join('|')})`,
      'i',
    );

    // check for consecutive special characters
    if (noConsecutiveSpecialCharactersRegex.test(val)) {
      ctx.addIssue({
        code: 'custom',
        message: `Some consecutive characters are not allowed (${options.characters.join('')})`,
      });
    }
  };
};

/** Configuration options for string validation refinements */
type StringRefinements = {
  /** Filter out strings matching blacklist patterns with optional custom error messages */
  blacklist?: BlacklistOptions;
  /** Prevent specified characters from appearing consecutively */
  noConsecutiveCharacters?: NoConsecutiveCharactersOptions;
};

/**
 * Applies validation refinements to a string schema
 * @param schema - Base string schema to refine
 * @returns Function that takes refinement options and returns enhanced schema
 * @example
 * ```ts
 * const schema = refineString(string())({
 *   blacklist: { patterns: ['invalid*'] },
 *   noConsecutiveCharacters: { characters: ['!', '@'] }
 * });
 * ```
 */
export const refineString = <T extends VStringSchema>(schema: T) => {
  return (refinements: StringRefinements) => {
    let _schema = schema as unknown as VetoEffects<T>;

    // add blacklist refinement
    if (refinements.blacklist) {
      _schema = _schema.superRefine(
        blacklist(refinements.blacklist),
      ) as unknown as VetoEffects<T>;
    }

    // add noConsecutiveCharacters refinement
    if (refinements.noConsecutiveCharacters) {
      _schema = _schema.superRefine(
        noConsecutiveCharacters(refinements.noConsecutiveCharacters),
      ) as unknown as VetoEffects<T>;
    }

    return _schema;
  };
};
