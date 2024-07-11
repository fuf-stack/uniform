import { describe } from 'vitest';

import storySnapshots from '@repo/storybook-config/story-snapshots';

import * as stories from './RadioGroup.stories';

describe('Story Snapshots', () => {
  storySnapshots(stories);
});
