# T21 · Documentation

**Milestone:** Milestone 4 — Polish and release  
**Depends on:** [T20](./T20-functional-api-audit-and-bundle-budget.md)  
**Status:** todo

## Scope

- `README.md`: install (including Temporal polyfill setup), a quick start in both API styles, the core types,
  ranges, business days, formatting and parsing, relative text, locales, errors, and FAQ entries
  ("why no timezones?", "why inclusive ranges?").
- One- or two-line JSDoc on every public export (AGENTS.md), and an API reference generated with TypeDoc.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
