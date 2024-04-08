import { describe, expect, it } from 'vitest';

describe('Addition', () => {
  it('knows that 2 and 2 make 4', () => {
    expect(2 + 2).toBe(4);
  });

  it('knows that 3 and 3 make 6', () => {
    expect(3 + 3).toBe(6);
  });

  it('knows that 4 and 4 make 8', () => {
    expect(4 + 4).toBe(8);
  });
});
