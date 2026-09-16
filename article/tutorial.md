# Expose React status messages without moving keyboard focus

When a cart count changes, sighted users can see the result immediately.
Keyboard and screen-reader users also need the result, but moving focus to a
message would interrupt the interaction. A status region can expose the update
programmatically while focus stays on the button that caused it.

This tutorial builds a small cart and a focused
`ScreenReaderStatusMessage` component. The component keeps an empty atomic
`role="status"` element mounted before content changes, defers new content by
one animation frame, cancels obsolete pending work, and uses a sequence value
to distinguish separate events that happen to have identical text.

The pattern creates DOM conditions for a polite status update. Actual speech
depends on the browser and assistive technology, so representative manual
observation remains part of release evidence.

## What you need

You should understand React components, props, state, and effects. Use Node.js
20.19 or later in major 20, Node.js 22.13 or later in major 22, or Node.js 24
or later, plus npm. The browser must provide `requestAnimationFrame` and
`cancelAnimationFrame`.

The repository locks React 18.3.1 and Vite 8.2.1.

<!-- twa:step id=STEP-01 -->
## Run the finished cart

Install the locked dependencies and start Vite from the repository root.

<!-- twa:snippet id=SNIP-01 class=command -->
```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Use the keyboard to activate **Add item** and
**Reset cart**. The visible count changes, focus remains on the activated
button, and a hidden status region receives the corresponding result. Reset an
already empty cart twice to exercise two events with the same text.

Stop the server with `Ctrl+C`. The example creates no account, remote data,
persistent browser storage, service worker, or background process.

<!-- twa:step id=STEP-02 -->
## Keep the status region mounted

A caller passes message text and a monotonically increasing `sequence`. Local
state records the event that has completed its deferred insertion. During a
new event, `announcedMessage` becomes an empty string until local state matches
both current props.

<!-- twa:snippet id=SNIP-02 class=canonical -->
```jsx
import { useEffect, useState } from 'react';

export const ScreenReaderStatusMessage = ({ message, sequence = 0 }) => {
  const [announcement, setAnnouncement] = useState(null);
  const announcedMessage =
    announcement?.message === message && announcement.sequence === sequence
      ? announcement.message
      : '';

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      setAnnouncement({ message, sequence });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [message, sequence]);

  return (
    <span role="status" aria-atomic="true" className="visually-hidden">
      {announcedMessage}
    </span>
  );
};
```

The span renders even when its content is empty. `role="status"` supplies a
polite live-region semantic, and `aria-atomic="true"` asks for the complete
message to be presented. The explicit attribute also makes the intent visible
in code and tests.

The effect schedules only nonempty messages. Its cleanup cancels the identifier
returned by the browser when props change or the component unmounts. A newer
event therefore clears the old derived content immediately and replaces any
pending frame.

The one-frame delay is this example's implementation technique. It is not a
WCAG requirement and does not guarantee an announcement in every browser and
assistive-technology pair.

<!-- twa:step id=STEP-03 -->
## Model results as distinct events

Message text alone cannot identify an event. Resetting an already empty cart
twice produces `Cart is already empty.` both times. If the component depended
only on the string, React would see no changed dependency for the second
action.

The application increments `sequence` for every result, including repeated
text. It also updates the visible count in the same state transition.

<!-- twa:snippet id=SNIP-03 class=canonical -->
```jsx
import { useState } from 'react';
import { ScreenReaderStatusMessage } from './components/ScreenReaderStatusMessage';
import './App.css';

function App() {
  const [cart, setCart] = useState({ count: 0, message: '', sequence: 0 });

  const addItem = () => {
    setCart((current) => {
      const count = current.count + 1;
      const noun = count === 1 ? 'item' : 'items';

      return {
        count,
        message: `Cart updated. ${count} ${noun} in cart.`,
        sequence: current.sequence + 1,
      };
    });
  };

  const resetCart = () => {
    setCart((current) => ({
      count: 0,
      message: current.count === 0 ? 'Cart is already empty.' : 'Cart reset.',
      sequence: current.sequence + 1,
    }));
  };

  return (
    <div className="App container">
      <header>
        <h1>Screen Reader Status Message Tutorial</h1>
      </header>
      <main>
        <p>
          Update the cart without moving focus. The visible count changes, and
          the same result is added to a polite status region.
        </p>
        <p>
          Items in cart: <strong>{cart.count}</strong>
        </p>
        <div className="button-group">
          <button type="button" onClick={addItem}>
            Add item
          </button>
          <button type="button" onClick={resetCart}>
            Reset cart
          </button>
        </div>
        <ScreenReaderStatusMessage
          message={cart.message}
          sequence={cart.sequence}
        />
      </main>
    </div>
  );
}

export default App;
```

The buttons remain ordinary native controls. The application never calls
`focus()`, so an activated button retains focus while visible and status state
change. A validation error or urgent interruption may require a different
interaction and announcement strategy.

<!-- twa:step id=STEP-04 -->
## Prove insertion and cleanup deterministically

Tests replace the browser scheduler with a controlled callback map. That lets
them inspect the empty region before a frame, invoke exactly one queued frame,
and assert the resulting content without depending on wall-clock timing.

<!-- twa:snippet id=SNIP-04 class=excerpt -->
```jsx
  test('defers new content until the existing region can observe the update', () => {
    const { rerender } = render(<ScreenReaderStatusMessage message="" />);

    rerender(
      <ScreenReaderStatusMessage message="Cart updated." sequence={1} />
    );
    expect(screen.getByRole('status')).toBeEmptyDOMElement();

    flushNextFrame();
    expect(screen.getByRole('status')).toHaveTextContent('Cart updated.');
  });
```

The suite separately verifies the initially empty atomic region, identical
text with a changed sequence, and cancellation during unmount. A replacement
test proves that a newer event cancels an older pending frame and only inserts
the newer message.

<!-- twa:step id=STEP-05 -->
## Prove the complete repeated-result flow

The application integration test activates the same reset control twice,
flushes each scheduled update, and confirms that focus stays on the button.

<!-- twa:snippet id=SNIP-05 class=excerpt -->
```jsx
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
```

This establishes the exercised React and DOM behavior. It cannot establish
which words a particular screen reader will speak or whether rapid production
updates should be queued, coalesced, or prioritized.

<!-- twa:step id=STEP-06 -->
## Run the gate and perform manual review

Run the repository's complete local gate.

<!-- twa:snippet id=SNIP-06 class=command -->
```sh
npm run check
```

The gate checks formatting, lint, all behavior tests, article bindings, the
teaching-history bundle, and the production build. Use `npm run test` while
developing, and use the one-shot gate for a review candidate.

For proportional manual verification, use the keyboard to activate both
buttons and confirm visible focus. Test repeated and rapid updates. Inspect the
page at 200 and 400 percent zoom and in the supported forced-color or
high-contrast mode. With a representative screen reader and browser, observe
whether each result is announced without focus movement. Record product,
version, settings, exact action, expected result, observed result, and reviewer.

If a pending result survives replacement or unmount, inspect effect cleanup
and the stored frame identifier. If repeated text does not produce a new DOM
update, confirm that the caller increments `sequence`. If manual observation
misses or duplicates speech, record the exact environment and revisit product
copy, update rate, and timing as product decisions.

If installation fails, confirm the Node.js range and rerun `npm ci` with the
committed lockfile. Reloading resets the in-memory cart. Remove stale generated
`dist` output and rerun the gate when you need a fresh production build.

## Production boundary and sources

This component is a narrow status-message pattern. It does not define error or
alert behavior, localization, a notification queue, priority, deduplication,
or a compatibility matrix. A product must test the real workflow with its
supported browser and assistive-technology combinations.

The source register in [`sources.md`](../sources.md) records WCAG 2.2, WAI-ARIA,
ARIA22, browser API, Vite, and Node.js sources, their limits, and unresolved
asset provenance. Repository source and tests remain canonical for the exact
behavior implemented here.

