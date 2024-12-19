import type { ClassValue } from '@fuf-stack/pixel-utils';

import { FaPlus } from 'react-icons/fa6';

import { cn } from '@fuf-stack/pixel-utils';
import { Button } from '@fuf-stack/pixels';

interface FieldArrayInsertButtonProps {
  /** CSS class name */
  className?: ClassValue;
  /** click handler */
  onClick: () => void;
}

const FieldArrayInsertButton = ({
  className = undefined,
  onClick,
}: FieldArrayInsertButtonProps) => {
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

export default FieldArrayInsertButton;
