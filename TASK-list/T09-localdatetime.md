# T09 · `LocalDateTime`

**Milestone:** Milestone 2 — Core types  
**Depends on:** [T06](./T06-localdate-arithmetic-and-adjusters.md), [T07](./T07-period.md), [T08](./T08-duration.md)  
**Status:** done

## Scope

- §5.3 in full: factories, getters, time arithmetic, adjusters (`startOfDay`, `endOfDay`, `truncatedTo`), `toLocalDate`,
  `LocalDate#atTime` and `#atStartOfDay`, `until` → `{ period, duration }`, `durationUntil`.
- Millisecond precision: reject or truncate sub-ms input (decide, and record the decision in PROJECT.md).

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
