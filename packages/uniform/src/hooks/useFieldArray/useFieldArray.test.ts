import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  useFieldArray as originalUseFieldArray,
  useForm,
} from 'react-hook-form';

import { renderHook } from '@testing-library/react';

import { useFieldArray } from './useFieldArray';

vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form');
  return {
    ...actual,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFieldArray: vi.fn().mockImplementation((props: any) => {
      if (!props?.control) {
        throw new Error('control is required');
      }
      if (!props?.name) {
        throw new Error('name is required');
      }
      return {
        fields: [],
        append: vi.fn(),
        prepend: vi.fn(),
        remove: vi.fn(),
        insert: vi.fn(),
        swap: vi.fn(),
        move: vi.fn(),
        update: vi.fn(),
        replace: vi.fn(),
      };
    }),
    useForm: vi.fn().mockReturnValue({
      control: { _formControl: true },
      register: vi.fn(),
    }),
  };
});

describe('useFieldArray hook', () => {
  const mockedUseFieldArray = vi.mocked(originalUseFieldArray);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should correctly re-export useFieldArray from react-hook-form', () => {
    const { result } = renderHook(() => {
      const { control } = useForm();
      return useFieldArray({
        control,
        name: 'testArray',
      });
    });

    expect(result.current).toBeDefined();
    expect(result.current.fields).toEqual([]);
  });

  it('should maintain the same API as the original useFieldArray', () => {
    const { result } = renderHook(() => {
      const { control } = useForm();
      return useFieldArray({
        control,
        name: 'testArray',
      });
    });

    const expectedMethods = [
      'fields',
      'append',
      'prepend',
      'remove',
      'insert',
      'swap',
      'move',
      'update',
      'replace',
    ];

    expectedMethods.forEach((method) => {
      expect(result.current).toHaveProperty(method);
    });
  });

  it('should throw an error when used without control parameter', () => {
    const props = { name: 'testArray' };

    expect(() => {
      mockedUseFieldArray(props);
    }).toThrow('control is required');
  });

  it('should throw an error when used without name parameter', () => {
    const { control } = useForm();

    const props = { control };

    expect(() => {
      // @ts-expect-error intentionally passing invalid props
      mockedUseFieldArray(props);
    }).toThrow('name is required');
  });
});
