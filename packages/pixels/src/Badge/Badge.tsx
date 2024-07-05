import type { TVClassName, TVProps } from '@fuf-stack/pixel-utils';
import type { BadgeProps as NextBadgeProps } from '@nextui-org/badge';

import { Badge as NextBadge } from '@nextui-org/badge';

import { tv, variantsToClassNames } from '@fuf-stack/pixel-utils';

// badge styling variants
export const badgeVariants = tv({
  slots: {
    badge: '',
    base: '',
  },
});

type VariantProps = TVProps<typeof badgeVariants>;
type ClassName = TVClassName<typeof badgeVariants>;

export interface BadgeProps extends VariantProps {
  /** component which is wrapped by the batch */
  children: NextBadgeProps['children'];
  /** CSS class name */
  className?: ClassName;
  /** badge content */
  content?: NextBadgeProps['content'];
  /** color of the badge */
  color?: NextBadgeProps['color'];
  /** placement of the badge */
  placement?: NextBadgeProps['placement'];
  /** size of the badge */
  size?: NextBadgeProps['size'];
}

/**
 * Badge component based on [NextUI Badge](https://nextui.org/docs/components/badge)
 */
const Avatar = ({
  children,
  className: _className = undefined,
  content = undefined,
  color = 'default',
  placement = 'top-right',
  size = 'md',
}: BadgeProps) => {
  // className from slots
  const variants = badgeVariants();
  const className = variantsToClassNames(variants, _className, 'base');

  return (
    <NextBadge
      classNames={className}
      color={color}
      content={content}
      placement={placement}
      size={size}
    >
      {children}
    </NextBadge>
  );
};

export default Avatar;
