# T07 · `Period`

**Milestone:** Milestone 2 — Core types  
**Depends on:** [T04](./T04-dayofweek-and-shared-comparison.md)  
**Status:** todo

## Scope

- §5.5 `Period`: factories, `parse`/`toString` (ISO `P…`), arithmetic, `negated`, `abs`, `normalized`, `equals`.
- `LocalDate#plus(period)`, `#minus(period)`, `#until(other): Period` (together with T06).

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
