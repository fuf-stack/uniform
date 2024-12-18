/* eslint-disable react/jsx-props-no-spreading */

import type { FieldArrayFeatures, FieldArrayHideOption } from '../types';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useFormContext, useInput } from '../../hooks';
import { FieldValidationError } from '../../partials/FieldValidationError';
import FieldArrayInsertButton from './FieldArrayInsertButton';
import FieldArrayRemoveButton from './FieldArrayRemoveButton';
import FieldArraySortDragHandle from './FieldArraySortDragHandle';

export type FieldArrayElementMethods = {
  append: () => void;
  duplicate: () => void;
  insert: () => void;
  remove: () => void;
};

interface FieldArrayElementProps extends FieldArrayFeatures {
  children: React.ReactNode;
  className?: string;
  field: Record<'id', string>;
  fields: Record<'id', string>[];
  hideButtons?: FieldArrayHideOption[];
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
  className = undefined,
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
      <li className={className} ref={setNodeRef} style={sortingStyle}>
        {/** sorting feature */}
        {sortable && (
          <div className="mr-6 flex flex-row items-center">
            {sortable && (
              <FieldArraySortDragHandle
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
              <FieldArrayRemoveButton onClick={() => methods.remove()} />
            )}
          </div>

          {/** insertAfter feature when not last element */}
          {insertAfter && index !== fields.length - 1 && (
            <FieldArrayInsertButton onClick={() => methods.insert()} />
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
