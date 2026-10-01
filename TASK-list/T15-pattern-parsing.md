# T15 · Pattern parsing

**Milestone:** Milestone 3 — Localization and text  
**Depends on:** [T13](./T13-pattern-compiler-and-format.md)  
**Status:** done

## Scope

- `parse(text, pattern, options?)` and `tryParse` for `LocalDate`/`LocalDateTime`, per §6.3 (strict mode,
  case-insensitive names, weekday consistency check, `yy` rule).
- `DaisyParseError.index` points at the failing position.
- Narrow month and weekday names (`MMMMM`, `LLLLL`, `EEEEE`) are rejected in parse patterns with `DaisyFormatError`
  (§6.3; owner decision, 2026-09-29).
- ~~Round-trip property test~~ replaced by literal rows whose input is the hand-written output of the `en` presets
  (`'Monday, September 28, 2026'` with `full` → 2026-09-28): generating the input with `format` would be a computed
  expectation, which AGENTS.md rules out.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
