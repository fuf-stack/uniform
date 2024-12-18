import type { JSX } from 'react';
import type { FieldArrayElementMethods } from './subcomponents/FieldArrayElement';

export type FieldArrayHideOption = 'add' | 'insert' | 'remove' | 'sort' | 'all';

export type FieldArrayChildrenRenderFn = (args: {
  index: number;
  length: number;
  methods: FieldArrayElementMethods;
  name: string;
  testId: string;
}) => JSX.Element;

export interface FieldArrayFeatures {
  /** enables duplicating existing elements */
  duplicate?: boolean;
  /** enables inserting new elements after existing elements */
  insertAfter?: boolean;
  /** enables sorting by drag-n-drop */
  sortable?: boolean;
}

export interface FieldArrayProps extends FieldArrayFeatures {
  /** function that renders the children with provided Properties. */
  children: FieldArrayChildrenRenderFn;
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
}
