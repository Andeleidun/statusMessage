# Sources and Provenance: React Status Message

**Last checked:** 2026-09-15  
**Claim basis:** repository implementation plus primary documentation

## Technical sources

| Source                                                                                                         | Use in this pair                                                                   | Applicability and limits                                                                                                         |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [WCAG 2.2, Success Criterion 4.1.3 Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)             | The accessibility outcome for programmatic status exposure without receiving focus | The pair demonstrates one technique and does not claim complete WCAG conformance.                                                |
| [WAI-ARIA 1.2 `status` role](https://www.w3.org/TR/wai-aria-1.2/#status)                                       | Semantics and implicit live-region properties of `role="status"`                   | Actual speech is controlled by the browser and assistive technology and requires representative manual observation.              |
| [ARIA22: Using `role=status` to present status messages](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22) | Technique context for a status container that exists before content changes        | A sufficient technique is not a universal announcement guarantee. The component tests only its DOM and scheduling preconditions. |
| [`useEffect`](https://react.dev/reference/react/useEffect)                                                     | Scheduling and cleanup around the browser animation-frame API                      | The repository's controlled-frame tests establish its exact replacement and unmount behavior.                                    |
| [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)       | Deferring message insertion until a following frame                                | Frame timing is browser-owned. The delay is an implementation technique, not an accessibility standard requirement.              |
| [`cancelAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame)         | Canceling obsolete pending insertion                                               | The implementation retains and cancels the current request identifier.                                                           |
| [Vite 8.0 announcement](https://vite.dev/blog/announcing-vite8)                                                | Toolchain generation and Node.js floor context                                     | The lockfile and `package.json` are authoritative for exact versions.                                                            |
| [Node.js releases](https://nodejs.org/en/about/previous-releases)                                              | Runtime lifecycle context                                                          | The supported local ranges are the exact `engines.node` expression in `package.json`.                                            |

## Repository and content provenance

- The public example originated in this child repository and retains its
  existing MIT license file and 2024 copyright notice.
- The tutorial-pair work extends the inspected component, cart example, tests,
  and documentation. Product names, messages, and cart state are synthetic.
- No private connector data, credentials, personal messages, or production
  datasets are used by the example.
- `package-lock.json` and `package.json` are the authoritative dependency
  inventory. Documentation sources do not prove a specific announcement in an
  untested browser and assistive-technology combination.

## Rights and release limits

The existing favicon and logo files predate this pair work, and their source
provenance has not been established in this review. Keep the pair internal
until an owner confirms those assets may be redistributed or replaces them
with reviewed assets. The existing MIT file is preserved; this record does not
reinterpret its legal scope or authorize publication.
