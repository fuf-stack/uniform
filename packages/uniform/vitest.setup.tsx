/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom/vitest';

import { afterEach } from 'vitest';

import { cleanup } from '@testing-library/react';

// see: https://testing-library.com/docs/react-testing-library/api#cleanup
afterEach(() => {
  cleanup();
});

// TODO: this is not working in vitest for now
// // fix react useId not consistent in snapshots (used directly by nextui)
// // e.g.: https://github.com/nextui-org/nextui/blob/main/packages/components/checkbox/src/use-checkbox.ts#L5
// vi.mock('react', async (importOriginal) => {
//   return {
//     // eslint-disable-next-line @typescript-eslint/consistent-type-imports
//     ...(await importOriginal<typeof import('react')>()),
//     useId: () => {
//       return 'react-useId-mock';
//     },
//   };
// });

// vi.mock('@react-aria/utils', async (importOriginal) => {
//   // const originalModule = jest.requireActual("ariakit-utils/hooks");
//   return {
//     __esModule: true,
//     // eslint-disable-next-line @typescript-eslint/consistent-type-imports
//     ...(await importOriginal<typeof import('@react-aria/utils')>()),
//     useId: vi.fn(() => 'mocked-id'),
//   };
// });
