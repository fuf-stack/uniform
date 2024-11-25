import { describe, expect, test } from 'vitest';

import storySnapshots from '@repo/storybook-config/story-snapshots';
import { render } from '@testing-library/react';

import ScrollShadow from './ScrollShadow';
// import { render } from '@testing-library/react';

import * as stories from './ScrollShadow.stories';

describe('Story Snapshots', () => {
  storySnapshots(stories);
});

describe('Coverage', () => {
  test('renders ScrollShadow component without children and className', () => {
    const { container } = render(<ScrollShadow />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
