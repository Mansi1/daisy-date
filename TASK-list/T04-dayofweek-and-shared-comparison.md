# T04 · `DayOfWeek` and shared comparison

**Milestone:** Milestone 2 — Core types  
**Depends on:** [T03](./T03-errors-and-temporal-provider.md)  
**Status:** todo

## Scope

- The `DayOfWeek` const object + type (1–7, ISO) with helpers `plusDays`/`ofIso`.
- An internal comparison helper, plus a `Comparable` interface implemented by all value types.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
