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
  /* initial value of a filed that is created in the array */
  elementInitialValue?: unknown;
  /** label of the field array */
  label?: React.ReactNode;
  /** when true last element can not be deleted and will be shown even if empty */
  lastElementNotDeletable?: boolean;
  /** form field name */
  name: string;
  /** HTML data-testid attribute used in e2e tests */
  testId?: string;
}
