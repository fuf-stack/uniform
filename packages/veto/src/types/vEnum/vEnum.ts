import { z } from 'zod';

// eslint-disable-next-line prefer-destructuring
export const vEnum = z.enum;

export type VEnum = typeof vEnum;
