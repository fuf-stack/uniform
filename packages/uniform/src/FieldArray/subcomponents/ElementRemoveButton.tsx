import type { ClassValue } from '@fuf-stack/pixel-utils';

import { FaTimes } from 'react-icons/fa';

import { cn } from '@fuf-stack/pixel-utils';
import { Button } from '@fuf-stack/pixels';

interface ElementRemoveButtonProps {
  /** CSS class name */
  className?: ClassValue;
  /** click handler */
  onClick: () => void;
}

const ElementRemoveButton = ({
  className = undefined,
  onClick,
}: ElementRemoveButtonProps) => {
  return (
    <Button
      ariaLabel="remove element"
      className={cn(className)}
      color="danger"
      icon={<FaTimes />}
      onClick={onClick}
      variant="light"
    />
  );
};

export default ElementRemoveButton;
