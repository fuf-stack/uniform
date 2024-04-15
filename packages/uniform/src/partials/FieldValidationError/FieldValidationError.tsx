import type { FieldError } from 'react-hook-form';

import { slugify } from '../../helpers';

interface FieldValidationErrorProps {
  error: FieldError[] | Record<string, FieldError[]>;
  testId?: string;
}

/**
 * Renders a validation error of a field
 */
const FieldValidationError = ({
  error,
  testId = undefined,
}: FieldValidationErrorProps) => {
  if (!error) {
    return null;
  }

  let tmp_errors: FieldError[] = [];

  if (typeof error === 'object' && !(error instanceof Array)) {
    const error_object = error as Record<string, FieldError[]>;
    Object.keys(error).forEach((key) => {
      tmp_errors = [...tmp_errors, ...error_object[key]];
    });
  }

  const errorArray: FieldError[] =
    JSON.stringify(tmp_errors) !== '[]' ? tmp_errors : (error as FieldError[]);
  const errorStrings: string[] = errorArray.map((e) => e.message) as string[];
  const ariaString = `Error: ${errorStrings.join('\n')}`;

  return (
    <ul
      data-testid={slugify(testId || errorStrings.join())}
      aria-label={ariaString} // TODO: ist das richtig @Hannes?
    >
      {errorStrings.map((errorString: string, i: number) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={`error_${i}`}>
          <div>{errorString}</div>
        </li>
      ))}
    </ul>
  );
};

export default FieldValidationError;
