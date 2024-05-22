import { z } from 'zod';

// eslint-disable-next-line prefer-destructuring
export const number = z.number;

export type VNumber = typeof number;
