import type { ClassValue } from '@fuf-stack/pixel-utils';

import { FaGripVertical } from 'react-icons/fa';

import { useSortable } from '@dnd-kit/sortable';

import { cn } from '@fuf-stack/pixel-utils';

import { slugify } from '../../helpers';

interface SortDragHandleProps {
  /** Optional CSS class name */
  className?: ClassValue;
  /** Unique identifier for sortable item */
  id: string | number;
  /** Item index for test ID generation */
  index: number;
  /** Base name for test ID generation */
  name: string;
}

/**
 * Drag handle component that integrates with dnd-kit sortable functionality.
 * Renders a vertical grip icon that can be used to reorder items.
 */
const SortDragHandle = ({
  className = undefined,
  id,
  index,
  name,
}: SortDragHandleProps) => {
  // Get dnd-kit sortable attributes and listeners
  const { attributes, listeners } = useSortable({ id });

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

export default SortDragHandle;
