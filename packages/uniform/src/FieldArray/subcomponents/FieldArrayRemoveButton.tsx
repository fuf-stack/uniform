import { FaTimes } from 'react-icons/fa';

import { Button } from '@fuf-stack/pixels';

interface FieldArrayRemoveButtonProps {
  onClick: () => void;
}

const FieldArrayRemoveButton = ({ onClick }: FieldArrayRemoveButtonProps) => {
  return (
    <Button
      ariaLabel="remove element"
      className="ml-1"
      color="danger"
      icon={<FaTimes />}
      onClick={onClick}
      variant="light"
    />
  );
};

export default FieldArrayRemoveButton;
