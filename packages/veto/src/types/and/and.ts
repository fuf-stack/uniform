// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

// TODO: make it accept a list
export const and = z.intersection;

export type VAnd = typeof and;
