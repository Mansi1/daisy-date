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
- 2026-09-29 (T05): `TemporalLike` checks at runtime for the `PlainDate`/`PlainDateTime`/`Duration`/`Instant` classes and a
  `Now` object; its types list only the members daisy calls (`PlainDateLike` etc.). Each later task adds the members it calls. `test/internal/temporal.test.ts` passes the polyfill's `Temporal` to `configureTemporal`
  without a cast, which proves at compile time that the real implementation still fits.
- 2026-09-28 (T03): error `name`s are string literals, not `new.target.name`, so they survive minifiers. `instanceof`
  breaks if both the CJS and the ESM copy get loaded (dual-package hazard); `error.code` is the reliable check. Mention in T21 docs.
- 2026-09-28 (T02): npm rejects provenance from **private** repos (E422), so the repo is public. A failed publish leaves a
  `vX` tag plus a `refs/notes/semantic-release-vX` ref. Delete both before retrying, or semantic-release treats the version
  as released. 0.1.0 was recovered this way.
- 2026-09-29 (T05): Temporal truncates fractional fields in property bags (`{ day: 2.5 }` → 2), so factories call
  `assertInteger` first. `vi.useFakeTimers({ now })` also drives the polyfill's `Temporal.Now`.
- 2026-09-29 (T06): functions in `src/functions/` reach a LocalDate's PlainDate through the internal `toPlainDate`/`fromPlainDate`
  in `local-date.ts`. `local-date.ts` and the function modules import each other; that is safe only while neither uses the
  other at module top level.
- 2026-09-29 (T07/T08): root functions shared by several types (`plus`, `minus`, `negated`, `abs`, `normalized`) are
  arrow consts cast to an overloaded call-signature type (`AmountArithmetic`, `AmountTransform`); TS can't check an arrow
  against overloads without the cast, so each dispatches on `instanceof` and `plus`/`minus` throw `TypeError` otherwise.
- 2026-09-29 (T08): `Period` and `Duration` expose their components as frozen public fields, so `toEqual` against a
  plain object works in tests. Only types with private state (`LocalDate`) need an equality tester in `test/setup`.
- 2026-09-29 (T07): Temporal throws "Cannot mix duration signs" for `add({ years: 1, months: -2 })`; Period arithmetic on
  dates therefore goes through `plusMonths` then `plusDays`.
- 2026-09-29 (T09): date functions are generic over `DateValue` via `adjustDatePart` (runs the LocalDate logic, re-attaches
  the time). Class methods pass the type argument explicitly (`plusDays<LocalDate>(this, …)`), otherwise
  `prefer-return-this-type` asks for a `this` return type.
- 2026-09-29 (T10): loops that need a counter use `for (const index of new Array<undefined>(count).keys())`; the sparse
  array allocates no elements, so it stays lazy without `let`. Generators must be class methods (`*[Symbol.iterator]`),
  since the lint rule forbids `function*` expressions.
- 2026-09-29 (T11): `0 - count` instead of `-count` where a count may be zero; `-0` fails `toBe(0)` and `toEqual`.
- 2026-09-29 (T12): `Locale.relative`/`units` hold CLDR-style `{ one, other }` templates with `{0}`; pick the form with
  `forms[locale.plural(n)] ?? forms.other`. `selectPluralCategory` caches one `Intl.PluralRules` per code and type.
  In the ESM build `daisy-date/locale/en` and the root share one `en` object; in CJS they are separate copies.
- 2026-09-29 (T13): locale name lookups go through `nameAt` (throws on a missing entry) instead of `?? ''`, whose fallback
  branch no test can reach; coverage is at 100 % and the owner wants unreachable branches tested, not tolerated.
- 2026-10-02 (T15): parsed fields carry `{ value, position }` together, so consistency errors always have an index;
  pattern checks run before reading text, and the resolver's own guards are tested directly via `dateFromFields`.
- 2026-09-29: git strips commit-message lines that start with `#` (e.g. `#atTime`); reword instead of starting a line with it.
- 2026-09-29: the `main` ruleset requires up-to-date branches, so after one PR merges every other open PR needs
  "Update branch" (or a rebase and force-push) plus a fresh CI run before it can merge.
- 2026-09-29: 0.1.0 and 0.2.0 were unpublished from npm (scaffold only, nothing usable). npm never allows those numbers
  again, so the `v0.1.0`/`v0.2.0` tags must stay: semantic-release continues from them and the next release is 0.3.0.
- Open follow-up (owner): enable `Mansi1/daisy-date` on codecov.io. Until then the Codecov upload fails quietly
  (`fail_ci_if_error: false`) and the README badge shows "unknown". Delete this entry once uploads work.
- Open follow-up (owner): npm trusted publishing for `Mansi1/daisy-date` + `release.yml`, then revoke the token and
  `gh secret delete NPM_TOKEN`. With the package unpublished, trusted publishing can only be set up after 0.3.0 has gone
  out with `NPM_TOKEN`, so keep the secret until then. Delete this entry once done.
