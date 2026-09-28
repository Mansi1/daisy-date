# T16 · Relative formatting

**Milestone:** Milestone 3 — Localization and text  
**Depends on:** [T12](./T12-locale-interface-and-en.md), [T09](./T09-localdatetime.md)  
**Status:** todo

## Scope

- `formatRelative` for `LocalDate` and `LocalDateTime` with the §6.4 unit-selection table, `numeric`, `style`,
  `relativeTo`, and a locale plural-aware template.
- A table-driven test in `en`, covering the boundaries: ±6, ±7, ±30, ±31, ±364, ±365 days.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
