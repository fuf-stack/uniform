import type { ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';

import {
  Modal as NextModal,
  ModalBody as NextModalBody,
  ModalContent as NextModalContent,
  ModalFooter as NextModalFooter,
  ModalHeader as NextModalHeader,
} from '@nextui-org/modal';

import { tv, variantsToClassNames } from '../utils';

// modal variants
export const modalVariants = tv({
  slots: {
    backdrop: '',
    base: '',
    body: '',
    closeButton: '',
    footer: '',
    header: '',
    wrapper: '',
  },
  variants: {
    size: {
      sm: { base: 'max-w-sm' },
      md: { base: 'max-w-md' },
      lg: { base: 'max-w-lg' },
      xl: { base: 'max-w-5xl' },
      full: { base: 'h-[80dvh] max-w-full' },
    },
  },
});

type ModalVariantProps = VariantProps<typeof modalVariants>;
type ModalVariantSlots = Partial<
  Record<keyof ReturnType<typeof modalVariants>, string>
>;

export interface ModalProps extends ModalVariantProps {
  /** modal body content */
  children?: ReactNode;
  /** CSS class name */
  className?: string | ModalVariantSlots;
  /** modal footer */
  footer?: ReactNode;
  /** modal header */
  header?: ReactNode;
  /** open state (controlled) */
  isOpen: boolean;
  /** close event handler */
  onClose: () => void;
  /** modal size */
  size?: ModalVariantProps['size'];
  /** HTML data-testid attribute used in e2e tests */
  testId?: string;
}

/**
 * Modal component based on [NextUI Modal](https://nextui.org/docs/components/modal)
 */
const Modal = ({
  children = null,
  className = undefined,
  footer = undefined,
  header = undefined,
  isOpen,
  onClose,
  size = 'md',
  testId = undefined,
}: ModalProps) => {
  // classNames from slots
  const variants = modalVariants({ size });
  const classNames = variantsToClassNames(variants, className, 'base');

  return (
    <NextModal
      backdrop="opaque"
      classNames={classNames}
      data-testid={testId}
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      scrollBehavior="inside"
    >
      <NextModalContent data-testid={testId ? `modal_${testId}` : 'modal'}>
        {() => (
          <>
            {header && <NextModalHeader>{header}</NextModalHeader>}
            <NextModalBody id="modal_body">{children}</NextModalBody>
            {footer && <NextModalFooter>{footer}</NextModalFooter>}
          </>
        )}
      </NextModalContent>
    </NextModal>
  );
};

export default Modal;
