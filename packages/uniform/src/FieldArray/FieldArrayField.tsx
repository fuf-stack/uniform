import type {
  FieldValues,
  UseFieldArrayInsert,
  UseFieldArrayMove,
  UseFieldArrayRemove,
} from 'react-hook-form';
import type { FieldArrayHideOption, MoveField } from './FieldArray';

import { FaAngleDown, FaAngleUp, FaGripVertical } from 'react-icons/fa';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Button } from '@fuf-stack/pixels';

import { slugify } from '../helpers';
import { useFormContext, useInput } from '../hooks';
import { FieldValidationError } from '../partials/FieldValidationError';

interface FieldArrayFieldProps {
  children: React.ReactNode;
  className?: string;
  field: Record<'id', string>;
  fields: Record<'id', string>[];
  hideButtons?: FieldArrayHideOption[];
  id: string | number;
  index: number;
  insert: UseFieldArrayInsert<FieldValues, string>;
  lastNotDeletable?: boolean;
  move: UseFieldArrayMove;
  moveField: MoveField[];
  testId?: string;
  name: string;
  remove: UseFieldArrayRemove;
}

/**
 * FieldArrayField component using react-hook-form
 */
const FieldArrayField = ({
  children,
  className = undefined,
  field,
  fields,
  hideButtons = [],
  id,
  index,
  insert,
  lastNotDeletable = true,
  move,
  moveField,
  name,
  remove,
  testId = undefined,
}: FieldArrayFieldProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const { getFieldState, trigger } = useFormContext();
  const { error, invalid } = getFieldState(`${name}`, undefined);

  // TODO: what about input props? and label props? Do we need a label?
  const { getHelperWrapperProps, getErrorMessageProps } = useInput({
    isInvalid: invalid,
    errorMessage: JSON.stringify(error),
    labelPlacement: 'inside',
    placeholder: ' ',
    classNames: { helperWrapper: 'block' },
  });

  return (
    <>
      <li
        ref={setNodeRef}
        style={style}
        className={className}
        onBlur={() => trigger(`${name}.${index}`)}
      >
        {/** Start Button up/down */}
        {!hideButtons.includes('move') && !hideButtons.includes('all') && (
          <div className="mr-6 flex flex-row items-center">
            {moveField.includes('drag-drop') && (
              <div
                className="mr-2 text-base text-xl"
                data-testid={slugify(`${name}_${index}_movebutton`)}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...attributes}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...listeners}
              >
                <FaGripVertical />
              </div>
            )}
            {moveField.includes('button') && (
              <div className="flex flex-col">
                <Button
                  testId={`${name}.${index}.up`}
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                  className="flex rounded-b-none rounded-t-md border border-gray-300 px-2 py-2 shadow-sm"
                >
                  <FaAngleUp />
                </Button>
                <Button
                  testId={`${name}.${index}.down`}
                  disabled={index === fields.length - 1}
                  onClick={() => move(index, index + 1)}
                  className="flex rounded-b-md rounded-t-none border border-gray-300 px-2 py-2 shadow-sm"
                >
                  <FaAngleDown />
                </Button>
              </div>
            )}
          </div>
        )}
        {/** End Button up/down */}
        <div key={`rest-${field.id}`} className="w-full">
          <div className="mb-2 flex items-center">
            {/** RENDER CHILDREN */}
            <div className="flex-grow" data-testid={testId}>
              {children}
            </div>
            {!hideButtons.includes('remove') &&
              !hideButtons.includes('all') &&
              (lastNotDeletable && fields.length === 1 ? null : (
                <Button onClick={() => remove(index)} className="ml-1">
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              ))}
          </div>

          {!hideButtons.includes('insert') &&
          !hideButtons.includes('all') &&
          index !== fields.length - 1 ? (
            <Button
              className="text-xs font-medium"
              testId={`add-harbor-button-${index}`}
              onClick={() => {
                insert(index + 1, {});
              }}
            >
              insert
            </Button>
          ) : null}
        </div>
      </li>
      {error && typeof error[index] !== 'undefined' && (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <div {...getHelperWrapperProps()}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
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
export default FieldArrayField;
