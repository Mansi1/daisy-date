# T01 · Project scaffold

**Milestone:** Milestone 1 — Foundation  
**Depends on:** —  
**Status:** done

## Scope

- `git init`, `.gitignore`, `package.json` (`name: daisy-date`, `type: module`, `engines.node >=18`,
  `sideEffects: false`, `files: ["dist"]`, optional peer `temporal-polyfill`, `license` to be decided by the owner).
- `tsconfig.json` (strict flags from §3), `tsup.config.ts` building ESM + CJS + d.ts for every entry point in §3.1
  (locale entries may be placeholder files for now).
- `exports` map with `import`/`require` and a `types` condition per entry.
- Vitest (with `temporal-polyfill/global` in the test setup, and a coverage threshold of 95 %), ESLint flat config
  (typescript-eslint strict-type-checked, plus a rule that forbids `function` declarations), Prettier.
- Scripts: `build`, `test`, `test:coverage`, `lint`, `format`, `typecheck`, `check` (all of them), `check:package`
  (`publint` + `attw --pack`).
- `src/internal/assert-never.ts`.
- Create `MEMORY.md`.

**Done when:** `npm run check && npm run build && npm run check:package` pass on an empty `src/index.ts` export.

## Definition of done

- Tests cover all public API added by this task; `npm run check` is green.
- AGENTS.md conventions followed (arrow functions, no inline comments, `assertNever`, meaningful names).
- `MEMORY.md` updated if something non-obvious was learned.

Spec: [PROJECT.md](../PROJECT.md)
