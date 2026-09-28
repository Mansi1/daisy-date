# T12 · Locale interface and `en`

**Milestone:** Milestone 3 — Localization and text  
**Depends on:** [T04](./T04-dayofweek-and-shared-comparison.md)  
**Status:** todo

## Scope

- Finalize the `Locale` type (§6.1) in `src/locale/types.ts`.
- `src/locale/en.ts`, plus `setDefaultLocale`/`getDefaultLocale`.
- Entry point `daisy-date/locale/en`. English is also the built-in default.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
