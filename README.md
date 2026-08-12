# React status-message example

This example keeps a polite live region in the document before a status update,
then announces cart changes without moving keyboard focus. It also demonstrates
how to cancel a pending animation-frame callback and how to replay identical
status text for separate user actions.

## Audience and outcome

This repository is for React developers who know components, props, state, and
effects and need to expose dynamic results to assistive technology. After
running it, you can trace a button action through visible application state and
an atomic `role="status"` region.

The component is a focused teaching example. Adding it does not by itself make
an application conform to WCAG or guarantee an announcement in every browser
and assistive-technology combination.

## Mental model

A status region must exist before its content changes. The component therefore
renders an empty `role="status"` container immediately, clears stale content
when a new message arrives, and adds the new content on the next animation
frame. The returned frame identifier is canceled if the message changes or the
component unmounts.

`role="status"` provides a polite live region. The component also sets
`aria-atomic="true"` explicitly so the complete message is intended to be
presented. A `sequence` prop lets callers replay the same text for two distinct
events.

## Run the example

Prerequisites:

- A current Node.js LTS release with npm.
- A browser with `requestAnimationFrame` and `cancelAnimationFrame`.

From this directory:

```sh
npm ci
npm start
```

Open the local URL printed by the development server. Use **Add item** and
**Reset cart**. Focus stays on the activated button while the visible count and
the off-screen status message update.

## Verify the example

Run the behavior tests once:

```sh
npm run test:ci
```

Create the production bundle:

```sh
npm run build
```

The tests verify that the empty status container exists first, new content is
deferred, repeated text can be replayed, pending callbacks are canceled, and
the visible cart can be operated without programmatic focus movement. These
checks prove DOM and component behavior only.

For proportional manual verification, run the example with a supported screen
reader and browser, activate each button by keyboard, and confirm that the
status is announced without moving focus. Repeat the same reset action, test
rapid updates, inspect high-contrast rendering, and test at 200% and 400% zoom.
Record the exact browser, assistive technology, versions, and observed result.

## Dependency security status

On 2026-08-11, a non-forced `npm audit fix` reduced this repository's
`npm audit --omit=dev` result from 64 findings to 28: 9 low, 5 moderate,
and 14 high. A second safe remediation pass made no further change. The
remaining chains are owned by Create React App's build, test, asset, and
development-server dependencies. npm's forced proposal would install the
invalid `react-scripts@0.0.0` package and was not applied.

Treat the remaining findings and the unmaintained toolchain as a production
release blocker. Run the development server only against trusted local source,
do not expose it to an untrusted network, and migrate the example before using
its toolchain for production delivery. Re-audit the migrated exact lockfile.

## Failure and recovery

If a message changes before its pending frame runs, cleanup cancels that frame
and only the latest message remains eligible to render. An empty message clears
the region without scheduling work.

If installation fails, remove the generated `node_modules` directory and run
`npm ci` again with the committed lockfile. If a production build is stale,
remove the generated `build` directory and rerun `npm run build`. Reloading the
page resets the in-memory cart.

Stop the development server with `Ctrl+C`. The example creates no account,
remote data, persistent browser storage, or background service.

## Limits and production differences

- Use a status message only for information that does not take focus and fits
  the status-message definition. Errors or urgent interruptions may need a
  different interaction and announcement strategy.
- The visually hidden utility must remain compatible with the host design
  system and supported browsers.
- Product copy, message deduplication, rapid-update policy, localization, and
  assistive-technology support must be verified in the real workflow.
- This repository preserves its React 18 and Create React App 5 teaching
  checkpoint. Create React App is deprecated. Treat migration to an actively
  maintained framework or build tool as a separate compatibility change.

## Sources

- [WCAG 2.2, Success Criterion 4.1.3: Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)
- [W3C Technique ARIA22: Using `role=status`](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22)
- [MDN: `requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/Window/requestAnimationFrame)
- [MDN: `cancelAnimationFrame`](https://developer.mozilla.org/docs/Web/API/Window/cancelAnimationFrame)
- [React: Sunsetting Create React App](https://react.dev/blog/2025/02/14/sunsetting-create-react-app)

## License

The existing [MIT License](LICENSE) applies to this example repository.
