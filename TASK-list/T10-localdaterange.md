# T10 · `LocalDateRange`

**Milestone:** Milestone 2 — Core types  
**Depends on:** [T06](./T06-localdate-arithmetic-and-adjusters.md)  
**Status:** todo

## Scope

- §5.4 in full, excluding `format` (T14) and business days (T11).
- Property-based tests (fast-check as a dev dependency) for `overlaps`/`intersection`/`union` symmetry, and
  `days() === toArray().length`.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
