import type { ReactNode } from 'react';

import {
  Modal as NextModal,
  ModalBody as NextModalBody,
  ModalContent as NextModalContent,
  ModalFooter as NextModalFooter,
  ModalHeader as NextModalHeader,
} from '@nextui-org/modal';
import cn from 'classnames';
import createDebug from 'debug';

const debug = createDebug('component:Modal');

export const ModalSizeOptions = ['sm', 'md', 'lg'] as const;
type ModalSize = (typeof ModalSizeOptions)[number];

export interface ModalProps {
  /** child components */
  children?: ReactNode;
  /** CSS class name */
  className?: string | string[];
  /** HTML data-testid attribute used in e2e tests */
  footer?: ReactNode;
  /** open state (controlled) */
  isOpen: boolean;
  /** close event handler */
  onClose: () => void;
  /** modal size */
  size?: ModalSize;
  /** e2e test id */
  testId?: string;
  /** modal header */
  title?: ReactNode;
}

/**
 * Modal component based on [NextUI Modal](https://nextui.org/docs/components/modal)
 */
const Modal = ({
  children = null,
  className = undefined,
  footer = undefined,
  isOpen,
  onClose,
  size = 'md',
  testId = undefined,
  title = undefined,
}: ModalProps) => {
  debug('Modal', { size });
  return (
    <div className={cn(className)} data-testid={testId}>
      <NextModal
        backdrop="opaque"
        classNames={{
          base: cn(
            {
              'lg:w-11/12': size === 'lg',
              'w-2/12': size === 'sm',
              'w-6/12': size === 'md',
            },
            // overwrite !rounded-none from nextui
            '!rounded-lg',
          ),
        }}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        size="full"
      >
        <NextModalContent data-testid={testId ? `${testId}_modal` : 'modal'}>
          {() => (
            <>
              {title && <NextModalHeader>{title}</NextModalHeader>}
              <NextModalBody className="bg-ex-background">
                {children}
              </NextModalBody>
              {footer && <NextModalFooter>{footer}</NextModalFooter>}
            </>
          )}
        </NextModalContent>
      </NextModal>
    </div>
  );
};

export default Modal;
