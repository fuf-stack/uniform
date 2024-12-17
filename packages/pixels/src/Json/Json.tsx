/* eslint-disable import/no-extraneous-dependencies */

import type { ReactNode } from 'react';

import { useMemo, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTimesCircle } from 'react-icons/fa';
import { HiOutlineClipboard, HiOutlineClipboardCheck } from 'react-icons/hi';

// INFO: react-json-view is bundled with --dts-resolve for now (dev dep)
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { useTheme } from 'next-themes';

import { cn } from '@fuf-stack/pixel-utils';

import { Button } from '../Button';

/**
 * Custom error for JSON parsing failures
 */
class JsonParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JsonParseError';
  }
}

/**
 * returns the value (JSON string or object) as object
 */
const getValue = (value: string | object): object => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new JsonParseError(
        `Invalid JSON string: ${(error as Error).message}`,
      );
    }
  }
  if (value === null || value === undefined) {
    throw new JsonParseError('Value cannot be null or undefined');
  }
  if (typeof value === 'object') {
    return value;
  }
  throw new JsonParseError(`${typeof value} cannot be visualized`);
};

const CopiedComponent = () => {
  return (
    <JsonView.Copied
      render={(props) => {
        // eslint-disable-next-line react/prop-types
        const { style, onClick, className } = props;

        // @ts-expect-error this is ok
        // eslint-disable-next-line react/prop-types
        const isCopied = props['data-copied'] as boolean;

        const elmClasses = cn(
          className,
          'absolute -right-4 -top-[2px] h-4 w-4 !fill-transparent pl-1',
          { 'text-success': isCopied },
        );

        const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick?.(e as unknown as React.MouseEvent<SVGSVGElement>);
          }
        };

        return (
          <span
            className="relative !ml-0 !h-[1em] !w-0"
            style={style}
            data-testid="copy-button"
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onClick={(e) =>
              onClick?.(e as unknown as React.MouseEvent<SVGSVGElement>)
            }
            aria-label={isCopied ? 'Copied to clipboard' : 'Copy to clipboard'}
          >
            {isCopied ? (
              <HiOutlineClipboardCheck className={elmClasses} />
            ) : (
              <HiOutlineClipboard className={elmClasses} />
            )}
          </span>
        );
      }}
    />
  );
};

export interface JsonProps {
  /** CSS class name */
  className?: string;
  /** When set to true, all nodes will be collapsed by default. Use an integer value to collapse at a particular depth. */
  collapsed?: boolean | number;
  /** Object to be visualized JSON string or object */
  value: string | object;
  /** Optional maximum height of the JSON viewer */
  maxHeight?: string | number;
  /** Callback when copy action is performed */
  onCopy?: (copiedValue: string) => void;
  /** Optional custom error renderer */
  errorRenderer?: (error: Error, data: string | object) => ReactNode;
}

/**
 * Json renderer based on [react-json-view](https://uiwjs.github.io/react-json-view)
 * with improved error handling, accessibility, and customization options
 */
const Json = ({
  className = undefined,
  collapsed = false,
  value,
  maxHeight = undefined,
  onCopy = undefined,
  errorRenderer = undefined,
}: JsonProps) => {
  const [showDetails, setShowDetails] = useState(false);

  // determine theme, if no theme context available (next-themes)
  // it will be determined by if body has dark class
  const { resolvedTheme } = useTheme();
  const isDarkMode = useMemo(
    () => resolvedTheme === 'dark' || document.body.classList.contains('dark'),
    [resolvedTheme],
  );

  const handleCopy = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const copiedValue = event.currentTarget.textContent || '';
    onCopy?.(copiedValue);
  };

  let content: ReactNode = null;
  let error: ReactNode = null;

  try {
    const parsedValue = getValue(value);
    content = (
      <div
        style={{ maxHeight, overflowY: maxHeight ? 'auto' : undefined }}
        className="relative"
      >
        <JsonView
          className="pr-5"
          collapsed={collapsed}
          displayDataTypes={false}
          style={{
            ...(isDarkMode ? vscodeTheme : lightTheme),
            backgroundColor: 'unset',
          }}
          value={parsedValue}
          onCopy={handleCopy}
        >
          {/* FIX: overwrite Copied component to fix flickering copy button */}
          <CopiedComponent />
          <JsonView.Null render={() => <span>NULL</span>} />
        </JsonView>
      </div>
    );
  } catch (err) {
    const defaultError = (
      <div
        className="mb-4 flex flex-col items-center rounded-lg border border-danger bg-danger-50 p-4 text-sm text-danger"
        role="alert"
        aria-live="polite"
      >
        <div className="flex w-full justify-between gap-6">
          <div className="flex items-center">
            <FaTimesCircle className="mr-2" aria-hidden="true" />
            <span className="font-medium">Failed to parse JSON data</span>
          </div>
          <Button
            color="danger"
            size="sm"
            variant="light"
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
            aria-controls="error-details"
          >
            {showDetails ? (
              <>
                <FaChevronUp aria-hidden="true" /> Hide Details
              </>
            ) : (
              <>
                <FaChevronDown aria-hidden="true" /> Show Details
              </>
            )}
          </Button>
        </div>
        {showDetails && (
          <div id="error-details" className="mt-4 w-full text-left">
            <div>
              <strong>Error:</strong>
              <pre>
                {err instanceof Error
                  ? `${err.name}: ${err.message}`
                  : 'Unknown error'}
              </pre>
            </div>
            <div className="mt-4">
              <strong>Data:</strong>
              <pre>
                {typeof value !== 'string'
                  ? JSON.stringify(value, null, 2)
                  : value}
              </pre>
            </div>
          </div>
        )}
      </div>
    );

    error = errorRenderer ? errorRenderer(err as Error, value) : defaultError;
  }

  return (
    <div aria-label="JSON viewer" className={cn(className)} role="region">
      {error || content}
    </div>
  );
};

export default Json;
