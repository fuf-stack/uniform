import { describe, expect, it } from 'vitest';

import v, { boolean, number, object, refineObject, string } from 'src';

describe('custom', () => {
  it('should validate using custom function', () => {
    const schema = {
      user: refineObject(
        object({
          name: string(),
          age: number(),
        }),
      )({
        custom: (data, ctx) => {
          if (
            data.name === 'admin' &&
            typeof data.age === 'number' &&
            data.age < 18
          ) {
            ctx.addIssue({
              code: 'custom',
              message: 'Admin must be 18 or older',
            });
          }
        },
      }),
    };

    const result = v(schema).validate({
      user: { name: 'admin', age: 16 },
    });

    expect(result).toMatchObject({
      success: false,
      errors: {
        user: {
          _errors: [
            {
              code: 'custom',
              message: 'Admin must be 18 or older',
            },
          ],
        },
      },
    });
  });

  it('should allow valid data', () => {
    const schema = {
      user: refineObject(
        object({
          name: string(),
          age: number(),
        }),
      )({
        custom: (data, ctx) => {
          if (
            data.name === 'admin' &&
            typeof data.age === 'number' &&
            data.age < 18
          ) {
            ctx.addIssue({
              code: 'custom',
              message: 'Admin must be 18 or older',
            });
          }
        },
      }),
    };

    const result = v(schema).validate({
      user: { name: 'admin', age: 20 },
    });

    expect(result).toMatchObject({
      success: true,
    });
  });

  it('should handle multiple validation errors', () => {
    const schema = {
      user: refineObject(
        object({
          name: string(),
          age: number(),
          role: string(),
        }),
      )({
        custom: (data, ctx) => {
          if (
            data.name === 'admin' &&
            typeof data.age === 'number' &&
            data.age < 18
          ) {
            ctx.addIssue({
              code: 'custom',
              message: 'Admin must be 18 or older',
            });
          }
          if (
            data.role === 'superuser' &&
            typeof data.age === 'number' &&
            data.age < 21
          ) {
            ctx.addIssue({
              code: 'custom',
              message: 'Superuser must be 21 or older',
            });
          }
        },
      }),
    };

    const result = v(schema).validate({
      user: { name: 'admin', age: 16, role: 'superuser' },
    });

    expect(result).toMatchObject({
      success: false,
      errors: {
        user: {
          _errors: [
            {
              code: 'custom',
              message: 'Admin must be 18 or older',
            },
            {
              code: 'custom',
              message: 'Superuser must be 21 or older',
            },
          ],
        },
      },
    });
  });

  it('should work with optional objects', () => {
    const schema = {
      user: refineObject(
        object({
          name: string(),
          age: number(),
        }).optional(),
      )({
        custom: (data, ctx) => {
          if (
            data.name === 'admin' &&
            typeof data.age === 'number' &&
            data.age < 18
          ) {
            ctx.addIssue({
              code: 'custom',
              message: 'Admin must be 18 or older',
            });
          }
        },
      }),
    };

    const resultWithData = v(schema).validate({
      user: { name: 'admin', age: 16 },
    });

    expect(resultWithData).toMatchObject({
      success: false,
      errors: {
        user: {
          _errors: [
            {
              code: 'custom',
              message: 'Admin must be 18 or older',
            },
          ],
        },
      },
    });

    const resultWithoutData = v(schema).validate({});
    expect(resultWithoutData).toMatchObject({
      success: true,
    });
  });

  it('should only run validation on objects', () => {
    const schema = {
      user: refineObject(
        object({
          name: string(),
          age: number(),
        }),
      )({
        custom: (_data, ctx) => {
          ctx.addIssue({
            code: 'custom',
            message: 'Should not be called',
          });
        },
      }),
    };

    const result = v(schema).validate({
      user: 'not an object',
    });

    expect(result).toMatchObject({
      success: false,
      errors: {
        user: {
          _errors: expect.arrayContaining([
            expect.objectContaining({
              code: 'invalid_type',
            }),
          ]),
        },
      },
    });
  });

  it('should work with nested objects', () => {
    const schema = {
      user: refineObject(
        object({
          name: string(),
          settings: object({
            theme: string(),
            notifications: boolean(),
          }),
        }),
      )({
        custom: (data, ctx) => {
          const settings = data.settings as Record<string, unknown>;
          if (data.name === 'guest' && settings?.notifications === true) {
            ctx.addIssue({
              code: 'custom',
              message: 'Guests cannot enable notifications',
            });
          }
        },
      }),
    };

    const result = v(schema).validate({
      user: {
        name: 'guest',
        settings: {
          theme: 'dark',
          notifications: true,
        },
      },
    });

    expect(result).toMatchObject({
      success: false,
      errors: {
        user: {
          _errors: [
            {
              code: 'custom',
              message: 'Guests cannot enable notifications',
            },
          ],
        },
      },
    });
  });

  it('should allow adding issues under specific paths', () => {
    const schema = {
      user: refineObject(
        object({
          name: string(),
          settings: object({
            theme: string(),
            notifications: boolean(),
          }),
        }),
      )({
        custom: (data, ctx) => {
          const settings = data.settings as Record<string, unknown>;
          if (data.name === 'guest' && settings?.notifications === true) {
            ctx.addIssue({
              code: 'custom',
              message: 'Notifications cannot be enabled for guests',
              path: ['settings', 'notifications'],
            });
          }
        },
      }),
    };

    const result = v(schema).validate({
      user: {
        name: 'guest',
        settings: {
          theme: 'dark',
          notifications: true,
        },
      },
    });

    expect(result).toMatchObject({
      success: false,
      errors: {
        user: {
          settings: {
            notifications: [
              {
                code: 'custom',
                message: 'Notifications cannot be enabled for guests',
              },
            ],
          },
        },
      },
    });
  });
});
