import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

import { FaGripVertical } from 'react-icons/fa';

import { slugify } from '../../helpers';

interface FieldArraySortDragHandleProps {
  attributes: DraggableAttributes;
  index: number;
  listeners?: SyntheticListenerMap;
  name: string;
}

const FieldArraySortDragHandle = ({
  name,
  index,
  attributes,
  listeners = undefined,
}: FieldArraySortDragHandleProps) => {
  return (
    <div
      className="mr-2 text-base text-xl"
      data-testid={slugify(`${name}_${index}_sort_drag_handle`)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...attributes}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...listeners}
    >
      <FaGripVertical />
    </div>
  );
};

export default FieldArraySortDragHandle;
