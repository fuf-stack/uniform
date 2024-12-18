import { createMockedIcon } from './fa';

// export everything (else) unchanged
export * from 'react-icons/hi';

// mock some used hi icons
export const HiOutlineClipboard = createMockedIcon('HiOutlineClipboard');
export const HiOutlineClipboardCheck = createMockedIcon(
  'HiOutlineClipboardCheck',
);
