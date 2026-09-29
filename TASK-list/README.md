# Task list

Work through the tasks in order. A task may start once its **Depends on** tasks are done. Each task
is one PR with Conventional Commit messages (semantic-release derives versions from them). The AGENTS.md
conventions apply to every task: arrow functions, no inline comments, `assertNever` in switches,
meaningful names. Every task also includes: tests for all public API it adds, `npm run check` green,
and a `MEMORY.md` update if something non-obvious was learned.

Set **Status** in each file to `todo`, `in progress` or `done`, and tick the box here.

## Milestone 1 — Foundation

- [x] [T01 · Project scaffold](./T01-project-scaffold.md)
- [x] [T02 · CI and release](./T02-ci-and-release.md)
- [x] [T03 · Errors and Temporal provider](./T03-errors-and-temporal-provider.md)

## Milestone 2 — Core types

- [x] [T04 · `DayOfWeek` and shared comparison](./T04-dayofweek-and-shared-comparison.md)
- [x] [T05 · `LocalDate` core](./T05-localdate-core.md)
- [x] [T06 · `LocalDate` arithmetic and adjusters](./T06-localdate-arithmetic-and-adjusters.md)
- [x] [T07 · `Period`](./T07-period.md)
- [x] [T08 · `Duration`](./T08-duration.md)
- [x] [T09 · `LocalDateTime`](./T09-localdatetime.md)
- [x] [T10 · `LocalDateRange`](./T10-localdaterange.md)
- [x] [T11 · Business days](./T11-business-days.md)

## Milestone 3 — Localization and text

- [x] [T12 · Locale interface and `en`](./T12-locale-interface-and-en.md)
- [ ] [T13 · Pattern compiler and `format`](./T13-pattern-compiler-and-format.md)
- [ ] [T14 · Range formatting](./T14-range-formatting.md)
- [ ] [T15 · Pattern parsing](./T15-pattern-parsing.md)
- [ ] [T16 · Relative formatting](./T16-relative-formatting.md)
- [ ] [T17 · Relative parsing](./T17-relative-parsing.md)
- [ ] [T18 · Period and duration text](./T18-period-and-duration-text.md)
- [ ] [T19 · `de`, `fr`, `es` locale packs](./T19-de-fr-es-locale-packs.md)

## Milestone 4 — Polish and release

- [ ] [T20 · Functional API audit and bundle budget](./T20-functional-api-audit-and-bundle-budget.md)
- [ ] [T21 · Documentation](./T21-documentation.md)
- [ ] [T22 · 1.0 release](./T22-1-0-release.md)

## Dependency overview

```
T01 ─┬─ T02 ───────────────────────────────────────────────┐
     └─ T03 ─ T04 ─┬─ T05 ─ T06 ─┬─ T09 ─┬─ T13 ─┬─ T15    │
                   ├─ T07 ───────┤       │       ├─ T14    │
                   ├─ T08 ───────┘       ├─ T16 ─ T17      │
                   └─ T12 ───────────────┘                 │
                                 T06 ─ T10 ─ T11           │
                   T07,T08,T12 ─ T18                       │
                   T13–T18 ─ T19 ─ T20 ─ T21 ─ T22 ────────┘
```
