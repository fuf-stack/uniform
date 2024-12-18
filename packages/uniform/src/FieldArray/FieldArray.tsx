/* eslint-disable react/jsx-props-no-spreading */

import type { DragEndEvent } from '@dnd-kit/core';
import type { JSX } from 'react';
import type {
  FieldValues,
  UseFieldArrayInsert,
  UseFieldArrayMove,
  UseFieldArrayRemove,
} from 'react-hook-form';

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { cn } from '@fuf-stack/pixel-utils';
import { Button } from '@fuf-stack/pixels';

import { toNullishString } from '../helpers';
import { useFieldArray, useFormContext, useInput } from '../hooks';
import { FieldCopyTestIdButton } from '../partials/FieldCopyTestIdButton';
import { FieldValidationError } from '../partials/FieldValidationError';
import FieldArrayField from './FieldArrayField';

export type FieldArrayHideOption = 'add' | 'remove' | 'move' | 'insert' | 'all';
export type FieldArrayFieldChildren = (args: {
  duplicate: (i: number) => void;
  index: number;
  insert: UseFieldArrayInsert<FieldValues, string>;
  length: number;
  move: UseFieldArrayMove;
  name: string;
  remove: UseFieldArrayRemove;
  testId: string;
}) => JSX.Element;

export type MoveField = 'drag-drop' | 'button';

export interface FieldArrayProps {
  /** function that renders the children with provided Properties. */
  children: FieldArrayFieldChildren;
  /* The initial value of a filed that is created in the array */
  elementInitialValue?: unknown;
  /** Hide a set of buttons. */
  hideButtons?: FieldArrayHideOption[];
  /** label of the FieldArray. */
  label?: React.ReactNode;
  /** stops user from deleting all items. */
  lastElementNotDeletable?: boolean;
  /** name the FieldArray is registered in RHF */
  name: string;
  /** ID for test purposes. */
  testId?: string;
  /* how the fields can be moved */
  moveField?: MoveField[];
}

/**
 * FieldArray component using react-hook-form
 */
const FieldArray = ({
  children,
  elementInitialValue = null,
  hideButtons = [],
  label: _label = undefined,
  lastElementNotDeletable = true,
  name,
  testId: _testId = undefined,
  moveField = ['button'],
}: FieldArrayProps) => {
  const {
    control,
    debugMode,
    getValues,
    getFieldState,
    trigger,
    // watch
  } = useFormContext();

  const { fields, append, remove, insert, move } = useFieldArray({
    control,
    name,
  });

  const { error, testId, invalid, required } = getFieldState(name, _testId);

  // TODO: what about input props?
  const { label, getLabelProps, getHelperWrapperProps, getErrorMessageProps } =
    useInput({
      isInvalid: invalid,
      isRequired: required,
      errorMessage: JSON.stringify(error),
      label: _label,
      labelPlacement: 'inside',
      placeholder: ' ',
      classNames: { helperWrapper: 'block' },
    });

  if (lastElementNotDeletable && fields.length === 0) {
    append(toNullishString(elementInitialValue));
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over?.id);
      move(oldIndex, newIndex);
    }
  };

  const showTestIdCopyButton = debugMode === 'debug-testids';
  const showLabel = label || showTestIdCopyButton;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext
        items={fields.map((field) => field.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul data-testid={testId} onBlur={() => trigger(`${name}`)}>
          {showLabel && (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label
              {...getLabelProps()}
              className={cn(
                getLabelProps().className,
                '!pointer-events-auto !static !z-0 -mb-1 ml-1 !inline-block',
              )}
            >
              {label}
            </label>
          )}
          {showTestIdCopyButton && <FieldCopyTestIdButton testId={testId} />}

          {fields.map((field, index) => {
            const duplicate = (i: number) => {
              const values = getValues(name);
              insert(i + 1, { ...values[i], id: null });
            };

            return (
              <FieldArrayField
                className="mb-3 mt-5 flex flex-row items-center"
                field={field}
                fields={fields}
                hideButtons={hideButtons}
                id={field.id}
                index={index}
                insert={insert}
                key={field.id}
                lastNotDeletable={lastElementNotDeletable}
                move={move}
                moveField={moveField}
                name={name}
                remove={remove}
                testId={`${testId}_${index}`}
              >
                {children({
                  duplicate,
                  index,
                  insert,
                  length: fields.length,
                  move,
                  name: `${name}.${index}`,
                  remove,
                  testId: `${testId}_${index}`,
                })}
              </FieldArrayField>
            );
          })}

          {!hideButtons.includes('add') && !hideButtons.includes('all') && (
            <Button
              onClick={() => append(toNullishString(elementInitialValue))}
              size="sm"
              testId={`${testId}_append`}
            >
              Add
            </Button>
          )}
          {/* @ts-expect-error rhf incompatibility */}
          {error?._errors && (
            <div {...getHelperWrapperProps()}>
              <div {...getErrorMessageProps()}>
                {/* @ts-expect-error rhf incompatibility */}
                <FieldValidationError error={error?._errors} />
              </div>
            </div>
          )}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default FieldArray;
