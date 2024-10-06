import { describe, expect, it } from 'vitest';

import { tv, variantsToClassNames } from './tv';

describe('variantsToClassNames with tv', () => {
  it('should convert simple variants to classnames without className or baseSlot', () => {
    const variants = tv({
      slots: {
        base: '',
        slot1: 'p-4', // Tailwind padding class
        slot2: 'text-center', // Tailwind text alignment class
      },
    });
    const result = variantsToClassNames(variants());
    expect(result).toEqual({
      base: undefined,
      slot1: 'p-4', // padding 4 applied
      slot2: 'text-center', // text center applied
    });
  });

  it('should merge global className only when baseSlot is defined', () => {
    const variants = tv({
      slots: {
        base: '',
        slot1: 'p-4',
        slot2: 'text-center',
      },
    });

    // Define baseSlot as 'base' and global className
    const result = variantsToClassNames(variants(), 'shadow-lg', 'base');
    expect(result).toEqual({
      base: 'shadow-lg', // 'shadow-lg' applied to base slot
      slot1: 'p-4', // slot1 remains unchanged
      slot2: 'text-center', // slot2 remains unchanged
    });
  });

  it('should dismiss global className when baseSlot is not defined', () => {
    const variants = tv({
      slots: {
        base: '',
        slot1: 'p-4',
        slot2: 'text-center',
      },
    });

    // Global className but no baseSlot defined
    const result = variantsToClassNames(variants(), 'shadow-lg');
    expect(result).toEqual({
      base: undefined, // No global className applied, empty slot
      slot1: 'p-4', // slot1 remains unchanged
      slot2: 'text-center', // slot2 remains unchanged
    });
  });

  it('should handle className as an object for specific slots', () => {
    const variants = tv({
      slots: {
        base: '',
        slot1: 'p-4',
        slot2: 'text-center',
      },
    });

    const classNameObj = {
      slot1: 'text-red-500', // Tailwind text color class
      slot2: 'bg-blue-500', // Tailwind background color class
    };

    const result = variantsToClassNames(variants(), classNameObj);
    expect(result).toEqual({
      base: undefined,
      slot1: 'p-4 text-red-500', // 'p-4' + 'text-red-500' merged
      slot2: 'text-center bg-blue-500', // 'text-center' + 'bg-blue-500' merged
    });
  });

  it('should apply baseSlot logic with tv variants', () => {
    const variants = tv({
      slots: {
        base: 'bg-white', // Tailwind background color class
        slot1: 'p-4', // Tailwind padding class
        slot2: 'text-center', // Tailwind text alignment class
      },
    });

    const result = variantsToClassNames(variants(), 'border', 'base'); // A valid Tailwind class (border)
    expect(result).toEqual({
      base: 'bg-white border', // 'bg-white' + 'border' merged
      slot1: 'p-4', // padding 4 remains in slot1
      slot2: 'text-center', // text-center remains in slot2
    });
  });

  it('should handle both baseSlot and className object with tv variants', () => {
    const variants = tv({
      slots: {
        base: 'bg-white', // Tailwind background class
        slot1: 'p-4', // Tailwind padding class
        slot2: 'text-center', // Tailwind text alignment class
      },
    });

    const classNameObj = {
      base: 'shadow-md', // Tailwind shadow class
      slot1: 'text-blue-500', // Tailwind text color class
    };

    const result = variantsToClassNames(variants(), classNameObj, 'base');
    expect(result).toEqual({
      base: 'bg-white shadow-md', // 'bg-white' + 'shadow-md' merged
      slot1: 'p-4 text-blue-500', // 'p-4' + 'text-blue-500' merged
      slot2: 'text-center', // Default Tailwind class for slot2 remains
    });
  });
});
