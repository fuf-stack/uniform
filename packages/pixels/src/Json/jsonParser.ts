export class JsonParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JsonParseError';
  }
}

export const getValue = (value: string | object): object => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new JsonParseError(
        `Invalid JSON string: ${(error as Error).message}`,
      );
    }
  }
  if (value === null || value === undefined) {
    throw new JsonParseError('Value cannot be null or undefined');
  }
  if (typeof value === 'object') {
    return value;
  }
  throw new JsonParseError(`${typeof value} cannot be visualized`);
};
