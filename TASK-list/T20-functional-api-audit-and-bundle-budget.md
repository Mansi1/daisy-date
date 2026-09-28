# T20 · Functional API audit and bundle budget

**Milestone:** Milestone 4 — Polish and release  
**Depends on:** [T19](./T19-de-fr-es-locale-packs.md)  
**Status:** todo

## Scope

- Check that every logic-bearing method has a standalone function that it delegates to (§7), with type-correct overloads.
- size-limit in CI: fix budgets for `{ plusDays }`, `{ LocalDate }`, `{ format }`, and each locale.
  Confirm that unused locales and relative parsing are tree-shaken out.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
