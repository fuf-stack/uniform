import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { ClassValue } from '@fuf-stack/pixel-utils';

import { FaGripVertical } from 'react-icons/fa';

import { cn } from '@nextui-org/theme';

import { slugify } from '../../helpers';

interface FieldArraySortDragHandleProps {
  attributes: DraggableAttributes;
  /** CSS class name */
  className?: ClassValue;
  index: number;
  listeners?: SyntheticListenerMap;
  name: string;
}

const FieldArraySortDragHandle = ({
  className = undefined,
  name,
  index,
  attributes,
  listeners = undefined,
}: FieldArraySortDragHandleProps) => {
  return (
    <div
      className={cn(className)}
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
