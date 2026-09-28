# MEMORY.md

- 2026-09-28: npm name `daisy` is taken (unrelated RabbitMQ lib, v0.2.0); `daisy-date` and `daisyjs` were free on that date.
- 2026-09-28: Tool majors are pinned by Node engines, not by preference: Vitest 5 needs Node ≥22.12, ESLint 10 needs ≥20.19
  (local Node was 20.18.2), and TypeScript 7 (the Go port) has no JS API for tsup's dts build. So: Vitest 4, ESLint 9, TS ~5.9.
- 2026-09-28: Tests get Temporal types via `import type {} from 'temporal-polyfill/global'`; `src/` must not rely on the global type.
- 2026-09-28: Prettier ignores `AGENTS.md`/`CLAUDE.md` (owner-maintained); `func-style` lint rule dropped as duplicate of the
  `no-restricted-syntax` arrow-function rule. `license: MIT` in package.json is a placeholder until the owner confirms.
- 2026-09-28 (T02): semantic-release 25 and its plugins need Node ≥22.14, so they are not devDependencies; `release.yml` runs
  them via `npx -p` on Node 24. commitlint is pinned to 20 (21 needs Node ≥22.12).
- 2026-09-28 (T02): the `angular` preset ignores `feat!:`, so the preset is `conventionalcommits`, pinned to **@9**. @10 fails
  in release-notes-generator ("requires conventional-changelog-writer@9"). Verified by a dry run in a scratch repo.
- 2026-09-28 (T02): 0.x is kept by a `breaking → minor` releaseRule plus a `v0.0.0` tag on the first commit (without the tag
  the first release is 1.0.0). T22 removes the rule.
- 2026-09-28: `npm audit` reports a low-severity esbuild advisory (dev server, Windows only) via tsup; `audit fix` can't resolve it. Ignored.
- 2026-09-28 (T02): the `@semantic-release/github` failure issue is disabled (`failTitle: false`); on the first run it crashed creating
  its label. Release failures show up only in the Actions tab.
- 2026-09-28 (T03): `TemporalLike` only checks for the `PlainDate`/`PlainDateTime`/`Duration` classes and a `Now` object. Each later
  task adds the members it calls. `test/internal/temporal.test.ts` passes the polyfill's `Temporal` to `configureTemporal`
  without a cast, which proves at compile time that the real implementation still fits.
- 2026-09-28 (T03): error `name`s are string literals, not `new.target.name`, so they survive minifiers. `instanceof`
  breaks if both the CJS and the ESM copy get loaded (dual-package hazard); `error.code` is the reliable check. Mention in T21 docs.
- 2026-09-28 (T02): the release job sets `HUSKY=0`. Otherwise `npm ci` installs the commit-msg hook and @semantic-release/git's
  commit fails: the hook's `npx commitlint` breaks inside semantic-release's own `npx` environment.
- 2026-09-28 (T02): npm rejects provenance from **private** repos (E422), so the repo is public. A failed publish after
  @semantic-release/git has pushed leaves a `vX` tag plus a `refs/notes/semantic-release-vX` ref. Delete both (and the release
  commit) before retrying, or semantic-release treats the version as released. 0.1.0 was recovered this way.
- 2026-09-29: 0.1.0 and 0.2.0 were unpublished from npm (scaffold only, nothing usable). npm never allows those numbers
  again, so the `v0.1.0`/`v0.2.0` tags must stay: semantic-release continues from them and the next release is 0.3.0.
- Open follow-up (owner): npm trusted publishing for `Mansi1/daisy-date` + `release.yml`, then revoke the token and
  `gh secret delete NPM_TOKEN`. With the package unpublished, trusted publishing can only be set up after 0.3.0 has gone
  out with `NPM_TOKEN`, so keep the secret until then. Delete this entry once done.
