import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';

test('replays the same cart result for separate reset actions', async () => {
  const user = userEvent.setup();
  const callbacks = new Map();
  let nextFrameId = 1;
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    const frameId = nextFrameId;
    nextFrameId += 1;
    callbacks.set(frameId, callback);
    return frameId;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((frameId) => {
    callbacks.delete(frameId);
  });

  function flushNextFrame() {
    const next = callbacks.entries().next().value;

    if (!next) {
      throw new Error('No animation frame is queued.');
    }

    const [frameId, callback] = next;
    callbacks.delete(frameId);
    act(() => callback(16));
  }

  render(<App />);
  const resetButton = screen.getByRole('button', { name: 'Reset cart' });

  await user.click(resetButton);
  flushNextFrame();
  expect(screen.getByRole('status')).toHaveTextContent(
    'Cart is already empty.'
  );

  await user.click(resetButton);
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
  flushNextFrame();

  expect(screen.getByRole('status')).toHaveTextContent(
    'Cart is already empty.'
  );
  expect(resetButton).toHaveFocus();
  expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);
});
