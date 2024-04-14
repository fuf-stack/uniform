import { describe } from 'vitest';

import storySnapshots from 'storybook-config/story-snapshots';

import * as stories from './Label.stories';

describe('Story Snapshots', () => {
  storySnapshots(stories);
});
