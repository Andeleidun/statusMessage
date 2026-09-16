import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ScreenReaderStatusMessage } from './ScreenReaderStatusMessage';

test('cancels a pending message when a newer event replaces it', () => {
  const callbacks = new Map();
  let nextFrameId = 1;
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    const frameId = nextFrameId;
    nextFrameId += 1;
    callbacks.set(frameId, callback);
    return frameId;
  });
  const cancelFrame = vi
    .spyOn(window, 'cancelAnimationFrame')
    .mockImplementation((frameId) => callbacks.delete(frameId));

  const { rerender } = render(
    <ScreenReaderStatusMessage message="First result." sequence={1} />
  );
  rerender(<ScreenReaderStatusMessage message="Second result." sequence={2} />);

  expect(cancelFrame).toHaveBeenCalledWith(1);
  expect(callbacks.has(1)).toBe(false);
  expect(callbacks.size).toBe(1);
  expect(screen.getByRole('status')).toBeEmptyDOMElement();

  const [[frameId, callback]] = callbacks;
  callbacks.delete(frameId);
  act(() => callback(16));

  expect(screen.getByRole('status')).toHaveTextContent('Second result.');
  expect(screen.getByRole('status')).not.toHaveTextContent('First result.');
});
