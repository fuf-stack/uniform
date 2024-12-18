/* eslint-disable react/jsx-props-no-spreading */

import type { DragEndEvent } from '@dnd-kit/core';
import type { FieldArrayElementMethods } from './subcomponents/FieldArrayElement';
import type { FieldArrayProps } from './types';

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

import { Button } from '@fuf-stack/pixels';

import { toNullishString } from '../helpers';
import { useFieldArray, useFormContext, useInput } from '../hooks';
import { FieldValidationError } from '../partials/FieldValidationError';
import FieldArrayElement from './subcomponents/FieldArrayElement';
import FieldArrayLabel from './subcomponents/FieldArrayLabel';

/**
 * FieldArray component using TODO
 */
const FieldArray = ({
  children,
  duplicate = false,
  elementInitialValue: _elementInitialValue = null,
  insertAfter = false,
  label: _label = undefined,
  lastElementNotDeletable = true,
  name,
  sortable = false,
  testId: _testId = undefined,
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

  // TODO: add info
  const elementInitialValue = toNullishString(_elementInitialValue);

  if (lastElementNotDeletable && fields.length === 0) {
    append(elementInitialValue);
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
        {/**
         * TODO: this trigger causes the field array (not element)
         * are shown immediately, but this will cause additional
         * render cycles, not sure if we should do this...
         */}
        <ul data-testid={testId} onBlur={() => trigger(`${name}`)}>
          {showLabel && (
            <FieldArrayLabel
              label={label}
              showTestIdCopyButton={showTestIdCopyButton}
              testId={testId}
              getLabelProps={getLabelProps}
            />
          )}

          {fields.map((field, index) => {
            const methods: FieldArrayElementMethods = {
              append: () => append(elementInitialValue),
              duplicate: () => {
                const values = getValues(name);
                insert(index + 1, values[index]);
              },
              insert: () => insert(index + 1, elementInitialValue),
              remove: () => remove(index),
            };

            return (
              <FieldArrayElement
                className="mb-3 mt-5 flex flex-row items-center"
                field={field}
                fields={fields}
                id={field.id}
                index={index}
                duplicate={duplicate}
                insertAfter={insertAfter}
                key={field.id}
                lastNotDeletable={lastElementNotDeletable}
                methods={methods}
                name={name}
                sortable={sortable}
                testId={`${testId}_${index}`}
              >
                {children({
                  index,
                  length: fields.length,
                  methods,
                  name: `${name}.${index}`,
                  testId: `${testId}_${index}`,
                })}
              </FieldArrayElement>
            );
          })}

          {/* append elements */}
          <Button
            onClick={() => append(elementInitialValue)}
            size="sm"
            testId={`${testId}_append`}
          >
            Add
          </Button>

          {/* top level field array errors */}
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
