# daisy-date

[![CI](https://github.com/Mansi1/daisy-date/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Mansi1/daisy-date/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Mansi1/daisy-date/graph/badge.svg)](https://codecov.io/gh/Mansi1/daisy-date)

**daisy** = **da**te + da**ys** + ea**sy**. Immutable calendar dates for TypeScript, modelled on `java.time`
and built on [Temporal](https://tc39.es/proposal-temporal/docs/).

```ts
import { LocalDate, Period } from 'daisy-date';

const invoice = LocalDate.parse('2026-01-31');
invoice.plusMonths(1).toString(); // '2026-02-28' (clamped to the month end)
invoice.plus(Period.parse('P1M1D')).toString(); // '2026-03-01'
invoice.until(LocalDate.parse('2026-03-01')).toString(); // 'P1M1D'
```

> **Status: pre-release.** daisy-date is not on npm yet. The first release is published once the core types
> are complete. Everything below works on `main` today; see the [roadmap](#roadmap) for what's next.

## Why daisy?

- **No timezone bugs in date maths.** A `LocalDate` is a calendar day and nothing else: no time, no zone, no
  hidden UTC offset. Adding a day always gives the next calendar day, even across daylight-saving changes.
  Time zones appear only where you convert: `today()` / `now()`, `fromDate()` and `toDate()`.
- **Familiar, predictable API.** Names and rules follow `java.time`: `plusMonths`, `until`, `isBefore`,
  `Period`. Month arithmetic clamps to the month end, the way people expect (`Jan 31 + 1 month = Feb 28`).
- **Immutable values.** Every operation returns a new value; nothing is ever modified in place.
- **Two API styles, one implementation.** Chain methods (`date.plusDays(3)`) or import standalone functions
  (`plusDays(date, 3)`) that bundlers can tree-shake.
- **Correct calendar maths underneath.** Temporal does the arithmetic, so leap years, month lengths and ISO week
  numbers are right. Temporal types never leak into daisy's API.
- **Clear errors.** Invalid input throws instead of silently rolling over: `LocalDate.of(2026, 2, 29)` throws a
  `DaisyRangeError`. Every error has a stable `code` you can branch on.
- **Small and strict.** Zero runtime dependencies, strict TypeScript types, ESM and CommonJS builds.

## Install

Once published:

```sh
npm install daisy-date
```

daisy uses [Temporal](https://tc39.es/proposal-temporal/docs/) for calendar maths but doesn't bundle it. On
runtimes without native Temporal, install the polyfill and load it once at startup:

```sh
npm install temporal-polyfill
```

```ts
import 'temporal-polyfill/global';
```

If you'd rather not touch the global scope, pass an implementation to daisy instead:

```ts
import { Temporal } from 'temporal-polyfill';
import { configureTemporal } from 'daisy-date';

configureTemporal(Temporal);
```

If neither is available, daisy throws a `TemporalUnavailableError` that explains both options. The package
runs on Node 18+ and in modern browsers through a bundler.

## Usage

### Creating dates

```ts
import { LocalDate } from 'daisy-date';

LocalDate.of(2026, 9, 28); // months are 1–12
LocalDate.parse('2026-09-28'); // ISO 8601
LocalDate.ofYearDay(2026, 271); // 2026-09-28
LocalDate.today(); // in the system time zone
LocalDate.today('Europe/Berlin'); // in a specific zone
LocalDate.fromDate(new Date(), 'America/New_York'); // from a JS Date
```

### Reading fields

```ts
const date = LocalDate.parse('2026-09-28');

date.year; // 2026
date.month; // 9
date.day; // 28
date.dayOfWeek; // 'monday'
date.dayOfYear; // 271
date.weekOfYear; // 40 (ISO week)
date.daysInMonth; // 30
date.isLeapYear(); // false
```

### Arithmetic

```ts
date.plusDays(3); // 2026-10-01
date.minusWeeks(1); // 2026-09-21
LocalDate.parse('2024-02-29').plusYears(1); // 2025-02-28
date.daysUntil(LocalDate.parse('2026-12-24')); // 87
```

### Adjusting

```ts
date.startOfWeek(); // 2026-09-28 (weeks start on Monday)
date.endOfWeek('sunday'); // 2026-10-03 (for weeks starting on Sunday)
date.endOfMonth(); // 2026-09-30
date.startOfYear(); // 2026-01-01
date.next('friday'); // 2026-10-02
date.previousOrSame('monday'); // 2026-09-28
date.withDay(1); // 2026-09-01
```

### Periods

A `Period` is an amount of calendar time in years, months, weeks and days.

```ts
import { Period } from 'daisy-date';

const notice = Period.parse('P1M2W'); // or Period.of({ months: 1, weeks: 2 })
date.plus(notice); // 2026-11-11
Period.parse('P14M').normalized().toString(); // 'P1Y2M'
LocalDate.parse('2024-02-29').until(LocalDate.parse('2025-02-28')).toString(); // 'P11M30D'
```

### Durations

A `Duration` is an exact amount of clock time in hours, minutes, seconds and milliseconds.

```ts
import { Duration } from 'daisy-date';

const meeting = Duration.parse('PT1H30M'); // or Duration.of({ hours: 1, minutes: 30 })
meeting.toMillis(); // 5400000
Duration.parse('PT90M').equals(meeting); // true (compared by length)
Duration.parse('PT100000S').normalized().toString(); // 'PT27H46M40S'
```

### Dates with a time

A `LocalDateTime` is a date plus a wall-clock time, precise to the millisecond, still without a time zone.

```ts
import { LocalDateTime } from 'daisy-date';

const start = LocalDateTime.parse('2026-09-28T14:30'); // or date.atTime(14, 30)
start.plus(meeting); // 2026-09-28T16:00:00
start.plusHours(10); // 2026-09-29T00:30:00
start.plusMonths(1); // 2026-10-28T14:30:00 (date steps keep the time)
start.startOfMonth(); // 2026-09-01T00:00:00
start.truncatedTo('hour'); // 2026-09-28T14:00:00
start.toLocalDate(); // 2026-09-28
start.until(LocalDateTime.parse('2026-10-01T10:00')); // { period: P2D, duration: PT19H30M }
start.toDate('Europe/Berlin'); // Date for 2026-09-28T12:30:00.000Z
```

### Ranges

A `LocalDateRange` is an inclusive run of days from `start` to `end`. Iterate it like an array:

```ts
import { LocalDateRange } from 'daisy-date';

const trip = LocalDateRange.parse('2026-10-01/2026-10-03'); // or LocalDateRange.of(start, end)

for (const day of trip) {
  console.log(day.toString()); // 2026-10-01, 2026-10-02, 2026-10-03
}
[...trip].map((day) => day.dayOfWeek); // ['thursday', 'friday', 'saturday']
trip.days(); // 3
```

Dates are created one at a time as you iterate, so even a range spanning centuries costs nothing up front.

```ts
LocalDateRange.ofMonth(2026, 2); // 2026-02-01/2026-02-28
LocalDateRange.ofWeek(LocalDate.parse('2026-10-01')); // 2026-09-28/2026-10-04

trip.contains(LocalDate.parse('2026-10-02')); // true
trip.overlaps(LocalDateRange.parse('2026-10-03/2026-10-05')); // true
trip.abuts(LocalDateRange.parse('2026-10-04/2026-10-05')); // true (no gap, no shared day)
trip.intersection(LocalDateRange.parse('2026-10-02/2026-10-09')); // 2026-10-02/2026-10-03
trip.union(LocalDateRange.parse('2026-10-04/2026-10-05')); // 2026-10-01/2026-10-05

LocalDateRange.parse('2026-10-30/2026-11-02').splitBy('month');
// [2026-10-30/2026-10-31, 2026-11-01/2026-11-02]
```

Formatting a range prints the fields both ends share only once:

```ts
trip.format('d MMM yyyy'); // '1–3 Oct 2026'
LocalDateRange.parse('2026-09-28/2026-10-03').format('d MMM yyyy'); // '28 Sep – 3 Oct 2026'
LocalDateRange.parse('2026-12-28/2027-01-03').format(); // 'Dec 28, 2026 – Jan 3, 2027'
```

### Business days

Business days skip weekends. There are no holiday calendars; you only choose which days form the weekend
(Saturday and Sunday by default).

```ts
const friday = LocalDate.parse('2026-10-02');

friday.isBusinessDay(); // true
friday.plusBusinessDays(1); // 2026-10-05 (Monday)
friday.businessDaysUntil(LocalDate.parse('2026-10-09')); // 5 (the Friday counts, the end doesn't)
LocalDateRange.ofMonth(2026, 10).businessDays(); // 22

// A Friday–Saturday weekend
friday.isBusinessDay({ weekend: ['friday', 'saturday'] }); // false
[...LocalDateRange.parse('2026-10-01/2026-10-07').businessDaysIterator()];
// [10-01, 10-02, 10-05, 10-06, 10-07]
```

> **How business days are counted:** `plusBusinessDays(n)` counts business days strictly _after_ the start, like
> Excel's `WORKDAY`. Friday + 1 and Saturday + 1 are both Monday, Sunday − 1 is Friday, and `plusBusinessDays(0)`
> returns the start unchanged, even on a weekend. `businessDaysUntil` counts from the start up to, but not
> including, the end. The same methods exist on `LocalDateTime`, where they keep the time.

### Formatting

Format with [LDML pattern letters](https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table)
(as in `java.time`'s `DateTimeFormatter`) or with a locale preset:

```ts
const date = LocalDate.parse('2026-09-28');

date.format('EEEE, d MMMM yyyy'); // 'Monday, 28 September 2026'
date.format('long'); // 'September 28, 2026'  (presets: short, medium, long, full)
date.format(); // 'Sep 28, 2026'  (the medium preset)
date.format("'Q'Q yyyy, 'week' w"); // 'Q3 2026, week 40'

const start = LocalDateTime.parse('2026-09-28T14:05');
start.format("h:mm a 'on' EEE"); // '2:05 PM on Mon'
start.format('short'); // '9/28/26, 2:05 PM'
```

Text in single quotes is copied as is, and `''` writes a quote. Unknown letters and time fields on a `LocalDate`
throw a `DaisyFormatError`.

| Letters                       | Meaning                                    | Example                        |
| ----------------------------- | ------------------------------------------ | ------------------------------ |
| `y` `yy` `yyyy`               | year                                       | `2026` `26` `2026`             |
| `M` `MM` `MMM` `MMMM` `MMMMM` | month (`L…` for standalone names)          | `9` `09` `Sep` `September` `S` |
| `d` `dd` / `D` `DDD`          | day of month / day of year                 | `8` `08` / `271`               |
| `E` `EEEE` `EEEEE` `EEEEEE`   | weekday                                    | `Mon` `Monday` `M` `Mo`        |
| `e` `c`                       | weekday number from the locale's first day | `1`                            |
| `w` `ww` / `Y`                | ISO week / week-based year                 | `40` / `2026`                  |
| `Q` `QQQ` `QQQQ`              | quarter                                    | `3` `Q3` `3rd quarter`         |
| `a`                           | AM/PM                                      | `PM`                           |
| `H` `h` `K` `k` (×2 pads)     | hour 0–23, 1–12, 0–11, 1–24                | `14` `2` `2` `14`              |
| `m` `s` / `S` `SS` `SSS`      | minute, second / fraction                  | `05` `09` / `0` `04` `045`     |

### Relative text

```ts
const today = LocalDate.parse('2026-09-28'); // a Monday

LocalDate.parse('2026-09-29').formatRelative({ relativeTo: today }); // 'tomorrow'
LocalDate.parse('2026-10-01').formatRelative({ relativeTo: today }); // 'this Thursday'
LocalDate.parse('2026-10-12').formatRelative({ relativeTo: today }); // 'in 2 weeks'
LocalDate.parse('2025-09-28').formatRelative({ relativeTo: today }); // '1 year ago'
LocalDate.parse('2026-10-01').formatRelative({ relativeTo: today, numeric: 'always' }); // 'in 3 days'
LocalDate.parse('2026-10-12').formatRelative({ relativeTo: today, style: 'short' }); // 'in 2 wks'

const noon = LocalDateTime.parse('2026-09-28T12:00');
LocalDateTime.parse('2026-09-28T12:45').formatRelative({ relativeTo: noon }); // 'in 45 minutes'
```

Without `relativeTo`, text is relative to today (or now) in the system time zone. Up to two days away you get
words (`today`, `the day after tomorrow`), up to six days a weekday (`next Friday`, `last Monday`), then days,
weeks, months and years. Date-times less than a day apart use hours, minutes and seconds.

### Parsing

`parse` reads ISO 8601 by default, or any text with a pattern or preset:

```ts
LocalDate.parse('28.09.2026', 'dd.MM.yyyy'); // 2026-09-28
LocalDate.parse('Monday, September 28, 2026', 'full'); // 2026-09-28
LocalDateTime.parse('28.09.2026 2:05 PM', 'dd.MM.yyyy h:mm a'); // 2026-09-28T14:05:00
LocalDate.tryParse('31.02.2026', 'dd.MM.yyyy'); // null instead of an error
```

Parsing is strict by default: `dd` needs two digits, `MMM` needs `Sep` (not `September`), the weekday must match
the date, and nothing may follow. `{ strict: false }` accepts single digits, either name form and trailing text.
Errors carry the `index` where the text stopped matching. Narrow names (`MMMMM`), week fields (`w`, `Y`) and
patterns that can't produce a date (`dd.MM`) throw a `DaisyFormatError`; `yy` means 2000–2099.

```ts
LocalDate.parse('28.9.2026', 'dd.MM.yyyy'); // DaisyParseError: Expected 2 digits for "MM" … at index 3
LocalDate.parse('28.9.2026', 'dd.MM.yyyy', { strict: false }); // 2026-09-28
```

### Locales

English is built in and is the default. A locale holds the names, presets and phrases that formatting uses; pass
one per call or make it the default. German, French and Spanish packs are on the roadmap.

```ts
import { en, getDefaultLocale, setDefaultLocale } from 'daisy-date';
// or: import { en } from 'daisy-date/locale/en';

getDefaultLocale().code; // 'en'
en.months.format.wide[8]; // 'September'
en.ordinal(22); // '22nd'
setDefaultLocale(en); // make a locale the default
date.format('long', { locale: en }); // or pick one per call
```

### Comparing and sorting

```ts
import { compare } from 'daisy-date';

date.isBefore(LocalDate.parse('2026-10-01')); // true
date.equals(LocalDate.of(2026, 9, 28)); // true
[LocalDate.parse('2026-12-24'), date].sort(compare); // [2026-09-28, 2026-12-24]
```

### Standalone functions

Arithmetic, adjusters, period and duration operations are also plain functions that take the value first, so
bundlers can drop what you don't use. Date functions work on both types and return the type they get:

```ts
import { LocalDate, endOfMonth, plusDays } from 'daisy-date';

endOfMonth(plusDays(LocalDate.parse('2026-09-28'), 3)); // 2026-10-31
```

### Converting

```ts
date.toString(); // '2026-09-28'
JSON.stringify({ due: date }); // '{"due":"2026-09-28"}'
date.toDate('UTC'); // Date for 2026-09-28T00:00:00.000Z
```

### Errors

Every error extends `DaisyError` and has a stable `code`:

| Error                      | `code`                 | Thrown when                                   |
| -------------------------- | ---------------------- | --------------------------------------------- |
| `DaisyRangeError`          | `RANGE`                | a value is out of range, such as `2026-02-29` |
| `DaisyParseError`          | `PARSE`                | text can't be parsed; carries `input`         |
| `TemporalUnavailableError` | `TEMPORAL_UNAVAILABLE` | no Temporal implementation is available       |

```ts
import { DaisyError } from 'daisy-date';

try {
  LocalDate.parse(userInput);
} catch (error) {
  if (error instanceof DaisyError && error.code === 'PARSE') {
    // show a validation message
  }
}
```

## Roadmap

daisy is being built in the open, task by task ([task list](./TASK-list/README.md), [specification](./PROJECT.md)).
Coming next:

- German, French and Spanish locale packs
- Period and duration text: `'2 weeks and 3 days'`

## Contributing

See [AGENTS.md](./AGENTS.md) for the code conventions. `npm run check` runs type checking, linting, formatting
and the tests with coverage.
