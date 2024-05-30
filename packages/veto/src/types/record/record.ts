import { z } from 'zod';

// eslint-disable-next-line prefer-destructuring
export const record = z.record;

export type VRecord = typeof record;
