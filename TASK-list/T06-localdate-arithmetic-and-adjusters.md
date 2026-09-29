# T06 · `LocalDate` arithmetic and adjusters

**Milestone:** Milestone 2 — Core types  
**Depends on:** [T05](./T05-localdate-core.md)  
**Status:** done

## Scope

- Functions in `src/functions/` (arithmetic, adjusters) and delegating methods: `plus/minus Days/Weeks/Months/Years`,
  `with*`, `startOf/endOf Week/Month/Year`, `next/previous(OrSame)`, `daysUntil`.
- Month-end clamping tests (`01-31 + 1M`, `02-29 + 1Y`).

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
