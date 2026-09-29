# daisy-date — Specification

> **daisy** = **da**te + da**ys** + ea**sy**. An immutable, java.time-inspired date library for TypeScript,
> built on Temporal, with locale-aware formatting, parsing and human-readable relative text.

Status: draft v1 · 2026-09-28 · Tasks: [TASK-list](./TASK-list/README.md)

---

## 1. Goals

1. **Easy calendar maths without timezone bugs.** All v1 types are _local_: they have no timezone,
   so adding a day always gives the next calendar day.
2. **Familiar model.** Names and semantics follow `java.time` (`LocalDate`, `LocalDateTime`, `Period`,
   `Duration`, `plusDays`, `until`, `isBefore`).
3. **Two API styles, one implementation.** Immutable classes with methods, plus standalone
   tree-shakable functions. Each method delegates to its function.
4. **Human text in four languages.** Pattern formatting and parsing, relative text (`"in 3 days"`,
   `"next Friday"`) in both directions, and duration text, for `en`, `de`, `fr` and `es`.
5. **Temporal underneath, hidden.** Correct calendar arithmetic comes from Temporal. Temporal types
   never appear in the public API.

## 2. Non-goals (v1)

- Timezone-aware types (`ZonedDateTime`, `Instant`). **Planned for a later version.** v1 must not block
  them (see §9).
- Holidays and holiday calendars. Business-day logic knows only weekends.
- Non-ISO calendars (Hebrew, Islamic, Japanese…). ISO 8601 only.
- Natural-language parsing beyond the fixed relative grammar in §6.4.
- Bundling a Temporal polyfill.

## 3. Package

| Item         | Decision                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| npm name     | `daisy-date`. The unscoped `daisy` is taken by an unrelated RabbitMQ package.                                  |
| Language     | TypeScript, `strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`                                 |
| Output       | Dual **ESM + CJS** with `.d.ts`/`.d.cts`, built by **tsup**                                                    |
| Runtime      | **Node ≥ 18**, modern browsers via bundlers, Deno and Bun on a best-effort basis                               |
| Runtime deps | **None.** Temporal comes from the environment (§4).                                                            |
| Peer deps    | `temporal-polyfill` as an _optional_ peer dependency                                                           |
| Tests        | **Vitest**, `src/` coverage ≥ 98 % lines, 96 % branches, 100 % functions; required to merge                    |
| Lint/format  | **ESLint** (typescript-eslint, strict-type-checked) + **Prettier**                                             |
| CI           | **GitHub Actions**: lint, typecheck, test (Node 20/22/24), build, package checks, `dist` smoke test on Node 18 |
| Release      | **semantic-release** from Conventional Commits on `main`, started by hand, npm publish with provenance         |

### 3.1 Entry points

```
daisy-date              → classes, functions, errors, configureTemporal, English locale (default)
daisy-date/locale/en    → en locale pack
daisy-date/locale/de    → de locale pack
daisy-date/locale/fr    → fr locale pack
daisy-date/locale/es    → es locale pack
```

`package.json` has `"sideEffects": false`. Every entry point has `import` and `require` conditions,
each with its own `types`. The package passes `publint --strict` and `@arethetypeswrong/cli` with the
`node16` profile. TypeScript's legacy `moduleResolution: node10` can't resolve subpath exports, and that is
intentionally not supported.

Dev tooling (Vitest 4, attw) needs **Node ≥ 20**. Only the published `dist` promises Node 18.

## 4. Temporal provisioning

- daisy resolves Temporal lazily on first use, in this order:
  1. an implementation registered through `configureTemporal(impl)`
  2. `globalThis.Temporal`
- If neither exists, it throws `TemporalUnavailableError` with an install hint
  (`npm i temporal-polyfill` + `import 'temporal-polyfill/global'`, or `configureTemporal`).
- `configureTemporal` accepts any object that implements the subset of the Temporal API daisy uses.
  It is typed structurally, so daisy does not depend on the polyfill's types.
- Temporal types stay internal. No public signature mentions them.

## 5. Domain model

All types are **immutable**. Every "modifying" operation returns a new instance. Instances are
created through static factories only (`of`, `parse`, `from…`, `now`). Constructors are private.

### 5.1 Common conventions

| Convention        | Rule                                                                                                                                                                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Months            | `1–12`                                                                                                                                                                                                                                                       |
| Day of week       | `DayOfWeek` is a string union (`'monday' … 'sunday'`) derived from the `DAY_OF_WEEK` array (ISO order), with `isDayOfWeek`, `dayOfWeekFromIsoNumber`, `dayOfWeekToIsoNumber`, `shiftDayOfWeek`. Getters such as `LocalDate#dayOfWeek` return the name.       |
| Value sets        | No `enum`s and no enum-like const objects. Fixed sets are `as const` string arrays with a derived union: `type Unit = (typeof UNIT)[number]`.                                                                                                                |
| Comparison        | Ordered types (`LocalDate`, `LocalDateTime`, `Duration`) extend `ComparableValue`: `compareTo(other): -1 \| 0 \| 1`, `equals`, `isBefore`, `isAfter`, `isEqual`, plus the root `compare` for `Array.sort`. `Period` and `LocalDateRange` only have `equals`. |
| String form       | `toString()` returns ISO 8601. `toJSON()` returns the same, so `JSON.stringify` works.                                                                                                                                                                       |
| Invalid input     | Throws `DaisyRangeError` (out-of-range values) or `DaisyParseError` (unparseable text). No silent clamping, except month-end overflow in arithmetic and `withYear`/`withMonth` (§5.2).                                                                       |
| `now` / `today`   | Take an optional IANA `timeZone` string, defaulting to the system zone. This is the only place zones appear in v1.                                                                                                                                           |
| JS `Date` interop | `fromDate(date, timeZone?)` / `toDate(timeZone?)`. The zone defaults to the system zone.                                                                                                                                                                     |

### 5.2 `LocalDate`

Wraps `Temporal.PlainDate`.

- **Create:** `LocalDate.of(year, month, day)`, `LocalDate.parse('2026-09-28')`,
  `LocalDate.today(timeZone?)`, `LocalDate.fromDate(date, timeZone?)`,
  `LocalDate.ofYearDay(year, dayOfYear)`
- **Read:** `year`, `month`, `day`, `dayOfWeek`, `dayOfYear`, `weekOfYear` (ISO), `daysInMonth`,
  `daysInYear`, `isLeapYear()`
- **Arithmetic:** `plusDays/Weeks/Months/Years`, `minus…`, `plus(period)`, `minus(period)`. Month and
  year arithmetic **clamps** to the month end (`2026-01-31 + 1 month = 2026-02-28`), as in java.time.
- **Adjust:** `withYear/Month/Day` (as in java.time, `withYear` and `withMonth` clamp the day to the month end;
  `withDay` throws for a day the month doesn't have), `startOfWeek(firstDay = 'monday')`, `endOfWeek(…)`,
  `startOfMonth`, `endOfMonth`, `startOfYear`, `endOfYear`, `next(dayOfWeek)`, `previous(dayOfWeek)`,
  `nextOrSame`, `previousOrSame`
- **Between:** `until(other): Period`, `daysUntil(other): number` (signed)
- **Combine:** `atTime(hour, minute?, second?, millisecond?): LocalDateTime`, `atStartOfDay()`
- **Convert:** `toString()`, `toJSON()`, `toDate(timeZone?)`, `format(pattern, options?)`

### 5.3 `LocalDateTime`

Wraps `Temporal.PlainDateTime`. Precision is **milliseconds** (Temporal supports ns, but JS `Date` interop
and typical use cases need ms). Finer input is **rejected**, not truncated: `parse` throws `DaisyParseError`
for `…15.2501`, as `Duration.parse` does. Only `now()` drops Temporal's micro- and nanoseconds, since the clock
isn't input.

- **Create:** `of(year, month, day, hour?, minute?, second?, millisecond?)`, `parse(iso)`,
  `now(timeZone?)`, `fromDate(date, timeZone?)`, `LocalDate#atTime`
- **Read:** everything `LocalDate` has, plus `hour`, `minute`, `second`, `millisecond`, `toLocalDate()`
- **Arithmetic:** `LocalDate`'s methods plus `plusHours/Minutes/Seconds/Milliseconds`, `minus…`,
  `plus(period | duration)`, `minus(period | duration)`
- **Adjust:** `LocalDate`'s adjusters plus `withHour/Minute/Second/Millisecond`, `startOfDay`,
  `endOfDay` (`23:59:59.999`), `truncatedTo(unit)`
- **Between:** `until(other): { period: Period; duration: Duration }` (assumption, see §10 Q3),
  `durationUntil(other): Duration`

Decisions made in T09:

- `parse` accepts `yyyy-MM-ddTHH:mm`, optionally with `:ss` and a fraction; no offset, zone or space separator.
  `toString` always writes seconds, and milliseconds (3 digits) when non-zero: `2026-09-28T14:30:00.250`.
- The date operations shared with `LocalDate` (`plusDays`, `withMonth`, `next`, …) keep the time, as in
  java.time. `startOf*`/`endOf*` also set it, to `00:00:00.000` and `23:59:59.999`, like `startOfDay`/`endOfDay`.
- The root functions are generic: `plusDays<T extends LocalDate | LocalDateTime>(value: T, …): T` returns the
  type it was given.
- `plus(duration)` adds exact clock time; with no zone there is no DST, so `02:30` always exists.
- `toDate(timeZone)` resolves DST like Temporal's `'compatible'` mode: a skipped time moves forward, a repeated
  time takes the earlier instant.
- `until` returns years, months and days plus the remaining clock time, with `start + period + duration = end`.
  `truncatedTo` takes `'day' | 'hour' | 'minute' | 'second'`.

### 5.4 `LocalDateRange`

An **inclusive** range of calendar days. Stored as `start` and `end`, both `LocalDate`, with
`start ≤ end`.

- **Create:** `LocalDateRange.of(start, end)` (throws if `end < start`),
  `LocalDateRange.ofDays(start, count)`, `LocalDateRange.ofMonth(year, month)`,
  `LocalDateRange.ofYear(year)`, `LocalDateRange.ofWeek(date, firstDay = 'monday')`,
  `LocalDateRange.parse('2026-10-01/2026-10-03')` (ISO 8601 interval syntax)
- **Read:** `start`, `end`, `days()` returns the **number of days** (`1–3 Oct → 3`)
- **Query:** `contains(date)`, `encloses(range)`, `overlaps(range)`, `abuts(range)` (`end + 1 day = other.start`),
  `isConnected(range)` (overlaps or abuts), `equals(range)`
- **Combine:** `intersection(range): LocalDateRange | null`, `span(range)`,
  `union(range)` (throws unless connected)
- **Iterate:** `[Symbol.iterator]()` yields each `LocalDate`, `toArray()`,
  `splitBy('week' | 'month', options?)` returns `LocalDateRange[]`
- **Business days:** see §5.6
- **Convert:** `toString()` returns `"2026-10-01/2026-10-03"`, `format(pattern, options?)` returns
  `"1–3 Oct 2026"` style text using the locale's range separator

Decisions made in T10: a range is never empty (`ofDays` needs at least 1 day), `start`/`end` are frozen public
fields, and `abuts` is symmetric (either range may come first). `parse` accepts only `date/date` intervals, not
ISO's `date/duration` or abbreviated forms. Iteration is lazy: each date is created when it's requested.
`splitBy('week')` takes `{ firstDay }` (default Monday); pieces at either end may be partial.

### 5.5 `Period` and `Duration`

|            | `Period`                     | `Duration`                            |
| ---------- | ---------------------------- | ------------------------------------- |
| Units      | years, months, weeks, days   | hours, minutes, seconds, milliseconds |
| Applies to | `LocalDate`, `LocalDateTime` | `LocalDateTime` only                  |
| Sign       | components may be negative   | components may be negative            |
| ISO text   | `P1Y2M3D`, `P2W`             | `PT2H30M`, `PT0.5S`                   |

Shared API: `of({...})`, `ofDays/ofWeeks/…` or `ofHours/ofMinutes/…`, `parse(iso)`, component
getters, `plus`, `minus`, `negated`, `abs`, `isZero`, `isNegative`, `equals`, `toString`, `toJSON`,
`format(options?)` for human text (§6.5).

- `Period.normalized()` folds months into years (`14M → 1Y2M`) and keeps weeks and days unchanged.
- `Period` follows java.time where the table is silent: components may have mixed signs (`P1Y-2M`), `equals`
  compares component by component (`P12M ≠ P1Y`), `isNegative` is true if any component is negative, and
  `abs` makes every component positive. `parse` accepts a leading sign and signed components (`-P1Y2M`,
  `P-1Y2M`); `toString` writes the sign into each component (`P-1Y-2M`) and `P0D` for zero.
- `LocalDate#plus(period)` applies all months first (`12 × years + months`, clamped to the month end), then
  `7 × weeks + days`, as java.time does: `2026-01-31 + P1M1D = 2026-03-01`. Temporal can't add mixed-sign
  durations, so daisy applies the two steps itself. `until` returns years, months and days, never weeks.
- `Duration.normalized()` balances units into hours, minutes, seconds and milliseconds.
- `Duration` is an exact length, ordered like java.time's: `equals` compares total length (`PT1H = PT60M`), and
  `isZero`, `isNegative` and `abs` look at the total too (`PT1H-60M` is zero). Components keep their units until
  `normalized()`. `parse` accepts `PT…` only (days belong to `Period`), with a fraction on seconds down to
  milliseconds; finer precision is a `DaisyParseError`. `toString` merges seconds and milliseconds (`PT1.5S`).
  The total must fit in a safe integer of milliseconds.
- The root `plus`/`minus` throw a `TypeError` for combinations the types don't allow, such as a date plus a
  `Duration` (that arrives with `LocalDateTime`).
- `Duration.toMillis()`. `Period` has **no** conversion to days, because months vary in length.

### 5.6 Business days (weekends only)

No holidays. The only configuration is which weekdays are weekend days.

```ts
type WeekendOptions = { weekend?: readonly DayOfWeek[] }; // default ['saturday', 'sunday']
```

- `LocalDate#isWeekend(options?)`, `LocalDate#isBusinessDay(options?)`
- `LocalDate#plusBusinessDays(n, options?)`, `minusBusinessDays`. Business days are counted **strictly after** the
  start (strictly before it for `minus`), like Excel's `WORKDAY`: Friday + 1 and Saturday + 1 are both Monday,
  Sunday − 1 is Friday, and `n = 0` returns the start unchanged, even on a weekend (owner decision, 2026-09-29).
  Whole weeks are skipped in one step, so the cost doesn't grow with `n`.
- `LocalDateTime` has the same business-day methods; they look at the date and keep the time.
- `LocalDate#businessDaysUntil(other, options?)` counts business days in `[this, other)` and is signed.
- `LocalDateRange#businessDays(options?)` counts business days in the range, inclusive.
- `LocalDateRange#businessDaysIterator(options?)`
- A weekend list that covers all seven days throws `DaisyRangeError`.

## 6. Localization, formatting and parsing

### 6.1 Locale packs

A locale pack is a plain, typed data object with no runtime logic beyond small pure helpers. English is
bundled as the default. The other packs are opt-in imports, so they are tree-shaken when unused.

```ts
import { de } from 'daisy-date/locale/de';
date.format('EEEE, d. MMMM yyyy', { locale: de }); // 'Montag, 28. September 2026'
setDefaultLocale(de); // global default, optional
```

`Locale` interface (sketch; the final shape is decided in task T12):

- `code` (`'de'`), `firstDayOfWeek`, `weekend` (default weekend days; can differ per locale)
- `months`: wide / abbreviated / narrow, in both format and standalone forms
- `weekdays`: wide / abbreviated / short / narrow
- `dayPeriods`: am/pm
- `ordinal(n)`: for the `do`-style ordinal output (e.g. `1st`, `1.`, `1er`, `1.º`)
- `plural(n)`: a CLDR plural category (assumption: delegates to `Intl.PluralRules(code)`)
- `relative`: phrase templates for §6.4 formatting, including special words
  (`today`, `yesterday`, `tomorrow`, `the day after tomorrow`…)
- `relativeGrammar`: tokens and word lists for §6.4 parsing
- `units`: unit names with plural forms for §6.5
- `listSeparator` / `listFinal` / `rangeSeparator`
- `patterns`: named presets `short | medium | long | full` for date, time and dateTime

### 6.2 Pattern formatting

Patterns use Unicode LDML (CLDR) date field symbols, as in `java.time.DateTimeFormatter`. Supported
in v1:

| Symbol                             | Meaning                                           | Examples                           |
| ---------------------------------- | ------------------------------------------------- | ---------------------------------- |
| `y`, `yy`, `yyyy`                  | year                                              | `2026`, `26`, `2026`               |
| `M`, `MM`, `MMM`, `MMMM`, `MMMMM`  | month (format context)                            | `9`, `09`, `Sep`, `September`, `S` |
| `L…LLLLL`                          | month (standalone)                                | as above, standalone forms         |
| `d`, `dd`                          | day of month                                      | `8`, `08`                          |
| `D`, `DDD`                         | day of year                                       | `271`                              |
| `E…EEE`, `EEEE`, `EEEEE`, `EEEEEE` | weekday                                           | `Mon`, `Monday`, `M`, `Mo`         |
| `e`, `c`                           | local numeric weekday (respects `firstDayOfWeek`) | `1`                                |
| `w`, `ww`                          | ISO week of year                                  | `40`                               |
| `Y`                                | ISO week-based year                               | `2026`                             |
| `Q`, `QQQ`, `QQQQ`                 | quarter                                           | `3`, `Q3`, `3rd quarter`           |
| `a`                                | am/pm                                             | `PM`                               |
| `H`, `HH`, `h`, `hh`, `K`, `k`     | hour                                              | `14`, `02`, …                      |
| `m`, `mm`, `s`, `ss`               | minute, second                                    |                                    |
| `S…SSS`                            | fraction of second                                | `123`                              |
| `'text'`, `''`                     | literal, escaped quote                            |                                    |

Named presets: `format('long')` resolves through `locale.patterns`. Time fields on a `LocalDate`
throw `DaisyFormatError`. Unknown letters throw at compile time of the pattern. Compiled patterns
are cached per (pattern, locale).

### 6.3 Pattern parsing

`LocalDate.parse(text, pattern, options?)` and `LocalDateTime.parse(text, pattern, options?)` accept
the same symbols as §6.2, except week-based fields in v1.

- Month and weekday names match case-insensitively, in wide, abbreviated or narrow form, depending on
  the symbol width.
- A parsed weekday must agree with the date, otherwise `DaisyParseError`.
- `options.strict` (default `true`): numeric widths must match exactly and trailing text is an error.
- `yy` maps to `2000–2099` (assumption, see §10 Q4).
- Also `tryParse(...)`, which returns `null` instead of throwing.

### 6.4 Relative text

**Formatting:** `date.formatRelative(options?)` and `formatRelative(date, options?)`:

```ts
type RelativeOptions = {
  relativeTo?: LocalDate; // default LocalDate.today()
  locale?: Locale;
  style?: 'long' | 'short'; // 'in 3 days' vs 'in 3 d'
  numeric?: 'auto' | 'always'; // 'auto' → 'tomorrow'; 'always' → 'in 1 day'
};
```

Unit selection, based on the signed day difference `n`:

| Condition                                             | Output (en)                                                                            |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `numeric: 'auto'` and a special word exists (`-2…+2`) | `today`, `yesterday`, `tomorrow`, `the day before yesterday`, `the day after tomorrow` |
| `\|n\| ≤ 6` and within the current or adjacent week   | `next Friday`, `last Monday` (with `numeric: 'auto'`)                                  |
| `\|n\| < 7`                                           | `in 3 days` / `3 days ago`                                                             |
| `\|n\| < 31`                                          | weeks, rounded down: `in 2 weeks`                                                      |
| `\|n\| < 365`                                         | months via calendar difference: `in 4 months`                                          |
| otherwise                                             | years via calendar difference: `in 2 years`                                            |

`LocalDateTime#formatRelative` adds seconds, minutes and hours for differences under one day.

**Parsing:** `LocalDate.parseRelative(text, options?)`, where `options` are `{ relativeTo?, locale? }`.
The grammar is fixed per locale, is case-insensitive and ignores surrounding whitespace. English forms:

| Form                                 | Examples                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------ |
| special words                        | `today`, `yesterday`, `tomorrow`, `day after tomorrow`, `day before yesterday` |
| `in N <unit>`                        | `in 3 days`, `in 2 weeks`, `in a month`, `in one year`                         |
| `N <unit> ago`                       | `3 days ago`, `a week ago`                                                     |
| `next\|last\|this <weekday>`         | `next friday`, `last mon`                                                      |
| `next\|last\|this week\|month\|year` | returns the **start** of that period (assumption)                              |
| `<weekday>` alone                    | the next occurrence, or today if it matches (assumption)                       |

Numbers: digits, plus number words `one` to `twelve` and the indefinite article (`a`, `an`) in every
locale. Unrecognised input throws `DaisyParseError`. `tryParseRelative` returns `null` instead.
Each locale pack provides its own grammar data: `in 3 Tagen`, `vor 2 Wochen`, `nächsten Freitag`,
`übermorgen`, `dans 3 jours`, `il y a 2 semaines`, `vendredi prochain`, `après-demain`,
`dentro de 3 días`, `hace 2 semanas`, `el próximo viernes`, `pasado mañana`.

### 6.5 Duration and period text

`period.format(options?)` and `duration.format(options?)`:

```ts
type DurationFormatOptions = {
  locale?: Locale;
  style?: 'long' | 'short' | 'narrow'; // '2 weeks 3 days' | '2 wks 3 d' | '2w 3d'
  list?: 'conjunction' | 'unit'; // '2 weeks and 3 days' vs '2 weeks, 3 days'
  zeros?: 'omit' | 'show'; // default 'omit'
  largestUnits?: number; // e.g. 2 → '1 year 2 months' (drops the smaller ones)
};
```

A zero period formats as `0 days` / `0 Tage` / `0 jour` / `0 días`.

## 7. Functional API

Every method with logic has a standalone function with the same name, taking the receiver first:

```ts
import { LocalDate, plusDays, isWeekend, formatRelative } from 'daisy-date';

const date = LocalDate.parse('2026-09-28');
date.plusDays(3).equals(plusDays(date, 3)); // true
```

- Methods are one-line delegations to the functions, so there is one implementation.
- Functions live in per-concern modules (`src/functions/arithmetic.ts`, …) and are re-exported from
  the root. Getters and factories stay on the classes.
- Where one name applies to several types, the function is overloaded (`plusDays(LocalDate)` and
  `plusDays(LocalDateTime)` return the matching type).
- Tree-shaking budget (checked in CI with size-limit): importing `{ plusDays }` alone stays under a
  budget fixed in T20. Importing all four locales adds each pack's size independently.

## 8. Errors

Every error extends `DaisyError`, which extends `Error`, and has a stable `code` string:

| Class                      | `code`                 | When                                                        |
| -------------------------- | ---------------------- | ----------------------------------------------------------- |
| `TemporalUnavailableError` | `TEMPORAL_UNAVAILABLE` | no Temporal found (§4)                                      |
| `DaisyRangeError`          | `RANGE`                | invalid component, `end < start`, bad weekend config        |
| `DaisyParseError`          | `PARSE`                | unparseable text. Carries `input`, `pattern?` and `index?`. |
| `DaisyFormatError`         | `FORMAT`               | invalid pattern, or a field not available on the type       |

## 9. Forward compatibility (zones later)

- The names `ZonedDateTime`, `Instant` and `ZoneId` stay reserved. Do not export anything with those names.
- Keep `now()`, `today()`, `fromDate()` and `toDate()` taking `timeZone?: string` as the only zone
  inputs, so a future `ZoneId` can be accepted alongside the string.
- Keep the `Locale` and format engine type-agnostic: field accessors come through an internal
  `FieldSource` interface, so a future zoned type can plug in (`z`/`VV`/`XXX` symbols later).

## 10. Open questions

Each question has a default so that implementation is not blocked. Override any of them before the
matching task starts.

1. **Node 18 has been end-of-life since April 2025.** Keep it (default), or raise the floor to Node 20?
   Raising it would also simplify the dual build.
2. **tsup is in maintenance mode.** Its README recommends tsdown. Default: use tsup as decided, and
   keep the build config small so switching later is easy.
3. `LocalDateTime#until` returns `{ period, duration }` (default), or only a `Duration`?
4. Two-digit years (`yy`): map to `2000–2099` (default), or use a sliding window around the current year?
5. Bare weekday in `parseRelative` (`"friday"`): the next occurrence including today (default), or
   strictly after today?
6. Should `LocalDateRange` also support open-ended ranges (no end)? Default: no, not in v1.

## 11. Tasks

One document per task in [`TASK-list/`](./TASK-list/README.md).
