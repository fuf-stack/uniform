/* eslint-disable react/jsx-props-no-spreading */

import { cn } from '@fuf-stack/pixel-utils';

import { FieldCopyTestIdButton } from '../../partials/FieldCopyTestIdButton';

interface FieldArrayLabelProps {
  label?: React.ReactNode;
  showTestIdCopyButton: boolean;
  testId: string;
  getLabelProps: () => Record<string, unknown>;
}

const FieldArrayLabel = ({
  label,
  showTestIdCopyButton,
  testId,
  getLabelProps,
}: FieldArrayLabelProps) => {
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        {...getLabelProps()}
        className={cn(
          getLabelProps()?.className,
          '!pointer-events-auto !static !z-0 -mb-1 ml-1 !inline-block',
        )}
      >
        {label}
      </label>
      {showTestIdCopyButton && <FieldCopyTestIdButton testId={testId} />}
    </>
  );
};

export default FieldArrayLabel;
