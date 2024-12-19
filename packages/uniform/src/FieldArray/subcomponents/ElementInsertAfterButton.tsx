import type { ClassValue } from '@fuf-stack/pixel-utils';

import { FaPlus } from 'react-icons/fa6';

import { cn } from '@fuf-stack/pixel-utils';
import { Button } from '@fuf-stack/pixels';

interface ElementInsertAfterButtonProps {
  /** CSS class name */
  className?: ClassValue;
  /** click handler */
  onClick: () => void;
}

const ElementInsertAfterButton = ({
  className = undefined,
  onClick,
}: ElementInsertAfterButtonProps) => {
  return (
    <Button
      className={cn(className)}
      color="success"
      icon={<FaPlus />}
      onClick={onClick}
      size="sm"
      variant="light"
    />
  );
};

export default ElementInsertAfterButton;
