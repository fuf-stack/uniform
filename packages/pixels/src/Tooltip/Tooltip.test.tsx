import { describe } from 'vitest';

import storySnapshots from 'storybook-config/story-snapshots';

import * as stories from './Tooltip.stories';

describe('Story Snapshots', () => {
  storySnapshots(stories);
});
