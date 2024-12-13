import { describe, expect, test } from 'vitest';

import storySnapshots from '@repo/storybook-config/story-snapshots';
import { fireEvent, render } from '@testing-library/react';

import Json from './Json';
import * as stories from './Json.stories';

describe('Story Snapshots', () => {
  storySnapshots(stories);
});

describe('Coverage', () => {
  test('renders Json component error without data', () => {
    const { getByText } = render(<Json />);

    // Find the "Show Details" button
    const showDetailsButton = getByText('Show Details');
    expect(showDetailsButton).toBeInTheDocument();

    // Click the button
    fireEvent.click(showDetailsButton);

    // Check if the error is shown
    const errorMessage = getByText('Error:');
    expect(errorMessage).toBeInTheDocument();
  });

  test('renders Json component error with data', () => {
    const { getByText } = render(<Json value="this is a string, not a Json" />);

    // Find the "Show Details" button
    const showDetailsButton = getByText('Show Details');
    expect(showDetailsButton).toBeInTheDocument();

    // Click the button
    fireEvent.click(showDetailsButton);

    // Check if the error is shown
    const errorMessage = getByText('Error:');
    expect(errorMessage).toBeInTheDocument();
  });

  test('Json component copy icon shows on hover and turns green on click', () => {
    const { getByTestId, getByText } = render(
      <Json value={{ some: 'data' }} />,
    );

    const mouseOverElement = getByText('1 item');

    fireEvent.mouseOver(mouseOverElement);

    const svgSpan = getByTestId('copy-button');

    fireEvent.click(svgSpan.firstChild);

    fireEvent.mouseOver(mouseOverElement);

    expect(svgSpan.firstChild).toHaveClass('text-success');
  });
});
