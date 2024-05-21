import { z } from 'zod';

type VAnd = typeof z.intersection;

const and: VAnd = z.intersection;

// TODO: make it accept a list
export default and;
