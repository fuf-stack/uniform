import { describe } from 'vitest';

import storySnapshots from '@repo/storybook-config/story-snapshots';

import * as stories from './Slider.stories';
import * as edgeCaseStories from './SliderEdgeCases.stories';

describe('Story Snapshots', () => {
  storySnapshots(stories);
  storySnapshots({
    ...edgeCaseStories,

    // This play function derives pointer coordinates from getBoundingClientRect()
    // and drags by 40% of the track width. JSDOM does not calculate layout, so
    // those rectangles have zero dimensions: the width assertion would fail,
    // and the simulated drag would move zero pixels.
    // Mocking the rectangles could test event handling, but would not verify
    // dragging against the rendered slider's actual geometry. Snapshot only the
    // fixture here; the separate Storybook Chromium suite runs the original play
    // function with real layout and all drag/release/submission assertions.
    EdgeCaseDragThenSubmit: {
      ...edgeCaseStories.EdgeCaseDragThenSubmit,
      play: undefined,
    },
  });
});
