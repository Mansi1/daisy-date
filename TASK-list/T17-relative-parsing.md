# T17 · Relative parsing

**Milestone:** Milestone 3 — Localization and text  
**Depends on:** [T16](./T16-relative-formatting.md)  
**Status:** dropped (owner decision, 2026-10-02)

## Why it was dropped

The feature isn't needed. The token grammar built for it (PR #17, closed unmerged) also wouldn't carry over to
many languages: no spaces (`3日後`), units without a number (`через неделю`), dual forms (`بعد يومين`) and
case-inflected weekdays. The `relativeGrammar` locale data was removed with it.

## Original scope

- A small token-based parser driven by `locale.relativeGrammar` (no regex per phrase), implementing the §6.4 forms.
- `parseRelative` and `tryParseRelative`.
- Tests: every form in the table, case and whitespace variations, number words, and rejection of near misses
  (`in three`, `next`).

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
