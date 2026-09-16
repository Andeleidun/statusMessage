# Design: Expose React Status Messages Without Moving Focus

## Outcome

The reader can trace a cart action through visible state and a persistent atomic
status region, replay identical text for separate events, and cancel an
obsolete pending update without programmatic focus movement.

## Non-goals

- Guaranteeing announcements in every browser and assistive-technology pair.
- Claiming complete WCAG conformance.
- Handling validation errors, alerts, urgent interruptions, or focus-required
  recovery.
- Building a notification queue, deduplication service, localization system,
  or persistence layer.
- Deployment or publication.

## Ownership and boundaries

- `App` owns cart count, message copy, and the monotonically increasing event
  sequence.
- `ScreenReaderStatusMessage` owns the persistent status node, deferred content
  insertion, and cancellation of its current pending frame.
- The browser owns animation-frame scheduling.
- The browser and assistive technology own actual announcement behavior.
  Component tests can prove DOM preconditions but cannot attest speech output.

## Accepted requirements

| ID    | Requirement                                                                         | Validation                               |
| ----- | ----------------------------------------------------------------------------------- | ---------------------------------------- |
| SM-01 | An empty atomic `role="status"` node exists before the first message                | initial-render component test            |
| SM-02 | A nonempty message is inserted after the scheduled frame                            | controlled-frame component test          |
| SM-03 | Increasing `sequence` makes identical text a distinct eligible update               | repeated-message component and app tests |
| SM-04 | Replacement and unmount cancel obsolete pending frames                              | controlled pending-frame tests           |
| SM-05 | Cart actions update visible state without programmatic focus movement               | user-event integration test              |
| SM-06 | Accessibility claims distinguish DOM evidence from manual announcement observations | article, README, and verification review |
| SM-07 | Article steps, snippets, commands, and claims remain bound to source                | static tutorial verifier                 |

## State transitions

1. The component mounts with an empty status region.
2. A caller supplies a message and event sequence.
3. The effect schedules one animation frame while the rendered region remains
   empty for the new event.
4. The frame stores the event as the current announcement.
5. A newer message or sequence clears the derived region immediately and
   cancels the older pending frame before scheduling its replacement.
6. Unmount cancels any outstanding frame.

An empty message schedules no work. Actual product behavior for rapid sequences
must define whether to coalesce, queue, or prioritize results; this example
keeps only the latest pending event.

## Failure and recovery

If the component unmounts or an event is replaced before the frame executes,
cleanup cancels the pending identifier. If a product observation shows missed,
duplicated, or interrupted speech, record the exact browser and assistive
technology, narrow the supported behavior, and revisit event timing and copy as
a product decision. Do not move focus merely to force a status announcement.

## Accessibility evidence

Automated tests establish region presence, content timing, cancellation,
visible result state, and exercised focus behavior. Manual review must cover
keyboard operation, visible focus, zoom, reflow, high contrast or forced
colors, repeated actions, rapid updates, and a representative screen reader and
browser. Only the latter can record an observed announcement.

## Teaching checkpoints

1. Establish the locked Vite example and portability rules.
2. Implement the persistent atomic region and exact replacement cleanup.
3. Connect the focus-preserving cart and prove repeated results.

Each checkpoint matches one additive commit in the constructed teaching
history and owns a unique set of example paths.

## Review limits

The design supplies one narrow status-message pattern. Product copy, message
priority, update rate, localization, compatibility, and assistive-technology
support require testing in the real workflow.
