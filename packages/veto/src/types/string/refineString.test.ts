import { describe, expect, it } from 'vitest';

import v, { refineString, string } from 'src';

describe('blacklist', () => {
  it('should reject exact matches', () => {
    const schema = {
      field: refineString(string())({
        blacklist: { patterns: ['invalid'] },
      }),
    };
    const result = v(schema).validate({ field: 'invalid' });
    expect(result).toMatchObject({
      success: false,
      errors: {
        field: [
          {
            code: 'custom',
            message: "Value 'invalid' is blacklisted",
          },
        ],
      },
    });
  });

  it('should reject wildcard patterns', () => {
    const schema = {
      field: refineString(string())({
        blacklist: { patterns: ['test*'] },
      }),
    };
    const result = v(schema).validate({ field: 'testing' });
    expect(result).toMatchObject({
      success: false,
      errors: {
        field: [
          {
            code: 'custom',
            message: "Value 'testing' is blacklisted",
          },
        ],
      },
    });
  });

  it('should use custom error message', () => {
    const schema = {
      field: refineString(string())({
        blacklist: {
          patterns: ['bad*'],
          message: (val) => `Custom: ${val}`,
        },
      }),
    };
    const result = v(schema).validate({ field: 'badword' });
    expect(result).toMatchObject({
      success: false,
      errors: {
        field: [
          {
            code: 'custom',
            message: 'Custom: badword',
          },
        ],
      },
    });
  });
});

describe('noConsecutiveCharacters', () => {
  it('should reject repeated characters', () => {
    const schema = {
      field: refineString(string())({
        noConsecutiveCharacters: { characters: ['!', '@'] },
      }),
    };
    const result = v(schema).validate({ field: 'hello!!' });
    expect(result).toMatchObject({
      success: false,
      errors: {
        field: [
          {
            code: 'custom',
            message: 'Some consecutive characters are not allowed (!@)',
          },
        ],
      },
    });
  });

  it('should allow non-consecutive special chars', () => {
    const schema = {
      field: refineString(string())({
        noConsecutiveCharacters: { characters: ['!', '@'] },
      }),
    };
    const result = v(schema).validate({ field: 'hello!world@' });
    expect(result).toMatchObject({
      success: true,
    });
  });
});
