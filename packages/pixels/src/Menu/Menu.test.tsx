import { describe, expect, test } from 'vitest';

import storySnapshots from '@repo/storybook-config/story-snapshots';
import { fireEvent, render } from '@testing-library/react';

import Menu from './Menu';
import * as stories from './Menu.stories';

describe('Story Snapshots', () => {
  storySnapshots(stories);
});

describe('Coverage', () => {
  test('renders Menu items correctly', () => {
    const { container, getByText } = render(
      <Menu items={[{ label: 'testItem', key: 'testitem' }]} />,
    );

    // Click the button
    fireEvent.click(container.firstChild);

    // Check if the error is shown
    const items = getByText('testItem');
    expect(items).toBeInTheDocument();
  });
  test('renders Menu items of item correctly', () => {
    const { container, getByText } = render(
      <Menu
        items={[
          { label: 'firstItem', key: 'firstitem' },
          {
            label: 'SubMenu',
            key: 'submenu',
            items: [{ label: 'subItem', key: 'subitem' }],
          },
        ]}
      />,
    );

    // Click the button
    fireEvent.click(container.firstChild);

    const firstItem = getByText('firstItem');
    expect(firstItem).toBeInTheDocument();

    const subMenu = getByText('SubMenu');
    expect(subMenu).toBeInTheDocument();

    const subItem = getByText('subItem');
    expect(subItem).toBeInTheDocument();
  });
});
