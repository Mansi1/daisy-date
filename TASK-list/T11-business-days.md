# T11 · Business days

**Milestone:** Milestone 2 — Core types  
**Depends on:** [T10](./T10-localdaterange.md)  
**Status:** todo

## Scope

- §5.6: `isWeekend`, `isBusinessDay`, `plus/minusBusinessDays`, `businessDaysUntil`, `LocalDateRange#businessDays`,
  and `businessDaysIterator`.
- `WeekendOptions` validation. `plusBusinessDays` is O(1) for full weeks, not a day-by-day loop.
- Tests with a Fri/Sat weekend and a single-day weekend.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
