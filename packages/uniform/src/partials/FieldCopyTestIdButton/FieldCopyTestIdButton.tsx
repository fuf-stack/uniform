import { FaBullseye } from 'react-icons/fa6';

import cn from 'classnames';

import Button from '@fuf-stack/pixels/Button';
import useLocalStorage from '@fuf-stack/pixels/hooks/useLocalStorage';

interface FormDebugProps {
  className?: string;
  testId: string;
}

const LOCALSTORAGE_DEBUG_KEY = 'uniform:form-debug-enabled';

const TestIdDebug = ({ className = undefined, testId }: FormDebugProps) => {
  const [debug] = useLocalStorage(LOCALSTORAGE_DEBUG_KEY, false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(testId).catch((err) => {
      console.error('Error copying TestId to clipboard', err);
    });
  };

  if (!debug) {
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
export default TestIdDebug;
