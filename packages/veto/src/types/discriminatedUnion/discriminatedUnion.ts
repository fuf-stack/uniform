import { z } from 'zod';

// eslint-disable-next-line prefer-destructuring
export const discriminatedUnion = z.discriminatedUnion;

export type VDiscriminatedUnion = typeof discriminatedUnion;
