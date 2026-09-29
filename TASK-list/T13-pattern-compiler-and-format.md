# T13 · Pattern compiler and `format`

**Milestone:** Milestone 3 — Localization and text  
**Depends on:** [T09](./T09-localdatetime.md), [T12](./T12-locale-interface-and-en.md)  
**Status:** done

## Scope

- A pattern tokenizer (with literals and `''`), a compiled pattern cache keyed by pattern + locale, and the internal `FieldSource` interface (§9).
- `format(pattern | preset, options?)` for `LocalDate` and `LocalDateTime`, plus the functional `format`.
- The full symbol table (§6.2). `DaisyFormatError` for unknown symbols and for time fields on `LocalDate`.
- ~~Snapshot tests~~ replaced by hand-written tables per symbol and width, and per preset in `en`: snapshots are
  recorded from the implementation's own output, which AGENTS.md rules out.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
