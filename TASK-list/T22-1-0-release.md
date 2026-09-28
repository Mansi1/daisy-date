# T22 · 1.0 release

**Milestone:** Milestone 4 — Polish and release  
**Depends on:** [T02](./T02-ci-and-release.md), [T21](./T21-documentation.md)  
**Status:** todo

## Scope

- Resolve the open questions in §10. Final `publint`/`attw` pass. A smoke test that installs the packed tarball in
  CJS and ESM sample projects on Node 18 and 24 (and Bun).
- Remove the `{ breaking: true, release: 'minor' }` rule from `.releaserc.json` (it keeps breaking changes on 0.x),
  then land a `feat!:`/`BREAKING CHANGE` commit to cut 1.0 via semantic-release. Publish `daisy-date@1.0.0`.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
