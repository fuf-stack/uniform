// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

// eslint-disable-next-line prefer-destructuring
export const nativeEnum = z.nativeEnum;

export type VNativeEnum = typeof nativeEnum;
