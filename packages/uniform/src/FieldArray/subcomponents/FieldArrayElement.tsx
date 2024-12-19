/* eslint-disable react/jsx-props-no-spreading */

import type { ClassValue } from '@fuf-stack/pixel-utils';
import type { FieldArrayFeatures } from '../types';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { cn } from '@fuf-stack/pixel-utils';

import { useFormContext, useInput } from '../../hooks';
import { FieldValidationError } from '../../partials/FieldValidationError';
import ElementInsertAfterButton from './ElementInsertAfterButton';
import ElementRemoveButton from './ElementRemoveButton';
import SortDragHandle from './SortDragHandle';

export type FieldArrayElementMethods = {
  /** Add new element at end */
  append: () => void;
  /** Clone current element */
  duplicate: () => void;
  /** Add new element after current */
  insert: () => void;
  /** Remove current element */
  remove: () => void;
};

interface FieldArrayElementProps extends FieldArrayFeatures {
  /** Form elements to render inside array element */
  children: React.ReactNode;
  /** CSS class names for component parts */
  className: {
    /** Class for the array element container */
    element?: ClassValue;
    /** Class for the insert button between elements */
    insertAfterButton?: ClassValue;
    /** Class for the remove element button */
    removeButton?: ClassValue;
    /** Class for the drag handle when sorting enabled */
    sortDragHandle?: ClassValue;
  };
  /** Current field data with unique ID */
  field: Record<'id', string>;
  /** All fields in the form array */
  fields: Record<'id', string>[];
  /** Unique identifier for drag/drop */
  id: string | number;
  /** Field index in array */
  index: number;
  /** Prevent deletion of last remaining element */
  lastNotDeletable?: boolean;
  /** Field array operation methods */
  methods: FieldArrayElementMethods;
  /** Base field name for form context */
  name: string;
  /** Optional test identifier */
  testId?: string;
}

/**
 * Form array element component using react-hook-form with drag-drop sorting
 * and validation capabilities
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

  // Apply transform styles when sortable is enabled for smooth drag animations
  // transform: handles the item's position during drag
  // transition: controls the animation timing when dropping
  const { setNodeRef, transform, transition } = useSortable({ id });
  const sortingStyle = sortable
    ? {
        transform: CSS.Translate.toString(transform),
        transition,
      }
    : undefined;

  return (
    <>
      <li
        className={cn(className.element)}
        ref={setNodeRef}
        style={sortingStyle}
      >
        {/** sorting drag handle */}
        {sortable && (
          <div className="mr-6 flex flex-row items-center">
            <SortDragHandle
              className={className.sortDragHandle}
              id={id}
              index={index}
              name={name}
            />
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
              <ElementRemoveButton
                className={className.removeButton}
                onClick={() => methods.remove()}
              />
            )}
          </div>

          {/** insertAfter feature when not last element */}
          {insertAfter && index !== fields.length - 1 && (
            <ElementInsertAfterButton
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
