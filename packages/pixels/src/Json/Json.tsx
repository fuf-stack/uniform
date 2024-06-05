import type { ReactNode } from 'react';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTimesCircle } from 'react-icons/fa';
import { HiOutlineClipboard, HiOutlineClipboardCheck } from 'react-icons/hi';

// INFO: react-json-view is bundled with --dts-resolve for now
// eslint-disable-next-line import/no-extraneous-dependencies
import JsonView from '@uiw/react-json-view';
// eslint-disable-next-line import/no-extraneous-dependencies
import { lightTheme } from '@uiw/react-json-view/light';
// eslint-disable-next-line import/no-extraneous-dependencies
import { vscodeTheme } from '@uiw/react-json-view/vscode';

import { cn } from '@fuf-stack/pixel-utils';

import { Button } from '../Button';

/**
 * returns the value (JSON string or object) as object
 */
const getValue = (value: string | object) => {
  if (typeof value === 'string') {
    return JSON.parse(value);
  }
  if (typeof value === 'object') {
    return value;
  }
  throw new Error(`${typeof value} can not be visualized`);
};

export interface JsonProps {
  /** CSS class name */
  className?: string | string[] | null;
  /** When set to true, all nodes will be collapsed by default. Use an integer value to collapse at a particular depth. */
  collapsed?: boolean | number;
  /** Object to be visualized JSON string or object */
  value: string | object;
}

/**
 * Json renderer based on [react-json-view](https://mac-s-g.github.io/react-json-view/demo/dist/)
 */
const Json = ({ className = null, collapsed = false, value }: JsonProps) => {
  const isDarkMode = document.body.classList.contains('dark');

  let content: ReactNode = null;
  let error: ReactNode = null;

  const [showDetails, setShowDetails] = useState(false);

  try {
    content = (
      <JsonView
        className="pr-5"
        collapsed={collapsed}
        displayDataTypes={false}
        style={{
          ...(isDarkMode ? vscodeTheme : lightTheme),
          backgroundColor: 'unset',
        }}
        value={getValue(value)}
      >
        {/* FIX: overwrite Copied component to fix flickering copy button */}
        <JsonView.Copied
          render={({
            // @ts-expect-error this should be fine
            'data-copied': copied,
            style,
            ...elmProps
          }) => {
            const elmClasses = cn(
              elmProps.className,
              'absolute -right-4 -top-[2px] h-4 w-4 !fill-transparent pl-1',
              { 'text-success': copied },
            );
            return (
              <span className="relative !ml-0 !h-[1em] !w-0" style={style}>
                {copied ? (
                  <HiOutlineClipboardCheck
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...elmProps}
                    className={elmClasses}
                  />
                ) : (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <HiOutlineClipboard {...elmProps} className={elmClasses} />
                )}
              </span>
            );
          }}
        />
      </JsonView>
    );
  } catch (err) {
    error = (
      <div
        className="mb-4 flex flex-col items-center rounded-lg border border-danger bg-danger-50 p-4 text-sm text-danger"
        role="alert"
      >
        <div className="flex w-full justify-between gap-6">
          <div className="flex items-center">
            <FaTimesCircle className="mr-2" />
            <span className="font-medium">Failed to parse JSON data</span>
          </div>
          <Button
            color="danger"
            size="sm"
            variant="light"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>
                <FaChevronUp /> Hide Details
              </>
            ) : (
              <>
                <FaChevronDown /> Show Details
              </>
            )}
          </Button>
        </div>
        {showDetails && (
          <div className="mt-4 w-full text-left">
            <div>
              <strong>Error:</strong>
              <pre>
                {/* @ts-expect-error is ok */}
                {err?.name}: {err?.message}
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
  }
  return <div className={cn(className)}>{error || content}</div>;
};

export default Json;
