# Pair Record: React Status Message

**Pair ID:** `react-status-message`  
**Status:** internal technical candidate; release blocked  
**Distribution:** internal candidate  
**Sensitivity:** public synthetic content

## Source basis

- Inspected child HEAD: `9099a3f7336723c9b13295f6feaac77b5a8bbe14`.
- The child worktree was clean at intake. Current uncommitted changes belong to
  this authorized pair implementation.
- The parent gitlink has not been advanced; a final immutable candidate ref is
  still required before release review.

## Teaching contract

- **Reader:** a React developer who understands components, props, state, and
  effects and needs to expose non-focus-changing results to assistive technology.
- **Outcome:** run a cart interface whose persistent atomic status region makes
  each distinct result eligible for a polite announcement while keyboard focus
  stays on the activated control.
- **Prerequisites:** Node.js 20.19 or later in major 20, Node.js 22.13 or later
  in major 22, or Node.js 24 or later, plus npm and a browser with
  `requestAnimationFrame` and `cancelAnimationFrame`.
- **Environment:** React 18.3.1, a Vite browser application, and in-memory cart
  state.
- **Non-goals:** a universal announcement guarantee, complete WCAG conformance,
  an error or urgent-alert system, a notification queue, localization,
  deployment, and publication.

## Canonical artifacts

- Article: `article/tutorial.md`
- Runnable example: this repository root
- Example documentation: `README.md`
- Design and requirements: `design.md`
- Teaching history: `history.md`
- Teaching bundle: `teaching-history.bundle`
- Verification: `verification.md`
- Sources and provenance: `sources.md`
- Static reconciliation: `scripts/verifyTutorial.mjs`

The repository source is canonical for executable behavior. The human-readable
records follow the internal format used by the newer TWA pairs. The current TWA
v1 workflow does not model a repository-root example, so no generated pair lock
or release approval is claimed.

## Directional decisions

- **DG-01 AudienceOutcome:** teach the persistent-region and distinct-event
  model through one cart result flow.
- **DG-02 ProductBoundary:** use a focused client component and visible cart
  state; keep priority policy, queues, localization, and product support
  matrices outside the example.
- **DG-03 ArchitectureDirection:** mount an empty `role="status"` region first,
  defer insertion by one animation frame, cancel obsolete work, and use a
  sequence value to distinguish identical messages from separate events.
- **DG-04 HistoryPackaging:** preserve `main`; construct a separate additive
  teaching repository and retain its exact internal bundle.
- **DG-05 DistributionRights:** keep the pair internal until prose, dependency,
  asset, accessibility, and existing MIT license scope have been reviewed.
- **DG-06 CompatibilityMigration:** retain React 18.3.1 and the current Vite 8
  toolchain; the lesson does not require a React upgrade.
- **DG-07 ReleaseApproval:** not open. Representative assistive-technology
  evidence, an immutable child ref, a supported sealing workflow, and a
  destination are incomplete.

## Requirement traceability

| Requirement                         | Implementation                            | Validation                                                 |
| ----------------------------------- | ----------------------------------------- | ---------------------------------------------------------- |
| SM-01 persistent atomic status      | `ScreenReaderStatusMessage.jsx`           | empty-region and semantic assertions                       |
| SM-02 deferred insertion            | `requestAnimationFrame` effect            | pre-frame and post-frame assertions                        |
| SM-03 distinct identical events     | `sequence` input                          | component and repeated-action integration tests            |
| SM-04 obsolete-work cleanup         | effect cleanup and `cancelAnimationFrame` | replacement and unmount cancellation tests                 |
| SM-05 focus-preserving integration  | native cart buttons in `App.jsx`          | visible state and focus assertions                         |
| SM-06 scoped accessibility evidence | article, README, and manual record        | separate DOM, keyboard, visual, and screen-reader evidence |
| SM-07 article-to-code agreement     | article markers and `verifyTutorial.mjs`  | exact canonical, excerpt, command, and history checks      |
| SM-08 truthful production boundary  | article, README, and `sources.md`         | technical, accessibility, and rights review                |
