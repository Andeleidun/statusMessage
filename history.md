# Teaching History: React Status Message

**Format:** standalone Git bundle  
**Bundle:** `teaching-history.bundle`  
**Branch:** `main`  
**Bundle head:** `955c0eb227214798fe1739403ef4ce7cf35657c7`  
**Identity:** `Technical Writing Assistant <twa@example.invalid>`  
**Constructed:** 2026-09-15

## Purpose and boundary

This bundle contains a separate additive learner history. It does not rewrite,
merge with, or add refs to this child repository's existing `main` history.
The teaching repository has no configured remote and no tags. Pair records,
article files, README content, verification tooling, and the bundle itself are
outside its declared example snapshot.

## Checkpoints

| Step | Commit                                     | Learner outcome                                                      | Files introduced                                               | Check completed before promotion                |
| ---- | ------------------------------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| 1    | `c8ed0385fd001549c438a891a6558f2d5ba15ffd` | Establish the locked Vite example and portability rules              | configuration, lockfile, license, HTML, and public assets      | `npm ci --ignore-scripts`                       |
| 2    | `b67b94217dcff240c913e43006efae078ec7ec4b` | Implement the persistent atomic region and exact replacement cleanup | component, setup, controlled-frame tests, and replacement test | focused component and replacement tests         |
| 3    | `955c0eb227214798fe1739403ef4ce7cf35657c7` | Connect the focus-preserving cart and replay identical results       | application, styles, entry point, and integration tests        | lint, complete test suite, and production build |

Each example path enters the learner history in one checkpoint. The final
snapshot contains only the allowlisted runnable-example files enforced by
`scripts/verifyTutorial.mjs`.

## Reconstruction and verification

From this repository root, reconstruct the branch in a disposable directory:

```sh
git clone --branch main teaching-history.bundle reconstructed-status-message
```

The repository verifier checks bundle validity, the sole branch ref, linear
parentage, author and committer identity, recorded checkpoint hashes, disjoint
checkpoint path ownership, allowlisted file-set parity, and byte parity with
the current example. Remove the disposable reconstruction after inspection.

The bundle is internal evidence. Its legacy image assets remain subject to the
rights limit recorded in `sources.md`.
