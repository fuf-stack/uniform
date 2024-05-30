import type React from 'react';

import { Avatar as NextAvatar } from '@nextui-org/avatar';

export interface AvatarProps {
  /* Display a border ring around the Avatar */
  bordered?: boolean;
  /* Roundness of the border around the Avatar */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** CSS class name */
  className?: string;
  /* Disables the Avatar */
  disabled?: boolean;
  /* Fallback content to display if the image fails to load or is not provided */
  fallback?: React.ReactNode;
  /* Size of the Avatar */
  size?: 'sm' | 'md' | 'lg';
  /* Image source */
  src: string;
}

/**
 * Avatar component based on [NextUI Avatar](https://nextui.org/docs/components/avatar)
 */
const Avatar = ({
  bordered = false,
  rounded = 'full',
  className = '',
  disabled = false,
  fallback = undefined,
  size = 'md',
  src,
}: AvatarProps) => {
  return (
    <NextAvatar
      className={className}
      fallback={fallback}
      isBordered={bordered}
      isDisabled={disabled}
      radius={rounded}
      showFallback={!!fallback}
      size={size}
      src={src}
    />
  );
};

export default Avatar;
