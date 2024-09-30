import { FaBullseye } from 'react-icons/fa6';

import { cn } from '@fuf-stack/pixel-utils';
import { Button, useLocalStorage } from '@fuf-stack/pixels';

export interface FieldCopyTestIdButtonProps {
  className?: string;
  testId: string;
}

const LOCALSTORAGE_DEBUG_KEY = 'uniform:form-debug-enabled';
const LOCALSTORAGE_COPY_KEY = 'uniform:form-debug-copy-enabled';

const FieldCopyTestIdButton = ({
  className = undefined,
  testId,
}: FieldCopyTestIdButtonProps) => {
  const [debug] = useLocalStorage(LOCALSTORAGE_DEBUG_KEY, false);
  const [copy] = useLocalStorage(LOCALSTORAGE_COPY_KEY, false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(testId).catch((err) => {
      console.error('Error copying TestId to clipboard', err);
    });
  };

  if (!debug || !copy) {
    return null;
  }

  return (
    <Button
      className={cn(className, 'pointer-events-auto')}
      variant="light"
      onClick={copyToClipboard}
      icon={<FaBullseye />}
      size="sm"
    />
  );
};
export default FieldCopyTestIdButton;
