/* eslint-disable import/no-extraneous-dependencies */

import { vi } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

export const createMockedIcon = (displayName: string) => {
  const MockedIcon = () => (
    <span data-testid={`icon-${displayName}`}>{displayName}</span>
  );
  return vi.fn().mockImplementation(MockedIcon);
};

// mock used fa icons
export const FaBars = createMockedIcon('FaBars');
export const FaChevronDown = createMockedIcon('FaChevronDown');
export const FaChevronUp = createMockedIcon('FaChevronUp');
export const FaEnvelope = createMockedIcon('FaEnvelope');
export const FaTimesCircle = createMockedIcon('FaTimesCircle');
