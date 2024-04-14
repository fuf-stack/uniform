import type { ReactNode } from 'react';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTimesCircle } from 'react-icons/fa';
import ReactJson from 'react-json-view';

import cn from 'classnames';

import Button from '../Button';

import styles from './Json.module.css';

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
      <ReactJson
        theme={isDarkMode ? 'tomorrow' : 'rjv-default'}
        style={{
          fontSize: '12px',
          backgroundColor: 'unset',
        }}
        name={false}
        displayDataTypes={false}
        src={getValue(value)}
        collapsed={collapsed}
      />
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
  return (
    <div className={cn(styles.wrapper, className)}>{error || content}</div>
  );
};

export default Json;
