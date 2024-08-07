import type { DragEndEvent } from '@dnd-kit/core';
import type {
  FieldValues,
  UseFieldArrayInsert,
  UseFieldArrayMove,
  UseFieldArrayRemove,
} from 'react-hook-form';

import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

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
import { useInput } from '@nextui-org/input';

import { Button } from '@fuf-stack/pixels';

import { useFormContext } from '../hooks';
import { FieldCopyTestIdButton } from '../partials/FieldCopyTestIdButton';
import { FieldValidationError } from '../partials/FieldValidationError';
import FieldArrayField from './FieldArrayField';

export type FieldArrayHideOption = 'add' | 'remove' | 'move' | 'insert' | 'all';
export type FieldArrayFieldChildren = (
  name: string,
  index: number,
  length: number,
  move: UseFieldArrayMove,
  insert: UseFieldArrayInsert<FieldValues, string>,
  remove: UseFieldArrayRemove,
  duplicate: (i: number) => void,
) => JSX.Element;

export type MoveField = 'drag-drop' | 'button';

export interface FieldArrayProps {
  /** function that renders the children with provided Properties. */
  children: FieldArrayFieldChildren;
  /** Hide a set of buttons. */
  hideButtons?: FieldArrayHideOption[];
  /** label of the FieldArray. */
  label?: React.ReactNode;
  /** stops user from deleting all items. */
  lastNotDeletable?: boolean;
  /** name the FieldArray is registered in RHF */
  name: string;
  /** ID for test purposes. */
  testId?: string;
  /* how the fields can be moved */
  moveField: MoveField[];
}

/**
 * FieldArray component using react-hook-form
 */
const FieldArray = ({
  children,
  hideButtons = [],
  label: _label = undefined,
  lastNotDeletable = true,
  name,
  testId: _testId = undefined,
  moveField = ['button'],
}: FieldArrayProps) => {
  const { control, getValues, getFieldState, register, trigger, watch } =
    useFormContext();

  const { fields, append, remove, insert, move } = useFieldArray({
    control,
    name,
  });

  const { error, testId, invalid, required } = getFieldState(name, _testId);

  register(`${name}._errors`);

  const formValues = watch();

  useEffect(() => {
    trigger(`${name}._errors`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formValues)]);

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

  if (lastNotDeletable && fields.length === 0) {
    append({});
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
        <ul data-testid={testId}>
          {label && (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...getLabelProps()}
              className={`${getLabelProps().className} !pointer-events-auto !static !z-0 -mb-1 ml-1 !inline-block`}
            >
              {label}
            </label>
          )}
          <FieldCopyTestIdButton testId={testId} />

          {fields.map((field, index) => {
            const duplicate = (i: number) => {
              const values = getValues(name);
              insert(i + 1, { ...values[i], id: null });
            };

            return (
              <FieldArrayField
                id={field.id}
                key={field.id}
                testId={`${testId}_${index}`}
                className="mb-3 mt-5 flex flex-row items-center"
                field={field}
                fields={fields}
                hideButtons={hideButtons}
                index={index}
                insert={insert}
                lastNotDeletable={lastNotDeletable}
                move={move}
                moveField={moveField}
                name={name}
                remove={remove}
              >
                {children(
                  `${name}[${index}]`,
                  index,
                  fields.length,
                  move,
                  insert,
                  remove,
                  duplicate,
                )}
              </FieldArrayField>
            );
          })}

          {!hideButtons.includes('add') && !hideButtons.includes('all') && (
            <Button
              testId={`${testId}_append`}
              size="sm"
              onClick={() => append({})}
            >
              Add
            </Button>
          )}
          {/* @ts-expect-error rhf incompatibility */}
          {error?._errors && (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <div {...getHelperWrapperProps()}>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
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
