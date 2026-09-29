# T10 · `LocalDateRange`

**Milestone:** Milestone 2 — Core types  
**Depends on:** [T06](./T06-localdate-arithmetic-and-adjusters.md)  
**Status:** done

## Scope

- §5.4 in full, excluding `format` (T14) and business days (T11).
- ~~Property-based tests (fast-check)~~ replaced by literal tables that check each relation in both orders
  (`overlaps(a, b)` and `overlaps(b, a)` against one written-out answer). AGENTS.md forbids computed expectations,
  which a property test comparing `days()` with `toArray().length` would be.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
