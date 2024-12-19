import type { ClassValue } from '@fuf-stack/pixel-utils';
import type { FieldArrayFeatures } from '../types';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { cn } from '@fuf-stack/pixel-utils';

import { useFormContext, useInput } from '../../hooks';
import { FieldValidationError } from '../../partials/FieldValidationError';
import FieldArrayInsertButton from './FieldArrayInsertButton';
import FieldArrayRemoveButton from './FieldArrayRemoveButton';
import FieldArraySortDragHandle from './FieldArraySortDragHandle';

/* eslint-disable react/jsx-props-no-spreading */

export type FieldArrayElementMethods = {
  append: () => void;
  duplicate: () => void;
  insert: () => void;
  remove: () => void;
};

interface FieldArrayElementProps extends FieldArrayFeatures {
  children: React.ReactNode;
  /** CSS class name */
  className: {
    element?: ClassValue;
    insertAfterButton?: ClassValue;
    removeButton?: ClassValue;
    sortDragHandle?: ClassValue;
  };
  field: Record<'id', string>;
  fields: Record<'id', string>[];
  id: string | number;
  index: number;
  lastNotDeletable?: boolean;
  methods: FieldArrayElementMethods;
  name: string;
  testId?: string;
}

/**
 * FieldArrayElement component using react-hook-form
 */
const FieldArrayElement = ({
  children,
  className,
  field,
  fields,
  id,
  index,
  insertAfter = false,
  lastNotDeletable = true,
  methods,
  name,
  sortable = false,
  testId = undefined,
}: FieldArrayElementProps) => {
  const { getFieldState } = useFormContext();
  const { error, invalid } = getFieldState(`${name}`, undefined);

  // TODO: what about input props? and label props? Do we need a label?
  const { getHelperWrapperProps, getErrorMessageProps } = useInput({
    classNames: { helperWrapper: 'block' },
    errorMessage: JSON.stringify(error),
    isInvalid: invalid,
    labelPlacement: 'inside',
    placeholder: ' ',
  });

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const sortingStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <>
      <li
        className={cn(className.element)}
        ref={setNodeRef}
        style={sortingStyle}
      >
        {/** sorting feature */}
        {sortable && (
          <div className="mr-6 flex flex-row items-center">
            {sortable && (
              <FieldArraySortDragHandle
                className={className.sortDragHandle}
                name={name}
                index={index}
                attributes={attributes}
                listeners={listeners}
              />
            )}
          </div>
        )}

        <div key={`rest-${field.id}`} className="w-full">
          <div className="mb-2 flex items-center">
            {/** render element fields */}
            <div className="flex-grow" data-testid={testId}>
              {children}
            </div>

            {/** remove element */}
            {lastNotDeletable && fields.length === 1 ? null : (
              <FieldArrayRemoveButton
                className={className.removeButton}
                onClick={() => methods.remove()}
              />
            )}
          </div>

          {/** insertAfter feature when not last element */}
          {insertAfter && index !== fields.length - 1 && (
            <FieldArrayInsertButton
              className={className.insertAfterButton}
              onClick={() => methods.insert()}
            />
          )}
        </div>
      </li>

      {/** element error */}
      {error && typeof error[index] !== 'undefined' && (
        <div {...getHelperWrapperProps()}>
          <div {...getErrorMessageProps()}>
            <FieldValidationError
              /* @ts-expect-error rhf incompatibility */
              error={error[Number(index)]?._errors}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FieldArrayElement;
