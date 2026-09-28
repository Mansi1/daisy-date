# T02 · CI and release

**Milestone:** Milestone 1 — Foundation  
**Depends on:** [T01](./T01-project-scaffold.md)  
**Status:** done

## Scope

- `.github/workflows/ci.yml`: on PR and push, run `npm run check` on a Node 20/22/24 matrix, then `check:package`.
  A separate Node 18 job builds on 22, then `require`s and `import`s every `dist` entry on Node 18. Vitest 4 needs Node 20+,
  so the suite can't run on 18.
- `.github/workflows/release.yml`: semantic-release on `main` with `@semantic-release/npm` (provenance),
  `@semantic-release/github` and `@semantic-release/changelog`. Needs the `NPM_TOKEN` secret (or trusted publishing).
- commitlint + a husky `commit-msg` hook enforcing Conventional Commits (including the `refactor:` type AGENTS.md requires).
- Start pre-1.0 (`0.x`); 1.0 is cut in T22.

**Done when:** a test PR runs green CI, and a dry-run release (`semantic-release --dry-run`) computes a version.

## Setup log

- [x] Create the GitHub repository (`Mansi1/daisy-date`) and add it as `origin`.
- [x] Add `repository`/`bugs`/`homepage` to `package.json`.
- [x] Commit, tag the first commit `v0.0.0` and push it. CI was green on the first push, including the Node 18 smoke test.
- [x] First publish via the short-lived `NPM_TOKEN` secret: `daisy-date@0.1.0` with provenance (repo made public; npm rejects
      provenance from private repos).
- [ ] Follow-up (owner, tracked in `MEMORY.md`): configure trusted publishing on npmjs.com (daisy-date → Settings → Trusted publishing: `Mansi1/daisy-date`,
      workflow `release.yml`), then revoke the token and `gh secret delete NPM_TOKEN`.
- [x] `main` is not protected, so the release job can push its `chore(release)` commit. Revisit if protection is added.
- [ ] Commitlint on PRs: first verified by the T04 PR (follow-up in `MEMORY.md`).

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
