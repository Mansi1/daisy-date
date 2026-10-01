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
import { LocalDateTime } from '../local-date-time';
import type { DateValue } from './date-part';

export type FormatOptions = {
  /** The locale for names and presets; defaults to `getDefaultLocale()`. */
  locale?: Locale;
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

/**
 * Formats a date or date-time with an LDML pattern (`'EEEE, d MMMM yyyy'`) or a locale preset (`'short'`,
 * `'medium'`, `'long'`, `'full'`). Time fields on a LocalDate throw `DaisyFormatError`.
 */
export const format = (value: DateValue, pattern: string, options: FormatOptions = {}): string => {
  const locale = options.locale ?? getDefaultLocale();
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
