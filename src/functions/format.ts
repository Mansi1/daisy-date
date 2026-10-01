import { dayOfWeekToIsoNumber } from '../day-of-week';
import { DaisyFormatError } from '../errors';
import { fieldSourceOf } from '../format/field-source';
import type { FieldSource } from '../format/field-source';
import { compilePattern } from '../format/pattern';
import type { FieldSymbol, PatternToken } from '../format/pattern';
import { assertNever } from '../internal/assert-never';
import { getDefaultLocale } from '../locale/default-locale';
import { PRESET_STYLE } from '../locale/types';
import type { Locale, PresetStyle, Presets } from '../locale/types';
import { LocalDateRange } from '../local-date-range';
import type { LocalDate } from '../local-date';
import { LocalDateTime } from '../local-date-time';
import type { DateValue } from './date-part';

export type FormatOptions = {
  /** The locale for names and presets; defaults to `getDefaultLocale()`. */
  locale?: Locale;
};

const DEFAULT_PRESET: PresetStyle = 'medium';

const NO_DIFFERENCE = 0;
const DAY_DIFFERENCE = 1;
const MONTH_DIFFERENCE = 2;
const YEAR_DIFFERENCE = 3;

/** The calendar level each field changes at; a range varies in every field at or below its largest difference. */
const FIELD_LEVEL: Readonly<Record<FieldSymbol, number>> = {
  y: YEAR_DIFFERENCE,
  Y: YEAR_DIFFERENCE,
  Q: MONTH_DIFFERENCE,
  M: MONTH_DIFFERENCE,
  L: MONTH_DIFFERENCE,
  d: DAY_DIFFERENCE,
  D: DAY_DIFFERENCE,
  E: DAY_DIFFERENCE,
  e: DAY_DIFFERENCE,
  c: DAY_DIFFERENCE,
  w: DAY_DIFFERENCE,
  a: NO_DIFFERENCE,
  H: NO_DIFFERENCE,
  h: NO_DIFFERENCE,
  K: NO_DIFFERENCE,
  k: NO_DIFFERENCE,
  m: NO_DIFFERENCE,
  s: NO_DIFFERENCE,
  S: NO_DIFFERENCE,
};

const MONTHS_PER_QUARTER = 3;
const HOURS_PER_HALF_DAY = 12;
const DAYS_PER_WEEK = 7;
const MILLISECOND_DIGITS = 3;

const isPresetStyle = (pattern: string): pattern is PresetStyle =>
  PRESET_STYLE.includes(pattern as PresetStyle);

/** Internal: reads a locale name list, which always has an entry for the index daisy computes. */
export const nameAt = (names: readonly string[], index: number): string => {
  const name = names[index];
  if (name === undefined) {
    throw new DaisyFormatError(`The locale has no name at index ${String(index)}`);
  }
  return name;
};

const padded = (value: number, width: number): string => {
  const digits = String(Math.abs(value)).padStart(width, '0');
  return value < 0 ? `-${digits}` : digits;
};

const formatYear = (year: number, width: number): string =>
  width === 2 ? padded(Math.abs(year) % 100, 2) : padded(year, width);

const monthName = (names: Locale['months']['format'], month: number, width: number): string => {
  const monthIndex = month - 1;
  if (width === 3) {
    return nameAt(names.abbreviated, monthIndex);
  }
  if (width === 4) {
    return nameAt(names.wide, monthIndex);
  }
  return width === 5 ? nameAt(names.narrow, monthIndex) : padded(month, width);
};

const weekdayName = (locale: Locale, source: FieldSource, width: number): string => {
  const weekdayIndex = dayOfWeekToIsoNumber(source.dayOfWeek) - 1;
  if (width === 4) {
    return nameAt(locale.weekdays.wide, weekdayIndex);
  }
  if (width === 5) {
    return nameAt(locale.weekdays.narrow, weekdayIndex);
  }
  return width === 6
    ? nameAt(locale.weekdays.short, weekdayIndex)
    : nameAt(locale.weekdays.abbreviated, weekdayIndex);
};

const localWeekdayNumber = (locale: Locale, source: FieldSource): number =>
  ((dayOfWeekToIsoNumber(source.dayOfWeek) -
    dayOfWeekToIsoNumber(locale.firstDayOfWeek) +
    DAYS_PER_WEEK) %
    DAYS_PER_WEEK) +
  1;

const quarterText = (locale: Locale, month: number, width: number): string => {
  const quarter = Math.ceil(month / MONTHS_PER_QUARTER);
  if (width === 3) {
    return nameAt(locale.quarters.abbreviated, quarter - 1);
  }
  return width === 4 ? nameAt(locale.quarters.wide, quarter - 1) : padded(quarter, width);
};

/** Internal: renders one pattern field; `symbol` and `width` were validated when the pattern was compiled. */
export const renderField = (
  symbol: FieldSymbol,
  width: number,
  source: FieldSource,
  locale: Locale,
): string => {
  const { hour, minute, second, millisecond } = source.time;
  switch (symbol) {
    case 'y':
      return formatYear(source.year, width);
    case 'Y':
      return formatYear(source.weekBasedYear, width);
    case 'M':
      return monthName(locale.months.format, source.month, width);
    case 'L':
      return monthName(locale.months.standalone, source.month, width);
    case 'd':
      return padded(source.day, width);
    case 'D':
      return padded(source.dayOfYear, width);
    case 'E':
      return weekdayName(locale, source, width);
    case 'e':
    case 'c':
      return padded(localWeekdayNumber(locale, source), width);
    case 'w':
      return padded(source.weekOfYear, width);
    case 'Q':
      return quarterText(locale, source.month, width);
    case 'a':
      return hour < HOURS_PER_HALF_DAY ? locale.dayPeriods.am : locale.dayPeriods.pm;
    case 'H':
      return padded(hour, width);
    case 'h':
      return padded(hour % HOURS_PER_HALF_DAY || HOURS_PER_HALF_DAY, width);
    case 'K':
      return padded(hour % HOURS_PER_HALF_DAY, width);
    case 'k':
      return padded(hour || 2 * HOURS_PER_HALF_DAY, width);
    case 'm':
      return padded(minute, width);
    case 's':
      return padded(second, width);
    case 'S':
      return padded(millisecond, MILLISECOND_DIGITS).slice(0, width);
    default:
      return assertNever(symbol);
  }
};

/** Internal: renders compiled tokens for one value. */
export const renderTokens = (
  tokens: readonly PatternToken[],
  source: FieldSource,
  locale: Locale,
): string =>
  tokens
    .map((token) =>
      token.kind === 'literal'
        ? token.text
        : renderField(token.symbol, token.width, source, locale),
    )
    .join('');

/** Internal: returns the preset's pattern if `pattern` names a preset, otherwise `pattern` itself. */
export const resolvePattern = (pattern: string, presets: Presets): string =>
  isPresetStyle(pattern) ? presets[pattern] : pattern;

const largestDifference = (start: LocalDate, end: LocalDate): number => {
  if (start.year !== end.year) {
    return YEAR_DIFFERENCE;
  }
  if (start.month !== end.month) {
    return MONTH_DIFFERENCE;
  }
  return start.day === end.day ? NO_DIFFERENCE : DAY_DIFFERENCE;
};

const namesMonth = (tokens: readonly PatternToken[]): boolean =>
  tokens.some(
    (token) =>
      token.kind === 'field' && (token.symbol === 'M' || token.symbol === 'L') && token.width >= 3,
  );

const formatRange = (range: LocalDateRange, pattern: string, locale: Locale): string => {
  const resolvedPattern = resolvePattern(pattern, locale.patterns.date);
  const { tokens, usesTime } = compilePattern(resolvedPattern);
  if (usesTime) {
    throw new DaisyFormatError(
      `Pattern "${resolvedPattern}" uses time fields, but a LocalDateRange has no time`,
    );
  }
  const startSource = fieldSourceOf(range.start);
  const endSource = fieldSourceOf(range.end);
  const difference = largestDifference(range.start, range.end);
  const varyingIndexes = tokens.flatMap((token, index) =>
    token.kind === 'field' && FIELD_LEVEL[token.symbol] <= difference ? [index] : [],
  );
  if (varyingIndexes.length === 0) {
    return renderTokens(tokens, startSource, locale);
  }
  if (!namesMonth(tokens)) {
    return `${renderTokens(tokens, startSource, locale)} ${locale.rangeSeparator} ${renderTokens(tokens, endSource, locale)}`;
  }
  const firstVarying = Math.min(...varyingIndexes);
  const lastVarying = Math.max(...varyingIndexes) + 1;
  const varyingTokens = tokens.slice(firstVarying, lastVarying);
  const separator =
    varyingTokens.length === 1 ? locale.rangeSeparator : ` ${locale.rangeSeparator} `;
  return (
    renderTokens(tokens.slice(0, firstVarying), startSource, locale) +
    renderTokens(varyingTokens, startSource, locale) +
    separator +
    renderTokens(varyingTokens, endSource, locale) +
    renderTokens(tokens.slice(lastVarying), endSource, locale)
  );
};

const formatValue = (value: DateValue, pattern: string, locale: Locale): string => {
  const presets = value instanceof LocalDateTime ? locale.patterns.dateTime : locale.patterns.date;
  const resolvedPattern = resolvePattern(pattern, presets);
  const compiledPattern = compilePattern(resolvedPattern);
  const source = fieldSourceOf(value);
  if (compiledPattern.usesTime && !source.hasTime) {
    throw new DaisyFormatError(
      `Pattern "${resolvedPattern}" uses time fields, but a LocalDate has no time`,
    );
  }
  return renderTokens(compiledPattern.tokens, source, locale);
};

/**
 * Formats a date, date-time or date range with an LDML pattern (`'EEEE, d MMMM yyyy'`) or a locale preset
 * (`'short'` … `'full'`, default `'medium'`). A range prints the fields its ends share once: `1–3 Oct 2026`.
 * Time fields on a LocalDate or range throw `DaisyFormatError`.
 */
export const format = (
  value: DateValue | LocalDateRange,
  pattern: string = DEFAULT_PRESET,
  options: FormatOptions = {},
): string => {
  const locale = options.locale ?? getDefaultLocale();
  return value instanceof LocalDateRange
    ? formatRange(value, pattern, locale)
    : formatValue(value, pattern, locale);
};
