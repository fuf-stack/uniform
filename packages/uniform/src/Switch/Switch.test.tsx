import { describe } from 'vitest';

import storySnapshots from '@repo/storybook-config/story-snapshots';

import * as stories from './Switch.stories';

describe.skip('Story Snapshots', () => {
  storySnapshots(stories);
});
