# Release checklist

Use this checklist before publishing or tagging a release. The repository is release-ready when the checks below pass, but publishing to a package registry is intentionally a separate decision.

## Automated verification

- Run `npm ci` from a clean checkout.
- Run `npm run verify`.
- Confirm formatting, linting, tests, library build, demo build, and package dry-run all pass.
- Inspect the `npm pack --dry-run` output and confirm only intended distributable files are included.
- Confirm the library bundle does not include React or React DOM.

## Accessibility verification

Automated tests verify DOM and component lifecycle behavior, not whether every assistive-technology/browser combination speaks an announcement.

- Test the demo by keyboard without moving focus after activating an action.
- Verify a new message is announced with a supported screen reader/browser pair.
- Repeat identical status text with a new `sequence` value.
- Trigger rapid successive updates and confirm stale status text is not presented.
- Test clearing the message.
- Record browser, screen reader, operating system, versions, and observed results.
- Recheck at 200% and 400% zoom and in high-contrast/forced-colors modes where applicable.

## Package and compatibility review

- Review package name and registry ownership before first publication.
- Review the React dependency/peer-dependency policy before first publication to avoid an unintended duplicate React runtime for consumers.
- Confirm the documented Node and browser support policy matches the release environment.
- Confirm public exports and TypeScript declarations match the documented API.
- Review README examples against the built package.

## Release hygiene

- Update the version according to the intended semantic-versioning change.
- Review the diff for generated files, secrets, proprietary material, or unrelated changes.
- Re-run the current registry vulnerability audit against the exact lockfile.
- Summarize behavioral changes and limitations in the release notes.
- Tag or publish only after the package-name and registry-ownership decision is explicit.
