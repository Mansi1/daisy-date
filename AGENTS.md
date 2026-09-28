## Conventions

- **No code comments, only short JSDoc.** Express intent through names and small functions; put the "why"
  in the commit body, PR description or task document. The only allowed comments are JSDoc, kept to one
  or two lines. Reviewers block merges over explanatory inline comments and long doc blocks. Leave
  existing comments alone unless they became wrong.
- **Meaningful variable names.** Name variables, including lambda parameters, after what they hold:
  `(shift) => shift.start`, not `(s) => s.start`.
- **Exhaustive switches.** End every `switch` over a union or enum with
  `default: return assertNever(value);`, so a new member fails the compile.
- **No enums.** Model fixed value sets as `as const` string arrays with a derived union:
  `const DAY_OF_WEEK = ['monday', …] as const; type DayOfWeek = (typeof DAY_OF_WEEK)[number];`.
  No TypeScript `enum` and no enum-like const objects such as `{ MONDAY: 1 }`.
- **Arrow functions.** Write `const fn = (...) => {...}` instead of `function fn() {}`, including module-level
  and exported functions (class methods excepted). Arrow consts aren't hoisted, so define helpers first.
- **Refactor what you touch.** When a change touches code, also improve that code: naming, structure,
  duplication, dead code, outdated patterns. Don't leave it as you found it. Put the refactoring in its
  own `refactor:` commit, ahead of the change that needs it, so the feature commits stay easy to review.

## MEMORY.md — the agent's own memory

`MEMORY.md` (project root) records what you learned while working that is **not** already in the
code, in this file, environment quirks, dead ends
including the reason, open follow-up work.

**Rules**
- **Read it first** — before your first change.
- **Keep it short** — one to three lines per entry. Date is absolute (`YYYY-MM-DD`), plus branch or
  commit where helpful.
- **Revise deliberately, don't just append**
    - On every visit, review the entries that touch your work.
    - Delete what is no longer true or no longer needed: fixed bugs, completed follow-ups, values
      superseded by a new measurement.
    - Correct what has changed **in place** instead of adding a second, contradicting entry.
    - A stale entry is more harmful than a missing one: the next agent acts on it.
- **Don't duplicate** — anything that holds permanently for all agents belongs here in `AGENTS.md`
  and is then deleted from `MEMORY.md`.