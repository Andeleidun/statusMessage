# React Screen Reader Status Message

A focused React utility for exposing non-focus-moving status updates to assistive technology, plus a small interactive demo that shows the behavior in context.

The reusable `ScreenReaderStatusMessage` component keeps an empty `role="status"` region in the document before content changes, defers new content by one animation frame, and supports replaying identical text for distinct user actions. The component is visually hidden without requiring host-application CSS.

This repository demonstrates one pattern for WCAG 2.2 Success Criterion 4.1.3 status messages. Adding the component does not by itself make an application conform to WCAG and does not guarantee identical spoken output across every browser and assistive-technology combination.

## Why this exists

Reactive interfaces frequently update search results, cart state, filters, background operations, or other information without moving keyboard focus. A sighted user can often perceive those changes immediately, while a screen-reader user may receive no equivalent feedback unless the application exposes the update programmatically.

A status message should communicate appropriate non-urgent information without stealing focus. This utility packages the live-region lifecycle into one small component so feature code can own the message content while the component owns the announcement region.

## Consumer API

The package exposes one component:

```jsx
import { ScreenReaderStatusMessage } from 'status-message';

export function SaveStatus({ saved, saveSequence }) {
  return (
    <ScreenReaderStatusMessage
      message={saved ? 'Changes saved.' : ''}
      sequence={saveSequence}
    />
  );
}
```

The repository is structured as a distributable library, but registry publication is intentionally not assumed. Before the first registry release, review the package name, registry ownership, and React dependency/peer-dependency policy in `RELEASE.md`.

### Props

| Prop       | Type     | Required | Purpose                                                                                 |
| ---------- | -------- | -------- | --------------------------------------------------------------------------------------- |
| `message`  | `string` | yes      | Status text to expose. Pass an empty string to clear the region.                        |
| `sequence` | `number` | no       | Distinguishes separate events that intentionally reuse identical text. Defaults to `0`. |

TypeScript declarations are included with the package boundary even though the implementation remains intentionally small JavaScript.

## Behavioral contract

The component:

- renders the empty status region immediately;
- uses `role="status"`, which provides polite live-region semantics;
- explicitly sets `aria-atomic="true"` so the complete status is intended to be presented;
- clears stale rendered text when the current `message`/`sequence` no longer matches the last completed announcement;
- adds eligible new text on the next animation frame;
- cancels a pending frame when inputs change or the component unmounts;
- allows identical text to be replayed when `sequence` changes;
- never moves focus; and
- carries its own visually hidden presentation styles rather than relying on a host CSS utility.

The `sequence` value represents event identity. If the same text describes two distinct events, increment the sequence even if the visible message string is unchanged.

## Why defer by one animation frame?

A live region is more reliable when it exists before its text changes. The component therefore renders the empty region first, then schedules the new content. Cleanup cancels a pending callback when a newer event arrives, preventing an older queued update from becoming eligible after the interface has already moved on.

This is a DOM lifecycle strategy, not a promise about a specific screen reader's speech queue. Product-level verification still needs real assistive technology.

## Run the demo

Prerequisites:

- Node.js 20.19 or later in the 20.x line, Node.js 22.13 or later in the 22.x line, or Node.js 24 or later;
- npm; and
- a browser with `requestAnimationFrame` and `cancelAnimationFrame`.

```sh
npm ci
npm run dev
```

Use **Add item** and **Reset cart**. The visible cart count changes while keyboard focus remains on the control that initiated the action. The same event is exposed through the off-screen status region.

The demo imports the component through `src/index.js`, the same public entry point used by the library build.

## Build and verify

Run the complete repository quality gate:

```sh
npm run verify
```

That command runs:

1. formatting verification;
2. ESLint;
3. the Vitest suite;
4. the library build into `dist/`;
5. the demo build into `demo-dist/`; and
6. `npm pack --dry-run` to inspect the distributable package contents.

Individual commands are also available:

```sh
npm run test:ci
npm run build:lib
npm run build:demo
npm run pack:check
```

The library build externalizes React and React DOM so the generated JavaScript bundle does not embed another framework runtime.

## Automated test coverage

The tests verify:

- an empty, atomic status region exists before a message;
- visually hidden behavior is self-contained;
- new content is deferred;
- identical text can replay through a new sequence;
- clearing a message empties the region;
- rapid replacement cancels a stale pending update;
- unmount cleanup cancels pending work;
- the public package entry exports the component; and
- the demo can update/reset visible state without programmatically redirecting focus.

These checks verify DOM, lifecycle, and integration behavior. They do not prove what a particular assistive-technology/browser pair will announce.

## Manual accessibility verification

For a release-quality check, use a supported browser and screen reader and record the exact versions and outcome.

At minimum:

1. Navigate and activate each demo control with the keyboard.
2. Confirm focus stays on the activated control.
3. Confirm each appropriate status update is announced.
4. Trigger the same status text twice using separate event sequences.
5. Trigger rapid successive changes and confirm stale status information is not presented as the current result.
6. Verify clearing behavior.
7. Repeat at 200% and 400% zoom and in high-contrast/forced-colors modes where applicable.

See `RELEASE.md` for the complete release checklist.

## Integration guidance

Use a status message when information changes without a context change and the user does not need focus moved to understand or act on it. Examples can include result counts, successful background actions, cart changes, or other non-urgent state feedback.

Do not mechanically route every dynamic message through `role="status"`. Errors, urgent interruptions, validation problems, or interactions that require immediate action may need different semantics or focus management. Message timing, localization, deduplication, priority, and assistive-technology support must be assessed in the real product workflow.

## Failure and recovery behavior

If a message changes before its pending frame runs, cleanup cancels that frame and only the newest input remains eligible to render. If `message` is empty, the rendered region is empty and no new frame is scheduled.

If installation fails, remove `node_modules` and run `npm ci` again with the committed lockfile. If generated output becomes stale, remove `dist/` and `demo-dist/` and rerun `npm run build`.

The demo creates no account, remote data, persistent browser storage, or background service.

## Production and compatibility limits

- `role="status"` is appropriate only for messages that fit status-message semantics.
- The component deliberately does not own product copy, focus management, localization, throttling, or error prioritization.
- The current Vite version targets its modern browser baseline. Confirm the intended production support matrix before release.
- Registry publication remains an explicit release decision. Review package naming and React dependency policy before the first publish.
- Re-run dependency security checks whenever the lockfile changes because advisories and the resolved closure can change over time.

## Engineering origin

This public utility is an independently implemented distillation of lessons from professional accessibility work on complex reactive interfaces. It is not a copy of proprietary application or component-library source. The repository is intentionally small so reviewers can inspect the live-region lifecycle, cleanup behavior, test strategy, and package boundary directly.

## Sources

- [WCAG 2.2, Success Criterion 4.1.3: Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)
- [W3C Technique ARIA22: Using `role=status`](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22)
- [MDN: `requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/Window/requestAnimationFrame)
- [MDN: `cancelAnimationFrame`](https://developer.mozilla.org/docs/Web/API/Window/cancelAnimationFrame)
- [React: Sunsetting Create React App](https://react.dev/blog/2025/02/14/sunsetting-create-react-app)
- [Vite: Library Mode](https://vite.dev/guide/build.html#library-mode)
- [Vitest: Getting Started](https://vitest.dev/guide/)

## License

MIT. See `LICENSE`.
