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

import { cn, tv, variantsToClassNames } from '@fuf-stack/pixel-utils';
import { Button } from '@fuf-stack/pixels';

import { toNullishString } from '../helpers';
import { useFieldArray, useFormContext, useInput } from '../hooks';
import { FieldCopyTestIdButton } from '../partials/FieldCopyTestIdButton';
import { FieldValidationError } from '../partials/FieldValidationError';
import FieldArrayElement from './subcomponents/FieldArrayElement';

export const fieldArrayVariants = tv({
  slots: {
    appendButton: '',
    content: 'flex-grow',
    contentInner: 'mb-2 flex items-center',
    contentWrapper: 'w-full',
    sortDragHandle: 'mr-2 text-base text-xl',
    element: 'mb-3 mt-5 flex flex-row items-center',
    errorWrapper: 'block',
    insertAfterButton: 'text-xs font-medium',
    label: '!pointer-events-auto !static !z-0 -mb-1 ml-1 !inline-block',
    list: 'm-0 w-full list-none p-0',
    removeButton: 'ml-1',
    wrapper: 'flex w-full flex-col gap-2',
  },
});

/**
 * FieldArray component using TODO
 */
const FieldArray = ({
  children,
  className: _className = undefined,
  duplicate = false,
  elementInitialValue: _elementInitialValue = null,
  insertAfter = false,
  label: _label = undefined,
  lastElementNotDeletable = true,
  name,
  sortable = false,
  testId: _testId = undefined,
}: FieldArrayProps) => {
  // className from slots
  const variants = fieldArrayVariants();
  const className = variantsToClassNames(variants, _className, 'list');

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
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext
        items={fields.map((field) => field.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          className={className.list}
          data-testid={testId}
          /**
           * TODO: this trigger causes the field array (not element)
           * are shown immediately, but this will cause additional
           * render cycles, not sure if we should do this...
           */
          onBlur={() => trigger(`${name}`)}
        >
          {/* field array label */}
          {showLabel && (
            <>
              {label && (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <label
                  {...getLabelProps()}
                  className={cn(getLabelProps()?.className, className.label)}
                >
                  {label}
                </label>
              )}
              {showTestIdCopyButton && (
                <FieldCopyTestIdButton testId={testId} />
              )}
            </>
          )}

          {fields.map((field, index) => {
            // create methods for element
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
                className={className}
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
            className={className.appendButton}
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
