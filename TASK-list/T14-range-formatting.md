# T14 · Range formatting

**Milestone:** Milestone 3 — Localization and text  
**Depends on:** [T10](./T10-localdaterange.md), [T13](./T13-pattern-compiler-and-format.md)  
**Status:** done

## Scope

- `LocalDateRange#format(pattern?, options?)`: collapses shared fields (`1–3 Oct 2026`, `28 Sep – 3 Oct 2026`)
  using `rangeSeparator`.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
