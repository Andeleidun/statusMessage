import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ScreenReaderStatusMessage } from './ScreenReaderStatusMessage';

describe('ScreenReaderStatusMessage', () => {
  let callbacks;
  let nextFrameId;

  beforeEach(() => {
    callbacks = new Map();
    nextFrameId = 1;

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      const frameId = nextFrameId;
      nextFrameId += 1;
      callbacks.set(frameId, callback);
      return frameId;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((frameId) => {
      callbacks.delete(frameId);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

  test('renders an empty atomic status region before a message exists', () => {
    render(<ScreenReaderStatusMessage message="" />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-atomic', 'true');
    expect(status).toBeEmptyDOMElement();
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  test('defers new content until the existing region can observe the update', () => {
    const { rerender } = render(<ScreenReaderStatusMessage message="" />);

    rerender(
      <ScreenReaderStatusMessage message="Cart updated." sequence={1} />
    );
    expect(screen.getByRole('status')).toBeEmptyDOMElement();

    flushNextFrame();
    expect(screen.getByRole('status')).toHaveTextContent('Cart updated.');
  });

  test('can replay identical text when its sequence changes', () => {
    const { rerender } = render(
      <ScreenReaderStatusMessage message="Cart is empty." sequence={1} />
    );
    flushNextFrame();

    rerender(
      <ScreenReaderStatusMessage message="Cart is empty." sequence={2} />
    );
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    flushNextFrame();

    expect(screen.getByRole('status')).toHaveTextContent('Cart is empty.');
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);
  });

  test('cancels a pending update during cleanup', () => {
    const { unmount } = render(
      <ScreenReaderStatusMessage message="Pending update" sequence={1} />
    );

    unmount();

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(callbacks.size).toBe(0);
  });
});
