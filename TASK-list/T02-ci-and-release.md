# T02 · CI and release

**Milestone:** Milestone 1 — Foundation  
**Depends on:** [T01](./T01-project-scaffold.md)  
**Status:** in progress (repo-side done; waiting on GitHub repo + npm setup)

## Scope

- `.github/workflows/ci.yml`: on PR and push, run `npm run check` on a Node 20/22/24 matrix, then `check:package`.
  A separate Node 18 job builds on 22, then `require`s and `import`s every `dist` entry on Node 18. Vitest 4 needs Node 20+,
  so the suite can't run on 18.
- `.github/workflows/release.yml`: semantic-release on `main` with `@semantic-release/npm` (provenance),
  `@semantic-release/github` and `@semantic-release/changelog`. Needs the `NPM_TOKEN` secret (or trusted publishing).
- commitlint + a husky `commit-msg` hook enforcing Conventional Commits (including the `refactor:` type AGENTS.md requires).
- Start pre-1.0 (`0.x`); 1.0 is cut in T22.

**Done when:** a test PR runs green CI, and a dry-run release (`semantic-release --dry-run`) computes a version.

## Remaining steps (need the owner)

- [ ] Create the GitHub repository, add it as `origin`, and add `repository`/`bugs`/`homepage` to `package.json`.
- [ ] Commit, tag the first commit `v0.0.0` and push it. Without that tag the first release becomes `1.0.0`.
- [ ] npm: configure trusted publishing for `daisy-date` (GitHub Actions, workflow `release.yml`), or add the `NPM_TOKEN` secret.
- [ ] If `main` is protected, allow the release job to push the `chore(release)` commit (or drop `@semantic-release/git`).
- [ ] Open a test PR and confirm that CI is green and the commitlint job runs.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
