import { describe } from 'vitest';

import storySnapshots from '@repo/storybook-config/story-snapshots';

import * as stories from './Modal.stories';

// TODO: TypeError: Cannot read properties of null (reading 'useState')
describe.skip('Story Snapshots', () => {
  storySnapshots(stories);
});
