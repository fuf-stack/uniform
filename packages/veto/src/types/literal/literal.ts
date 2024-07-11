// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

// eslint-disable-next-line prefer-destructuring
export const literal = z.literal;

export type VLiteral = typeof literal;
