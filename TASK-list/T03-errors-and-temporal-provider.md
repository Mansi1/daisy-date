# T03 · Errors and Temporal provider

**Milestone:** Milestone 1 — Foundation  
**Depends on:** [T01](./T01-project-scaffold.md)  
**Status:** done

## Scope

- `src/errors.ts`: `DaisyError` and its subclasses with `code` (§8). `DaisyParseError` carries `input`, `pattern?` and `index?`.
- `src/internal/temporal.ts`: a structural `TemporalLike` type covering only what daisy uses, `configureTemporal(impl)`,
  and a lazy `getTemporal()` that resolves in the §4 order and throws `TemporalUnavailableError` with an install hint.
- Tests: a registered implementation wins over the global; no Temporal → the error names the fix; resolution is cached,
  and `configureTemporal` resets the cache.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
