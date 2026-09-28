# T04 · `DayOfWeek` and shared comparison

**Milestone:** Milestone 2 — Core types  
**Depends on:** [T03](./T03-errors-and-temporal-provider.md)  
**Status:** done

## Scope

- `DAY_OF_WEEK` (`as const` array, ISO order) and the `DayOfWeek` string union, with `isDayOfWeek`,
  `dayOfWeekFromIsoNumber`, `dayOfWeekToIsoNumber` and `shiftDayOfWeek`. The helpers were first planned as `plusDays`/`ofIso`;
  a root-level `plusDays` belongs to the date functions (§7). No enum or enum-like object (owner decision, 2026-09-28).
- `toComparisonResult` (internal), the `Comparable<T>` type, the `ComparableValue<T>` base class and the public `compare` for
  `Array.sort`. Implemented by the ordered types `LocalDate`, `LocalDateTime` and `Duration`. `Period` and `LocalDateRange` have
  no natural order and only get `equals`.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
