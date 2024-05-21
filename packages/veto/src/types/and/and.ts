import { z } from 'zod';

// TODO: make it accept a list
const and = z.intersection;

export type VAnd = typeof and;

export default and;
