import { FaPlus } from 'react-icons/fa6';

import { Button } from '@fuf-stack/pixels';

interface FieldArrayInsertButtonProps {
  onClick: () => void;
}

const FieldArrayInsertButton = ({ onClick }: FieldArrayInsertButtonProps) => {
  return (
    <Button
      onClick={onClick}
      icon={<FaPlus />}
      color="success"
      variant="light"
      size="sm"
    />
  );
};

export default FieldArrayInsertButton;
