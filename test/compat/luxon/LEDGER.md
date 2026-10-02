# Luxon test coverage ledger

Every test in Luxon's `test/` folder ([moment/luxon@f427515](https://github.com/moment/luxon/tree/f427515/test), MIT
licence) is accounted for here: translated into daisy's compatibility suite (`test/compat/luxon/`), translated with
daisy's documented value where daisy behaves differently on purpose, or not applicable with the reason. Rows of
Luxon's `test.each` tables count as separate tests.

| Status       | Meaning                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| translated   | The daisy test asserts the value from Luxon's assertion.                                                   |
| differs      | daisy behaves differently on purpose; the test asserts daisy's value and names the documented rule.        |
| n/a          | The feature doesn't exist in daisy (time zones, invalid instances, other calendars, Luxon-only options …). |
| POSSIBLE BUG | daisy's behaviour isn't explained by any documented rule; open until decided.                              |

## Totals

| Luxon file                      |    Tests | Translated | Differs |     n/a | Possible bugs |
| ------------------------------- | -------: | ---------: | ------: | ------: | ------------: |
| `datetime/create.test.js`       |       93 |         32 |      13 |      48 |             0 |
| `datetime/degrade.test.js`      |        1 |          0 |       0 |       1 |             0 |
| `datetime/diff.test.js`         |       24 |         11 |       7 |       6 |             0 |
| `datetime/dst.test.js`          |       23 |          4 |       9 |      10 |             0 |
| `datetime/equality.test.js`     |        7 |          2 |       0 |       5 |             0 |
| `datetime/format.test.js`       |       88 |         14 |       7 |      67 |             0 |
| `datetime/getters.test.js`      |       33 |         23 |       0 |      10 |             0 |
| `datetime/info.test.js`         |        3 |          0 |       0 |       3 |             0 |
| `datetime/invalid.test.js`      |       10 |          2 |       2 |       6 |             0 |
| `datetime/localeWeek.test.js`   |       42 |         25 |       0 |      17 |             0 |
| `datetime/many.test.js`         |       10 |          6 |       0 |       4 |             0 |
| `datetime/math.test.js`         |       53 |         28 |      10 |      15 |             0 |
| `datetime/misc.test.js`         |       15 |          8 |       0 |       7 |             0 |
| `datetime/proto.test.js`        |        1 |          0 |       0 |       1 |             0 |
| `datetime/reconfigure.test.js`  |        6 |          2 |       0 |       4 |             0 |
| `datetime/regexParse.test.js`   |       58 |         14 |      24 |      20 |             0 |
| `datetime/relative.test.js`     |       22 |          7 |       4 |      11 |             0 |
| `datetime/set.test.js`          |       23 |         13 |       0 |      10 |             0 |
| `datetime/toFormat.test.js`     |       83 |         56 |       5 |      22 |             0 |
| `datetime/tokenParse.test.js`   |       75 |         19 |      21 |      35 |             0 |
| `datetime/transform.test.js`    |        7 |          1 |       0 |       6 |             0 |
| `datetime/typecheck.test.js`    |        3 |          0 |       0 |       3 |             0 |
| `datetime/zone.test.js`         |       51 |         21 |       2 |      28 |             0 |
| `duration/accuracy.test.js`     |        3 |          0 |       0 |       3 |             0 |
| `duration/create.test.js`       |       13 |          6 |       1 |       6 |             0 |
| `duration/customMatrix.test.js` |        2 |          0 |       0 |       2 |             0 |
| `duration/equality.test.js`     |       13 |          7 |       0 |       6 |             0 |
| `duration/format.test.js`       |       51 |         18 |       1 |      32 |             0 |
| `duration/getters.test.js`      |       10 |          8 |       1 |       1 |             0 |
| `duration/info.test.js`         |        2 |          0 |       0 |       2 |             0 |
| `duration/invalid.test.js`      |       10 |          0 |       0 |      10 |             0 |
| `duration/math.test.js`         |       21 |         11 |       0 |      10 |             0 |
| `duration/parse.test.js`        |        8 |          2 |       3 |       3 |             0 |
| `duration/proto.test.js`        |        1 |          0 |       0 |       1 |             0 |
| `duration/reconfigure.test.js`  |        4 |          0 |       0 |       4 |             0 |
| `duration/set.test.js`          |        3 |          0 |       0 |       3 |             0 |
| `duration/typecheck.test.js`    |        3 |          0 |       0 |       3 |             0 |
| `duration/units.test.js`        |       43 |          6 |       5 |      32 |             0 |
| `impl/english.test.js`          |       16 |          8 |       3 |       5 |             0 |
| `info/features.test.js`         |        3 |          0 |       0 |       3 |             0 |
| `info/listers.test.js`          |       15 |         10 |       0 |       5 |             0 |
| `info/localeWeek.test.js`       |        7 |          3 |       0 |       4 |             0 |
| `info/zones.test.js`            |       25 |          0 |       0 |      25 |             0 |
| `interval/create.test.js`       |       13 |          2 |       2 |       9 |             0 |
| `interval/format.test.js`       |       30 |          5 |       2 |      23 |             0 |
| `interval/getters.test.js`      |        4 |          1 |       1 |       2 |             0 |
| `interval/info.test.js`         |       45 |          8 |       1 |      36 |             0 |
| `interval/localeWeek.test.js`   |        2 |          0 |       0 |       2 |             0 |
| `interval/many.test.js`         |       47 |         12 |       3 |      32 |             0 |
| `interval/parse.test.js`        |       41 |          4 |      21 |      16 |             0 |
| `interval/proto.test.js`        |        1 |          0 |       0 |       1 |             0 |
| `interval/setter.test.js`       |        3 |          0 |       0 |       3 |             0 |
| `interval/typecheck.test.js`    |        3 |          0 |       0 |       3 |             0 |
| `zones/IANA.test.js`            |       19 |          0 |       0 |      19 |             0 |
| `zones/fixedOffset.test.js`     |       11 |          0 |       0 |      11 |             0 |
| `zones/invalid.test.js`         |        1 |          0 |       0 |       1 |             0 |
| `zones/local.test.js`           |        2 |          0 |       0 |       2 |             0 |
| `zones/zoneInterface.test.js`   |        1 |          0 |       0 |       1 |             0 |
| **All 58 files**                | **1207** |    **399** | **148** | **660** |         **0** |

What the translation found and changed in daisy (2026-10-02): English short unit names now follow CLDR (`2 mths`,
`4 hr`); parse patterns that mix AM/PM with a 24-hour field are rejected; a single `y` reads up to six digits; a
parsed month or day must agree with a day of year; English weeks start on Sunday. Newly documented: the supported
range (Temporal's) and the rejected ISO `24:00`.

## Per file

### datetime/create.test.js

93 tests: 32 translated, 13 differ on purpose, 48 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/create.test.ts`

| line | Luxon test name                                                                                   | status     | daisy test or reason                                                                                                                            |
| ---- | ------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 16   | DateTime.now has today's date                                                                     | translated | create.test.js:16: DateTime.now has today’s date                                                                                                |
| 24   | DateTime.now accepts the default locale                                                           | n/a        | daisy values carry no locale; the locale is a per-call option or setDefaultLocale                                                               |
| 28   | DateTime.now accepts the default numbering system                                                 | n/a        | numbering systems are not supported                                                                                                             |
| 32   | DateTime.now accepts the default output calendar                                                  | n/a        | non-ISO output calendars are not supported                                                                                                      |
| 36   | DateTime.now accepts the default time zone                                                        | n/a        | daisy has no default-zone setting and values have no zone; zones are only an argument of now/today/fromDate/toDate                              |
| 43   | DateTime.local() has today's date                                                                 | translated | create.test.js:43: DateTime.local() has today’s date                                                                                            |
| 51   | DateTime.local(2017) is the beginning of the year                                                 | differs    | create.test.js:51/185/550: of(2017) throws (of requires year, month and day, PROJECT §5.3)                                                      |
| 62   | DateTime.local(2017, 6) is the beginning of the month                                             | differs    | create.test.js:62/196: of(2017, 6) throws (of requires year, month and day)                                                                     |
| 73   | DateTime.local(2017, 6, 12) is the beginning of 6/12                                              | translated | create.test.js:73                                                                                                                               |
| 84   | DateTime.local(2017, 6, 12, 5) is the beginning of the hour                                       | translated | create.test.js:84                                                                                                                               |
| 95   | DateTime.local(2017, 6, 12, 5, 25) is the beginning of the minute                                 | translated | create.test.js:95                                                                                                                               |
| 106  | DateTime.local(2017, 6, 12, 5, 25, 16) is the beginning of the second                             | translated | create.test.js:106                                                                                                                              |
| 117  | DateTime.local(2017, 6, 12, 5, 25, 16, 255) is right down to the millisecond                      | translated | create.test.js:117                                                                                                                              |
| 128  | DateTime.local accepts the default locale                                                         | n/a        | daisy values carry no locale; the locale is a per-call option or setDefaultLocale                                                               |
| 132  | DateTime.local accepts the default numbering system                                               | n/a        | numbering systems are not supported                                                                                                             |
| 136  | DateTime.local accepts the default output calendar                                                | n/a        | non-ISO output calendars are not supported                                                                                                      |
| 140  | DateTime.local does not accept non-integer values                                                 | differs    | create.test.js:140: LocalDateTime.of(2017, 6.7, 12) throws DaisyRangeError (no invalid instances)                                               |
| 145  | DateTime.local accepts the default time zone                                                      | n/a        | daisy has no default-zone setting and values have no zone; zones are only an argument of now/today/fromDate/toDate                              |
| 149  | DateTime.local accepts an options hash in any position                                            | n/a        | options carry zone, numbering system, calendar and locale; none is part of a daisy value                                                        |
| 180  | DateTime.utc() is in utc                                                                          | n/a        | asserts the offset of a zoned instant; daisy values have no offset                                                                              |
| 185  | DateTime.utc(2017) is the beginning of the year                                                   | differs    | create.test.js:51/185/550 (of requires month and day)                                                                                           |
| 196  | DateTime.utc(2017, 6) is the beginning of the month                                               | differs    | create.test.js:62/196 (of requires month and day)                                                                                               |
| 207  | DateTime.utc(2017, 6, 12) is the beginning of 6/12                                                | translated | create.test.js:207: of(…).toDate('UTC') instant                                                                                                 |
| 218  | DateTime.utc(2017, 6, 12, 5) is the beginning of the hour                                         | translated | create.test.js:218                                                                                                                              |
| 229  | DateTime.utc(2017, 6, 12, 5, 25) is the beginning of the minute                                   | translated | create.test.js:229                                                                                                                              |
| 240  | DateTime.utc(2017, 6, 12, 5, 25, 16) is the beginning of the second                               | translated | create.test.js:240                                                                                                                              |
| 251  | DateTime.utc(2017, 6, 12, 5, 25, 16, 255) is right down to the millisecond                        | translated | create.test.js:251                                                                                                                              |
| 262  | DateTime.utc accepts the default locale                                                           | n/a        | daisy values carry no locale; the locale is a per-call option or setDefaultLocale                                                               |
| 266  | DateTime.utc accepts an options hash in any position                                              | n/a        | numbering system, calendar and locale options; not part of a daisy value                                                                        |
| 296  | DateTime.fromJSDate(date) clones the date                                                         | translated | create.test.js:296: LocalDateTime.fromDate, then mutating the Date                                                                              |
| 305  | DateTime.fromJSDate(date) accepts a zone option                                                   | translated | create.test.js:305: fromDate/toDate round trip in America/Santiago (zoneName part n/a)                                                          |
| 313  | DateTime.fromJSDate(date) returns invalid for invalid values                                      | differs    | create.test.js:313: invalid Date throws DaisyRangeError (no invalid instances); non-Date inputs are rejected by the types                       |
| 319  | DateTime.fromJSDate accepts the default locale                                                    | n/a        | daisy values carry no locale; the locale is a per-call option or setDefaultLocale                                                               |
| 323  | DateTime.fromJSDate(date) throw errors for invalid values when throwOnInvalid is true             | translated | create.test.js:323: invalid Date and unknown zone throw DaisyRangeError (string/number inputs rejected by the types)                            |
| 336  | DateTime.fromMillis(ms) has a value of ms                                                         | n/a        | daisy has no epoch factory; epoch millis/seconds of zoned instants are out of scope                                                             |
| 343  | DateTime.fromMillis(ms) accepts a zone option                                                     | n/a        | daisy has no epoch factory; epoch millis/seconds of zoned instants are out of scope                                                             |
| 351  | DateTime.fromMillis accepts the default locale                                                    | n/a        | daisy values carry no locale; the locale is a per-call option or setDefaultLocale                                                               |
| 355  | DateTime.fromMillis(ms) throws InvalidArgumentError for non-numeric input                         | n/a        | daisy has no epoch factory; epoch millis/seconds of zoned instants are out of scope                                                             |
| 359  | DateTime.fromMillis(ms) does not accept out-of-bounds numbers                                     | n/a        | daisy has no epoch factory; epoch millis/seconds of zoned instants are out of scope                                                             |
| 364  | DateTime.fromMillis(ms) does not accept non-finite numbers                                        | n/a        | daisy has no epoch factory; epoch millis/seconds of zoned instants are out of scope                                                             |
| 373  | DateTime.fromSeconds(seconds) has a value of 1000 * seconds                                       | n/a        | daisy has no epoch factory; epoch millis/seconds of zoned instants are out of scope                                                             |
| 380  | DateTime.fromSeconds(ms) accepts a zone option                                                    | n/a        | daisy has no epoch factory; epoch millis/seconds of zoned instants are out of scope                                                             |
| 388  | DateTime.fromSeconds accepts the default locale                                                   | n/a        | daisy values carry no locale; the locale is a per-call option or setDefaultLocale                                                               |
| 392  | DateTime.fromSeconds(seconds) throws InvalidArgumentError for non-numeric input                   | n/a        | daisy has no epoch factory; epoch millis/seconds of zoned instants are out of scope                                                             |
| 396  | DateTime.fromSeconds(seconds) does not accept out-of-bounds numbers                               | n/a        | daisy has no epoch factory; epoch millis/seconds of zoned instants are out of scope                                                             |
| 401  | DateTime.fromSeconds(seconds) does not accept non-finite numbers                                  | n/a        | daisy has no epoch factory; epoch millis/seconds of zoned instants are out of scope                                                             |
| 420  | DateTime.fromObject() sets all the fields                                                         | translated | create.test.js:420 (isOffsetFixed part n/a)                                                                                                     |
| 433  | DateTime.fromObject() accepts a zone option of "utc"                                              | translated | create.test.js:433: toDate('UTC') instant                                                                                                       |
| 446  | DateTime.fromObject() accepts "utc-8" as the zone option                                          | translated | create.test.js:446: toDate('Etc/GMT+8'); daisy takes IANA names, not utc-8                                                                      |
| 460  | DateTime.fromObject() accepts "America/Los_Angeles" as the zone option                            | translated | create.test.js:460: toDate instant at -7h                                                                                                       |
| 474  | DateTime.fromObject() accepts a Zone as the zone option                                           | translated | create.test.js:474: May at -7h, December at -8h                                                                                                 |
| 505  | DateTime.fromObject() rejects invalid zones                                                       | differs    | create.test.js:505: now('blorp') throws DaisyRangeError (no invalid instances)                                                                  |
| 511  | DateTime.fromObject() ignores the case of object keys                                             | n/a        | daisy has no object factory for dates; of takes positional numbers                                                                              |
| 519  | DateTime.fromObject() throws with invalid object key                                              | n/a        | no object factory; the types reject unknown keys                                                                                                |
| 523  | DateTime.fromObject() throws with invalid value types                                             | translated | create.test.js:523: NaN/±Infinity month throws DaisyRangeError (string/boolean/object values rejected by the types)                             |
| 535  | DateTime.fromObject() reject invalid values                                                       | differs    | create.test.js:535: ofYearDay(2017, 5000) and minute -6 throw DaisyRangeError (no invalid instances); Date as millisecond rejected by the types |
| 541  | DateTime.fromObject() defaults high-order values to the current date                              | n/a        | no partial-field factory; of needs year, month and day                                                                                          |
| 550  | DateTime.fromObject() defaults lower-order values to their minimums if a high-order value is set  | differs    | create.test.js:51/185/550 (of requires month and day)                                                                                           |
| 561  | DateTime.fromObject() w/weeks handles fully specified dates                                       | translated | create.test.js:561 and :561/579 — checked in reverse: 2016-01-13 is ISO week 2, Wednesday, week-year 2016 (no week-date factory)                |
| 579  | DateTime.fromObject() w/weekYears handles skew with Gregorian years                               | translated | create.test.js:579 and :561/579 — in reverse: 2014-12-31 is week 1 of 2015, 2010-01-01 week 53 of 2009                                          |
| 597  | DateTime.fromObject() w/weeks defaults high-order values to the current date                      | n/a        | no week-date factory and no defaulting from the current date                                                                                    |
| 606  | DateTime.fromObject() w/weeks defaults low-order values to their minimums                         | n/a        | no week-date factory (week-year setters out of scope)                                                                                           |
| 618  | DateTime.fromObject() w/locale weeks defaults low-order values to their minimums                  | n/a        | locale weeks (localWeekYear) not supported                                                                                                      |
| 630  | DateTime.fromObject() w/locale weeks defaults high-order values to the current date               | n/a        | locale weeks not supported                                                                                                                      |
| 639  | DateTime.fromObject() w/locale weeks handles fully specified dates                                | n/a        | locale weeks not supported                                                                                                                      |
| 660  | DateTime.fromObject() w/locale weeks handles fully specified dates with custom week settings      | n/a        | locale weeks not supported                                                                                                                      |
| 690  | DateTime.fromObject() w/localWeekYears handles skew with Gregorian years                          | n/a        | locale weeks not supported                                                                                                                      |
| 714  | DateTime.fromObject() w/localWeekYears handles skew with Gregorian years and custom week settings | n/a        | locale weeks not supported                                                                                                                      |
| 733  | DateTime.fromObject throws when both locale based weeks and ISO-weeks are specified               | n/a        | locale weeks not supported                                                                                                                      |
| 738  | DateTime.fromObject() w/ordinals handles fully specified dates                                    | translated | create.test.js:738: LocalDate.ofYearDay(2016, 200).atTime(…)                                                                                    |
| 753  | DateTime.fromObject() w/ordinal defaults to the current year                                      | n/a        | ofYearDay requires the year; no defaulting from the current date                                                                                |
| 760  | DateTime.fromObject() returns invalid for invalid values                                          | n/a        | week-number/weekday inputs; daisy has no week-date factory                                                                                      |
| 766  | DateTime.fromObject accepts the default locale                                                    | n/a        | daisy values carry no locale; the locale is a per-call option or setDefaultLocale                                                               |
| 770  | DateTime.fromObject accepts really low year numbers                                               | translated | create.test.js:770: LocalDate.of(5, 1, 1)                                                                                                       |
| 777  | DateTime.fromObject accepts really low year numbers with IANA zones                               | translated | create.test.js:777: year 5 round-trips through America/New_York                                                                                 |
| 784  | DateTime.fromObject accepts plurals and weird capitalization                                      | n/a        | no object factory with unit keys                                                                                                                |
| 791  | DateTime.fromObject validates weekdays                                                            | differs    | create.test.js:791: parse with EEEE throws DaisyParseError for Monday 2005-12-13, accepts Tuesday (no invalid instances)                        |
| 799  | DateTime.fromObject accepts a locale                                                              | n/a        | locale 'be' not supported; values carry no locale                                                                                               |
| 804  | DateTime.fromObject accepts a locale with calendar and numbering identifiers                      | n/a        | BCP 47 locale tags, calendars and numbering systems not supported                                                                               |
| 811  | DateTime.fromObject accepts a locale string with weird junk in it                                 | n/a        | BCP 47 locale tags not supported                                                                                                                |
| 828  | DateTime.fromObject overrides the locale string with explicit settings                            | n/a        | calendars and numbering systems not supported                                                                                                   |
| 843  | DateTime.fromObject handles null as a language tag                                                | n/a        | values carry no locale                                                                                                                          |
| 860  | DateTime.fromRFC2822 parses GMT correctly                                                         | translated | create.test.js:860: pattern d MMM yyyy HH:mm:ss 'GMT' (no RFC 2822 parser; UTC wall clock)                                                      |
| 872  | DateTime.fromRFC2822 parses Zulu correctly                                                        | translated | create.test.js:872: pattern with literal 'Z'                                                                                                    |
| 884  | DateTime.fromRFC2822 parses offset correctly                                                      | n/a        | converts a +0600 offset to UTC; daisy parses no offsets                                                                                         |
| 898  | DateTime.fromRFC2822 is invalid when weekday is not consistent                                    | differs    | create.test.js:898: throws DaisyParseError instead of an invalid instance                                                                       |
| 903  | DateTime.fromHTTP parses rfc1123                                                                  | translated | create.test.js:903: pattern EEE, dd MMM yyyy HH:mm:ss 'GMT'                                                                                     |
| 917  | DateTime.fromHTTP parses rfc850                                                                   | differs    | create.test.js:917: yy is 2000–2099 (PROJECT §6.3, §10 Q4), so 06-Nov-94 is 2094-11-06, a Saturday; 'Sunday' throws DaisyParseError             |
| 931  | DateTime.fromHTTP parses ascii                                                                    | translated | create.test.js:931: pattern EEE MMM d HH:mm:ss yyyy                                                                                             |
| 943  | DateTime.fromHTTP is invalid when weekday is not consistent                                       | differs    | create.test.js:943 (two rows throw DaisyParseError; 'Saturday, 06-Nov-94' parses as 2094-11-06 because yy is 2000–2099)                         |
| 950  | DateTime.fromObject takes a undefined to mean {}                                                  | translated | create.test.js:950: LocalDate.today().year is the JS clock’s year                                                                               |
| 955  | private language subtags don't break unicode subtags                                              | n/a        | BCP 47 locale tags not supported                                                                                                                |
| 970  | DateTime.local works even after time zone change                                                  | translated | create.test.js:970 (fields, plus round trip through America/Chicago; cache reset n/a)                                                           |

### datetime/degrade.test.js

1 tests: 0 translated, 0 differ on purpose, 1 n/a, 0 possible bugs.

Daisy file: none (no translatable case)

| line | Luxon test name                                               | status | daisy test or reason                                                                                                                                      |
| ---- | ------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6    | calling toRelative falls back to English (Helpers.withoutRTF) | n/a    | tests Luxon's fallback when Intl.RelativeTimeFormat is missing; daisy's relative text comes from its own locale packs, never from Intl.RelativeTimeFormat |

### datetime/diff.test.js

24 tests: 11 translated, 7 differ on purpose, 6 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/diff.test.ts`. Luxon `a.diff(b)` is daisy `b.until(a)` / `b.durationUntil(a)` /
`b.daysUntil(a)`.

| line | Luxon test name                                                                   | status     | daisy test or reason                                                                                                                                                                              |
| ---- | --------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 14   | DateTime#diff defaults to milliseconds                                            | translated | diff.test.js:14: durationUntil 12 ms and 0 ms                                                                                                                                                     |
| 21   | DateTime#diff makes simple diffs                                                  | translated | diff.test.js:21: years/months/days via until, weeks via daysUntil (28, 14), hours via durationUntil; the 1/3-day case is in the differs block; the two `quarters` cases are n/a (no quarter unit) |
| 81   | DateTime#diff accepts multiple units                                              | translated | diff.test.js:81: P12D + PT8H45M42S, 24 days, 6 years 12 days, 5 years + 364/363 days                                                                                                              |
| 116  | DateTime#diff handles unmatched units                                             | translated | diff.test.js:116: P5D + PT23H, P0D + PT23H, 143 hours                                                                                                                                             |
| 142  | DateTime#diff sets all its units to 0 if the duration is empty                    | translated | diff.test.js:142                                                                                                                                                                                  |
| 149  | DateTime#diff sets units to 0 if second object is slightly larger                 | translated | diff.test.js:149: -1 ms                                                                                                                                                                           |
| 168  | DateTime#diff puts fractional parts in the lowest order unit                      | differs    | diff.test.js:168: whole units, P1Y28D instead of 1 year 1 − 2/30 months                                                                                                                           |
| 177  | DateTime#diff returns the fractional parts even when it can't find a whole unit   | differs    | diff.test.js:177: P0D + PT4H instead of 1/6 day                                                                                                                                                   |
| 187  | DateTime#diff is calendary for years, months, day                                 | translated | diff.test.js:187: P6Y, 5 years + 364 days, 90 days                                                                                                                                                |
| 209  | DateTime#diff handles fractional years as fractions of those specific years       | differs    | diff.test.js:209: P1Y11M28D instead of 1 + 365/366 years                                                                                                                                          |
| 216  | DateTime#diff handles fractional months as fractions of those specific months     | differs    | diff.test.js:216: P1M30D instead of 1 + 30/31 months                                                                                                                                              |
| 223  | DateTime#diff handles fractional weeks as fractions of those specific weeks       | differs    | diff.test.js:223: P13D + PT23H instead of fractional weeks                                                                                                                                        |
| 234  | DateTime#diff handles fractional days as fractions of those specific days         | differs    | diff.test.js:234: no DST, P1D + PT23H instead of 1 + 24/25 days                                                                                                                                   |
| 245  | DateTime#diff is precise for lower order units                                    | differs    | diff.test.js:245: no DST, 3000 hours instead of 2999                                                                                                                                              |
| 252  | DateTime#diff passes through options                                              | n/a        | conversionAccuracy is a Luxon-only option                                                                                                                                                         |
| 261  | DateTime#diff returns invalid Durations if the DateTimes are invalid              | n/a        | no invalid instances                                                                                                                                                                              |
| 267  | DateTime#diff results in a duration with the same locale                          | n/a        | durations carry no locale or numbering system                                                                                                                                                     |
| 297  | DateTime#diff results works when needing to backtrack months                      | translated | diff.test.js:297: P1D + PT0.09S (0 months, 1 day)                                                                                                                                                 |
| 307  | DateTime#diff handles Feb-29 edge case logic … consistent with DateTime#plus      | translated | diff.test.js:307: P1Y1M3D and start + diff = end                                                                                                                                                  |
| 317  | DateTime#diff handles datetimes whose dayDiff is off by 2 days … zone differences | n/a        | time zones                                                                                                                                                                                        |
| 335  | DateTime#diffNow defaults to milliseconds                                         | translated | diff.test.js:335: fake clock, now('UTC').durationUntil(…).toMillis() = −87523200000                                                                                                               |
| 341  | DateTime#diffNow accepts units                                                    | translated | diff.test.js:341: today('UTC').daysUntil(2014-08-06) = −1013                                                                                                                                      |
| 347  | DateTime#diffNow passes through options                                           | n/a        | conversionAccuracy is Luxon-only                                                                                                                                                                  |
| 353  | DateTime#diffNow returns invalid Durations if the DateTime is invalid             | n/a        | no invalid instances                                                                                                                                                                              |

### datetime/dst.test.js

23 tests: 4 translated, 9 differ on purpose, 10 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/dst.test.ts`

| line | Luxon test name                                                                                                                        | status     | daisy test or reason                                                                                                                                       |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 14   | Hole dates are bumped forward (runs for both fromObject and local; identical in daisy)                                                 | differs    | dst.test.js:14 (two tests): of(2017,3,12,2) stays 02:00 (no DST in arithmetic/values); its toDate('America/New_York') is 07:00Z, Luxon's 03:00 EDT instant |
| 23   | Ambiguous dates pick the one with the current offset (fromObject)                                                                      | differs    | dst.test.js:23/40: toDate always takes the earlier instant, 05:00Z, whatever the clock (PROJECT T09); Luxon gives 06:00Z when now is in January            |
| 40   | Ambiguous dates pick the one with the cached offset (local)                                                                            | differs    | dst.test.js:23/40 (no offset cache in daisy)                                                                                                               |
| 71   | Adding an hour to land on the Spring Forward springs forward (runs for both fromObject and local; identical in daisy)                  | differs    | dst.test.js:71: 01:00 + 1h = 02:00 (no DST in arithmetic); dst.test.js:71/99: it converts to Luxon's 03:00 EDT instant                                     |
| 77   | Subtracting an hour to land on the Spring Forward springs forward (runs for both fromObject and local; identical in daisy)             | differs    | dst.test.js:77: 03:00 − 1h = 02:00 (Luxon 01:00 EST)                                                                                                       |
| 83   | Adding an hour to land on the Fall Back falls back (runs for both fromObject and local; identical in daisy)                            | differs    | dst.test.js:83: 00:00 + 2h = 02:00 (Luxon 01:00 EST)                                                                                                       |
| 89   | Subtracting an hour to land on the Fall Back falls back (runs for both fromObject and local; identical in daisy)                       | differs    | dst.test.js:89: 03:00 − 2h = 01:00 (hour agrees), then − 1h = 00:00 (Luxon 01:00 EDT)                                                                      |
| 99   | Changing a calendar date to land on a hole bumps forward (runs for both fromObject and local; identical in daisy)                      | differs    | dst.test.js:99: ±1 day lands on 2017-03-12T02:00 (Luxon 03:00); dst.test.js:71/99: toDate gives Luxon's instant                                            |
| 109  | Changing a calendar date to land on an ambiguous time chooses the closest one (runs for both fromObject and local; identical in daisy) | translated | dst.test.js:109 (hour 1; offset part n/a)                                                                                                                  |
| 119  | Start of a 0:00->1:00 DST day is 1:00 (runs for both fromObject and local; identical in daisy)                                         | differs    | dst.test.js:119: start of day is 00:00 (no zones in values); toDate('America/Sao_Paulo') moves it to 01:00 -02:00 = 03:00Z, Luxon's instant                |
| 136  | End of a 0:00->1:00 DST day is 23:59 (runs for both fromObject and local; identical in daisy)                                          | translated | dst.test.js:136: endOfDay is 23:59:59.999                                                                                                                  |
| 169  | cache = EDT/EST, now = EDT/EST, date = EDT (4 generated tests)                                                                         | translated | dst.test.js:169: 2017-05-24T15:15:14 in New York is 1495653314000                                                                                          |
| 169  | cache = EDT/EST, now = EDT/EST, date = EST (4 generated tests)                                                                         | translated | dst.test.js:169: 2017-01-15T00:00 in New York is 1484456400000                                                                                             |
| 196  | wasHole is false by default                                                                                                            | n/a        | wasHole does not exist; daisy values have no zone, so no time is a hole                                                                                    |
| 200  | wasHole is set on hole times                                                                                                           | n/a        | wasHole does not exist; daisy values have no zone, so no time is a hole                                                                                    |
| 204  | wasHole is set on hole times with DateTime.local                                                                                       | n/a        | wasHole does not exist; daisy values have no zone, so no time is a hole                                                                                    |
| 208  | wasHole is set on hole times with DateTime.fromISO                                                                                     | n/a        | wasHole does not exist; daisy values have no zone, so no time is a hole                                                                                    |
| 212  | wasHole is false when setting to non-hole                                                                                              | n/a        | wasHole does not exist; daisy values have no zone, so no time is a hole                                                                                    |
| 217  | wasHole is true when setting hole-time on time from hole                                                                               | n/a        | wasHole does not exist; daisy values have no zone, so no time is a hole                                                                                    |
| 223  | wasHole is true when setting hole-time on time from non-hole                                                                           | n/a        | wasHole does not exist; daisy values have no zone, so no time is a hole                                                                                    |
| 229  | wasHole is dropped on math                                                                                                             | n/a        | wasHole does not exist; daisy values have no zone, so no time is a hole                                                                                    |
| 235  | wasHole is kept on reconfigure                                                                                                         | n/a        | wasHole does not exist; daisy values have no zone, so no time is a hole                                                                                    |
| 243  | wasHole is dropped on rezoning                                                                                                         | n/a        | wasHole does not exist; daisy values have no zone, so no time is a hole                                                                                    |

### datetime/equality.test.js

7 tests: 2 translated, 0 differ on purpose, 5 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/equality.test.ts`

| line | Luxon test name                             | status     | daisy test or reason                              |
| ---- | ------------------------------------------- | ---------- | ------------------------------------------------- |
| 5    | equals self                                 | translated | equality.test.js:5                                |
| 10   | equals identically constructed              | translated | equality.test.js:10 (also isBefore/isAfter false) |
| 16   | does not equal a different zone             | n/a        | time zones                                        |
| 22   | does not equal an invalid DateTime          | n/a        | no invalid instances                              |
| 28   | does not equal a different locale           | n/a        | daisy values carry no locale                      |
| 34   | does not equal a different numbering system | n/a        | numbering systems                                 |
| 40   | does not equal a different output calendar  | n/a        | calendars                                         |

### datetime/format.test.js

88 tests: 14 translated, 7 differ on purpose, 67 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/format.test.ts`

| line | Luxon test name                                                                                         | status     | daisy test or reason                                                                                                                           |
| ---- | ------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 71   | DateTime#toJSON() just does toISO                                                                       | differs    | `format.test.js:72 (toJSON)`: daisy toJSON is ISO without offset (PROJECT §2, §5.3): `1982-05-25T09:23:54.123`                                 |
| 78   | DateTime#toISO() shows 'Z' for UTC                                                                      | n/a        | subject is the `Z` designator for UTC; daisy values carry no zone (the toString value itself is covered by line 72)                            |
| 82   | DateTime#toISO() shows the offset, unless explicitly asked                                              | n/a        | offset conversion (toUTC(-360)) and `includeOffset`                                                                                            |
| 88   | DateTime#toISO() supports the 'basic' format                                                            | n/a        | Luxon-only `format: basic` option with `Z`                                                                                                     |
| 92   | DateTime#toISO() suppresses [milli]seconds                                                              | differs    | `:94`–`:103`: daisy toString always drops zero ms and always writes seconds (PROJECT §5.3), no `Z`; suppressSeconds cases keep `:00`           |
| 108  | DateTime#toISO() returns null for invalid DateTimes                                                     | n/a        | invalid DateTimes                                                                                                                              |
| 113  | DateTime#toISO() rounds fractional timezone minute offsets                                              | n/a        | time zone (America/Chicago) and fromMillis                                                                                                     |
| 119  | DateTime#toISO() handles long gregorian format                                                          | differs    | `:121 (toISO)`: year 12345 → `+012345-05-25T09:23:54.123` (no `Z`, §2)                                                                         |
| 124  | DateTime#toISO() handles negative years                                                                 | differs    | `:126 (toISO)`: year -12345 → `-012345-05-25T09:23:54.123` (no `Z`, §2)                                                                        |
| 129  | DateTime#toISO() default to Z when timezone is 00:00                                                    | n/a        | setZone(utc) and `Z`: no zones                                                                                                                 |
| 134  | DateTime#toISO() renders 00:00 for non-offset but non utc datetimes                                     | n/a        | zone Africa/Abidjan offset: no zones                                                                                                           |
| 139  | DateTime#toISO() supports the extendedZone option                                                       | n/a        | `extendedZone` option: no zones                                                                                                                |
| 162  | DateTime#toISO({precision}) truncates time to desired precision                                         | n/a        | Luxon-only `precision` option                                                                                                                  |
| 172  | DateTime#toISO({precision}) throws when the precision is invalid                                        | n/a        | Luxon-only `precision` option / InvalidUnitError                                                                                               |
| 181  | DateTime#toISODate() returns ISO 8601 date                                                              | translated | `:182 (toISODate)`: `toLocalDate().toString()`                                                                                                 |
| 185  | DateTime#toISODate() is local to the zone                                                               | n/a        | offset conversion (toUTC(-600))                                                                                                                |
| 189  | DateTime#toISODate() can output the basic format                                                        | translated | `:190 (toISODate basic)` via pattern `yyyyMMdd`                                                                                                |
| 193  | DateTime#toISODate() returns null for invalid DateTimes                                                 | n/a        | invalid DateTimes                                                                                                                              |
| 197  | DateTime#toISODate() returns ISO 8601 date in format [±YYYYY]                                           | translated | `:199`, `:202`: `LocalDate.of(±118040, 5, 25).toString()`                                                                                      |
| 206  | DateTime#toISODate() correctly pads negative years                                                      | translated | `:207`, `:210`: years -1 and -10                                                                                                               |
| 215  | DateTime#toISODate({precision}) truncates time to desired precision                                     | n/a        | Luxon-only `precision` option                                                                                                                  |
| 225  | DateTime#toISODate({precision}) throws when the precision is invalid                                    | n/a        | Luxon-only `precision` option / InvalidUnitError                                                                                               |
| 234  | DateTime#toISOWeekDate() returns ISO 8601 date                                                          | translated | `:235 (toISOWeekDate)` via pattern `YYYY-'W'ww-e`                                                                                              |
| 238  | DateTime#toISOWeekDate() returns null for invalid DateTimes                                             | n/a        | invalid DateTimes                                                                                                                              |
| 245  | DateTime#toISOTime() returns an ISO 8601 date                                                           | differs    | `:246 (toISOTime)`: pattern `HH:mm:ss.SSS`, no `Z` (no zones, §2)                                                                              |
| 249  | DateTime#toISOTime() won't suppress seconds by default                                                  | differs    | `:250 (toISOTime)`: `truncatedTo('minute')`, no `Z`                                                                                            |
| 253  | DateTime#toISOTime() won't suppress milliseconds by default                                             | differs    | `:254 (toISOTime)`: `truncatedTo('second')`, no `Z`                                                                                            |
| 257  | DateTime#toISOTime({suppressMilliseconds: true}) won't suppress milliseconds if they're nonzero         | n/a        | Luxon-only `suppressMilliseconds` option on toISOTime (with `Z`)                                                                               |
| 261  | DateTime#toISOTime({suppressMilliseconds: true}) will suppress milliseconds if they're zero             | n/a        | Luxon-only `suppressMilliseconds` option on toISOTime (with `Z`)                                                                               |
| 265  | DateTime#toISOTime({suppressSeconds: true}) won't suppress milliseconds if they're nonzero              | n/a        | Luxon-only `suppressSeconds` option on toISOTime (with `Z`)                                                                                    |
| 269  | DateTime#toISOTime({suppressSeconds: true}) will suppress milliseconds if they're zero                  | n/a        | Luxon-only `suppressSeconds` option on toISOTime (with `Z`)                                                                                    |
| 273  | DateTime#toISOTime() handles other offsets                                                              | n/a        | time zone America/New_York                                                                                                                     |
| 277  | DateTime#toISOTime() can omit the offset                                                                | translated | `:278 (toISOTime without offset)` via pattern `HH:mm:ss.SSS`                                                                                   |
| 281  | DateTime#toISOTime() can output the basic format                                                        | n/a        | `basic` format with `Z`/offsets                                                                                                                |
| 289  | DateTime#toISOTime can include the prefix                                                               | n/a        | Luxon-only `includePrefix` option with `Z`                                                                                                     |
| 294  | DateTime#toISOTime() returns null for invalid DateTimes                                                 | n/a        | invalid DateTimes                                                                                                                              |
| 298  | DateTime#toISOTime({precision}) truncates time to desired precision                                     | n/a        | Luxon-only `precision` option                                                                                                                  |
| 308  | DateTime#toISOTime({precision}) throws when the precision is invalid                                    | n/a        | Luxon-only `precision` option / InvalidUnitError                                                                                               |
| 314  | DateTime#toISOTime({precision, suppressSeconds}) suppresses when precision is > 'hour'                  | n/a        | Luxon-only `precision` + `suppressSeconds` options                                                                                             |
| 325  | DateTime#toISOTime({precision, suppressMilliseconds}) suppresses when precision is > 'minute'           | n/a        | Luxon-only `precision` + `suppressMilliseconds` options                                                                                        |
| 340  | DateTime#toRFC2822() returns an RFC 2822 date                                                           | n/a        | RFC 2822 carries a numeric offset (`+0000`, `-0400`): no offsets                                                                               |
| 346  | DateTime#toRFC2822() returns null for invalid DateTimes                                                 | n/a        | invalid DateTimes                                                                                                                              |
| 354  | DateTime#toHTTP() returns an RFC 1123 date                                                              | translated | `:355`, `:357 (toHTTP)` via pattern `EEE, dd MMM yyyy HH:mm:ss 'GMT'` on the UTC wall time; `:356` (New York zone) n/a                         |
| 360  | DateTime#toHTTP() returns null for invalid DateTimes                                                    | n/a        | invalid DateTimes                                                                                                                              |
| 368  | DateTime#toSQLDate() returns SQL date                                                                   | translated | `:369 (toSQLDate)`: `toLocalDate().toString()`; `:370` (New York zone) n/a                                                                     |
| 373  | DateTime#toSQLDate() returns null for invalid DateTimes                                                 | n/a        | invalid DateTimes                                                                                                                              |
| 381  | DateTime#toSQLTime() returns SQL time                                                                   | n/a        | SQL time with offsets: no offsets                                                                                                              |
| 386  | DateTime#toSQLTime() accepts an includeOffset option                                                    | translated | `:387 (toSQLTime without offset)` via pattern `HH:mm:ss.SSS`; `:388` (New York zone) n/a                                                       |
| 391  | DateTime#toSQLTime() accepts an includeOffsetSpace option                                               | n/a        | `includeOffsetSpace` with a New York offset                                                                                                    |
| 397  | DateTime#toSQLTime() accepts an includeZone option                                                      | n/a        | `includeZone`: zone names                                                                                                                      |
| 404  | DateTime#toSQLTime() returns null for invalid DateTimes                                                 | n/a        | invalid DateTimes                                                                                                                              |
| 412  | DateTime#toSQL() returns SQL date time                                                                  | n/a        | SQL with offsets: no offsets                                                                                                                   |
| 417  | DateTime#toSQL() accepts space option                                                                   | n/a        | `includeOffsetSpace` with a New York offset                                                                                                    |
| 423  | DateTime#toSQL() accepts an includeOffset option                                                        | translated | `:424 (toSQL without offset)` via pattern `yyyy-MM-dd HH:mm:ss.SSS`; `:425` (New York zone) n/a                                                |
| 430  | DateTime#toSQL() accepts an includeZone option                                                          | n/a        | `includeZone`: zone names                                                                                                                      |
| 437  | DateTime#toSQL() returns null for invalid DateTimes                                                     | n/a        | invalid DateTimes                                                                                                                              |
| 444  | DateTime#toString() returns the ISO time                                                                | n/a        | offset conversion (toUTC(-360)) with offset in the text                                                                                        |
| 448  | DateTime#toString() returns something different for invalid DateTimes                                   | n/a        | invalid DateTimes                                                                                                                              |
| 455  | DateTime#toLocaleString returns a sensible string by default                                            | translated | `:456 (default, en-US)`: DATE_SHORT text equals pattern `M/d/yyyy`                                                                             |
| 459  | DateTime#toLocaleString lets the locale set the numbering system                                        | n/a        | ja-JP locale                                                                                                                                   |
| 463  | DateTime#toLocaleString accepts locale settings from the dateTime                                       | n/a        | be locale                                                                                                                                      |
| 467  | DateTime#toLocaleString accepts numbering system settings from the dateTime                             | n/a        | numbering systems                                                                                                                              |
| 471  | DateTime#toLocaleString accepts output calendar settings from the dateTime                              | n/a        | output calendars                                                                                                                               |
| 475  | DateTime#toLocaleString accepts options to the formatter                                                | translated | `:476`: `{ weekday: short }` contains `Tue`; pattern `EEE` gives `Tue`                                                                         |
| 479  | DateTime#toLocaleString can override the dateTime's locale                                              | translated | `:480`: fr `short` date preset gives `25/05/1982`                                                                                              |
| 483  | DateTime#toLocaleString can override the dateTime's numbering system                                    | n/a        | numbering systems                                                                                                                              |
| 489  | DateTime#toLocaleString can override the dateTime's output calendar                                     | n/a        | output calendars                                                                                                                               |
| 495  | DateTime#toLocaleString() returns something different for invalid DateTimes                             | n/a        | invalid DateTimes                                                                                                                              |
| 499  | DateTime#toLocaleString() shows things in the right IANA zone                                           | n/a        | time zone America/New_York                                                                                                                     |
| 505  | DateTime#toLocaleString() shows things in the right fixed-offset zone                                   | n/a        | fixed-offset zone UTC-8                                                                                                                        |
| 509  | DateTime#toLocaleString() shows things in the right fixed-offset zone when showing the zone             | n/a        | fixed-offset zone with zone name                                                                                                               |
| 515  | DateTime#toLocaleString() shows things with UTC if fixed-offset zone with 0 offset is used              | n/a        | zone UTC with zone name                                                                                                                        |
| 521  | DateTime#toLocaleString() does the best it can with unsupported fixed-offset zone when showing the zone | n/a        | fixed-offset zone UTC+4:30                                                                                                                     |
| 527  | DateTime#toLocaleString() does the best it can with unsupported fixed-offset zone with timeStyle full   | n/a        | fixed-offset zone with `timeStyle` Intl option                                                                                                 |
| 533  | DateTime#toLocaleString() shows things in the right custom zone                                         | n/a        | custom Zone class                                                                                                                              |
| 539  | DateTime#toLocaleString() shows things in the right custom zone when showing the zone                   | n/a        | custom Zone class                                                                                                                              |
| 545  | DateTime#toLocaleString() shows things in the right custom zone with timeStyle full                     | n/a        | custom Zone class                                                                                                                              |
| 551  | DateTime#toLocaleString uses locale-appropriate time formats                                            | translated | `:552`, `:553` en (`h:mm a`, `HH:mm`), `:556`, `:557` fr (`HH:mm`), `:560`, `:561` es (`H:mm`): Intl presets whose text equals a daisy pattern |
| 564  | DateTime#toLocaleString() respects language tags                                                        | n/a        | BCP 47 language tag with `-u-hc-h23` extension: only en/de/fr/es locale packs                                                                  |
| 570  | DateTime#toLocaleString() accepts a zone even when the zone is set                                      | n/a        | Intl `timeZone`/`timeZoneName` options                                                                                                         |
| 584  | DateTime#resolvedLocaleOpts returns a thing                                                             | n/a        | resolvedLocaleOptions: Luxon locale/numbering/calendar settings                                                                                |
| 592  | DateTime#resolvedLocaleOpts reflects changes to the locale                                              | n/a        | resolvedLocaleOptions: be locale, numbering systems, calendars                                                                                 |
| 606  | DateTime#resolvedLocaleOpts can override with options                                                   | n/a        | resolvedLocaleOptions: be locale, numbering systems, calendars                                                                                 |
| 622  | DateTime#toLocaleParts returns a en-US by default                                                       | n/a        | toLocaleParts: no format-to-parts API in daisy                                                                                                 |
| 632  | DateTime#toLocaleParts accepts locale settings from the dateTime                                        | n/a        | toLocaleParts / be locale                                                                                                                      |
| 642  | DateTime#toLocaleParts can override the dateTime's locale                                               | n/a        | toLocaleParts                                                                                                                                  |
| 652  | DateTime#toLocaleParts accepts date formatting options                                                  | n/a        | toLocaleParts with Intl options                                                                                                                |
| 660  | DateTime#toLocaleParts returns empty for invalid DateTimes                                              | n/a        | toLocaleParts / invalid DateTimes                                                                                                              |

### datetime/getters.test.js

33 tests: 23 translated, 0 differ on purpose, 10 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/getters.test.ts`. The `utc` fixture assertions are covered by the same
wall-clock fixture (daisy values have no zone); the `inv` assertions are n/a (no invalid instances).

| line | Luxon test name                                                    | status     | daisy test or reason                                         |
| ---- | ------------------------------------------------------------------ | ---------- | ------------------------------------------------------------ |
| 13   | DateTime#year returns the year                                     | translated | getters.test.js:13                                           |
| 19   | DateTime#month returns the (1-indexed) month                       | translated | getters.test.js:19                                           |
| 25   | DateTime#day returns the day                                       | translated | getters.test.js:25                                           |
| 31   | DateTime#hour returns the hour                                     | translated | getters.test.js:31                                           |
| 37   | DateTime#minute returns the minute                                 | translated | getters.test.js:37                                           |
| 43   | DateTime#second returns the second                                 | translated | getters.test.js:43                                           |
| 49   | DateTime#millisecond returns the millisecond                       | translated | getters.test.js:49                                           |
| 58   | DateTime#weekYear returns the weekYear                             | translated | getters.test.js:58: format('Y') is '1982'                    |
| 64   | DateTime#weekNumber returns the weekNumber                         | translated | getters.test.js:64: weekOfYear 21                            |
| 70   | DateTime#weekday returns the weekday                               | translated | getters.test.js:70: dayOfWeek 'tuesday'                      |
| 76   | DateTime#weekday returns the weekday for older dates               | translated | getters.test.js:76: 0043-04-04 is 'saturday'                 |
| 84   | DateTime#weekdayShort … en-US                                      | translated | getters.test.js:84: EEE → Tue                                |
| 88   | DateTime#weekdayLong … en-US                                       | translated | getters.test.js:88: EEEE → Tuesday                           |
| 92   | DateTime#weekdayShort … fr                                         | translated | getters.test.js:92: EEE with fr → mar.                       |
| 96   | DateTime#weekdayLong … fr                                          | translated | getters.test.js:96: EEEE with fr → mardi                     |
| 100  | DateTime#weekdayShort returns null for invalid DateTimes           | n/a        | no invalid instances                                         |
| 104  | DateTime#weekdayLong returns null for invalid DateTimes            | n/a        | no invalid instances                                         |
| 111  | DateTime#monthShort returns the short human readable month         | translated | getters.test.js:111: MMM → May                               |
| 115  | DateTime#monthLong returns the human readable month                | translated | getters.test.js:115: MMMM → May                              |
| 119  | DateTime#monthShort returns the short human readable month (April) | translated | getters.test.js:119: minusMonths(1), MMM → Apr               |
| 123  | DateTime#monthLong returns the human readable month (April)        | translated | getters.test.js:123: MMMM → April                            |
| 127  | DateTime#monthShort … fr locale                                    | translated | getters.test.js:127: MMM with fr → avr.                      |
| 131  | DateTime#monthLong … fr locale                                     | translated | getters.test.js:131: MMMM with fr → avril                    |
| 135  | DateTime#monthLong returns null for invalid DateTimes              | n/a        | no invalid instances                                         |
| 139  | DateTime#monthShort returns null for invalid DateTimes             | n/a        | no invalid instances                                         |
| 147  | DateTime#ordinal returns the ordinal                               | translated | getters.test.js:147: dayOfYear 145                           |
| 151  | DateTime#ordinal returns NaN for invalid DateTimes                 | n/a        | no invalid instances                                         |
| 158  | DateTime#get can retrieve any unit                                 | translated | getters.test.js:158: dayOfYear, year, weekOfYear             |
| 164  | DateTime#get returns undefined for invalid units                   | n/a        | no generic get(unit); unknown properties are a compile error |
| 171  | DateTime#locale returns the locale                                 | n/a        | daisy values carry no locale; 'be' is not a supported locale |
| 179  | DateTime#zone returns the time zone                                | n/a        | time zones                                                   |
| 183  | DateTime#zoneName returns the name of the time zone                | n/a        | time zones                                                   |
| 190  | Invalid DateTimes have unhelpful getters                           | n/a        | no invalid instances                                         |

### datetime/info.test.js

3 tests: 0 translated, 0 differ on purpose, 3 n/a, 0 possible bugs.

Daisy file: none (no translatable case)

| line | Luxon test name                                                 | status | daisy test or reason                                        |
| ---- | --------------------------------------------------------------- | ------ | ----------------------------------------------------------- |
| 10   | DateTime#toObject returns the object                            | n/a    | toObject is not part of daisy (fields are getters)          |
| 22   | DateTime#toObject accepts a flag to return config               | n/a    | toObject and locale/numbering/calendar config not supported |
| 37   | DateTime#toObject returns an empty object for invalid DateTimes | n/a    | invalid instances do not exist in daisy; bad input throws   |

### datetime/invalid.test.js

10 tests: 2 translated, 2 differ on purpose, 6 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/invalid.test.ts`

| line | Luxon test name                                       | status     | daisy test or reason                                                                                                                         |
| ---- | ----------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 14   | Explicitly invalid dates are invalid                  | n/a        | DateTime.invalid/invalidReason do not exist in daisy                                                                                         |
| 21   | Invalid creations are invalid                         | differs    | invalid.test.js:21: month 13/day 33 and hour 27 throw DaisyRangeError, a contradicting weekday throws DaisyParseError (no invalid instances) |
| 27   | invalid zones result in invalid dates                 | differs    | invalid.test.js:27: now/today/toDate/fromDate with America/Lasers throw DaisyRangeError (no invalid instances)                               |
| 46   | Invalid DateTimes tell you why                        | n/a        | invalidReason does not exist                                                                                                                 |
| 53   | Invalid DateTimes can provide an extended explanation | n/a        | invalidExplanation does not exist; daisy error messages are not Luxon's                                                                      |
| 65   | Invalid DateTimes return invalid Dates                | n/a        | invalid instances do not exist in daisy; bad input throws                                                                                    |
| 69   | Diffing invalid DateTimes creates invalid Durations   | n/a        | invalid instances do not exist in daisy; bad input throws                                                                                    |
| 74   | throwOnInvalid throws                                 | translated | invalid.test.js:74: contradicting weekday throws DaisyParseError                                                                             |
| 90   | DateTime.invalid throws if you don't provide a reason | n/a        | DateTime.invalid does not exist                                                                                                              |
| 94   | throwOnInvalid throws if year is too big              | translated | invalid.test.js:94: LocalDate.of(9999999, 5, 25) throws DaisyRangeError                                                                      |

### datetime/localeWeek.test.js

42 tests: 25 translated, 0 differ on purpose, 17 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/localeWeek.test.ts`. daisy's `en` pack starts weeks on Monday, so en-US is
written as `{ ...en, firstDayOfWeek: 'sunday' }` (locales are spreadable plain objects, README "Locales").

| line | Luxon test name                                                           | status     | daisy test or reason                                                                                                              |
| ---- | ------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 11   | startOf(week) with useLocaleWeeks adheres to the locale                   | translated | localeWeek.test.js:11: startOfWeek(de / en-US first day)                                                                          |
| 21   | startOf(week) with useLocaleWeeks handles crossing into the previous year | translated | localeWeek.test.js:21                                                                                                             |
| 31   | endOf(week) with useLocaleWeeks adheres to the locale                     | translated | localeWeek.test.js:31                                                                                                             |
| 41   | endOf(week) with useLocaleWeeks handles crossing into the next year       | translated | localeWeek.test.js:41                                                                                                             |
| 51   | hasSame(week) with useLocaleWeeks adheres to the locale                   | translated | localeWeek.test.js:51: LocalDateRange.ofWeek(…, 'sunday').contains(…)                                                             |
| 61   | hasSame(week) with useLocaleWeeks ignores the locale of otherDateTime     | translated | localeWeek.test.js:61: week of the receiver's locale                                                                              |
| 81   | isWeekend in locale en-US reports Saturday and Sunday as weekend          | translated | localeWeek.test.js:81                                                                                                             |
| 88   | isWeekend in locale he reports Friday and Saturday as weekend             | translated | localeWeek.test.js:88: no he pack, weekend passed as option ['friday', 'saturday']                                                |
| 97   | localWeekNumber de-DE: Jan 1 2012 should be week 52, year 2011            | n/a        | locale week numbers (localWeekNumber/localWeekYear)                                                                               |
| 102  | localWeekNumber de-DE: Jan 2 2012 should be week 1, year 2012             | n/a        | locale week numbers                                                                                                               |
| 107  | localWeekNumber de-DE: Jan 8 2012 should be week 1, year 2012             | n/a        | locale week numbers                                                                                                               |
| 112  | localWeekNumber de-DE: Jan 9 2012 should be week 2, year 2012             | n/a        | locale week numbers                                                                                                               |
| 117  | localWeekNumber de-DE: Jan 15 2012 should be week 2, year 2012            | n/a        | locale week numbers                                                                                                               |
| 125  | localWeekNumber en-US: Jan 1 2012 should be week 1, year 2012             | n/a        | locale week numbers                                                                                                               |
| 130  | localWeekNumber en-US: Jan 7 2012 should be week 1, year 2012             | n/a        | locale week numbers                                                                                                               |
| 135  | localWeekNumber en-US: Jan 8 2012 should be week 2, year 2012             | n/a        | locale week numbers                                                                                                               |
| 140  | localWeekNumber en-US: Jan 14 2012 should be week 2, year 2012            | n/a        | locale week numbers                                                                                                               |
| 145  | localWeekNumber en-US: Jan 15 2012 should be week 3, year 2012            | n/a        | locale week numbers                                                                                                               |
| 156  | localWeekday en-US: Sunday should be reported as the 1st day of the week  | translated | localeWeek.test.js:156: format('e') → 1                                                                                           |
| 160  | localWeekday en-US: Monday … 2nd                                          | translated | localeWeek.test.js:160                                                                                                            |
| 164  | localWeekday en-US: Tuesday … 3rd                                         | translated | localeWeek.test.js:164                                                                                                            |
| 168  | localWeekday en-US: Wednesday … 4th                                       | translated | localeWeek.test.js:168                                                                                                            |
| 172  | localWeekday en-US: Thursday … 5th                                        | translated | localeWeek.test.js:172                                                                                                            |
| 176  | localWeekday en-US: Friday … 6th                                          | translated | localeWeek.test.js:176                                                                                                            |
| 180  | localWeekday en-US: Saturday … 7th                                        | translated | localeWeek.test.js:180                                                                                                            |
| 187  | localWeekday de-DE: Monday … 1st                                          | translated | localeWeek.test.js:187: format('e', { locale: de })                                                                               |
| 191  | localWeekday de-DE: Tuesday … 2nd                                         | translated | localeWeek.test.js:191                                                                                                            |
| 195  | localWeekday de-DE: Wednesday … 3rd                                       | translated | localeWeek.test.js:195                                                                                                            |
| 199  | localWeekday de-DE: Thursday … 4th                                        | translated | localeWeek.test.js:199                                                                                                            |
| 203  | localWeekday de-DE: Friday … 5th                                          | translated | localeWeek.test.js:203                                                                                                            |
| 207  | localWeekday de-DE: Saturday … 6th                                        | translated | localeWeek.test.js:207                                                                                                            |
| 211  | localWeekday de-DE: Sunday … 7th                                          | translated | localeWeek.test.js:211                                                                                                            |
| 218  | weeksInLocalWeekYear: 2018 should have 53 weeks in en-US                  | n/a        | locale week numbers (no weeks-in-year)                                                                                            |
| 221  | weeksInLocalWeekYear: 2022 should have 53 weeks in en-US                  | n/a        | locale week numbers                                                                                                               |
| 226  | weeksInLocalWeekYear: 2022 should have 52 weeks in de-DE                  | n/a        | locale week numbers                                                                                                               |
| 229  | weeksInLocalWeekYear: 2020 should have 53 weeks in de-DE                  | n/a        | locale week numbers                                                                                                               |
| 232  | weeksInLocalWeekYear: 2018 should have 52 weeks with minDays 1, start 7   | n/a        | locale week numbers, Settings                                                                                                     |
| 244  | weeksInLocalWeekYear: 2022 should have 53 weeks with minDays 1, start 7   | n/a        | locale week numbers, Settings                                                                                                     |
| 259  | Overridden week info should be reported by Info                           | n/a        | Info/Settings                                                                                                                     |
| 267  | Overridden week info should be reported by DateTime#isWeekend             | translated | localeWeek.test.js:267: weekend option ['monday', 'wednesday']                                                                    |
| 278  | Overridden week info should be respected by DateTime accessors            | translated | localeWeek.test.js:278: weekday part only (format('e') with firstDayOfWeek 'sunday' → 7); localWeekNumber/localWeekYear parts n/a |
| 286  | Overridden week info should be respected by DateTime#set                  | translated | localeWeek.test.js:286: startOfWeek('sunday') of 2022-01-01 → 2021-12-26                                                          |

### datetime/many.test.js

10 tests: 6 translated, 0 differ on purpose, 4 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/many.test.ts`

| line | Luxon test name                                    | status     | daisy test or reason                                                                                      |
| ---- | -------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| 8    | DateTime.min returns the only dateTime if solo     | translated | many.test.js:8: [date].sort(compare)                                                                      |
| 14   | DateTime.min returns the min dateTime              | translated | many.test.js:14                                                                                           |
| 23   | DateTime.min returns undefined if no argument      | translated | many.test.js:23: [].sort(compare).at(0)                                                                   |
| 28   | DateTime.min is stable                             | n/a        | tells equal instants apart by locale; daisy values carry no locale, so equal values are indistinguishable |
| 37   | DateTime.min throws if you don't pass it DateTimes | n/a        | non-date arguments are rejected by compare's types                                                        |
| 49   | DateTime.max returns the only dateTime if solo     | translated | many.test.js:49                                                                                           |
| 55   | DateTime.max returns the max dateTime              | translated | many.test.js:55                                                                                           |
| 64   | DateTime.max returns undefined if no argument      | translated | many.test.js:64                                                                                           |
| 69   | DateTime.max is stable                             | n/a        | tells equal instants apart by locale; daisy values carry no locale                                        |
| 78   | DateTime.max throws if you don't pass it DateTimes | n/a        | non-date arguments are rejected by compare's types                                                        |

### datetime/math.test.js

53 tests: 28 translated, 10 differ on purpose, 15 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/math.test.ts`

| line | Luxon test name                                                              | status     | daisy test or reason                                                                                           |
| ---- | ---------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| 22   | DateTime#plus({ years: 1 }) adds a year                                      | translated | math.test.js:22: plus 1 year                                                                                   |
| 27   | DateTime#plus({quarter: 1}) adds a quarter                                   | n/a        | quarter arithmetic: daisy has no quarters unit                                                                 |
| 33   | DateTime#plus({ months: 1 }) at the end of the month                         | translated | math.test.js:33                                                                                                |
| 40   | DateTime#plus({ months: 1 }) at the end of the month in a leap year          | translated | math.test.js:40                                                                                                |
| 47   | DateTime#plus({ months: 13 }) at the end of the month                        | translated | math.test.js:47                                                                                                |
| 55   | DateTime#plus({ days: 1 }) keeps the same time across a DST                  | translated | math.test.js:55 (no zone; same expected wall time)                                                             |
| 64   | DateTime#plus({ hours: 24 }) gains an hour to spring forward                 | differs    | math.test.js:64: no DST, 2016-03-13T10:00 instead of 11:00                                                     |
| 74   | DateTime#plus({ days:0, hours: 24 }) gains an hour to spring forward         | differs    | math.test.js:74: no DST, 2016-03-13T10:00 instead of 11:00                                                     |
| 83   | DateTime#plus(Duration) adds the right amount of time                        | translated | math.test.js:83 (Period P1D + Duration PT3H28M)                                                                |
| 91   | DateTime#plus(multiple) adds the right amount of time                        | translated | math.test.js:91                                                                                                |
| 99   | DateTime#plus maintains invalidity                                           | n/a        | no invalid instances in daisy                                                                                  |
| 103  | DateTime#plus works across the 100 barrier                                   | translated | math.test.js:103                                                                                               |
| 110  | DateTime#plus works across the 100 barrier when passing through February     | translated | math.test.js:110                                                                                               |
| 117  | DateTime#plus renders invalid when out of max. datetime range using days     | differs    | math.test.js:117: out-of-range throws DaisyRangeError instead of an invalid DateTime                           |
| 122  | DateTime#plus renders invalid when out of max. datetime range using seconds  | differs    | daisy uses Temporal's range, one day wider than Luxon's (PROJECT.md §5.1): the plusSeconds result stays valid  |
| 127  | DateTime#plus renders invalid when out of max. datetime range using IANAZone | n/a        | time zones (setZone)                                                                                           |
| 134  | DateTime#plus handles fractional days                                        | differs    | math.test.js:134: non-integer amounts throw DaisyRangeError                                                    |
| 143  | DateTime#plus handles fractional large units                                 | differs    | math.test.js:143 (weeks, months, years throw; quarters n/a)                                                    |
| 158  | DateTime#plus supports positive and negative duration units                  | translated | math.test.js:158: P1M-1D and P4Y-1D; the 0.5-year part is in the differs block (throws)                        |
| 168  | DateTime#minus({ years: 1 }) subtracts a year                                | translated | math.test.js:168                                                                                               |
| 173  | DateTime#minus({ quarters: 1 }) subtracts a quarter                          | n/a        | quarter arithmetic                                                                                             |
| 180  | DateTime#minus({ months: 1 }) at the end of the month                        | translated | math.test.js:180                                                                                               |
| 187  | DateTime#minus({ months: 1 }) at the end of the month in a leap year         | translated | math.test.js:187                                                                                               |
| 194  | DateTime#minus({ months: 13 }) at the end of the month                       | translated | math.test.js:194                                                                                               |
| 202  | DateTime#minus maintains invalidity                                          | n/a        | no invalid instances                                                                                           |
| 206  | DateTime#minus works across the 100 barrier                                  | translated | math.test.js:206                                                                                               |
| 213  | DateTime#minus renders invalid when out of max. datetime range using days    | differs    | math.test.js:213: throws DaisyRangeError                                                                       |
| 218  | DateTime#minus renders invalid when out of max. datetime range using seconds | differs    | daisy uses Temporal's range, one day wider than Luxon's (PROJECT.md §5.1): the minusSeconds result stays valid |
| 223  | DateTime#plus renders invalid when out of max. datetime range using IANAZone | n/a        | time zones (setZone)                                                                                           |
| 230  | DateTime#minus handles fractional days                                       | differs    | math.test.js:230: throws DaisyRangeError                                                                       |
| 239  | DateTime#minus handles fractional large units                                | differs    | math.test.js:239 (weeks, months, years throw; quarters n/a)                                                    |
| 254  | DateTime#minus supports positive and negative duration units                 | translated | math.test.js:254: P1M-1D and P4Y-1D; 0.5 years in the differs block                                            |
| 266  | DateTime#startOf('year') goes to the start of the year                       | translated | math.test.js:266                                                                                               |
| 278  | DateTime#startOf('quarter') goes to the start of the quarter                 | n/a        | no quarter start in daisy (quarter arithmetic)                                                                 |
| 313  | DateTime#startOf('month') goes to the start of the month                     | translated | math.test.js:313                                                                                               |
| 325  | DateTime#startOf('day') goes to the start of the day                         | translated | math.test.js:325 (startOfDay and truncatedTo('day'))                                                           |
| 337  | DateTime#startOf('hour') goes to the start of the hour                       | translated | math.test.js:337 truncatedTo('hour')                                                                           |
| 349  | DateTime#startOf('minute') goes to the start of the minute                   | translated | math.test.js:349                                                                                               |
| 361  | DateTime#startOf('second') goes to the start of the second                   | translated | math.test.js:361                                                                                               |
| 373  | DateTime#startOf('week') goes to the start of the week                       | translated | math.test.js:373                                                                                               |
| 386  | DateTime#startOf maintains invalidity                                        | n/a        | no invalid instances                                                                                           |
| 390  | DateTime#startOf throws on invalid units                                     | translated | math.test.js:390: truncatedTo('splork' / '') throws DaisyRangeError                                            |
| 398  | DateTime#endOf('year') goes to the start of the year                         | translated | math.test.js:398                                                                                               |
| 410  | DateTime#endOf('quarter') goes to the end of the quarter                     | n/a        | no quarter end in daisy                                                                                        |
| 422  | DateTime#endOf('quarter') goes to the end of the quarter in December         | n/a        | no quarter end in daisy                                                                                        |
| 457  | DateTime#endOf('month') goes to the start of the month                       | translated | math.test.js:457                                                                                               |
| 469  | DateTime#endOf('day') goes to the start of the day                           | translated | math.test.js:469                                                                                               |
| 481  | DateTime#endOf('hour') goes to the start of the hour                         | n/a        | daisy has no endOf for hour/minute/second                                                                      |
| 493  | DateTime#endOf('minute') goes to the start of the minute                     | n/a        | no endOf minute                                                                                                |
| 505  | DateTime#endOf('second') goes to the start of the second                     | n/a        | no endOf second                                                                                                |
| 517  | DateTime#endOf('week') goes to the end of the week                           | translated | math.test.js:517                                                                                               |
| 530  | DateTime#endOf maintains invalidity                                          | n/a        | no invalid instances                                                                                           |
| 534  | DateTime#endOf throws on invalid units                                       | n/a        | daisy's endOf* are fixed methods without a unit argument                                                       |

### datetime/misc.test.js

15 tests: 8 translated, 0 differ on purpose, 7 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/misc.test.ts`

| line | Luxon test name                                                                 | status     | daisy test or reason                                                                                                             |
| ---- | ------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 10   | DateTime#hasSame() can use milliseconds for exact comparisons                   | translated | misc.test.js:10: equals (reconfigure part n/a)                                                                                   |
| 17   | DateTime#hasSame() checks the unit                                              | translated | misc.test.js:17: truncatedTo('day').equals                                                                                       |
| 24   | DateTime#hasSame() checks high-order units                                      | translated | misc.test.js:24: startOfYear/startOfMonth/equals                                                                                 |
| 34   | DateTime#hasSame() ignores time offsets and is symmetric                        | translated | misc.test.js:34: equal wall-clock values (offsets dropped; daisy parses none)                                                    |
| 52   | DateTime#hasSame() returns false for invalid DateTimes                          | n/a        | invalid instances do not exist in daisy; bad input throws                                                                        |
| 64   | DateTime#until() creates an Interval                                            | n/a        | asserts an Interval over now and now + 1 day keeps the same instances; daisy's until returns a Period and ranges hold whole days |
| 73   | DateTime#until() creates an invalid Interval out of an invalid DateTime         | n/a        | invalid instances do not exist in daisy; bad input throws                                                                        |
| 85   | DateTime#isInLeapYear returns the whether the DateTime's year is in a leap year | translated | misc.test.js:85: isLeapYear()                                                                                                    |
| 90   | DateTime#isInLeapYear returns false for invalid DateTimes                       | n/a        | invalid instances do not exist in daisy; bad input throws                                                                        |
| 97   | DateTime#daysInYear returns the number of days in the DateTime's year           | translated | misc.test.js:97                                                                                                                  |
| 102  | DateTime#daysInYear returns NaN for invalid DateTimes                           | n/a        | invalid instances do not exist in daisy; bad input throws                                                                        |
| 109  | DateTime#daysInMonth returns the number of days in the DateTime's month         | translated | misc.test.js:109                                                                                                                 |
| 116  | DateTime#daysInMonth returns NaN for invalid DateTimes                          | n/a        | invalid instances do not exist in daisy; bad input throws                                                                        |
| 123  | DateTime#weeksInWeekYear returns the number of days in the DateTime's year      | translated | misc.test.js:123: no weeksInWeekYear; 28 December’s weekOfYear is the week count                                                 |
| 129  | DateTime#weeksInWeekYear returns NaN for invalid DateTimes                      | n/a        | invalid instances do not exist in daisy; bad input throws                                                                        |

### datetime/proto.test.js

1 tests: 0 translated, 0 differ on purpose, 1 n/a, 0 possible bugs.

Daisy file: none (no translatable case)

| line | Luxon test name                                              | status | daisy test or reason            |
| ---- | ------------------------------------------------------------ | ------ | ------------------------------- |
| 4    | DateTime prototype properties should not throw when accessed | n/a    | prototype test of a Luxon class |

### datetime/reconfigure.test.js

6 tests: 2 translated, 0 differ on purpose, 4 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/reconfigure.test.ts`

| line | Luxon test name                                                          | status     | daisy test or reason                                                                                              |
| ---- | ------------------------------------------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| 17   | DateTime#reconfigure() sets the locale                                   | n/a        | values carry no locale, numbering system or calendar                                                              |
| 24   | DateTime#reconfigure() sets the outputCalendar                           | n/a        | output calendars not supported                                                                                    |
| 31   | DateTime#reconfigure() sets the numberingSystem                          | n/a        | numbering systems not supported                                                                                   |
| 38   | DateTime#reconfigure() with no arguments no opts                         | n/a        | reconfigure does not exist                                                                                        |
| 45   | DateTime#reconfigure() sets the weekSettings                             | translated | reconfigure.test.js:45: startOfWeek('saturday') (firstDay is an argument in daisy; minimalDays/weekend parts n/a) |
| 53   | DateTime#reconfigure() preserves weekSettings when setting other options | translated | reconfigure.test.js:53: startOfWeek('wednesday') (locale part n/a)                                                |

### datetime/regexParse.test.js

58 tests: 14 translated, 24 differ on purpose, 20 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/regexParse.test.ts`. `fromISO` → `LocalDate.parse`/`LocalDateTime.parse` (ISO only,
strict, §5.3 T09 / §6.3 T15); `fromHTTP`/`fromSQL` and UTC-designator RFC 2822 text → pattern parsing with the zone
designator as a literal (its UTC fields are the wall-clock fields).

| line | Luxon test name                                                                                  | status     | daisy test or reason                                                                                                                             |
| ---- | ------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 10   | fromISO() parses as local by default                                                             | translated | `regexParse.test.js:11`                                                                                                                          |
| 23   | fromISO() uses the offset provided, but keeps the dateTime as local                              | n/a        | offsets                                                                                                                                          |
| 36   | fromISO() uses the Z if provided, but keeps the dateTime as local                                | n/a        | offsets (`Z`)                                                                                                                                    |
| 49   | fromISO() optionally adopts the UTC offset provided                                              | n/a        | offsets / setZone                                                                                                                                |
| 103  | fromISO() can optionally specify a zone                                                          | n/a        | zone option                                                                                                                                      |
| 131  | fromISO() accepts both capital T and lowercase t                                                 | n/a        | input carries an offset                                                                                                                          |
| 137  | fromISO() accepts both capital Z and lowercase z                                                 | n/a        | `Z` offset                                                                                                                                       |
| 143  | fromISO() accepts just the year                                                                  | differs    | `regexParse.test.js:144`: throws (ISO parse reads only yyyy-MM-dd)                                                                               |
| 155  | fromISO() accepts year-month                                                                     | differs    | `:156` throws                                                                                                                                    |
| 167  | fromISO() accepts yearmonth                                                                      | differs    | `:168` throws                                                                                                                                    |
| 179  | fromISO() accepts year-month-day                                                                 | translated | `:180`                                                                                                                                           |
| 191  | fromISO() accepts yearmonthday                                                                   | differs    | `:192` throws (basic format)                                                                                                                     |
| 203  | fromISO() accepts extend years                                                                   | translated | `:204`, `:214`                                                                                                                                   |
| 225  | fromISO() accepts year-month-dayThour                                                            | differs    | `:226` throws (minutes required)                                                                                                                 |
| 237  | fromISO() accepts year-month-dayThour:minute                                                     | differs    | `:238` translated; `:248` basic `T0924` throws                                                                                                   |
| 259  | fromISO() accepts year-month-dayThour:minute:second                                              | differs    | `:260` translated; `:270` basic throws                                                                                                           |
| 281  | fromISO() accepts ...second.millisecond                                                          | differs    | translated `:282`, `:322`, `:364`; throws: `:292` basic, `:302` comma, `:312`/`:333`/`:343`/`:354` finer than ms (§5.3: rejected, not truncated) |
| 375  | fromISO() accepts year-week                                                                      | differs    | `:376` throws (no week dates)                                                                                                                    |
| 387  | fromISO() accepts year-week-day                                                                  | differs    | `:388`, `:398` throw                                                                                                                             |
| 409  | fromISO() accepts year-week-dayTtime                                                             | differs    | `:410`, `:420` throw                                                                                                                             |
| 431  | fromISO() accepts year-ordinal                                                                   | differs    | `:432`, `:442` throw                                                                                                                             |
| 453  | fromISO() accepts year-ordinalTtime                                                              | differs    | `:454` throws                                                                                                                                    |
| 465  | fromISO() accepts year-ordinalTtime+offset                                                       | n/a        | offset / setZone                                                                                                                                 |
| 479  | fromISO() accepts hour:minute:second.millisecond                                                 | differs    | `:481` throws (no bare times)                                                                                                                    |
| 492  | fromISO() accepts hour:minute:second,millisecond                                                 | differs    | `:494` throws                                                                                                                                    |
| 505  | fromISO() accepts hour:minute:second                                                             | differs    | `:507` throws                                                                                                                                    |
| 518  | fromISO() accepts hour:minute                                                                    | differs    | `:520` throws                                                                                                                                    |
| 531  | fromISO() accepts hour:minute (duplicate)                                                        | differs    | `:533` throws                                                                                                                                    |
| 544  | fromISO() accepts 24:00                                                                          | differs    | daisy rejects the ISO end-of-day form 24:00 (PROJECT.md §5.3)                                                                                    |
| 556  | fromISO() doesn't accept 24:23                                                                   | translated | `regexParse.test.js:557`                                                                                                                         |
| 560  | fromISO() accepts extended zones                                                                 | n/a        | bracketed IANA zones                                                                                                                             |
| 605  | fromISO() accepts extended zones and offsets                                                     | n/a        | zones / offsets                                                                                                                                  |
| 636  | fromISO() accepts extended zones on bare times                                                   | n/a        | zones                                                                                                                                            |
| 654  | fromISO() accepts extended zones on bare times when UTC and zone are in different days (withNow) | n/a        | zones                                                                                                                                            |
| 676  | fromISO() accepts some technically incorrect stuff                                               | differs    | `:679`, `:689`, `:699` throw (strict ISO)                                                                                                        |
| 710  | fromISO() rejects poop                                                                           | translated | `:714`–`:728` (15 rows); `rejects(null)` is a type error in TS, left out                                                                         |
| 735  | fromRFC2822() accepts full format                                                                | n/a        | offset `+0630`                                                                                                                                   |
| 749  | fromRFC2822 parses a range of dates                                                              | n/a        | offsets and zone abbreviations converted to UTC                                                                                                  |
| 773  | fromRFC2822() rejects incorrect days of the week                                                 | n/a        | offset in the input; weekday agreement is covered in tokenParse `:378`, `:821`                                                                   |
| 778  | fromRFC2822() can elide the day of the week                                                      | n/a        | offset `+0600`                                                                                                                                   |
| 792  | fromRFC2822() can elide seconds                                                                  | n/a        | offset `+0600`                                                                                                                                   |
| 806  | fromRFC2822() can use Z                                                                          | translated | `regexParse.test.js:807` (pattern, `'Z'` literal)                                                                                                |
| 820  | fromRFC2822() can use a weird subset of offset abbreviations                                     | n/a        | `EST` offset conversion                                                                                                                          |
| 834  | fromRFC2822() can use the obsolete UT zone                                                       | translated | `:835` (`'UT'` literal)                                                                                                                          |
| 852  | fromHTTP() can parse RFC 1123                                                                    | translated | `:853`                                                                                                                                           |
| 866  | fromHTTP() can parse RFC 850                                                                     | differs    | `:867`: `yy` 94 is 2094 (§6.3), a Saturday, so `Sunday` throws                                                                                   |
| 880  | fromHTTP() can parse RFC 850 on Wednesday                                                        | translated | `:881`                                                                                                                                           |
| 894  | fromHTTP() can parse ASCII dates with one date digit                                             | translated | `:895`                                                                                                                                           |
| 908  | fromHTTP() can parse ASCII dates with two date digits                                            | translated | `:909`                                                                                                                                           |
| 926  | fromSQL() can parse SQL dates                                                                    | translated | `:927`                                                                                                                                           |
| 940  | fromSQL() can parse SQL times                                                                    | differs    | `:941`: pattern without year/month/day throws `DaisyFormatError` (§6.3)                                                                          |
| 955  | fromSQL() handles times without fractional seconds                                               | differs    | `:956` same                                                                                                                                      |
| 970  | fromSQL() can parse SQL datetimes with sub-millisecond precision                                 | differs    | `:971`, `:983` throw (SSS exact width; ms precision §5.3)                                                                                        |
| 996  | fromSQL() handles deciseconds in SQL datetimes                                                   | translated | `:997`                                                                                                                                           |
| 1010 | fromSQL() handles datetimes without fractional seconds                                           | translated | `:1011`                                                                                                                                          |
| 1024 | fromSQL() accepts a zone to default to                                                           | n/a        | zone option                                                                                                                                      |
| 1039 | fromSQL() can parse an optional offset                                                           | n/a        | offsets                                                                                                                                          |
| 1079 | fromSQL() can parse an optional zone                                                             | n/a        | zones                                                                                                                                            |

### datetime/relative.test.js

22 tests: 7 translated, 4 differ on purpose, 11 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/relative.test.ts`. Luxon `toRelative` (default `numeric: "always"`) maps to
`LocalDateTime#formatRelative({ relativeTo, numeric: 'always' })`; `toRelativeCalendar` maps to `LocalDate#formatRelative`
on the date parts.

| line | Luxon test name                                                               | status     | daisy test or reason                                                                                                                                                                                                                                                                                         |
| ---- | ----------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 11   | DateTime#toRelative works down through the units                              | translated | `relative.test.js:13`…`:29` (16 rows)                                                                                                                                                                                                                                                                        |
| 32   | DateTime#toRelative allows padding                                            | n/a        | Luxon-only `padding` option                                                                                                                                                                                                                                                                                  |
| 40   | DateTime#toRelative takes a round argument                                    | n/a        | Luxon-only `round: false` (fractional units); daisy prints whole numbers                                                                                                                                                                                                                                     |
| 46   | DateTime#toRelative takes a rounding argument                                 | translated | the `trunc` rows `:61`, `:64`, `:67`, `:70` (daisy always rounds toward zero, §6.4 T16); `expand/round/floor/ceil` are a Luxon-only option                                                                                                                                                                   |
| 114  | DateTime#toRelative takes a round and a rounding argument                     | n/a        | Luxon-only `round` + `rounding` options (fractional output)                                                                                                                                                                                                                                                  |
| 184  | DateTime#toRelative takes a unit argument                                     | n/a        | Luxon-only `unit` option (and UTC zone)                                                                                                                                                                                                                                                                      |
| 213  | DateTime#toRelative always rounds toward 0                                    | translated | `relative.test.js:215`, `:216`                                                                                                                                                                                                                                                                               |
| 219  | DateTime#toRelative uses the absolute time                                    | translated | `relative.test.js:222 and 223`                                                                                                                                                                                                                                                                               |
| 226  | DateTime#toRelative works without RTF                                         | translated | `relative.test.js:229`; rows 230–235 use Luxon-only `style: "narrow"`, `unit`, `round` (n/a); daisy never uses Intl.RelativeTimeFormat                                                                                                                                                                       |
| 240  | DateTime#toRelative falls back to English                                     | n/a        | tests the fallback when Intl.RelativeTimeFormat is missing; daisy's `fr` pack has its own phrases                                                                                                                                                                                                            |
| 245  | DateTime#toRelative returns null when used on an invalid date                 | n/a        | no invalid instances                                                                                                                                                                                                                                                                                         |
| 253  | DateTime#toRelativeCalendar uses the calendar                                 | translated | `relative.test.js:256`                                                                                                                                                                                                                                                                                       |
| 259  | toRelativeCalendar picks the correct unit with no options (withNow)           | translated | `relative.test.js:264` (fake timers, default `relativeTo` = today)                                                                                                                                                                                                                                           |
| 268  | ... with no options at last day of month (withNow)                            | differs    | `relative.test.js:273`: daisy says `tomorrow` (special words for ±2 days, §6.4), Luxon `next month`                                                                                                                                                                                                          |
| 277  | ... with no options at last day of year (withNow)                             | differs    | `relative.test.js:282`: `tomorrow` vs Luxon `next year`                                                                                                                                                                                                                                                      |
| 286  | DateTime#toRelativeCalendar returns null when used on an invalid date         | n/a        | no invalid instances                                                                                                                                                                                                                                                                                         |
| 290  | DateTime#toRelativeCalendar works down through the units                      | differs    | translated: `:292`–`:295`, `:301`–`:304`, `:307`; differs (§6.4 weekday-by-calendar-week, weeks rounded down, calendar months/years, no next/last month/year words): `:296` next Monday, `:297` in 1 month, `:298` in 5 months, `:299` in 1 year, `:305` this Tuesday, `:306` 4 weeks ago, `:308` 1 year ago |
| 311  | DateTime#toRelativeCalendar takes a unit argument                             | n/a        | Luxon-only `unit` option                                                                                                                                                                                                                                                                                     |
| 317  | DateTime#toRelativeCalendar works without RTF                                 | differs    | `relative.test.js:319`: `in 1 month` vs Luxon `next month` (§6.4 calendar months)                                                                                                                                                                                                                            |
| 322  | DateTime#toRelativeCalendar falls back to English                             | n/a        | Intl.RelativeTimeFormat fallback; daisy `fr` has its own phrases                                                                                                                                                                                                                                             |
| 327  | toRelativeCalendar works down through the units for different zone than local | n/a        | time zones (`UTC+3`) plus Luxon-only `unit` option                                                                                                                                                                                                                                                           |
| 340  | toRelative works down through the units for different zone than local         | n/a        | time zones (`UTC+3`); the same units are covered by line 11                                                                                                                                                                                                                                                  |

### datetime/set.test.js

23 tests: 13 translated, 0 differ on purpose, 10 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/set.test.ts`

| line | Luxon test name                                                                                | status     | daisy test or reason                                                                                       |
| ---- | ---------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| 14   | DateTime#set() sets Gregorian fields                                                           | translated | set.test.js:14: withYear/Month/Day/Hour/Minute/Second/Millisecond                                          |
| 25   | DateTime#set({ month }) doesn't go to the wrong month                                          | translated | set.test.js:25                                                                                             |
| 32   | DateTime#set({ year }) doesn't wrap leap years                                                 | translated | set.test.js:32                                                                                             |
| 43   | DateTime#set({ weekYear }) sets the date to the same weekNumber/weekday of the target weekYear | translated | set.test.js:43: checks the expected 2017-05-23 is a Tuesday in ISO week 21 (daisy has no week-year setter) |
| 56   | DateTime#set({ weekNumber }) sets the date to the same weekday of the target weekNumber        | translated | set.test.js:56: checks the expected 1982-01-12 is a Tuesday in ISO week 2 (no week setter)                 |
| 68   | DateTime#set({ weekday }) sets the weekday to this week's matching day                         | translated | set.test.js:68: previousOrSame('monday') and startOfWeek()                                                 |
| 80   | DateTime#set({ weekday }) handles week year edge cases                                         | translated | set.test.js:80: endOfWeek() for the four dates                                                             |
| 97   | DateTime#set({ localWeekday }) … (en-US)                                                       | translated | set.test.js:97: weeks starting Sunday (startOfWeek/previousOrSame 'sunday')                                |
| 110  | DateTime#set({ localWeekday }) … (de-DE)                                                       | translated | set.test.js:110: de.firstDayOfWeek                                                                         |
| 123  | DateTime#set({ localWeekday }) handles crossing over into the previous year                    | translated | set.test.js:123                                                                                            |
| 138  | DateTime#set({ localWeekday }) handles crossing over into the previous year (duplicate)        | translated | set.test.js:138                                                                                            |
| 153  | DateTime#set({ localWeekNumber }) … (en-US)                                                    | n/a        | locale week numbers                                                                                        |
| 166  | DateTime#set({ localWeekNumber }) … (de-DE)                                                    | n/a        | locale week numbers                                                                                        |
| 179  | DateTime#set({ localWeekNumber }) … (custom weekSettings)                                      | n/a        | locale week numbers, Settings                                                                              |
| 201  | DateTime#set({ localWeekYear }) … (en-US)                                                      | n/a        | locale week-year setter                                                                                    |
| 215  | DateTime#set({ localWeekNumber }) … (custom weekSettings, duplicate)                           | n/a        | locale week numbers, Settings                                                                              |
| 237  | DateTime#set({ localWeekYear }) … (de-DE)                                                      | n/a        | locale week-year setter                                                                                    |
| 254  | DateTime#set({ ordinal }) sets the date to the ordinal within the current year                 | translated | set.test.js:254: LocalDate.ofYearDay(1982, 200).atTime(…)                                                  |
| 269  | DateTime.set does units in increasing size                                                     | translated | set.test.js:269: withMonth(3).withDay(31)                                                                  |
| 278  | DateTime#set throws for invalid units                                                          | n/a        | no generic set(object); unknown keys are a compile error                                                   |
| 282  | DateTime#set throws for metadata                                                               | n/a        | zone/locale/invalid metadata don't exist on daisy values                                                   |
| 288  | DateTime#set throws for mixing incompatible units                                              | n/a        | no generic set; week/ordinal setters don't exist                                                           |
| 298  | DateTime#set maintains invalidity                                                              | n/a        | no invalid instances                                                                                       |

### datetime/toFormat.test.js

83 tests: 56 translated, 5 differ on purpose, 22 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/toFormat.test.ts`

| line | Luxon test name                                                                    | status     | daisy test or reason                                                                                                                                                    |
| ---- | ---------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 25   | DateTime#toFormat accepts the locale from the DateTime or the options              | translated | `toFormat.test.js:26`/`:27`: `LLLL` with `{ locale: fr }` is `mai`; line 28 (`pt` overridden) dropped: no pt locale, same option path as 27                             |
| 31   | DateTime#toFormat('u') returns fractional seconds                                  | translated | `:32`–`:35`: Luxon `u` = LDML `SSS`                                                                                                                                     |
| 38   | DateTime#toFormat('uu') returns fractional seconds as two digits                   | translated | `:39`–`:41`: Luxon `uu` = LDML `SS`                                                                                                                                     |
| 44   | DateTime#toFormat('uuu') returns fractional seconds as one digit                   | translated | `:45`–`:47`: Luxon `uuu` = LDML `S`                                                                                                                                     |
| 50   | DateTime#toFormat('S') returns the millisecond                                     | translated | `:51 (S)`: `SSS` gives 123; line 54 (`82`, unpadded ms) has no LDML letter (LDML `S` is a fraction); bn locale (52) n/a                                                 |
| 57   | DateTime#toFormat('SSS') returns padded the millisecond                            | translated | `:58`, `:60`; bn locale (59) n/a                                                                                                                                        |
| 63   | DateTime#toFormat('s') returns the second                                          | translated | `:64`, `:66`; bn locale n/a                                                                                                                                             |
| 69   | DateTime#toFormat('ss') returns the padded second                                  | translated | `:70`, `:72`; bn locale n/a                                                                                                                                             |
| 75   | DateTime#toFormat('m') returns the minute                                          | translated | `:76`, `:78`; bn locale n/a                                                                                                                                             |
| 81   | DateTime#toFormat('mm') returns the padded minute                                  | translated | `:82`, `:84`; bn locale n/a                                                                                                                                             |
| 87   | DateTime#toFormat('h') returns the hours                                           | translated | `:88`, `:90`, `:92`, `:93`; bn n/a; hour 24 (91) rolls over in Luxon, daisy rejects hour 24 with DaisyRangeError (no invalid/overflowing values)                        |
| 96   | DateTime#toFormat('hh') returns the padded hour (12-hour time)                     | translated | `:97`, `:101`, `:102`; bn n/a; lines 99/100 repeat the `h` cases of line 87 (hour 24 as above)                                                                          |
| 105  | DateTime#toFormat('H') returns the hour (24-hour time)                             | translated | `:106`, `:108`, `:109`; bn n/a                                                                                                                                          |
| 112  | DateTime#toFormat('HH') returns the padded hour (24-hour time)                     | translated | `:113`, `:115`, `:116`; bn n/a                                                                                                                                          |
| 119  | DateTime#toFormat('Z') returns the narrow offset                                   | n/a        | offset `Z` token: daisy values carry no offset                                                                                                                          |
| 127  | DateTime#toFormat('ZZ') returns the padded offset                                  | n/a        | offset `ZZ`: no offsets                                                                                                                                                 |
| 135  | DateTime#toFormat('ZZZ') returns a numerical offset                                | n/a        | offset `ZZZ`: no offsets                                                                                                                                                |
| 143  | DateTime#toFormat('ZZZZ') returns the short offset name                            | n/a        | offset name `ZZZZ`: no zones                                                                                                                                            |
| 149  | DateTime#toFormat('ZZZZZ') returns the full offset name                            | n/a        | offset name `ZZZZZ`: no zones                                                                                                                                           |
| 155  | DateTime#toFormat('z') returns the zone name                                       | n/a        | zone name `z`: no zones                                                                                                                                                 |
| 163  | DateTime#toFormat('a') returns the meridiem                                        | translated | `:164`, `:166`; `my` locale (165, 167) n/a                                                                                                                              |
| 170  | DateTime#toFormat('d') returns the day                                             | translated | `:171`, `:172`                                                                                                                                                          |
| 175  | DateTime#toFormat('dd') returns the padded day                                     | translated | `:176`, `:177`                                                                                                                                                          |
| 180  | DateTime#toFormat('E' \|\| 'c') returns weekday number                             | translated | `:181 (E)`, `:182 (c)`: Luxon number `E`/`c` = LDML `e`/`c`                                                                                                             |
| 185  | DateTime#toFormat('EEE') returns short format weekday name                         | translated | `:186`; `:187` de `Di.` (in the locale table)                                                                                                                           |
| 190  | DateTime#toFormat('ccc') returns short standalone weekday name                     | differs    | `:191 (ccc)` en `Tue` via `EEE` (translated); `:192 (ccc)` in the differs block: daisy weekday names have no standalone form (PROJECT §6.1), so de gives `Di.` not `Di` |
| 195  | DateTime#toFormat('EEEE') returns the full format weekday name                     | translated | `:196`                                                                                                                                                                  |
| 199  | DateTime#toFormat('cccc') returns the full standalone weekday name                 | translated | `:200 (cccc)` via `EEEE`                                                                                                                                                |
| 203  | DateTime#toFormat('EEEEE' \|\| 'ccccc') returns narrow weekday name                | translated | `:204`, `:205 (ccccc)` via `EEEEE`                                                                                                                                      |
| 208  | DateTime#toFormat('M' \|\| 'L') return the month number                            | translated | `:209`, `:210`                                                                                                                                                          |
| 213  | DateTime#toFormat('MM' \|\| 'LL') return the padded month number                   | translated | `:214`                                                                                                                                                                  |
| 217  | DateTime#toFormat('MMM') returns the short format month name                       | translated | `:218`, `:219` (de `Mai`), `:220`                                                                                                                                       |
| 223  | DateTime#toFormat('LLL') returns the short standalone month name                   | translated | `:224`, `:225` (de `Mai`), `:226`                                                                                                                                       |
| 229  | DateTime#toFormat('MMMM') returns the full format month name                       | translated | `:230`, `:231`; ru locale (232) n/a                                                                                                                                     |
| 235  | DateTime#toFormat('LLLL') returns the full standalone month name                   | translated | `:236`, `:237`                                                                                                                                                          |
| 240  | DateTime#toFormat('MMMMM' \|\| 'LLLLL') returns the narrow month name              | translated | `:241`, `:242`                                                                                                                                                          |
| 245  | DateTime#toFormat('y') returns the full year                                       | translated | `:246`, `:248` (year 3); bn n/a                                                                                                                                         |
| 251  | DateTime#toFormat('yy') returns the two-digit year                                 | translated | `:252`, `:254`; bn n/a                                                                                                                                                  |
| 257  | DateTime#toFormat('yyyy') returns the padded full year                             | translated | `:258`, `:260`; bn n/a (258, 261)                                                                                                                                       |
| 264  | DateTime#toFormat('yyyy') returns the padded full year                             | translated | `:266`, `:269` (Jan 1 of 36000 / 17)                                                                                                                                    |
| 272  | DateTime#toFormat('yyyyyy') returns the padded extended year                       | translated | `:274`, `:277`, `:279`, `:282`                                                                                                                                          |
| 285  | DateTime#toFormat('G') returns the short era                                       | n/a        | era `G`: daisy has no era field (not in PROJECT §6.2)                                                                                                                   |
| 292  | DateTime#toFormat('GG') returns the full era                                       | n/a        | era `GG`: no era field                                                                                                                                                  |
| 297  | DateTime#toFormat('GGGGG') returns the narrow era                                  | n/a        | era `GGGGG`: no era field                                                                                                                                               |
| 302  | DateTime#toFormat('W') returns the week number                                     | translated | `:303 (W)` via `w`; `:304` with 1982-02-02 (Luxon week 5, same weekday)                                                                                                 |
| 307  | DateTime#toFormat('WW') returns the padded week number                             | translated | `:308 (WW)`, `:309` via `ww`                                                                                                                                            |
| 312  | DateTime#toFormat('kk') returns the abbreviated week year                          | translated | `:313 (kk)` via `YY`                                                                                                                                                    |
| 316  | DateTime#toFormat('kkkk') returns the full week year                               | translated | `:317 (kkkk)` via `YYYY`                                                                                                                                                |
| 320  | DateTime#toFormat('o') returns an unpadded ordinal                                 | translated | `:321`, `:322`, `:323` (o → `D`)                                                                                                                                        |
| 326  | DateTime#toFormat('ooo') returns an unpadded ordinal                               | translated | `:327`, `:328`, `:329` (ooo → `DDD`)                                                                                                                                    |
| 332  | DateTime#toFormat('q') returns an unpadded quarter                                 | translated | `:333`, `:334` (q → `Q`)                                                                                                                                                |
| 337  | DateTime#toFormat('qq') returns a padded quarter                                   | translated | `:338`, `:339` (qq → `QQ`)                                                                                                                                              |
| 342  | DateTime#toFormat('D') returns a short date representation                         | translated | `:343 (D)` via pattern `M/d/yyyy` (en short preset is `M/d/yy`); `:344` fr `short` preset                                                                               |
| 347  | DateTime#toFormat('DD') returns a medium date representation                       | translated | `:348`–`:351` `medium` preset, en and fr                                                                                                                                |
| 354  | DateTime#toFormat('DDD') returns a long date representation                        | translated | `:355`–`:358` `long` preset, en and fr                                                                                                                                  |
| 363  | DateTime#toFormat('DDDD') returns a long date representation                       | translated | `:364`–`:367` `full` preset, en and fr                                                                                                                                  |
| 372  | DateTime#toFormat('t') returns a short time representation                         | translated | `:373`–`:376` (en `h:mm a`, fr `HH:mm`)                                                                                                                                 |
| 379  | DateTime#toFormat('T') returns a short 24-hour time representation                 | translated | `:380`–`:383` (`HH:mm`)                                                                                                                                                 |
| 386  | DateTime#toFormat('tt') returns a medium time representation                       | translated | `:387`–`:390` (en `h:mm:ss a`, fr `HH:mm:ss`)                                                                                                                           |
| 393  | DateTime#toFormat('TT') returns a medium 24-hour time representation               | translated | `:394`–`:397` (`HH:mm:ss`)                                                                                                                                              |
| 400  | DateTime#toFormat('ttt') returns a medium time representation                      | n/a        | test body has no assertions (all commented out in Luxon)                                                                                                                |
| 408  | DateTime#toFormat('TTT') returns a medium time representation                      | n/a        | test body has no assertions (all commented out in Luxon)                                                                                                                |
| 416  | DateTime#toFormat('f') returns a short date/time representation without seconds    | translated | `:417`, `:418` (pattern `M/d/yyyy, h:mm a`), `:419`, `:420` (fr `short` preset)                                                                                         |
| 423  | DateTime#toFormat('ff') returns a medium date/time representation without seconds  | translated | `:424`–`:426` en pattern, `:427`, `:428`, `:431` fr pattern `d MMM yyyy, HH:mm`                                                                                         |
| 436  | DateTime#toFormat('fff') returns a medium date/time representation without seconds | differs    | `:437`–`:444 (fff)`: no zones (PROJECT §2), so the zone name (EDT, UTC−4) is left out of the expectation                                                                |
| 449  | DateTime#toFormat('ffff') returns a long date/time representation without seconds  | differs    | `:450`–`:463 (ffff)`: zone name left out (no zones)                                                                                                                     |
| 468  | DateTime#toFormat('F') returns a short date/time representation with seconds       | translated | `:469`, `:470` en pattern, `:471`, `:472` fr pattern `dd/MM/yyyy HH:mm:ss`                                                                                              |
| 477  | DateTime#toFormat('FF') returns a medium date/time representation with seconds     | translated | `:478`–`:485 (FF)` `medium` preset, en and fr                                                                                                                           |
| 490  | DateTime#toFormat('FFF') returns a medium date/time representation without seconds | differs    | `:491`–`:498 (FFF)`: en `long` preset / fr pattern, zone name left out (no zones)                                                                                       |
| 503  | DateTime#toFormat('FFFF') returns a long date/time representation without seconds  | differs    | `:504`–`:517 (FFFF)`: en `full` preset / fr pattern, zone name left out (no zones)                                                                                      |
| 522  | DateTime#toFormat returns a full formatted string                                  | n/a        | uses era `GG`: no era field                                                                                                                                             |
| 526  | DateTime#toFormat() accepts literals in single quotes                              | translated | `:527`, `:528`                                                                                                                                                          |
| 531  | DateTime#toFormat allows escaping of single quotes                                 | translated | `:532`                                                                                                                                                                  |
| 535  | DateTime#toFormat() uses the numbering system                                      | n/a        | numbering systems                                                                                                                                                       |
| 540  | DateTime#toFormat() uses the output calendar                                       | n/a        | output calendars                                                                                                                                                        |
| 545  | DateTime#toFormat() returns something different for invalid DateTimes              | n/a        | invalid DateTimes                                                                                                                                                       |
| 549  | DateTime#toFormat('X') returns a Unix timestamp in seconds                         | n/a        | Unix seconds `X`: epoch of a zoned instant                                                                                                                              |
| 553  | DateTime#toFormat('X') rounds down                                                 | n/a        | Unix seconds `X`: epoch of a zoned instant                                                                                                                              |
| 557  | DateTime#toFormat('x') returns a Unix timestamp in milliseconds                    | n/a        | Unix millis `x`: epoch of a zoned instant                                                                                                                               |
| 561  | DateTime#toFormat('n')                                                             | n/a        | locale week `n`: locale weeks                                                                                                                                           |
| 566  | DateTime#toFormat('nn')                                                            | n/a        | locale week `nn`: locale weeks                                                                                                                                          |
| 571  | DateTime#toFormat('ii')                                                            | n/a        | locale week-year `ii`: locale weeks                                                                                                                                     |
| 576  | DateTime#toFormat('iiii')                                                          | n/a        | locale week-year `iiii`: locale weeks                                                                                                                                   |

### datetime/tokenParse.test.js

75 tests: 19 translated, 21 differ on purpose, 35 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/tokenParse.test.ts`. `fromFormat` → `LocalDate.parse` / `LocalDateTime.parse`
with a pattern (strict by default). Luxon tokens mapped to LDML: `u`→`S`, `uu`→`SS`, `uuu`→`S`, `ccc`→`EEE`, `cccc`→`EEEE`,
`o`/`ooo`→`D`/`DDD`, `q`/`qq`→`Q`/`QQ`, `E`/`c` number→`e`/`c`, `W`→`w`, `kk`/`kkkk`→`YY`/`YYYY`. Luxon fills missing fields
(Jan 1, today); where only that default mattered, the input is embedded in a full date (`yyyy-MM-dd` prefix/suffix).

| line | Luxon test name                                                            | status     | daisy test or reason                                                                                                                                                                                                                                                           |
| ---- | -------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 10   | fromFormat() parses basic times                                            | translated | `tokenParse.test.js:11`                                                                                                                                                                                                                                                        |
| 21   | fromFormat() yields Invalid reason 'unparseable' for incompatible formats  | translated | `:22` throws (`dd` needs two digits)                                                                                                                                                                                                                                           |
| 27   | fromFormat() parses with variable-length input                             | differs    | `:28` translated (Luxon `S` 004 = `SSS`); `:37` differs: `yy` 82 → 2082 and `S` reads a fraction (.4 = 400 ms), §6.3                                                                                                                                                           |
| 47   | fromFormat() parses meridiems                                              | translated | `:48`, `:54`, `:60`, `:66`                                                                                                                                                                                                                                                     |
| 73   | fromFormat() throws if you specify meridiem with 24-hour time              | translated | Found a bug: daisy ignored the PM; patterns mixing H/k with a are now rejected with DaisyFormatError. `tokenParse.test.js:73: throws if you specify meridiem with 24-hour time`                                                                                                |
| 78   | fromFormat() rejects 12-hour values outside [1, 12] with a meridiem        | translated | `:79`–`:82` reject, `:85`–`:88` parse                                                                                                                                                                                                                                          |
| 92   | fromFormat() makes dots optional and handles non breakable spaces          | differs    | `:102`, `:107` translated (es `a. m.`/`p. m.`); the 14 dotless / NBSP forms throw (es day periods use plain spaces and must match, §6.1/§6.3)                                                                                                                                  |
| 126  | fromFormat() parses variable-digit years                                   | translated | `:127`–`:131`, `:134`, and (after fixing a bug: `y` read at most 4 digits) `:132`/`:133`: 22222 and 222222 parse with `y-MM-dd`                                                                                                                                                |
| 137  | fromFormat() with yyyyy optionally parses extended years                   | differs    | `:138`, `:140`, `:142` translated; `:139` (4 digits) and `:141` (6 digits) throw in strict mode (exact width, §6.3); `:139` parses in lenient mode                                                                                                                             |
| 145  | fromFormat() with yyyyyy strictly parses extended years                    | translated | `:146`–`:149`                                                                                                                                                                                                                                                                  |
| 152  | fromFormat() defaults yy to the right century                              | differs    | `:153` translated; `:154` 61 → 2061 (yy = 2000–2099); `:155` 1960 throws strict, lenient reads 1960                                                                                                                                                                            |
| 158  | respects Settings.twoDigitCutoffYear when parsing yy                       | n/a        | `Settings`                                                                                                                                                                                                                                                                     |
| 171  | fromFormat() parses hours                                                  | differs    | `:176`–`:179` translated (H/HH); `:172`–`:175` `h`/`hh` without `a` throw `DaisyFormatError` (§6.3)                                                                                                                                                                            |
| 182  | fromFormat() parses milliseconds                                           | differs    | translated `:185`, `:186`, `:192`–`:196`; `:183`, `:184`, `:188`, `:189` Luxon `S` is unpadded ms, daisy `S` is a fraction (.1 = 100 ms, §6.3)                                                                                                                                 |
| 199  | fromFormat() parses fractional seconds                                     | differs    | translated `:200`–`:204`, `:209`–`:211`, `:213`, `:214`; `:205`, `:206` 4 digits throw (§5.3 ms precision); `:208` `SS` needs 2 digits in strict mode                                                                                                                          |
| 217  | fromFormat() parses weekdays                                               | differs    | `:221`, `:222`, `:224`, `:225` translated (embedded in a date); `:218` (`E`→`e`), `:219` (`c`) are format-only, `DaisyFormatError`                                                                                                                                             |
| 228  | fromFormat() parses eras                                                   | n/a        | no era symbol `G`; daisy uses signed ISO years                                                                                                                                                                                                                                 |
| 239  | fromFormat() parses variable-length days                                   | translated | `:240`, `:243`                                                                                                                                                                                                                                                                 |
| 247  | fromFormat() parses fixed-length days                                      | translated | `:248`, `:251`                                                                                                                                                                                                                                                                 |
| 255  | fromFormat() parses standalone month names                                 | translated | `:256`–`:271`, fr `:276`, `:281`                                                                                                                                                                                                                                               |
| 287  | fromFormat() parses format month names                                     | translated | `:288`–`:303`, fr `:308`, `:313`                                                                                                                                                                                                                                               |
| 319  | fromFormat() parses quarters                                               | differs    | `:320`–`:331` throw `DaisyFormatError`: a quarter doesn't make a date, the pattern needs month and day or D (§6.3)                                                                                                                                                             |
| 334  | fromFormat() makes trailing periods in month names optional                | differs    | `:335` fr `janv` throws (exact name forms, §6.3)                                                                                                                                                                                                                               |
| 343  | fromFormat() does not match arbitrary stuff with those periods             | translated | `:344`                                                                                                                                                                                                                                                                         |
| 350  | fromFormat() uses case-insensitive matching                                | translated | `:351`                                                                                                                                                                                                                                                                         |
| 359  | fromFormat() parses offsets                                                | n/a        | empty test body (and offsets)                                                                                                                                                                                                                                                  |
| 361  | fromFormat() validates weekday numbers                                     | differs    | `:362`, `:367`: numeric weekday `e` is format-only, `DaisyFormatError`                                                                                                                                                                                                         |
| 371  | fromFormat() validates weekday names                                       | translated | `:372`, `:378`, fr `:381`                                                                                                                                                                                                                                                      |
| 390  | fromFormat() defaults weekday to this week                                 | differs    | `:391` `EEEE` alone and `:398` `e` throw `DaisyFormatError` (no year/day; `e` format-only)                                                                                                                                                                                     |
| 403  | fromFormat() parses ordinals                                               | translated | `:404`, `:408`, `:412`, `:416`, `:420`                                                                                                                                                                                                                                         |
| 425  | fromFormat() throws on mixed units                                         | differs    | `:427` differs (`ww` is format-only, DaisyFormatError). `:431` found a bug: daisy ignored a month contradicting the day of year; a parsed month or day must now agree with the date → `tokenParse.test.js:431: throws when a month contradicts the day of year`                |
| 435  | fromFormat() accepts weekYear by itself                                    | differs    | `:436`, `:441`: `YYYY`/`YY` are format-only (§6.3)                                                                                                                                                                                                                             |
| 447  | fromFormat() defaults kk to the right century                              | differs    | `:448`–`:450`: `YY` format-only                                                                                                                                                                                                                                                |
| 453  | respects Settings.twoDigitCutoffYear when parsing two digit weekYear       | n/a        | `Settings`, week year                                                                                                                                                                                                                                                          |
| 466  | fromFormat() accepts weekNumber by itself                                  | differs    | `:469`, `:474`: `w` format-only                                                                                                                                                                                                                                                |
| 480  | fromFormat() accepts weekYear/weekNumber/weekday                           | differs    | `:481`: `YYYY ww e` format-only                                                                                                                                                                                                                                                |
| 487  | fromFormat() allows regex content                                          | differs    | `:488`: `EEEE` alone has no year, `DaisyFormatError`                                                                                                                                                                                                                           |
| 495  | fromFormat() allows literals                                               | translated | `:496`                                                                                                                                                                                                                                                                         |
| 507  | fromFormat() returns invalid when unparsed                                 | translated | `:508` (embedded in a date)                                                                                                                                                                                                                                                    |
| 511  | fromFormat() returns invalid when quarter value is not valid               | translated | `:512`–`:516` (embedded with `MM-dd`, quarter must agree)                                                                                                                                                                                                                      |
| 519  | fromFormat() returns invalid for out-of-range values                       | differs    | `:524`–`:527` translated; `:523` `e` is format-only (`DaisyFormatError`)                                                                                                                                                                                                       |
| 530  | fromFormat() accepts a zone argument                                       | n/a        | zones                                                                                                                                                                                                                                                                          |
| 545  | fromFormat() parses IANA zones                                             | n/a        | zones                                                                                                                                                                                                                                                                          |
| 562  | fromFormat() with setZone parses IANA zones and sets it                    | n/a        | zones                                                                                                                                                                                                                                                                          |
| 572  | fromFormat() parses fixed offsets                                          | n/a        | offsets                                                                                                                                                                                                                                                                        |
| 592  | fromFormat() with setZone parses fixed offsets and sets it                 | n/a        | offsets                                                                                                                                                                                                                                                                        |
| 614  | fromFormat() prefers IANA zone id                                          | n/a        | zones                                                                                                                                                                                                                                                                          |
| 632  | fromFormat() ignores numerical offsets when they conflict with the zone    | n/a        | zones                                                                                                                                                                                                                                                                          |
| 651  | fromFormat() ignores numerical offsets when they are are wrong right now   | n/a        | zones / DST                                                                                                                                                                                                                                                                    |
| 670  | fromFormat() maintains offset that belongs to time zone during overlap     | n/a        | zones / DST                                                                                                                                                                                                                                                                    |
| 705  | format() uses local zone when setZone is false and offset in input         | n/a        | zones                                                                                                                                                                                                                                                                          |
| 721  | format() uses local zone when setZone is false and zone id in input        | n/a        | zones                                                                                                                                                                                                                                                                          |
| 739  | fromFormat() parses localized macro tokens                                 | differs    | presets round-trip in en and de: D/DD/DDD/DDDD → date `short/medium/long/full`, FF → date-time `medium` (translated); FFF/FFFF → `long`/`full` read back in daisy (no zone name), Luxon invalid; t/T/tt/TT/F n/a (no time-only value, no short-with-seconds preset); en-gb n/a |
| 807  | allows non-breaking white-space to be substituted inside macro-tokens      | n/a        | time-only `t` preset (no time-of-day value) and Intl's U+202F output, which daisy's locale data doesn't emit                                                                                                                                                                   |
| 813  | fromFormat() throws if you don't provide a format                          | differs    | `:814`: daisy's pattern is optional (ISO fallback); `'yo'` throws `DaisyParseError`                                                                                                                                                                                            |
| 817  | fromFormat validates weekdays                                              | translated | `:818`, `:821`; the `ZZ` offset rows are n/a                                                                                                                                                                                                                                   |
| 839  | fromFormat containing special regex token                                  | n/a        | every case parses an IANA zone (`z`)                                                                                                                                                                                                                                           |
| 861  | fromFormat only an offset                                                  | n/a        | offsets                                                                                                                                                                                                                                                                        |
| 875  | fromFormatExplain() explains success                                       | n/a        | no explain API                                                                                                                                                                                                                                                                 |
| 884  | fromFormatExplain() explains a bad match                                   | n/a        | no explain API                                                                                                                                                                                                                                                                 |
| 893  | fromFormatExplain() parses zone correctly                                  | n/a        | no explain API, zones                                                                                                                                                                                                                                                          |
| 916  | fromFormatExplain() parses localized string with numberingSystem correctly | n/a        | numbering systems, locales                                                                                                                                                                                                                                                     |
| 1163 | fromFormatExplain() takes the same options as fromFormat                   | n/a        | no explain API                                                                                                                                                                                                                                                                 |
| 1171 | fromStringExplain is an alias for fromFormatExplain                        | n/a        | Luxon alias                                                                                                                                                                                                                                                                    |
| 1182 | fromString is an alias for fromFormat                                      | n/a        | Luxon alias                                                                                                                                                                                                                                                                    |
| 1193 | parseFormatForOpts returns a parsing format                                | n/a        | Intl options → format; no such API                                                                                                                                                                                                                                             |
| 1198 | parseFormatForOpts returns a parsing format (empty)                        | n/a        | no such API                                                                                                                                                                                                                                                                    |
| 1202 | parseFormatForOpts respects the hour cycle                                 | n/a        | no such API                                                                                                                                                                                                                                                                    |
| 1209 | parseFormatForOpts respects the hour cycle when forced by the options      | n/a        | no such API                                                                                                                                                                                                                                                                    |
| 1218 | expandFormat works with the default locale                                 | n/a        | no macro-token expansion (presets live in `locale.patterns`)                                                                                                                                                                                                                   |
| 1223 | expandFormat works with other locales                                      | n/a        | en-gb locale; no such API                                                                                                                                                                                                                                                      |
| 1228 | expandFormat respects the hour cycle                                       | n/a        | no such API                                                                                                                                                                                                                                                                    |
| 1236 | expandFormat respects the hour cycle when forced by the macro token        | n/a        | no such API                                                                                                                                                                                                                                                                    |
| 1245 | fromFormatParser behaves equivalently to fromFormat                        | n/a        | no prebuilt parser API (daisy caches compiled patterns internally)                                                                                                                                                                                                             |
| 1256 | fromFormatParser throws error when used with a different locale            | n/a        | no prebuilt parser API, es-ES/es-MX locales                                                                                                                                                                                                                                    |

### datetime/transform.test.js

7 tests: 1 translated, 0 differ on purpose, 6 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/transform.test.ts`

| line | Luxon test name                                              | status     | daisy test or reason                                                                     |
| ---- | ------------------------------------------------------------ | ---------- | ---------------------------------------------------------------------------------------- |
| 25   | DateTime#toMillis() returns milliseconds for valid DateTimes | n/a        | epoch millis/seconds of zoned instants are out of scope (daisy has no toMillis on dates) |
| 30   | DateTime#toMillis() returns NaN for invalid DateTimes        | n/a        | invalid instances do not exist in daisy; bad input throws                                |
| 38   | DateTime#toSeconds() returns seconds for valid DateTimes     | n/a        | epoch millis/seconds of zoned instants are out of scope (daisy has no toMillis on dates) |
| 43   | DateTime#toSeconds() returns NaN for invalid DateTimes       | n/a        | invalid instances do not exist in daisy; bad input throws                                |
| 51   | DateTime#valueOf() just does toMillis()                      | n/a        | daisy values have no numeric valueOf; ordering uses compare                              |
| 60   | DateTime#toJSDate() returns a native Date equivalent         | translated | transform.test.js:60: toDate('UTC') is a Date at the same instant                        |
| 69   | DateTime#toBSON() return a BSON serializable equivalent      | n/a        | toBSON not supported                                                                     |

### datetime/typecheck.test.js

3 tests: 0 translated, 0 differ on purpose, 3 n/a, 0 possible bugs.

Daisy file: none (no translatable case)

| line | Luxon test name                                      | status | daisy test or reason                                    |
| ---- | ---------------------------------------------------- | ------ | ------------------------------------------------------- |
| 7    | DateTime#isDateTime return true for valid DateTime   | n/a    | typecheck test of a Luxon class (daisy uses instanceof) |
| 12   | DateTime#isDateTime return true for invalid DateTime | n/a    | typecheck test; no invalid instances                    |
| 17   | DateTime#isDateTime return false for primitives      | n/a    | typecheck test of a Luxon class                         |

### datetime/zone.test.js

51 tests: 21 translated, 2 differ on purpose, 28 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/datetime/zone.test.ts`

| line | Luxon test name                                                                                    | status     | daisy test or reason                                                                                                            |
| ---- | -------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 14   | setZone defaults to local                                                                          | n/a        | isOffsetFixed of a zoned instant; daisy values have no zone                                                                     |
| 21   | DateTime#utc() puts the dt in UTC 'mode'                                                           | translated | zone.test.js:21: fromDate(instant, 'UTC') is 04:00 and round-trips (zoneName/isInDST n/a)                                       |
| 30   | DateTime#utc(offset) sets dt in UTC+offset 'mode'                                                  | translated | zone.test.js:30: Etc/GMT-5 shows 09:00 (daisy takes IANA names, not offsets)                                                    |
| 39   | DateTime#utc maintains invalidity                                                                  | n/a        | invalid instances do not exist in daisy                                                                                         |
| 46   | DateTime#toLocal() sets the calendar back to local                                                 | translated | zone.test.js:46: fromDate without a zone uses the system zone                                                                   |
| 54   | DateTime#toLocal() accepts the default locale                                                      | n/a        | default-zone setting does not exist                                                                                             |
| 64   | DateTime#setZone setZone sets the TZ to the specified zone                                         | translated | zone.test.js:64: America/Los_Angeles shows 1982-05-24T21:00 (isInDST n/a)                                                       |
| 76   | DateTime#setZone accepts "system"                                                                  | n/a        | "system" is a Luxon keyword; omitting the zone means system (see zone.test.js:86)                                               |
| 81   | DateTime#setZone accepts "local"                                                                   | n/a        | "local" is a Luxon keyword                                                                                                      |
| 86   | DateTime#setZone accepts "system" and uses the system zone                                         | translated | zone.test.js:86: omitting the zone equals passing the system IANA zone                                                          |
| 91   | DateTime#setZone accepts "default" and uses the default zone                                       | n/a        | default-zone setting does not exist                                                                                             |
| 97   | DateTime#setZone accepts "utc"                                                                     | n/a        | asserts offsets/offset names of a zoned instant; daisy values have no zone                                                      |
| 104  | DateTime#setZone accepts "gmt"                                                                     | n/a        | asserts offsets/offset names of a zoned instant; daisy values have no zone                                                      |
| 111  | DateTime#setZone accepts "utc+3"                                                                   | n/a        | Luxon fixed-offset zone syntax and offset names                                                                                 |
| 119  | DateTime#setZone accepts "utc-3"                                                                   | n/a        | Luxon fixed-offset zone syntax and offset names                                                                                 |
| 127  | DateTime#setZone accepts "utc-3:30"                                                                | n/a        | Luxon fixed-offset zone syntax and offset names                                                                                 |
| 135  | DateTime#setZone does not accept dumb things                                                       | n/a        | Luxon falls back to the system zone object; daisy has no zone objects                                                           |
| 143  | DateTime#setZone accepts IANA zone names                                                           | translated | zone.test.js:143: Europe/Paris shows 06:00 (offset names n/a)                                                                   |
| 153  | DateTime#setZone accepts whacky zone PST8PDT                                                       | translated | zone.test.js:153: whacky zone PST8PDT                                                                                           |
| 153  | DateTime#setZone accepts whacky zone EST5EDT                                                       | translated | zone.test.js:153: whacky zone EST5EDT                                                                                           |
| 153  | DateTime#setZone accepts whacky zone GMT+0                                                         | translated | zone.test.js:153: whacky zone GMT+0                                                                                             |
| 153  | DateTime#setZone accepts whacky zone GMT0                                                          | translated | zone.test.js:153: whacky zone GMT0                                                                                              |
| 165  | DateTime#setZone accepts a keepLocalTime option                                                    | translated | zone.test.js:165: wall clock round-trips through toDate/fromDate                                                                |
| 185  | DateTime#setZone with keepLocalTime can span wacky offsets                                         | translated | zone.test.js:185: 0001-01-01 round-trips in America/Curacao                                                                     |
| 194  | DateTime#setZone with keepLocalTime handles zones with very different offsets than the current one | translated | zone.test.js:194: 02:59 round-trips in Europe/Athens                                                                            |
| 200  | DateTime#setZone rejects jibberish                                                                 | differs    | zone.test.js:200: fromDate(…, 'blorp') throws DaisyRangeError (no invalid instances)                                            |
| 207  | DateTime#setZone works for dates before 1970 with milliseconds                                     | translated | zone.test.js:207: 1966-12-31T19:00:00.001 in New York (offset -300)                                                             |
| 215  | DateTime#setZone handles negative years                                                            | translated | zone.test.js:215: year -716 in Europe/Rome (offset bound n/a)                                                                   |
| 224  | DateTime#isInDST() returns false for pre-DST times                                                 | n/a        | isInDST does not exist; values have no zone                                                                                     |
| 229  | DateTime#isInDST() returns true for during-DST times                                               | n/a        | isInDST does not exist                                                                                                          |
| 234  | DateTime#isInDST() returns false for post-DST times                                                | n/a        | isInDST does not exist                                                                                                          |
| 239  | DateTime#isInDST() returns true for 1974 whole year in USA                                         | n/a        | isInDST does not exist                                                                                                          |
| 248  | DateTime#getPossibleOffsets() returns the same DateTime for fixed zones                            | n/a        | fixed-offset zones and getPossibleOffsets do not exist                                                                          |
| 255  | DateTime#getPossibleOffsets() returns the same DateTime when not at an ambiguous local time        | translated | zone.test.js:255: 2023-01-01T15:00 Berlin is 14:00Z                                                                             |
| 262  | DateTime#getPossibleOffsets() returns the possible DateTimes when at an ambiguous local time       | differs    | zone.test.js:262: toDate returns one instant, the earlier (+02:00) one (PROJECT T09: a repeated time takes the earlier instant) |
| 276  | DateTime#offset returns NaN for invalid times                                                      | n/a        | invalid instances do not exist in daisy                                                                                         |
| 281  | DateTime#offsetNameLong returns null for invalid times                                             | n/a        | invalid instances do not exist in daisy                                                                                         |
| 286  | DateTime#offsetNameShort returns null for invalid times                                            | n/a        | invalid instances do not exist in daisy                                                                                         |
| 294  | Etc/GMTx zones now work natively (Etc/GMT+8)                                                       | translated | zone.test.js:294: Etc/GMT+8                                                                                                     |
| 294  | Etc/GMTx zones now work natively (Etc/GMT-5)                                                       | translated | zone.test.js:294: Etc/GMT-5                                                                                                     |
| 294  | Etc/GMTx zones now work natively (Etc/GMT)                                                         | translated | zone.test.js:294: Etc/GMT                                                                                                       |
| 294  | Etc/GMTx zones now work natively (Etc/GMT-0)                                                       | translated | zone.test.js:294: Etc/GMT-0                                                                                                     |
| 294  | Etc/GMTx zones now work natively (Etc/GMT, repeated row)                                           | translated | zone.test.js:294: Etc/GMT (same case as the third row)                                                                          |
| 310  | The local zone does local stuff                                                                    | n/a        | offset names of the system zone; values have no zone                                                                            |
| 319  | Setting the default zone results in a different creation zone                                      | n/a        | default-zone setting does not exist                                                                                             |
| 326  | Setting the default zone to 'system' gives you back the system zone                                | n/a        | default-zone setting does not exist                                                                                             |
| 338  | invalid DateTimes have no zone                                                                     | n/a        | invalid instances do not exist in daisy                                                                                         |
| 342  | can parse zones with special JS keywords as invalid                                                | n/a        | daisy's ISO parser rejects zone annotations; invalidReason does not exist                                                       |
| 350  | Special JS keywords produce invalid Zone                                                           | n/a        | IANAZone class does not exist                                                                                                   |
| 357  | Invalid Zones named after special JS keywords produce NaN offset                                   | n/a        | IANAZone class does not exist                                                                                                   |
| 364  | Invalid zones produce NaN offset                                                                   | n/a        | IANAZone class does not exist                                                                                                   |

### duration/accuracy.test.js

3 tests: 0 translated, 0 differ on purpose, 3 n/a, 0 possible bugs.

| line | Luxon test name                                   | status | daisy test or reason                                                                                                        |
| ---- | ------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| 8    | There are slightly more than 365 days in a year   | n/a    | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5)                   |
| 16   | There are slightly more than 30 days in a month   | n/a    | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5)                   |
| 21   | There are slightly more than 91 days in a quarter | n/a    | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5); no quarters unit |

### duration/create.test.js

13 tests: 6 translated, 1 differ on purpose, 6 n/a, 0 possible bugs.

| line | Luxon test name                                                                   | status     | daisy test or reason                                                                                                                            |
| ---- | --------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 8    | Duration.fromObject sets all the values                                           | translated | `test/compat/luxon/duration/create.test.ts` (split into Period and Duration)                                                                    |
| 27   | Duration.fromObject sets all the fractional values                                | differs    | `create.test.ts` differs block: `Duration.of({ hours: 4.5 })` throws DaisyRangeError (PROJECT.md §5.1 invalid input; whole-unit components)     |
| 43   | Duration.fromObject sets all the values from the object having string type values | n/a        | typed API: Period.of/Duration.of take numbers in a typed object; strings and unknown keys are compile errors                                    |
| 62   | Duration.fromObject accepts a conversionAccuracy                                  | n/a        | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5)                                       |
| 67   | Duration.fromObject throws if the argument is not an object                       | n/a        | typed API: Period.of/Duration.of take numbers in a typed object; strings and unknown keys are compile errors (a missing or non-object argument) |
| 73   | Duration.fromObject({}) constructs zero duration                                  | translated | `test/compat/luxon/duration/create.test.ts`                                                                                                     |
| 84   | Duration.fromObject throws if the initial object has invalid keys                 | n/a        | typed API: Period.of/Duration.of take numbers in a typed object; strings and unknown keys are compile errors                                    |
| 89   | Duration.fromObject throws if the initial object has invalid values               | translated | `create.test.ts` (the `NaN` value; `{}`, strings and booleans are compile errors)                                                               |
| 98   | Duration.fromObject is valid if providing options only                            | n/a        | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5)                                       |
| 114  | Duration.fromDurationLike returns a Duration from millis                          | translated | `test/compat/luxon/duration/create.test.ts`                                                                                                     |
| 120  | Duration.fromDurationLike returns a Duration from object                          | translated | `test/compat/luxon/duration/create.test.ts`                                                                                                     |
| 126  | Duration.fromDurationLike returns passed Duration                                 | n/a        | no `fromDurationLike`; values are passed directly                                                                                               |
| 132  | Duration.fromDurationLike throws for invalid inputs                               | translated | `create.test.ts` (Infinity and NaN milliseconds; `"foo"`/`null` are compile errors)                                                             |

### duration/customMatrix.test.js

2 tests: 0 translated, 0 differ on purpose, 2 n/a, 0 possible bugs.

| line | Luxon test name                                              | status | daisy test or reason                                                                                                        |
| ---- | ------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| 34   | One day is made of 7 hours                                   | n/a    | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5)                   |
| 39   | One and a half week is made of 7 days 3 hours and 30 minutes | n/a    | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5); fractional weeks |

### duration/equality.test.js

13 tests: 7 translated, 0 differ on purpose, 6 n/a, 0 possible bugs.

| line | Luxon test name                                                          | status     | daisy test or reason                                                                                                                                                                                  |
| ---- | ------------------------------------------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4    | equals self                                                              | translated | `test/compat/luxon/duration/equality.test.ts`                                                                                                                                                         |
| 9    | equals identically constructed                                           | translated | `test/compat/luxon/duration/equality.test.ts`                                                                                                                                                         |
| 15   | equals identically constructed with fractional values                    | n/a        | fractional components don't exist in daisy; `of()` rejects them (see create.test.js:27)                                                                                                               |
| 21   | equals identically constructed but one has string type values            | n/a        | typed API: Period.of/Duration.of take numbers in a typed object; strings and unknown keys are compile errors                                                                                          |
| 27   | equals identically constructed but one has fractional string type values | n/a        | fractional components don't exist in daisy; `of()` rejects them (see create.test.js:27); typed API: Period.of/Duration.of take numbers in a typed object; strings and unknown keys are compile errors |
| 34   | equals with extra zero units                                             | translated | `equality.test.ts` (zero and -0 extra units on both Period and Duration)                                                                                                                              |
| 41   | does not equal an invalid duration                                       | n/a        | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1)                                                                                                                            |
| 47   | does not equal a different locale                                        | n/a        | daisy values carry no locale or numbering system; the locale is a format option                                                                                                                       |
| 53   | does not equal a different numbering system                              | n/a        | daisy values carry no locale or numbering system; the locale is a format option                                                                                                                       |
| 59   | does not equal a different set of units                                  | translated | `test/compat/luxon/duration/equality.test.ts`                                                                                                                                                         |
| 65   | does not equal a subset of units                                         | translated | `test/compat/luxon/duration/equality.test.ts`                                                                                                                                                         |
| 71   | does not equal a superset of units                                       | translated | `test/compat/luxon/duration/equality.test.ts`                                                                                                                                                         |
| 77   | does not equal a different unit values                                   | translated | `test/compat/luxon/duration/equality.test.ts`                                                                                                                                                         |

### duration/format.test.js

51 tests: 18 translated, 1 differ on purpose, 32 n/a, 0 possible bugs.

| line | Luxon test name                                                                                                             | status     | daisy test or reason                                                                                                                                                                       |
| ---- | --------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 20   | Duration#toISO fills out every field                                                                                        | translated | `format.test.ts` (split: `P1Y2M1W3D` + `PT4H5M6.007S`)                                                                                                                                     |
| 24   | Duration#toISO fills out every field with fractional                                                                        | n/a        | fractional components don't exist in daisy; `of()` rejects them (see create.test.js:27)                                                                                                    |
| 38   | Duration#toISO creates a minimal string                                                                                     | translated | `format.test.ts` (split into date and time parts)                                                                                                                                          |
| 45   | Duration#toISO handles negative durations                                                                                   | translated | `format.test.ts` (split: `P-3Y` + `PT-45S`)                                                                                                                                                |
| 49   | Duration#toISO handles mixed negative/positive durations                                                                    | translated | `format.test.ts` (split into date and time parts)                                                                                                                                          |
| 55   | Duration#toISO handles zero durations                                                                                       | translated | `test/compat/luxon/duration/format.test.ts`                                                                                                                                                |
| 59   | Duration#toISO returns null for invalid durations                                                                           | n/a        | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1)                                                                                                                 |
| 63   | Duration#toISO handles milliseconds duration                                                                                | translated | `test/compat/luxon/duration/format.test.ts`                                                                                                                                                |
| 67   | Duration#toISO handles seconds/milliseconds duration                                                                        | translated | `test/compat/luxon/duration/format.test.ts`                                                                                                                                                |
| 71   | Duration#toISO handles negative seconds/milliseconds duration                                                               | translated | `test/compat/luxon/duration/format.test.ts`                                                                                                                                                |
| 75   | Duration#toISO handles mixed negative/positive numbers in seconds/milliseconds durations                                    | translated | `test/compat/luxon/duration/format.test.ts`                                                                                                                                                |
| 80   | Duration#toISO does not use exponential notation for very small values                                                      | n/a        | fractional components don't exist in daisy; `of()` rejects them (see create.test.js:27)                                                                                                    |
| 89   | Duration#toISO output round-trips small fractional values through fromISO                                                   | n/a        | fractional components don't exist in daisy; `of()` rejects them (see create.test.js:27); shiftTo is Luxon-only                                                                             |
| 108  | Duration#toISOTime creates a correct extended string                                                                        | n/a        | daisy has no ISO time-of-day form for durations (`toISOTime`/`fromISOTime`)                                                                                                                |
| 112  | Duration#toISOTime suppresses milliseconds correctly                                                                        | n/a        | daisy has no ISO time-of-day form for durations (`toISOTime`/`fromISOTime`)                                                                                                                |
| 118  | Duration#toISOTime suppresses seconds correctly                                                                             | n/a        | daisy has no ISO time-of-day form for durations (`toISOTime`/`fromISOTime`)                                                                                                                |
| 124  | Duration#toISOTime includes the prefix correctly                                                                            | n/a        | daisy has no ISO time-of-day form for durations (`toISOTime`/`fromISOTime`)                                                                                                                |
| 128  | Duration#toISOTime creates a correct basic string                                                                           | n/a        | daisy has no ISO time-of-day form for durations (`toISOTime`/`fromISOTime`)                                                                                                                |
| 134  | Duration#toISOTime returns null if the value is outside the range of one day                                                | n/a        | daisy has no ISO time-of-day form for durations (`toISOTime`/`fromISOTime`)                                                                                                                |
| 139  | Duration#toISOTime is not influenced by the locale                                                                          | n/a        | daisy has no ISO time-of-day form for durations (`toISOTime`/`fromISOTime`)                                                                                                                |
| 149  | Duration#toMillis returns the value in milliseconds                                                                         | translated | `format.test.ts` (first assertion; `valueOf` has no counterpart)                                                                                                                           |
| 158  | Duration#toJSON returns the ISO representation                                                                              | translated | `format.test.ts` (split)                                                                                                                                                                   |
| 166  | Duration#toString returns the ISO representation                                                                            | translated | `format.test.ts` (split)                                                                                                                                                                   |
| 174  | Duration#toFormat('S') returns milliseconds                                                                                 | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 183  | Duration#toFormat('s') returns seconds                                                                                      | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 195  | Duration#toFormat('m') returns minutes                                                                                      | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 208  | Duration#toFormat('h') returns hours                                                                                        | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 221  | Duration#toFormat('d') returns days                                                                                         | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 234  | Duration#toFormat('w') returns weeks                                                                                        | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 247  | Duration#toFormat('M') returns months                                                                                       | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 260  | Duration#toFormat('y') returns years                                                                                        | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 272  | Duration#toFormat accepts the deprecated 'round' option                                                                     | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 281  | Duration#toFormat leaves in zeros                                                                                           | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 287  | Duration#toFormat rounds down                                                                                               | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 295  | Duration#toFormat localizes the numbers                                                                                     | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`; numbering systems                                                                          |
| 301  | Duration#toFormat returns a lame string for invalid durations                                                               | n/a        | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1)                                                                                                                 |
| 307  | Duration#toFormat shows negative sign on the largest unit when using signMode negativeLargestOnly                           | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 326  | Duration#toFormat shows no negative sign on the largest unit when using signMode negativeLargestOnly with positive Duration | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 345  | Duration#toFormat keeps the negative sign on the largest unit when it is zero with signMode negativeLargestOnly             | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 374  | Duration#toFormat with signMode all shows positive sign on positive durations                                               | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 393  | Duration#toFormat with signMode all shows positive sign on negative durations                                               | n/a        | daisy has no duration patterns (`toFormat`); amounts only have unit text via `format(options)`                                                                                             |
| 416  | Duration#toHuman formats out a list                                                                                         | translated | `format.test.ts` (split; Luxon default list = `list: 'unit'`)                                                                                                                              |
| 422  | Duration#toHuman only shows the units you have                                                                              | translated | `format.test.ts` (split)                                                                                                                                                                   |
| 426  | Duration#toHuman accepts a listStyle                                                                                        | translated | `format.test.ts` (split; `listStyle: long` = `list: 'conjunction'`, each part ends with `, and`)                                                                                           |
| 432  | Duration#toHuman accepts number format opts                                                                                 | differs    | Found a bug: English short names were `mos`/`hrs`; fixed to CLDR `mths`/`hr`. Time half translated (`4 hr, 5 min, 6 sec, 7 ms`); date half differs only in `3 d` (README: `2 wks and 3 d`) |
| 438  | Duration#toHuman accepts hiding of zero values                                                                              | translated | `format.test.ts` (split; `zeros: 'omit'`)                                                                                                                                                  |
| 453  | Duration#toHuman handles undefined showZeros                                                                                | translated | `format.test.ts` (split; Luxon shows zeros by default = `zeros: 'show'`)                                                                                                                   |
| 468  | Duration#toHuman works in differt languages                                                                                 | translated | `format.test.ts` (split; `fr` locale)                                                                                                                                                      |
| 474  | Duration#toHuman handles quarters                                                                                           | n/a        | daisy has no quarters unit                                                                                                                                                                 |
| 484  | Duration#toHuman handles quarters and months together                                                                       | n/a        | daisy has no quarters unit                                                                                                                                                                 |
| 495  | Duration#toHuman handles quarters and months with showZeros false                                                           | n/a        | daisy has no quarters unit                                                                                                                                                                 |

### duration/getters.test.js

10 tests: 8 translated, 1 differ on purpose, 1 n/a, 0 possible bugs.

| line | Luxon test name                                | status     | daisy test or reason                                                                      |
| ---- | ---------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------- |
| 22   | Duration#years returns the years               | translated | `test/compat/luxon/duration/getters.test.ts`                                              |
| 27   | Duration#quarters returns the quarters         | n/a        | daisy has no quarters unit                                                                |
| 32   | Duration#months returns the (1-indexed) months | translated | `test/compat/luxon/duration/getters.test.ts`                                              |
| 37   | Duration#days returns the days                 | translated | `test/compat/luxon/duration/getters.test.ts`                                              |
| 42   | Duration#hours returns the hours               | translated | `test/compat/luxon/duration/getters.test.ts`                                              |
| 47   | Duration#hours returns the fractional hours    | differs    | `getters.test.ts` differs block: fractional hours throw DaisyRangeError (PROJECT.md §5.1) |
| 65   | Duration#minutes returns the minutes           | translated | `test/compat/luxon/duration/getters.test.ts`                                              |
| 70   | Duration#seconds returns the seconds           | translated | `test/compat/luxon/duration/getters.test.ts`                                              |
| 75   | Duration#milliseconds returns the milliseconds | translated | `test/compat/luxon/duration/getters.test.ts`                                              |
| 80   | Duration#weeks returns the weeks               | translated | `test/compat/luxon/duration/getters.test.ts`                                              |

### duration/info.test.js

2 tests: 0 translated, 0 differ on purpose, 2 n/a, 0 possible bugs.

| line | Luxon test name                                                 | status | daisy test or reason                                                       |
| ---- | --------------------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| 14   | Duration#toObject returns the object                            | n/a    | `toObject` is out of scope (brief rule 4); components are public fields    |
| 22   | Duration#toObject returns an empty object for invalid durations | n/a    | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1) |

### duration/invalid.test.js

10 tests: 0 translated, 0 differ on purpose, 10 n/a, 0 possible bugs.

| line | Luxon test name                                                  | status | daisy test or reason                                                       |
| ---- | ---------------------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| 5    | Explicitly invalid durations are invalid                         | n/a    | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1) |
| 12   | throwOnInvalid throws                                            | n/a    | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1) |
| 21   | Duration.invalid throws if you don't provide a reason            | n/a    | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1) |
| 25   | Diffing invalid DateTimes creates invalid Durations              | n/a    | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1) |
| 31   | Duration.invalid produces invalid Intervals                      | n/a    | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1) |
| 35   | Duration.toMillis produces NaN on invalid Durations              | n/a    | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1) |
| 39   | Duration.as produces NaN on invalid Durations                    | n/a    | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1) |
| 43   | Duration.toHuman produces null on invalid Durations              | n/a    | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1) |
| 47   | Duration.toISO produces null on invalid Durations                | n/a    | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1) |
| 51   | Duration.toFormat produces Invalid Duration on invalid Durations | n/a    | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1) |

### duration/math.test.js

21 tests: 11 translated, 0 differ on purpose, 10 n/a, 0 possible bugs.

| line | Luxon test name                                    | status     | daisy test or reason                                                                                      |
| ---- | -------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| 8    | Duration#plus add straightforward durations        | translated | `test/compat/luxon/duration/math.test.ts`                                                                 |
| 19   | Duration#plus add fractional durations             | n/a        | fractional components don't exist in daisy; `of()` rejects them (see create.test.js:27)                   |
| 30   | Duration#plus noops empty druations                | translated | `test/compat/luxon/duration/math.test.ts`                                                                 |
| 40   | Duration#plus adds negatives                       | translated | `test/compat/luxon/duration/math.test.ts`                                                                 |
| 51   | Duration#plus adds single values                   | translated | `math.test.ts` (`Duration.ofMinutes(5)` for the object)                                                   |
| 60   | Duration#plus adds number as milliseconds          | translated | `math.test.ts` (`Duration.ofMilliseconds(333)` for the number)                                            |
| 69   | Duration#plus maintains invalidity                 | n/a        | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1)                                |
| 75   | Duration#plus results in the superset of units     | translated | `test/compat/luxon/duration/math.test.ts`                                                                 |
| 83   | Duration#plus throws with invalid parameter        | translated | `math.test.ts` (TypeError, PROJECT.md §5.5 root plus/minus)                                               |
| 90   | Duration#minus subtracts durations                 | translated | `test/compat/luxon/duration/math.test.ts`                                                                 |
| 101  | Duration#minus subtracts fractional durations      | n/a        | fractional components don't exist in daisy; `of()` rejects them (see create.test.js:27)                   |
| 112  | Duration#minus subtracts single values             | translated | `test/compat/luxon/duration/math.test.ts`                                                                 |
| 121  | Duration#minus maintains invalidity                | n/a        | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1)                                |
| 131  | Duration#negate flips all the signs                | translated | `math.test.ts` (`negated()`)                                                                              |
| 139  | Duration#negate preserves invalidity               | n/a        | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1)                                |
| 146  | Duration#negate doesn't mutate                     | translated | `test/compat/luxon/duration/math.test.ts`                                                                 |
| 152  | Duration#negate preserves conversionAccuracy       | n/a        | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5) |
| 171  | Duration#units can multiply durations              | n/a        | `mapUnits` is a Luxon-only option                                                                         |
| 181  | Duration#units can take the unit into account      | n/a        | `mapUnits` is a Luxon-only option                                                                         |
| 191  | Duration#mapUnits maintains invalidity             | n/a        | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1)                                |
| 197  | Duration#mapUnits requires that fn return a number | n/a        | `mapUnits` is a Luxon-only option                                                                         |

### duration/parse.test.js

8 tests: 2 translated, 3 differ on purpose, 3 n/a, 0 possible bugs.

| line | Luxon test name                                                       | status     | daisy test or reason                                                                                                                                                                                                                         |
| ---- | --------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 13   | Duration.fromISO can parse a variety of ISO formats                   | differs    | `parse.test.ts`: every row translated (mixed texts split into `Period.parse` date part and `Duration.parse` time part); `PT10000000000000000000.999S` differs: throws DaisyParseError (total must fit a safe integer of ms, PROJECT.md §5.5) |
| 23   | Duration.fromISO can parse mixed or negative durations                | translated | `parse.test.ts` (mixed texts split into date and time parts, sign kept on both)                                                                                                                                                              |
| 40   | Duration.fromISO can parse fractions of seconds                       | differs    | `parse.test.ts`: .5, .53, .534, .034 translated; `PT54M32.5348S` differs: throws DaisyParseError (finer than ms, PROJECT.md §5.5)                                                                                                            |
| 68   | Duration.fromISO can parse fractions                                  | differs    | `parse.test.ts` differs block: P1.5Y/M/W/D and PT9.5H throw DaisyParseError (only seconds take a fraction, PROJECT.md §5.5)                                                                                                                  |
| 90   | Duration.fromISO rejects junk                                         | translated | `parse.test.ts` (both `Period.parse` and `Duration.parse` throw DaisyParseError)                                                                                                                                                             |
| 108  | Duration.fromISOTime can parse a variety of extended ISO time formats | n/a        | daisy has no ISO time-of-day form for durations (`toISOTime`/`fromISOTime`)                                                                                                                                                                  |
| 115  | Duration.fromISOTime can parse a variety of basic ISO time formats    | n/a        | daisy has no ISO time-of-day form for durations (`toISOTime`/`fromISOTime`)                                                                                                                                                                  |
| 127  | Duration.fromISOTime rejects junk                                     | n/a        | daisy has no ISO time-of-day form for durations (`toISOTime`/`fromISOTime`)                                                                                                                                                                  |

### duration/proto.test.js

1 tests: 0 translated, 0 differ on purpose, 1 n/a, 0 possible bugs.

| line | Luxon test name                                               | status | daisy test or reason            |
| ---- | ------------------------------------------------------------- | ------ | ------------------------------- |
| 3    | Duration prototype properties should not throw when addressed | n/a    | prototype test of a Luxon class |

### duration/reconfigure.test.js

4 tests: 0 translated, 0 differ on purpose, 4 n/a, 0 possible bugs.

| line | Luxon test name                                       | status | daisy test or reason                                                                                              |
| ---- | ----------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| 22   | Duration#reconfigure() sets the locale                | n/a    | daisy values carry no locale or numbering system; the locale is a format option; conversionAccuracy is Luxon-only |
| 29   | Duration#reconfigure() sets the numberingSystem       | n/a    | daisy values carry no locale or numbering system; the locale is a format option; conversionAccuracy is Luxon-only |
| 36   | Duration#reconfigure() sets the conversion accuracy   | n/a    | daisy values carry no locale or numbering system; the locale is a format option; conversionAccuracy is Luxon-only |
| 43   | Duration#reconfigure() with no arguments does nothing | n/a    | daisy values carry no locale or numbering system; the locale is a format option; conversionAccuracy is Luxon-only |

### duration/set.test.js

3 tests: 0 translated, 0 differ on purpose, 3 n/a, 0 possible bugs.

| line | Luxon test name                    | status | daisy test or reason                                                       |
| ---- | ---------------------------------- | ------ | -------------------------------------------------------------------------- |
| 18   | Duration#set() sets the values     | n/a    | Period/Duration have no `set`; build a new value with `of()`               |
| 29   | Duration#set() throws for metadata | n/a    | Luxon metadata (locale, numberingSystem) has no counterpart                |
| 35   | Duration#set maintains invalidity  | n/a    | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1) |

### duration/typecheck.test.js

3 tests: 0 translated, 0 differ on purpose, 3 n/a, 0 possible bugs.

| line | Luxon test name                                      | status | daisy test or reason                                             |
| ---- | ---------------------------------------------------- | ------ | ---------------------------------------------------------------- |
| 8    | Duration#isDuration return true for valid duration   | n/a    | `isDuration` typecheck of a Luxon class; daisy uses `instanceof` |
| 13   | Duration#isDuration return true for invalid duration | n/a    | `isDuration` typecheck of a Luxon class; daisy uses `instanceof` |
| 18   | Duration#isDuration return false for primitives      | n/a    | `isDuration` typecheck of a Luxon class; daisy uses `instanceof` |

### duration/units.test.js

43 tests: 6 translated, 5 differ on purpose, 32 n/a, 0 possible bugs.

| line | Luxon test name                                                                                                      | status     | daisy test or reason                                                                                                                                                                                                                                              |
| ---- | -------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 7    | Duration#shiftTo rolls milliseconds up hours and minutes                                                             | translated | `units.test.ts` (`shiftTo("hours","minutes")` = `normalized()`; the fractional `shiftTo("hours")` 1.6 assertion is n/a)                                                                                                                                           |
| 15   | Duration#shiftTo boils hours down milliseconds                                                                       | translated | `units.test.ts` (`toMillis()`)                                                                                                                                                                                                                                    |
| 20   | Duration boils hours down shiftTo minutes and milliseconds                                                           | n/a        | shiftTo/shiftToAll/as are Luxon-only unit conversions; daisy only has `normalized()` (Duration: balance into h/m/s/ms; Period: fold months into years)                                                                                                            |
| 25   | Duration#shiftTo boils down and then rolls up                                                                        | n/a        | shiftTo/shiftToAll/as are Luxon-only unit conversions; daisy only has `normalized()` (Duration: balance into h/m/s/ms; Period: fold months into years); conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5) |
| 30   | Duration#shiftTo throws on invalid units                                                                             | n/a        | shiftTo/shiftToAll/as are Luxon-only unit conversions; daisy only has `normalized()` (Duration: balance into h/m/s/ms; Period: fold months into years)                                                                                                            |
| 36   | Duration#shiftTo tacks decimals onto the end                                                                         | n/a        | shiftTo/shiftToAll/as are Luxon-only unit conversions; daisy only has `normalized()` (Duration: balance into h/m/s/ms; Period: fold months into years); fractional result                                                                                         |
| 42   | Duration#shiftTo deconstructs decimal inputs                                                                         | n/a        | fractional components don't exist in daisy; `of()` rejects them (see create.test.js:27)                                                                                                                                                                           |
| 49   | Duration#shiftTo deconstructs in cascade and tacks decimal onto the end                                              | n/a        | fractional components don't exist in daisy; `of()` rejects them (see create.test.js:27)                                                                                                                                                                           |
| 57   | Duration#shiftTo maintains invalidity                                                                                | n/a        | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1)                                                                                                                                                                                        |
| 63   | Duration#shiftTo without any units no-ops                                                                            | n/a        | shiftTo/shiftToAll/as are Luxon-only unit conversions; daisy only has `normalized()` (Duration: balance into h/m/s/ms; Period: fold months into years)                                                                                                            |
| 69   | Duration#shiftTo accumulates when rolling up                                                                         | translated | `units.test.ts` (`normalized()`)                                                                                                                                                                                                                                  |
| 77   | Duration#shiftTo keeps unnecessary higher-order negative units 0                                                     | n/a        | shiftTo/shiftToAll/as are Luxon-only unit conversions; daisy only has `normalized()` (Duration: balance into h/m/s/ms; Period: fold months into years); fractional seconds result                                                                                 |
| 83   | Duration#shiftTo does not normalize values                                                                           | n/a        | shiftTo/shiftToAll/as are Luxon-only unit conversions; daisy only has `normalized()` (Duration: balance into h/m/s/ms; Period: fold months into years); no quarters unit                                                                                          |
| 91   | Duration#shiftTo boils hours down to hours and minutes                                                               | n/a        | fractional components don't exist in daisy; `of()` rejects them (see create.test.js:27)                                                                                                                                                                           |
| 99   | Duration#shiftTo handles mixed units                                                                                 | n/a        | shiftTo/shiftToAll/as are Luxon-only unit conversions; daisy only has `normalized()` (Duration: balance into h/m/s/ms; Period: fold months into years); Period never converts weeks and days (PROJECT.md §5.5)                                                    |
| 108  | Duration#shiftTo does not produce unnecessary fractions in higher order units                                        | n/a        | fractional components don't exist in daisy; `of()` rejects them (see create.test.js:27); conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5)                                                                |
| 120  | Duration#siftTo does not create intermediate units when lower order units can go directly into a higher one          | n/a        | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5)                                                                                                                                                         |
| 136  | Duration#shiftTo can convert milliseconds directly into whole years correctly: 1                                     | n/a        | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5); millis to years                                                                                                                                        |
| 136  | Duration#shiftTo can convert milliseconds directly into whole years correctly: 5                                     | n/a        | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5); millis to years                                                                                                                                        |
| 136  | Duration#shiftTo can convert milliseconds directly into whole years correctly: -12                                   | n/a        | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5); millis to years                                                                                                                                        |
| 156  | Duration#shiftTo with no units normalizes                                                                            | n/a        | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5)                                                                                                                                                         |
| 166  | Duration#shiftToAll shifts to all available units                                                                    | translated | `units.test.ts` (`normalized()`; date units have no Duration counterpart)                                                                                                                                                                                         |
| 180  | Duration#shiftToAll does not produce unnecessary fractions in higher order units                                     | n/a        | fractional components don't exist in daisy; `of()` rejects them (see create.test.js:27); conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5)                                                                |
| 196  | Duration#shiftToAll maintains invalidity                                                                             | n/a        | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1)                                                                                                                                                                                        |
| 205  | Duration#normalize rebalances negative units                                                                         | differs    | `units.test.ts` differs block: `Period.normalized()` keeps `P2Y-2D` (only folds months into years, PROJECT.md §5.5)                                                                                                                                               |
| 210  | Duration#normalize de-overflows                                                                                      | differs    | `units.test.ts` differs block: `P2Y5000D` stays (PROJECT.md §5.5)                                                                                                                                                                                                 |
| 217  | Duration#normalize handles fully negative durations                                                                  | differs    | `units.test.ts` differs block: `P-2Y-5000D` stays (PROJECT.md §5.5)                                                                                                                                                                                               |
| 222  | Duration#normalize handles the full grid partially negative durations                                                | differs    | `units.test.ts`: 12 month/day rows differ (Period.normalized keeps days, PROJECT.md §5.5); hours row `PT96H-10S` → `PT95H59M50S` translated                                                                                                                       |
| 283  | Duration#normalize maintains invalidity                                                                              | n/a        | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1)                                                                                                                                                                                        |
| 289  | Duration#normalize can convert all unit pairs                                                                        | n/a        | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5); no quarters unit                                                                                                                                       |
| 317  | Duration#normalize moves fractions to lower-order units                                                              | n/a        | fractional components don't exist in daisy; `of()` rejects them (see create.test.js:27)                                                                                                                                                                           |
| 338  | Duration#normalize does not produce fractions in higher order units when rolling up negative lower order unit values | n/a        | conversionAccuracy/conversion matrices are Luxon-only; Period has no conversion to days (PROJECT.md §5.5)                                                                                                                                                         |
| 354  | Duration#rescale normalizes, shifts to all units and remove units with a value of 0                                  | differs    | `units.test.ts`: the two millisecond rows translated via `normalized()`; `{ months: 2, days: -30 }` differs (Period.normalized keeps days, PROJECT.md §5.5)                                                                                                       |
| 369  | Duration#rescale maintains invalidity                                                                                | n/a        | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1)                                                                                                                                                                                        |
| 379  | Duration#as shifts to one unit and returns it                                                                        | n/a        | shiftTo/shiftToAll/as are Luxon-only unit conversions; daisy only has `normalized()` (Duration: balance into h/m/s/ms; Period: fold months into years); fractional result                                                                                         |
| 384  | Duration#as returns null for invalid durations                                                                       | n/a        | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1)                                                                                                                                                                                        |
| 392  | Duration#valueOf value of zero duration                                                                              | translated | `units.test.ts` (`toMillis()`)                                                                                                                                                                                                                                    |
| 397  | Duration#valueOf returns as millisecond value (lower order units)                                                    | translated | `units.test.ts` (`toMillis()`)                                                                                                                                                                                                                                    |
| 402  | Duration#valueOf value of the duration with lower and higher order units                                             | n/a        | days are a Period unit and Period has no conversion to milliseconds (PROJECT.md §5.5)                                                                                                                                                                             |
| 411  | Duration#removeZeros leaves empty object if everything was zero                                                      | n/a        | daisy values always have every component; `removeZeros` has no counterpart                                                                                                                                                                                        |
| 415  | Duration#removeZeros removes units with zero value                                                                   | n/a        | daisy values always have every component; `removeZeros` has no counterpart                                                                                                                                                                                        |
| 437  | Duration#removeZeros removes nothing if no value is zero                                                             | n/a        | daisy values always have every component; `removeZeros` has no counterpart                                                                                                                                                                                        |
| 451  | Duration#removeZeros maintains invalidity                                                                            | n/a        | invalid instances don't exist in daisy; bad input throws (PROJECT.md §5.1)                                                                                                                                                                                        |

### impl/english.test.js

16 tests: 8 translated, 3 differ on purpose, 5 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/impl/english.test.ts`. Mapping: formatRelativeTime(unit, n, numeric) = formatRelative of a date (or date-time for hours) n units from 2026-01-15 (12:00), long style. Luxon's short-style strings (`in 1 mo.`, `1 hr. ago`) are not translated: daisy's short phrases are its own locale data (`in 1 mo`), not documented phrases.

| line | Luxon test name                           | status     | daisy test or reason                                                                                                                |
| ---- | ----------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 5    | today                                     | translated | english.test.js:6, english.test.js:7                                                                                                |
| 10   | tomorrow                                  | translated | english.test.js:11, english.test.js:12                                                                                              |
| 15   | yesterday                                 | translated | english.test.js:16, english.test.js:17                                                                                              |
| 20   | in 0.5 days                               | n/a        | fractional days; relative text counts whole calendar days                                                                           |
| 25   | 0.5 days ago                              | n/a        | fractional days                                                                                                                     |
| 30   | 2 days ago                                | differs    | english.test.js:31 — auto gives `the day before yesterday` (§6.4 special words −2…+2); always part translated as english.test.js:32 |
| 35   | this month                                | n/a        | daisy picks the unit from the distance (§6.4); a zero difference is always in days, so no `this month` / `in 0 months`              |
| 43   | next month                                | differs    | english.test.js:44 — auto gives `in 1 month`, no `next month` word (§6.4 table); always part translated as english.test.js:46       |
| 50   | last month                                | differs    | english.test.js:51 — auto gives `1 month ago`, no `last month` word (§6.4); always part translated as english.test.js:53            |
| 57   | in 3 months                               | translated | english.test.js:58, english.test.js:60                                                                                              |
| 64   | in 1 hour                                 | translated | english.test.js:65, english.test.js:66                                                                                              |
| 69   | in 1 hour (second copy, with short style) | translated | english.test.js:70, english.test.js:72 (short-style parts not translated)                                                           |
| 76   | 1 hour ago                                | translated | english.test.js:77, english.test.js:79 (short-style parts not translated)                                                           |
| 83   | formatString                              | n/a        | Luxon's internal Intl-options-to-token table; daisy has no Intl options, its presets are fixed LDML patterns in the locale pack     |
| 109  | weekdays                                  | translated | english.test.js:109 (narrow/short/long; numeric list and null input don't exist)                                                    |
| 125  | eras                                      | n/a        | daisy has no eras                                                                                                                   |

### info/features.test.js

3 tests: 0 translated, 0 differ on purpose, 3 n/a, 0 possible bugs.

No daisy file.

| line | Luxon test name                                                | status | daisy test or reason                                                                      |
| ---- | -------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------- |
| 6    | Info.features shows this environment supports all the features | n/a    | Info/Features; daisy needs no Intl.RelativeTimeFormat or weekInfo (locale packs are data) |
| 11   | Info.features shows no support (without RelativeTimeFormat)    | n/a    | Info/Features; environment feature detection                                              |
| 15   | Info.features shows no support (without Intl.Locale weekInfo)  | n/a    | Info/Features; environment feature detection                                              |

### info/listers.test.js

15 tests: 10 translated, 0 differ on purpose, 5 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/info/listers.test.ts`. Mapping: Info.months = locale.months.standalone, Info.monthsFormat = locale.months.format, Info.weekdays/weekdaysFormat = locale.weekdays (no context split), long/short/narrow = wide/abbreviated/narrow, Info.meridiems = locale.dayPeriods. Only the en parts translate; numeric/2-digit lists and ru/ja/bn/my/fr-era parts are n/a.

| line | Luxon test name                               | status     | daisy test or reason                                                           |
| ---- | --------------------------------------------- | ---------- | ------------------------------------------------------------------------------ |
| 12   | Info.months lists all the months              | translated | listers.test.js:12 (long/short/narrow; numeric and 2-digit lists don't exist)  |
| 89   | Info.months respects the numbering system     | n/a        | numbering systems                                                              |
| 106  | Info.months respects the calendar             | n/a        | calendars                                                                      |
| 123  | Info.months respects the locale               | n/a        | locales bn, ja, ru                                                             |
| 179  | Info.months defaults to long names            | translated | listers.test.js:179 (default locale)                                           |
| 199  | Info.monthsFormat lists all the months        | translated | listers.test.js:199 (en parts; ru part n/a, numeric list doesn't exist)        |
| 262  | Info.monthsFormat defaults to long names      | translated | listers.test.js:262                                                            |
| 282  | Info.weekdays lists all the weekdays          | translated | listers.test.js:282 (en parts; ru part n/a)                                    |
| 316  | Info.weekdays defaults to long names          | translated | listers.test.js:316                                                            |
| 331  | Info.weekdaysFormat lists all the weekdays    | translated | listers.test.js:331                                                            |
| 353  | Info.weekdaysFormat defaults to long names    | translated | listers.test.js:353                                                            |
| 368  | Info.meridiems lists the meridiems            | translated | listers.test.js:368 (en part; locale my n/a)                                   |
| 373  | Info.meridiems defaults to the current locale | translated | listers.test.js:373                                                            |
| 381  | Info.eras lists both eras                     | n/a        | daisy has no eras (no `G` letter, no era names in locale packs)                |
| 392  | Info English lists are not mutable            | n/a        | no lister calls/caches; locale data is readonly-typed plain data read directly |

### info/localeWeek.test.js

7 tests: 3 translated, 0 differ on purpose, 4 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/info/localeWeek.test.ts`. Mapping: Info.getStartOfWeek = locale.firstDayOfWeek, getWeekendWeekdays = locale.weekend; en-US/de-DE read as daisy's en/de packs; he is n/a.

| line | Luxon test name                                                                | status     | daisy test or reason                                                                                                                       |
| ---- | ------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 7    | Info.getStartOfWeek reports the correct start of the week                      | translated | Found an inconsistency: en started weeks on Monday; now Sunday as in CLDR (owner decision, 2026-10-02). `localeWeek.test.js:7` (en and de) |
| 12   | Info.getStartOfWeek reports Monday as the start of the week (without weekInfo) | n/a        | environment feature detection                                                                                                              |
| 17   | Info.getMinimumDaysInFirstWeek reports the correct value                       | n/a        | daisy has ISO weeks only, no minimal-days setting                                                                                          |
| 24   | Info.getMinimumDaysInFirstWeek reports 4 (without weekInfo)                    | n/a        | environment feature detection; ISO weeks only                                                                                              |
| 29   | Info.getWeekendWeekdays reports the correct value                              | translated | localeWeek.test.js:29 (he part n/a)                                                                                                        |
| 34   | Info.getWeekendWeekdays reports [6, 7] (without weekInfo)                      | n/a        | environment feature detection                                                                                                              |
| 39   | Info.getStartOfWeek honors the default locale                                  | translated | default en starts on Sunday, de on Monday; weekend translated; minDays and he n/a. `localeWeek.test.js:39`                                 |

### info/zones.test.js

25 tests: 0 translated, 0 differ on purpose, 25 n/a, 0 possible bugs.

No daisy file.

| line | Luxon test name                                                                                    | status | daisy test or reason                |
| ---- | -------------------------------------------------------------------------------------------------- | ------ | ----------------------------------- |
| 18   | Info.hasDST returns true for America/New_York                                                      | n/a    | time zones / DST; no Info           |
| 22   | Info.hasDST returns false for America/Aruba                                                        | n/a    | time zones / DST; no Info           |
| 26   | Info.hasDST returns false for America/Cancun                                                       | n/a    | time zones / DST; no Info           |
| 30   | Info.hasDST returns true for Europe/Andora                                                         | n/a    | time zones / DST; no Info           |
| 34   | Info.hasDST defaults to the global zone                                                            | n/a    | time zones / DST; no Info           |
| 44   | Info.isValidIANAZone returns true for valid zones                                                  | n/a    | time zones; no Info or Zone objects |
| 48   | Info.isValidIANAZone returns true for single-section zones                                         | n/a    | time zones; no Info or Zone objects |
| 52   | Info.isValidIANAZone returns false for junk                                                        | n/a    | time zones; no Info or Zone objects |
| 56   | Info.isValidIANAZone returns false for well-specified but invalid zones                            | n/a    | time zones; no Info or Zone objects |
| 60   | Info.isValidIANAZone returns true for valid zones like America/Indiana/Indianapolis                | n/a    | time zones; no Info or Zone objects |
| 64   | Info.isValidIANAZone returns false for well-specified but invalid zones like America/Indiana/Blork | n/a    | time zones; no Info or Zone objects |
| 72   | Info.normalizeZone returns Zone objects unchanged                                                  | n/a    | time zones; no Info or Zone objects |
| 86   | Info.normalizeZone converts valid input Local into valid Zone instance                             | n/a    | time zones; no Zone objects         |
| 86   | Info.normalizeZone converts valid input System into valid Zone instance                            | n/a    | time zones; no Zone objects         |
| 86   | Info.normalizeZone converts valid input UTC into valid Zone instance                               | n/a    | time zones; no Zone objects         |
| 86   | Info.normalizeZone converts valid input GMT into valid Zone instance                               | n/a    | time zones; no Zone objects         |
| 86   | Info.normalizeZone converts valid input Etc/GMT+5 into valid Zone instance                         | n/a    | time zones; no Zone objects         |
| 86   | Info.normalizeZone converts valid input Etc/GMT-10 into valid Zone instance                        | n/a    | time zones; no Zone objects         |
| 86   | Info.normalizeZone converts valid input Europe/Paris into valid Zone instance                      | n/a    | time zones; no Zone objects         |
| 86   | Info.normalizeZone converts valid input 0 into valid Zone instance                                 | n/a    | time zones; no Zone objects         |
| 86   | Info.normalizeZone converts valid input 3 into valid Zone instance                                 | n/a    | time zones; no Zone objects         |
| 86   | Info.normalizeZone converts valid input -11 into valid Zone instance                               | n/a    | time zones; no Zone objects         |
| 101  | Info.normalizeZone converts unknown name to invalid Zone                                           | n/a    | time zones; no Zone objects         |
| 105  | Info.normalizeZone converts null and undefined to default Zone                                     | n/a    | time zones; no Zone objects         |
| 112  | Info.normalizeZone converts local to system Zone                                                   | n/a    | time zones; no Zone objects         |

### interval/create.test.js

13 tests: 2 translated, 2 differ on purpose, 9 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/interval/create.test.ts`. Mapping: Luxon [a, b) at midnight = daisy a..b-1.

| line | Luxon test name                                                                    | status     | daisy test or reason                                                                       |
| ---- | ---------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------ |
| 10   | Interval.fromDateTimes creates an interval from datetimes                          | translated | create.test.js:10                                                                          |
| 19   | Interval.fromDateTimes creates an interval from objects                            | n/a        | LocalDateRange.of takes LocalDate values only, no plain objects                            |
| 28   | Interval.fromDateTimes creates an interval from Dates                              | n/a        | ranges take no JS Date endpoints; Date conversion needs a zone (LocalDate.fromDate)        |
| 41   | Interval.fromDateTimes results in an invalid Interval if the endpoints are invalid | differs    | create.test.js:41 — end before start throws DaisyRangeError; invalid endpoints don't exist |
| 57   | Interval.fromDateTimes throws with invalid input                                   | n/a        | non-date endpoint (`true`) is rejected by the TypeScript types                             |
| 61   | Interval.fromDateTimes throws with start date coming after end date                | translated | create.test.js:61                                                                          |
| 77   | Interval.after takes a duration                                                    | differs    | create.test.js:77 — ofDays(start, 3) ends on day 27 (inclusive), Luxon end 28              |
| 85   | Interval.after an object                                                           | n/a        | ofDays takes a day count only; no Duration vs object distinction (covered by line 77)      |
| 96   | Interval.before takes a duration                                                   | n/a        | no `before` factory on LocalDateRange                                                      |
| 104  | Interval.before takes a number and unit                                            | n/a        | no `before` factory on LocalDateRange                                                      |
| 115  | Interval.invalid produces invalid Intervals                                        | n/a        | no invalid instances                                                                       |
| 119  | Interval.invalid throws if throwOnInvalid is set                                   | n/a        | no invalid instances / Settings                                                            |
| 128  | Interval.invalid throws if no reason is specified                                  | n/a        | no invalid instances                                                                       |

### interval/format.test.js

30 tests: 5 translated, 2 differ on purpose, 23 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/interval/format.test.ts`. Mapping: 1982-05-25T09:00Z..1983-10-14T13:30Z = days 1982-05-25..1983-10-14 (both touched).

| line | Luxon test name                                                                                       | status     | daisy test or reason                                                                                 |
| ---- | ----------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| 13   | Interval#toString returns a simple range format                                                       | differs    | format.test.js:13 — toString is the ISO interval `1982-05-25/1983-10-14` (§5.4)                      |
| 16   | Interval#toString returns an unfriendly string for invalid intervals                                  | n/a        | no invalid instances                                                                                 |
| 23   | Interval#toLocaleString defaults to the DATE_SHORT format                                             | translated | format.test.js:23, DATE_SHORT as `M/d/yyyy` (Luxon's own mapping, impl/english.test.js:84)           |
| 26   | Interval#toLocaleString returns an unfriendly string for invalid intervals                            | n/a        | no invalid instances                                                                                 |
| 29   | Interval#toLocaleString lets the locale set the numbering system                                      | n/a        | ja locale, time-of-day interval; ranges have no time                                                 |
| 37   | Interval#toLocaleString accepts locale settings from the start DateTime                               | n/a        | locale `be` is not one of en/de/fr/es; values carry no locale                                        |
| 46   | Interval#toLocaleString accepts numbering system settings from the start DateTime                     | n/a        | numbering systems                                                                                    |
| 55   | Interval#toLocaleString accepts ouptput calendar settings from the start DateTime                     | n/a        | calendars                                                                                            |
| 64   | Interval#toLocaleString accepts options to the formatter                                              | translated | format.test.js:64, `{ weekday: 'short' }` as `EEE`                                                   |
| 68   | Interval#toLocaleString can override the start DateTime's locale                                      | translated | format.test.js:68, fr short preset                                                                   |
| 77   | Interval#toLocaleString can override the start DateTime's numbering system                            | n/a        | numbering systems                                                                                    |
| 86   | Interval#toLocaleString can override the start DateTime's output calendar                             | n/a        | calendars                                                                                            |
| 95   | Interval#toLocaleString shows things in the right IANA zone                                           | n/a        | time zones                                                                                           |
| 104  | Interval#toLocaleString shows things in the right fixed-offset zone                                   | n/a        | offsets                                                                                              |
| 112  | Interval#toLocaleString shows things in the right fixed-offset zone when showing the zone             | n/a        | offsets                                                                                              |
| 120  | Interval#toLocaleString shows things with UTC if fixed-offset with 0 offset is used                   | n/a        | offsets                                                                                              |
| 128  | Interval#toLocaleString does the best it can with unsupported fixed-offset zone when showing the zone | n/a        | offsets                                                                                              |
| 136  | Interval#toLocaleString uses locale-appropriate time formats                                          | n/a        | time-of-day intervals; LocalDateRange has no time                                                    |
| 173  | Interval#toLocaleString sets the separator between days for same-month dates                          | differs    | format.test.js:173 — `May 25–27, 1982`, unspaced dash when one field varies (T14)                    |
| 183  | Interval#toISO returns a simple ISO format                                                            | n/a        | instants with offsets; ranges hold dates only                                                        |
| 186  | Interval#toISO accepts ISO options                                                                    | n/a        | Luxon-only ISO options (suppressSeconds)                                                             |
| 189  | Interval#toISO returns an unfriendly string for invalid intervals                                     | n/a        | no invalid instances                                                                                 |
| 196  | Interval#toISODate returns a simple ISO date interval format                                          | translated | format.test.js:196                                                                                   |
| 199  | Interval#toISODate returns an unfriendly string for invalid intervals                                 | n/a        | no invalid instances                                                                                 |
| 206  | Interval#toISOTime returns a simple ISO time interval format                                          | n/a        | ranges have no time                                                                                  |
| 209  | Interval#toISOTime returns an unfriendly string for invalid intervals                                 | n/a        | no invalid instances                                                                                 |
| 212  | Interval#toISOTime accepts ISO options                                                                | n/a        | ranges have no time; Luxon-only ISO options                                                          |
| 221  | Interval#toFormat accepts date formats                                                                | translated | format.test.js:221; its `HH:mm` assertion differs: format.test.js:223 throws DaisyFormatError (§6.2) |
| 226  | Interval#toFormat accepts date formats (separator option)                                             | n/a        | no separator option; the locale's rangeSeparator is used                                             |
| 232  | Interval#toFormat returns an unfriendly string for invalid intervals                                  | n/a        | no invalid instances                                                                                 |

### interval/getters.test.js

4 tests: 1 translated, 1 differ on purpose, 2 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/interval/getters.test.ts`. Mapping: todayFrom(a, b) = 2017-05-a..2017-05-(b-1).

| line | Luxon test name                                   | status     | daisy test or reason                                                              |
| ---- | ------------------------------------------------- | ---------- | --------------------------------------------------------------------------------- |
| 9    | Interval.start gets the start                     | translated | getters.test.js:9                                                                 |
| 13   | Interval.start returns null for invalid intervals | n/a        | no invalid instances                                                              |
| 17   | Interval.end gets the end                         | differs    | getters.test.js:17 — end is the last included day (4), Luxon's exclusive end is 5 |
| 21   | Interval.end returns null for invalid intervals   | n/a        | no invalid instances                                                              |

### interval/info.test.js

45 tests: 8 translated, 1 differ on purpose, 36 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/interval/info.test.ts`. Mappings: count('days') = days() of the days the interval touches; contains: hour h of 1982-05-25 = day h of May 1982.

| line | Luxon test name                                                                 | status     | daisy test or reason                                                                       |
| ---- | ------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------ |
| 11   | Interval#length defaults to milliseconds                                        | n/a        | ranges are whole days, no millisecond length                                               |
| 17   | Interval#length('days') returns 1 for yesterday                                 | n/a        | exact elapsed length between instants (13:00 to 13:00); ranges have days() only            |
| 21   | Interval#length('months') returns the right number of months                    | n/a        | no fractional length in months; LocalDate#until is covered by the datetime diff files      |
| 25   | Interval#length('years') returns the right number of years                      | n/a        | no fractional length in years                                                              |
| 29   | Interval#length() returns NaN for invalid intervals                             | n/a        | no invalid instances                                                                       |
| 37   | Interval#count('days') returns 1 inside a day                                   | translated | info.test.js:37                                                                            |
| 42   | Interval#count('days') returns 2 if the interval crosses midnight               | translated | info.test.js:42                                                                            |
| 47   | Interval#count('years') returns 1 inside a year                                 | n/a        | no count by year; ranges count days only                                                   |
| 52   | Interval#count('years') returns 2 if the interval crosses the new year          | n/a        | no count by year                                                                           |
| 57   | Interval#count() does not count the endpoint of the interval                    | translated | info.test.js:57                                                                            |
| 62   | Interval#count() uses milliseconds by default                                   | n/a        | no milliseconds in ranges                                                                  |
| 67   | Interval#count() returns NaN for invalid intervals                              | n/a        | no invalid instances                                                                       |
| 75   | Interval#toDuration creates a duration in those units                           | n/a        | no range-to-duration conversion; fractional units                                          |
| 87   | Interval#toDuration accepts multiple units                                      | n/a        | no range-to-duration conversion; sub-day times                                             |
| 96   | Interval#toDuration accepts duration options                                    | n/a        | conversionAccuracy is Luxon-only                                                           |
| 102  | Interval#toDuration returns an invalid duration for invalid intervals           | n/a        | no invalid instances                                                                       |
| 111  | Interval#contains returns true for DateTimes in the interval                    | translated | info.test.js:111                                                                           |
| 116  | Interval#contains returns false for DateTimes after the interval                | translated | info.test.js:116                                                                           |
| 121  | Interval#contains returns false for DateTimes before the interval               | translated | info.test.js:121                                                                           |
| 126  | Interval#contains returns true for the start endpoint                           | translated | info.test.js:126                                                                           |
| 131  | Interval#contains returns false for the end endpoint                            | translated | info.test.js:131                                                                           |
| 136  | Interval#contains returns false for invalid intervals                           | n/a        | no invalid instances                                                                       |
| 144  | Interval#isEmpty returns true for empty intervals                               | differs    | info.test.js:144 — an empty range can't be built, throws DaisyRangeError (T10 never empty) |
| 149  | Interval#isEmpty returns false for non-empty intervals                          | n/a        | no isEmpty; every range is non-empty by construction                                       |
| 157  | Interval#isBefore returns true for intervals fully before the input             | n/a        | LocalDateRange has no isBefore(date) (§5.1: ranges only have equals)                       |
| 163  | Interval#isBefore returns false for intervals containing the input              | n/a        | no isBefore on ranges                                                                      |
| 169  | Interval#isBefore returns false for intervals fully after the input             | n/a        | no isBefore on ranges                                                                      |
| 175  | Interval#isBefore returns true for intervals ending at the input                | n/a        | no isBefore on ranges                                                                      |
| 181  | Interval#isBefore returns false for intervals just inside the input             | n/a        | no isBefore on ranges; millisecond instants                                                |
| 187  | Interval#isBefore returns false for invalid intervals                           | n/a        | no invalid instances                                                                       |
| 196  | Interval#isAfter returns true for intervals fully after the input               | n/a        | no isAfter on ranges                                                                       |
| 202  | Interval#isAfter returns false for intervals containing the input               | n/a        | no isAfter on ranges                                                                       |
| 208  | Interval#isAfter returns false for fully before the input                       | n/a        | no isAfter on ranges                                                                       |
| 214  | Interval#isAfter returns false for intervals beginning at the input             | n/a        | no isAfter on ranges                                                                       |
| 220  | Interval#isAfter returns false for invalid intervals                            | n/a        | no invalid instances                                                                       |
| 229  | Interval#hasSame('day') returns true for durations on the same day              | n/a        | no hasSame on ranges; sub-day instants                                                     |
| 235  | Interval#hasSame('day') returns true for durations that last until the next day | n/a        | no hasSame on ranges                                                                       |
| 241  | Interval#hasSame('day') returns true for durations durations ending at midnight | n/a        | no hasSame on ranges                                                                       |
| 247  | Interval#hasSame returns false for invalid intervals                            | n/a        | no invalid instances                                                                       |
| 252  | Interval#hasSame returns true for empty intervals [1982-05-25T00:00:00]         | n/a        | no hasSame; ranges are never empty                                                         |
| 252  | Interval#hasSame returns true for empty intervals [1982-05-25T00:00:02]         | n/a        | no hasSame; ranges are never empty                                                         |
| 252  | Interval#hasSame returns true for empty intervals [1982-05-25T12:00:00]         | n/a        | no hasSame; ranges are never empty                                                         |
| 252  | Interval#hasSame returns true for empty intervals [1982-05-25T23:59:58]         | n/a        | no hasSame; ranges are never empty                                                         |
| 252  | Interval#hasSame returns true for empty intervals [1982-05-25T23:59:59]         | n/a        | no hasSame; ranges are never empty                                                         |
| 264  | Interval#hasSame respects the zones of an empty interval's endpoints            | n/a        | time zones                                                                                 |

### interval/localeWeek.test.js

2 tests: 0 translated, 0 differ on purpose, 2 n/a, 0 possible bugs.

No daisy file.

| line | Luxon test name                                        | status | daisy test or reason                                                 |
| ---- | ------------------------------------------------------ | ------ | -------------------------------------------------------------------- |
| 8    | count(weeks) with useLocaleWeeks adheres to the locale | n/a    | locale weeks and count('weeks') don't exist; ranges have days() only |
| 16   | count(weeks) with useLocaleWeeks uses the start locale | n/a    | locale weeks; daisy values carry no locale                           |

### interval/many.test.js

47 tests: 12 translated, 3 differ on purpose, 32 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/interval/many.test.ts`. Mappings: fromISOs(a, b) = a..b-1; todayFrom(a, b) (hours a to b on 2017-05-25) = days 2017-05-a..2017-05-(b-1).

| line | Luxon test name                                                                    | status     | daisy test or reason                                                                                                                                           |
| ---- | ---------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 12   | Interval#equals returns true iff the times are the same                            | translated | many.test.js:12                                                                                                                                                |
| 25   | Interval#equals returns false for invalid intervals                                | n/a        | no invalid instances                                                                                                                                           |
| 38   | Interval#union returns an interval spanning a later interval                       | differs    | many.test.js:38 — 5..7 and 9..10 leave a gap, union throws DaisyRangeError (§5.4); `span` would give 5..10                                                     |
| 42   | Interval#union returns an interval spanning a earlier interval                     | differs    | many.test.js:42 — 5..7 and 3..3 leave a gap, union throws DaisyRangeError (§5.4)                                                                               |
| 46   | Interval#union returns an interval spanning a partially later interval             | translated | many.test.js:46                                                                                                                                                |
| 50   | Interval#union returns an interval spanning a partially earlier interval           | translated | many.test.js:50                                                                                                                                                |
| 54   | Interval#union returns an interval no-ops when applied to an engulfed interval     | translated | many.test.js:54                                                                                                                                                |
| 58   | Interval#union expands to an engulfing interval                                    | translated | many.test.js:58                                                                                                                                                |
| 62   | Interval#union spans adjacent intervals                                            | translated | many.test.js:62                                                                                                                                                |
| 66   | Interval#union returns invalid for invalid intervals                               | n/a        | no invalid instances                                                                                                                                           |
| 74   | Interval#intersection returns null if there's no intersection                      | translated | many.test.js:74                                                                                                                                                |
| 78   | Interval#intersection returns the intersection for overlapping intervals           | translated | many.test.js:78                                                                                                                                                |
| 82   | Interval#intersection returns null for adjacent intervals                          | translated | many.test.js:82                                                                                                                                                |
| 86   | Interval#intersection returns invalid for invalid intervals                        | n/a        | no invalid instances                                                                                                                                           |
| 93   | Interval.merge returns the minimal set of intervals                                | n/a        | no merge of range lists                                                                                                                                        |
| 109  | Interval.merge returns empty for an empty input                                    | n/a        | no merge of range lists                                                                                                                                        |
| 127  | Interval.xor returns non-overlapping intervals as-is                               | n/a        | no xor                                                                                                                                                         |
| 132  | Interval.xor returns empty for an empty input                                      | n/a        | no xor                                                                                                                                                         |
| 136  | Interval.xor returns empty for a fully overlapping set of intervals                | n/a        | no xor; ranges are never empty                                                                                                                                 |
| 141  | Interval.xor returns the non-overlapping parts of intervals                        | n/a        | no xor                                                                                                                                                         |
| 158  | Interval.xor handles funny adjacency cases                                         | n/a        | no xor                                                                                                                                                         |
| 183  | Interval#difference returns self for non-overlapping intervals                     | n/a        | no difference                                                                                                                                                  |
| 188  | Interval#difference returns the non-overlapping parts of intervals                 | n/a        | no difference                                                                                                                                                  |
| 194  | Interval#difference returns the empty for fully subtracted intervals               | n/a        | no difference                                                                                                                                                  |
| 200  | Interval#difference returns the outside parts when engulfing another interval      | n/a        | no difference                                                                                                                                                  |
| 209  | Interval#difference allows holes                                                   | n/a        | no difference                                                                                                                                                  |
| 220  | Interval#engulfs                                                                   | translated | many.test.js:223–230 (encloses)                                                                                                                                |
| 233  | Interval#engulfs returns false for invalid intervals                               | n/a        | no invalid instances                                                                                                                                           |
| 241  | Interval#abutsStart                                                                | translated | many.test.js:242–245 (symmetric abuts)                                                                                                                         |
| 248  | Interval#abutsStart returns false for invalid intervals                            | n/a        | no invalid instances                                                                                                                                           |
| 256  | Interval#abutsEnd                                                                  | translated | many.test.js:257–260 (symmetric abuts)                                                                                                                         |
| 263  | Interval#abutsEnd returns false for invalid intervals                              | n/a        | no invalid instances                                                                                                                                           |
| 271  | Interval#splitAt breaks up the interval                                            | n/a        | no splitAt at arbitrary dates; splitBy only cuts at week/month boundaries                                                                                      |
| 279  | Interval#splitAt returns [] for invalid intervals                                  | n/a        | no invalid instances                                                                                                                                           |
| 284  | Interval#splitAt ignores times outside the interval                                | n/a        | no splitAt                                                                                                                                                     |
| 304  | Interval#splitAt handles DST shifts                                                | n/a        | time zones / DST                                                                                                                                               |
| 325  | Interval#splitBy accepts an object                                                 | n/a        | splitBy takes 'week' or 'month', not an hour duration                                                                                                          |
| 333  | Interval#splitBy accepts a duration                                                | n/a        | splitBy takes no Duration                                                                                                                                      |
| 341  | Interval#splitBy returns [] for invalid intervals                                  | n/a        | no invalid instances                                                                                                                                           |
| 346  | Interval#split by returns [] for invalid durations                                 | n/a        | no invalid instances                                                                                                                                           |
| 351  | Interval#split by returns [] for durations of length 0                             | n/a        | splitBy takes no Duration                                                                                                                                      |
| 356  | Interval#split by works across varying length months                               | differs    | many.test.js:356 — splitBy('month') cuts at calendar month ends: 6 pieces 12-30..12-31, Jan…Apr, 05-01..05-02 (T10); Luxon steps P1M from the start (5 pieces) |
| 384  | Interval#divideEqually should split a 4 hour period into 4 contiguous 1-hour parts | n/a        | no divideEqually                                                                                                                                               |
| 391  | Interval#divideEqually should split a 1m30s into 3 30-second parts                 | n/a        | no divideEqually; sub-day times                                                                                                                                |
| 399  | Interval#divideEqually always gives you the right number of parts                  | n/a        | no divideEqually                                                                                                                                               |
| 405  | Interval#divideEqually returns [] for invalid intervals                            | n/a        | no invalid instances                                                                                                                                           |
| 410  | Interval#mapEndpoints returns a new Interval with the mapped endpoints             | n/a        | time zones (toUTC); no mapEndpoints                                                                                                                            |

### interval/parse.test.js

41 tests: 4 translated, 21 differ on purpose, 16 n/a, 0 possible bugs.

Daisy file: `test/compat/luxon/interval/parse.test.ts`. Luxon's "invalid, unparsable" = daisy's DaisyParseError.

| line | Luxon test name                                                                   | status     | daisy test or reason                                                                                                |
| ---- | --------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| 11   | Interval.fromISO can parse a variety of ISO formats                               | differs    | parse.test.js:20/42/64/86 — date-time, week-date and duration endpoints throw DaisyParseError (T10: date/date only) |
| 109  | Interval.fromISO accepts a zone argument                                          | n/a        | zone option; date/duration forms are T10-rejected                                                                   |
| 124  | Interval.fromISO works with Settings.throwOnInvalid                               | n/a        | Settings, offsets                                                                                                   |
| 142  | Interval.fromISO will return invalid for [null]                                   | n/a        | null is rejected by the TypeScript types                                                                            |
| 142  | Interval.fromISO will return invalid for []                                       | translated | parse.test.js:142 rejects the empty string                                                                          |
| 142  | Interval.fromISO will return invalid for [hello]                                  | translated | parse.test.js:142 rejects "hello"                                                                                   |
| 142  | Interval.fromISO will return invalid for [foo/bar]                                | translated | parse.test.js:142 rejects "foo/bar"                                                                                 |
| 142  | Interval.fromISO will return invalid for [R5/2008-03-01T13:00:00Z/P1Y2M10DT2H30M] | translated | parse.test.js:142 rejects a repeating interval                                                                      |
| 149  | Gregorian, end just time                                                          | differs    | parse.test.js:149 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 154  | Gregorian, end just time and zone                                                 | n/a        | offsets / zone option; daisy values have no zone (would also throw DaisyParseError, T10)                            |
| 159  | Gregorian, end just day                                                           | differs    | parse.test.js:159 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 164  | Gregorian, end day and time                                                       | differs    | parse.test.js:164 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 169  | Gregorian, end month and day                                                      | differs    | parse.test.js:169 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 174  | Gregorian, end month, day and time                                                | differs    | parse.test.js:174 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 179  | Gregorian with zone in options and partial date                                   | n/a        | offsets / zone option; daisy values have no zone (would also throw DaisyParseError, T10)                            |
| 184  | Gregorian with zone in options and partial date and time                          | n/a        | offsets / zone option; daisy values have no zone (would also throw DaisyParseError, T10)                            |
| 189  | Gregorian with zone in options and full date and time                             | n/a        | offsets / zone option; daisy values have no zone (would also throw DaisyParseError, T10)                            |
| 194  | Gregorian with zone in options and end zone                                       | n/a        | offsets / zone option; daisy values have no zone (would also throw DaisyParseError, T10)                            |
| 199  | Gregorian with zone in options, setZone and end zone                              | n/a        | offsets / zone option; daisy values have no zone (would also throw DaisyParseError, T10)                            |
| 207  | Gregorian with start zone                                                         | n/a        | offsets / zone option; daisy values have no zone (would also throw DaisyParseError, T10)                            |
| 212  | Gregorian with start zone and zone in options                                     | n/a        | offsets / zone option; daisy values have no zone (would also throw DaisyParseError, T10)                            |
| 217  | Gregorian with start zone and setZone                                             | n/a        | offsets / zone option; daisy values have no zone (would also throw DaisyParseError, T10)                            |
| 222  | Gregorian with two zones                                                          | n/a        | offsets / zone option; daisy values have no zone (would also throw DaisyParseError, T10)                            |
| 227  | Gregorian with two zones and setZone                                              | n/a        | offsets / zone option; daisy values have no zone (would also throw DaisyParseError, T10)                            |
| 234  | Week, end just time                                                               | differs    | parse.test.js:234 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 239  | Week, end just time and zone                                                      | n/a        | offsets / zone option; daisy values have no zone (would also throw DaisyParseError, T10)                            |
| 244  | Week, end week day                                                                | differs    | parse.test.js:244 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 249  | Week, end week number and week day                                                | differs    | parse.test.js:249 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 256  | Ordinal, end just time                                                            | differs    | parse.test.js:256 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 261  | Ordinal, end just time and zone                                                   | n/a        | offsets / zone option; daisy values have no zone (would also throw DaisyParseError, T10)                            |
| 266  | Ordinal, end with ordinal                                                         | differs    | parse.test.js:266 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 273  | Gregorian, end just weekday                                                       | differs    | parse.test.js:273 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 278  | Gregorian, end weekNumber and weekday                                             | differs    | parse.test.js:278 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 283  | Gregorian, end just ordinal                                                       | differs    | parse.test.js:283 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 289  | Week date, end just day                                                           | differs    | parse.test.js:289 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 294  | Week date, end month and day                                                      | differs    | parse.test.js:294 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 299  | Week date, end just ordinal                                                       | differs    | parse.test.js:299 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 305  | Ordinal, end just day                                                             | differs    | parse.test.js:305 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 310  | Ordinal, end month and day                                                        | differs    | parse.test.js:310 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 315  | Ordinal, end just weekday                                                         | differs    | parse.test.js:315 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |
| 320  | Ordinal, end weekNumber and weekday                                               | differs    | parse.test.js:320 throws DaisyParseError — only date/date intervals parse, no times or abbreviated ends (T10)       |

### interval/proto.test.js

1 tests: 0 translated, 0 differ on purpose, 1 n/a, 0 possible bugs.

No daisy file.

| line | Luxon test name                                               | status | daisy test or reason            |
| ---- | ------------------------------------------------------------- | ------ | ------------------------------- |
| 4    | Interval prototype properties should not throw when addressed | n/a    | prototype test of a Luxon class |

### interval/setter.test.js

3 tests: 0 translated, 0 differ on purpose, 3 n/a, 0 possible bugs.

No daisy file.

| line | Luxon test name                   | status | daisy test or reason                                                      |
| ---- | --------------------------------- | ------ | ------------------------------------------------------------------------- |
| 8    | Interval.set can set the start    | n/a    | LocalDateRange has no setter; a new range is built with LocalDateRange.of |
| 12   | Interval.set can set the end      | n/a    | LocalDateRange has no setter; a new range is built with LocalDateRange.of |
| 16   | Interval.set preserves invalidity | n/a    | no invalid instances                                                      |

### interval/typecheck.test.js

3 tests: 0 translated, 0 differ on purpose, 3 n/a, 0 possible bugs.

No daisy file.

| line | Luxon test name                                      | status | daisy test or reason                              |
| ---- | ---------------------------------------------------- | ------ | ------------------------------------------------- |
| 8    | Interval.isInterval return true for valid duration   | n/a    | typecheck of a Luxon class; daisy uses instanceof |
| 13   | Interval.isInterval return true for invalid duration | n/a    | typecheck test; no invalid instances              |
| 18   | Interval.isInterval return false for primitives      | n/a    | typecheck of a Luxon class                        |

### zones/IANA.test.js

19 tests: 0 translated, 0 differ on purpose, 19 n/a, 0 possible bugs.

No daisy file. Daisy has no time zones in values and no Zone classes (zones appear only as IANA strings in today/now/fromDate/toDate).

| line | Luxon test name                                                 | status | daisy test or reason                          |
| ---- | --------------------------------------------------------------- | ------ | --------------------------------------------- |
| 4    | IANAZone.create returns a singleton per zone name               | n/a    | Luxon Zone class; time zones are not modelled |
| 14   | IANAZone.create should return IANAZone instance                 | n/a    | Luxon Zone class; time zones are not modelled |
| 19   | IANAZone.isValidSpecifier                                       | n/a    | Luxon Zone class; time zones are not modelled |
| 31   | IANAZone.isValidZone                                            | n/a    | Luxon Zone class; time zones are not modelled |
| 41   | IANAZone.type returns a static string                           | n/a    | Luxon Zone class; time zones are not modelled |
| 46   | IANAZone.name returns the zone name passed to the constructor   | n/a    | Luxon Zone class; time zones are not modelled |
| 52   | IANAZone is not universal                                       | n/a    | Luxon Zone class; time zones are not modelled |
| 56   | IANAZone.offsetName with a long format                          | n/a    | Luxon Zone class; time zones are not modelled |
| 62   | IANAZone.offsetName with a short format                         | n/a    | Luxon Zone class; time zones are not modelled |
| 68   | IANAZone.formatOffset with a short format                       | n/a    | Luxon Zone class; time zones are not modelled |
| 74   | IANAZone.formatOffset with a narrow format                      | n/a    | Luxon Zone class; time zones are not modelled |
| 80   | IANAZone.formatOffset with a techie format                      | n/a    | Luxon Zone class; time zones are not modelled |
| 86   | IANAZone.formatOffset throws for an invalid format              | n/a    | Luxon Zone class; time zones are not modelled |
| 91   | IANAZone.equals requires both zones to be iana                  | n/a    | Luxon Zone class; time zones are not modelled |
| 95   | IANAZone.equals returns false even if the two share offsets     | n/a    | Luxon Zone class; time zones are not modelled |
| 101  | IANAZone.isValid returns true for valid zone names              | n/a    | Luxon Zone class; time zones are not modelled |
| 107  | IANAZone.isValid returns false for invalid zone names           | n/a    | Luxon Zone class; time zones are not modelled |
| 116  | IANAZone.normalize normalizes the zone name                     | n/a    | Luxon Zone class; time zones are not modelled |
| 126  | IANAZone returns canonical zone name regardless of input casing | n/a    | Luxon Zone class; time zones are not modelled |

### zones/fixedOffset.test.js

11 tests: 0 translated, 0 differ on purpose, 11 n/a, 0 possible bugs.

No daisy file. Daisy has no time zones in values and no Zone classes (zones appear only as IANA strings in today/now/fromDate/toDate).

| line | Luxon test name                                                                  | status | daisy test or reason                          |
| ---- | -------------------------------------------------------------------------------- | ------ | --------------------------------------------- |
| 4    | FixedOffsetZone.utcInstance returns a singleton                                  | n/a    | Luxon Zone class; time zones are not modelled |
| 8    | FixedOffsetZone.utcInstance provides valid UTC data                              | n/a    | Luxon Zone class; time zones are not modelled |
| 18   | FixedOffsetZone.parseSpecifier returns a valid instance from a UTC offset string | n/a    | Luxon Zone class; time zones are not modelled |
| 35   | FixedOffsetZone.parseSpecifier returns null for invalid data                     | n/a    | Luxon Zone class; time zones are not modelled |
| 43   | FixedOffsetZone.formatOffset is consistent despite the provided timestamp        | n/a    | Luxon Zone class; time zones are not modelled |
| 56   | FixedOffsetZone.formatOffset prints the correct sign before the offset           | n/a    | Luxon Zone class; time zones are not modelled |
| 66   | FixedOffsetZone is valid when constructed with a numeric offset                  | n/a    | Luxon Zone class; time zones are not modelled |
| 73   | FixedOffsetZone is invalid when constructed with a non-numeric offset            | n/a    | Luxon Zone class; time zones are not modelled |
| 84   | A DateTime in an invalid FixedOffsetZone is itself invalid                       | n/a    | Luxon Zone class; time zones are not modelled |
| 90   | FixedOffsetZone.equals requires both zones to be fixed                           | n/a    | Luxon Zone class; time zones are not modelled |
| 94   | FixedOffsetZone.equals compares fixed offset values                              | n/a    | Luxon Zone class; time zones are not modelled |

### zones/invalid.test.js

1 tests: 0 translated, 0 differ on purpose, 1 n/a, 0 possible bugs.

No daisy file. Daisy has no time zones in values and no Zone classes (zones appear only as IANA strings in today/now/fromDate/toDate).

| line | Luxon test name | status | daisy test or reason                          |
| ---- | --------------- | ------ | --------------------------------------------- |
| 4    | InvalidZone     | n/a    | Luxon Zone class; time zones are not modelled |

### zones/local.test.js

2 tests: 0 translated, 0 differ on purpose, 2 n/a, 0 possible bugs.

No daisy file. Daisy has no time zones in values and no Zone classes (zones appear only as IANA strings in today/now/fromDate/toDate).

| line | Luxon test name                         | status | daisy test or reason                          |
| ---- | --------------------------------------- | ------ | --------------------------------------------- |
| 4    | SystemZone.instance returns a singleton | n/a    | Luxon Zone class; time zones are not modelled |
| 8    | SystemZone.instance provides valid ...  | n/a    | Luxon Zone class; time zones are not modelled |

### zones/zoneInterface.test.js

1 tests: 0 translated, 0 differ on purpose, 1 n/a, 0 possible bugs.

No daisy file. Daisy has no time zones in values and no Zone classes (zones appear only as IANA strings in today/now/fromDate/toDate).

| line | Luxon test name                   | status | daisy test or reason                          |
| ---- | --------------------------------- | ------ | --------------------------------------------- |
| 4    | You can instantiate Zone directly | n/a    | Luxon Zone class; time zones are not modelled |
