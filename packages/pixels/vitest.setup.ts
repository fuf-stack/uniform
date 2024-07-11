/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom/vitest';

import { afterEach, vi } from 'vitest';

import { cleanup } from '@testing-library/react';

// see: https://testing-library.com/docs/react-testing-library/api#cleanup
afterEach(() => {
  cleanup();
});

// fix react useId not consistent in snapshots (used directly by nextui)
// e.g.: https://github.com/nextui-org/nextui/blob/main/packages/components/checkbox/src/use-checkbox.ts#L5
vi.mock('react', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const reactOrig = await importOriginal<typeof import('react')>();

  const useId = () => 'react-useId-mock';

  // @ts-expect-error we also have to mock useId in default (React.useId)
  reactOrig.default.useId = useId;

  return { ...reactOrig, useId };
});
