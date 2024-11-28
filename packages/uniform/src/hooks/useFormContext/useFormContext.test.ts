import { describe, expect, it } from 'vitest';

// TODO: not sure why we have to import veto src here
import v, * as vt from '@fuf-stack/veto/src/index';

import { checkFieldIsRequired } from './useFormContext';

describe('checkFieldIsRequired', () => {
  it('required flat', () => {
    const validation = v({
      name: vt.string(),
    });
    const fieldPath = ['name']; // `arrayField[0].name`;
    const result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(true);
  });

  it('optional flat', () => {
    const validation = v({
      name: vt.string().optional(),
    });
    const fieldPath = ['name']; // `arrayField[0].name`;
    const result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(false);
  });

  it('optional nullable', () => {
    const validation = v({
      name: vt.string().optional().nullable(),
    });
    const fieldPath = ['name']; // `arrayField[0].name`;
    const result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(false);
  });

  it('nullable optional', () => {
    const validation = v({
      name: vt.string().nullable().optional(),
    });
    const fieldPath = ['name']; // `arrayField[0].name`;
    const result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(false);
  });

  it('required object with optional field', () => {
    const validation = v({
      object: vt.object({ name: vt.string().optional() }),
    });

    // field in the object is optional
    let fieldPath = ['object', 'name'];
    let result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(false);

    // object required
    fieldPath = ['object'];
    result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(true);
  });

  it('optional object with required field', () => {
    const validation = v({
      object: vt.object({ name: vt.string() }).optional(),
    });

    // field in the object is required
    let fieldPath = ['object', 'name'];
    let result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(true);

    // object is optional
    fieldPath = ['object'];
    result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(false);
  });

  it('required array with optional field', () => {
    const validation = v({
      arrayField: vt
        .object({
          name: vt.string().optional(),
        })
        .array(),
    });

    // field in the array is optional
    let fieldPath = ['arrayField', '0', 'name'];
    let result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(false);

    // array is required
    fieldPath = ['arrayField'];
    result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(true);
  });

  it('optional array with required field', () => {
    const validation = v({
      arrayField: vt
        .object({
          name: vt.string(),
        })
        .array()
        .optional(),
    });

    // field in the array is required
    let fieldPath = ['arrayField', 'name'];
    let result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(true);

    // array is optional
    fieldPath = ['arrayField'];
    result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(false);
  });

  it('not found', () => {
    const validation = v({
      name: vt.string(),
    });
    const fieldPath = ['waitWhat']; // `arrayField[0].name`;
    const result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(false);
  });

  it('refine array with required fields in object', () => {
    const validation = v({
      refineArray: vt.refineArray(vt.array(vt.object({ name: vt.string() })))({
        unique: {
          elementMessage: 'Contains duplicate places',
          mapFn: (val) => {
            return val?.place;
          },
          elementErrorPath: ['place'],
        },
      }),
    });

    // field in the array is required
    let fieldPath = ['refineArray', 'name'];
    let result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(true);

    // object required
    fieldPath = ['refineArray'];
    result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(true);
  });

  it('Intersection with fieldName', () => {
    const validation = v({
      andField: vt
        .and(
          vt.object({ left: vt.string() }),
          vt.object({ right: vt.number().optional() }),
        )
        .optional(),
    });

    let fieldPath = ['andField', 'left'];
    let result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(true);

    fieldPath = ['andField', 'right'];
    result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(false);

    fieldPath = ['andField'];
    result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(false);
  });

  it('Intersection v1', () => {
    const validation = v(
      vt.and(
        vt.object({ left: vt.string() }),
        vt.object({ right: vt.number().optional() }),
      ),
    );
    // field in the array is required
    let fieldPath = ['left'];
    let result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(true);

    // object required
    fieldPath = ['right'];
    result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(false);
  });

  it('Intersection v2', () => {
    const validation1 = vt.object({
      nameUri: vt.string().optional(),
    });

    const validation2 = vt.object({
      name: vt
        .string()
        .max(256)
        .regex(
          /^[0-9a-z ]+$/i,
          'Name can only contain alphanumeric characters and spaces',
        ),
      description: vt.string({ min: 0 }).max(256),
    });

    const validation = v(vt.and(validation2, validation1));

    let fieldPath = ['nameUri'];
    let result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(false);

    fieldPath = ['name'];
    result = checkFieldIsRequired(validation, fieldPath);
    expect(result).toBe(true);
  });

  it('FieldArray', () => {
    const validation = v({
      fieldArray: vt
        .array(
          vt
            .object({
              name: vt
                .string()
                .regex(
                  /^[a-z0-9\s]+$/i,
                  'Must only contain alphanumeric characters and spaces.',
                )
                .min(8),
            })
            .refine(() => false, {
              message: 'Custom error at the object level 1.',
            })
            .refine(() => false, {
              message: 'Custom error at the object level 2.',
            }),
        )
        .min(3),
    });

    const fieldName1 = ['fieldArray'];
    const result1 = checkFieldIsRequired(validation, fieldName1);
    expect(result1).toBe(true);

    const fieldName2 = ['fieldArray', 'name'];
    const result2 = checkFieldIsRequired(validation, fieldName2);
    expect(result2).toBe(true);
  });
});
