# Verification Record: React Status Message

**Record date:** 2026-09-15  
**Candidate state:** uncommitted internal worktree  
**Basis HEAD:** `9099a3f7336723c9b13295f6feaac77b5a8bbe14`  
**Bundle head:** `955c0eb227214798fe1739403ef4ce7cf35657c7`

## Execution environment and frozen hashes

- Windows in the repository workspace
- Node.js 24.15.0
- npm 11.14.1
- React and build-tool versions from the exact lockfile

| Artifact                  | SHA-256                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `article/tutorial.md`     | `2aeb2a27670004fc8dea01aafa33df6fc52aed534811222f8abddd8ed21eac10` |
| `README.md`               | `4e90f099bb770c4fedd9e58da9f1df497fd50f1f8627e4b489b074cedd866375` |
| `package-lock.json`       | `ce87353ab01b6b759ea753924268ba20de3d653334c8306fce334d50e993d5d4` |
| `teaching-history.bundle` | `ae8d142ef03865cdd89873529c567fabfb2d969f4e20704b0cf87f37905d1d89` |

## Automated evidence

| Lane                      | Status   | Observation                                                                                                    |
| ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| Focused proof additions   | `passed` | replacement and repeated-result files passed with 2 tests                                                      |
| Complete behavior suite   | `passed` | 4 files and 7 tests passed on the current worktree                                                             |
| Teaching checkpoints      | `passed` | three additive commits each passed its recorded install, focused, lint, test, or build check                   |
| Tutorial reconciliation   | `passed` | 6 steps, 6 snippets, and 24 exact teaching snapshot files reconciled                                           |
| Format, lint, and build   | `passed` | Prettier check, ESLint, and Vite 8.2.1 production build passed                                                 |
| Composite `npm run check` | `passed` | complete gate passed after the Vitest 4.1.11 update and history rebuild                                        |
| Dependency audit          | `passed` | after updating Vitest to 4.1.11, `npm audit --json` reported zero known vulnerabilities for the exact lockfile |

## Manual evidence

| Review                          | Status            | Required scope                                                                                                      |
| ------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| Article and README rendering    | `manual_required` | headings, links, fences, wrapping, and standalone comprehension                                                     |
| Keyboard and visible focus      | `manual_required` | add, reset, repeated reset, rapid input, and visible focus                                                          |
| Zoom, reflow, and forced colors | `manual_required` | 200 and 400 percent zoom, narrow layout, and supported high-contrast mode                                           |
| Assistive technology            | `manual_required` | exact browser and screen-reader observation for distinct, repeated, and rapid status results without focus movement |
| Asset and license scope         | `blocked`         | legacy favicon and logo provenance requires owner review before external distribution                               |

## Evidence limits

Automated checks establish DOM state, controlled scheduling, cleanup, visible
cart behavior, and exercised focus. They do not establish spoken output. The
current child HEAD does not identify the uncommitted pair snapshot. No release
approval, remote reachability, publication, deployment, support matrix, or
complete accessibility conformance is claimed.
