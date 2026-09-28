# T19 · `de`, `fr`, `es` locale packs

**Milestone:** Milestone 3 — Localization and text  
**Depends on:** [T13](./T13-pattern-compiler-and-format.md)–[T18](./T18-period-and-duration-text.md)  
**Status:** todo

## Scope

- Complete packs, each with its own entry point, covering names, presets, ordinals, relative phrases and grammar
  (`übermorgen`, `il y a`, `hace`), unit plurals, and range separators.
- Each locale runs the same table-driven suites as `en` (format, parse round-trip, relative format and parse,
  duration text).
- A native-speaker review of the strings is recommended before 1.0.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
