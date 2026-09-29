# T05 · `LocalDate` core

**Milestone:** Milestone 2 — Core types  
**Depends on:** [T04](./T04-dayofweek-and-shared-comparison.md)  
**Status:** done

## Scope

- A private constructor wrapping a PlainDate. Factories: `of`, `parse` (ISO only), `today(timeZone?)`, `fromDate`, `ofYearDay`.
- The getters from §5.2, `compareTo`/`equals`/`isBefore`/`isAfter`/`isEqual`/static `compare`, `toString`, `toJSON`, `toDate`.
- Validation errors are `DaisyRangeError` or `DaisyParseError`. Temporal errors never leak.
- Tests include leap years, `2026-02-29` rejection, week 53 years, and `today` in explicit zones.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
