import type { TVClassName, TVProps } from '@fuf-stack/pixel-utils';
import type { ReactNode } from 'react';

import { Tab as NextTab, Tabs as NextTabs } from '@nextui-org/tabs';

import { tv, variantsToClassNames } from '@fuf-stack/pixel-utils';

export const tabsVariants = tv({
  slots: {
    base: '',
    tabList: '',
    tab: '',
    tabContent: '',
    cursor: '',
    panel: '',
  },
});

type VariantProps = TVProps<typeof tabsVariants>;
type ClassName = TVClassName<typeof tabsVariants>;

export interface TabOptions {
  content: ReactNode;
  id: string;
  label: string;
}

export interface TabsProps extends VariantProps {
  className?: ClassName;
  fullWidth?: boolean;
  onSelectionChange?: (key: React.Key) => void;
  selectedKey?: number | null | undefined;
  tabs: TabOptions[];
}

/**
 * Tabs component based on [NextUI Tabs](https://nextui.org/docs/components/tabs)
 */
const Tabs = ({
  className = undefined,
  fullWidth = true,
  selectedKey = undefined,
  tabs,
  onSelectionChange = undefined,
}: TabsProps) => {
  const variants = tabsVariants();
  const classNames = variantsToClassNames(variants, className, 'base');

  return (
    <NextTabs
      aria-label="Tabs"
      classNames={classNames}
      fullWidth={fullWidth}
      items={tabs || []}
      onSelectionChange={onSelectionChange}
      selectedKey={selectedKey}
      size="md"
    >
      {(item) => (
        <NextTab key={item.id} title={item.label}>
          {item.content}
        </NextTab>
      )}
    </NextTabs>
  );
};

export default Tabs;
