import { describe } from 'vitest';

import storySnapshots from '@repo/storybook-config/story-snapshots';

// import { render } from '@testing-library/react';

import * as stories from './ScrollShadow.stories';

describe('Story Snapshots', () => {
  storySnapshots(stories);
});
