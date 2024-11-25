import { describe, expect, test } from 'vitest';

import storySnapshots from '@repo/storybook-config/story-snapshots';
import { render } from '@testing-library/react';

import Popover from './Popover';
import * as stories from './Popover.stories';

describe('Story Snapshots', () => {
  storySnapshots(stories);
});

describe('Coverage', () => {
  test('renders no trigger with no children', () => {
    const { container } = render(<Popover content="i am the content" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('controlled popover', () => {
    const { getByText } = render(
      <Popover
        content="i am the content"
        openControlled={{ open: true, setOpen: () => {} }}
      >
        i am the trigger
      </Popover>,
    );
    const trigger = getByText('i am the trigger');
    expect(trigger).toBeInTheDocument();
  });
});
