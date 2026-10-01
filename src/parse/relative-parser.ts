import { DAY_OF_WEEK } from '../day-of-week';
import type { DayOfWeek } from '../day-of-week';
import { DaisyParseError } from '../errors';
import { nextOrSame, startOfMonth, startOfWeek, startOfYear } from '../functions/adjusters';
import { plusDays, plusMonths, plusWeeks, plusYears } from '../functions/arithmetic';
import { assertNever } from '../internal/assert-never';
import { getDefaultLocale } from '../locale/default-locale';
import type { Locale, RelativeGrammar, RelativeUnit } from '../locale/types';
import { LocalDate } from '../local-date';

export type RelativeParseOptions = {
  /** The day the text is relative to; defaults to today in the system time zone. */
  relativeTo?: LocalDate;
  /** The locale whose grammar is read; defaults to `getDefaultLocale()`. */
  locale?: Locale;
};

type DateUnit = Extract<RelativeUnit, 'day' | 'week' | 'month' | 'year'>;

type PeriodWord = 'week' | 'month' | 'year';

type Target =
  | { readonly kind: 'weekday'; readonly day: DayOfWeek }
  | { readonly kind: 'period'; readonly period: PeriodWord };

type Captures = { readonly amount?: number; readonly unit?: DateUnit; readonly target?: Target };

const DIRECTIONS = ['next', 'last', 'this'] as const;

type Direction = (typeof DIRECTIONS)[number];

const DIRECTION_OFFSET: Readonly<Record<Direction, number>> = { last: -1, this: 0, next: 1 };
const DATE_UNITS: readonly RelativeUnit[] = ['day', 'week', 'month', 'year'];
const DIGITS = /^\d+$/;

const tokensOf = (text: string): readonly string[] =>
  text.normalize('NFC').trim().toLowerCase().split(/\s+/);

const isDateUnit = (unit: RelativeUnit): unit is DateUnit => DATE_UNITS.includes(unit);

const weekdayOf = (locale: Locale, word: string): DayOfWeek | undefined => {
  const index = [locale.weekdays.wide, locale.weekdays.abbreviated]
    .map((names) => names.findIndex((name) => name.toLowerCase() === word))
    .find((foundIndex) => foundIndex !== -1);
  return index === undefined ? undefined : DAY_OF_WEEK[index];
};

const amountOf = (grammar: RelativeGrammar, word: string): number | undefined =>
  DIGITS.test(word) ? Number(word) : grammar.numbers[word];

const dateUnitOf = (grammar: RelativeGrammar, word: string): DateUnit | undefined => {
  const unit = grammar.units[word];
  return unit !== undefined && isDateUnit(unit) ? unit : undefined;
};

const targetOf = (locale: Locale, word: string): Target | undefined => {
  const day = weekdayOf(locale, word);
  if (day !== undefined) {
    return { kind: 'weekday', day };
  }
  const period = locale.relativeGrammar.periods[word];
  return period === undefined ? undefined : { kind: 'period', period };
};

const matchToken = (locale: Locale, templateToken: string, word: string): Captures | null => {
  const grammar = locale.relativeGrammar;
  if (templateToken === '{amount}') {
    const amount = amountOf(grammar, word);
    return amount === undefined ? null : { amount };
  }
  if (templateToken === '{unit}') {
    const unit = dateUnitOf(grammar, word);
    return unit === undefined ? null : { unit };
  }
  if (templateToken === '{target}') {
    const target = targetOf(locale, word);
    return target === undefined ? null : { target };
  }
  return templateToken === word ? {} : null;
};

const matchTemplate = (
  locale: Locale,
  template: string,
  words: readonly string[],
): Captures | null => {
  const templateTokens = tokensOf(template);
  if (templateTokens.length !== words.length) {
    return null;
  }
  const matches = templateTokens.map((templateToken, index) =>
    matchToken(locale, templateToken, words.slice(index, index + 1).join('')),
  );
  return matches.every((match) => match !== null)
    ? matches.reduce<Captures>((captures, match) => ({ ...captures, ...match }), {})
    : null;
};

const firstMatch = (
  locale: Locale,
  templates: readonly string[],
  words: readonly string[],
): Captures | undefined =>
  templates
    .map((template) => matchTemplate(locale, template, words))
    .find((captures): captures is Captures => captures !== null);

/** Internal: moves `relativeTo` by `amount` of a date unit. */
export const moveBy = (relativeTo: LocalDate, unit: DateUnit, amount: number): LocalDate => {
  switch (unit) {
    case 'day':
      return plusDays(relativeTo, amount);
    case 'week':
      return plusWeeks(relativeTo, amount);
    case 'month':
      return plusMonths(relativeTo, amount);
    case 'year':
      return plusYears(relativeTo, amount);
    default:
      return assertNever(unit);
  }
};

/** Internal: the start of the week, month or year `offset` periods away from `relativeTo`. */
export const startOfPeriod = (
  locale: Locale,
  relativeTo: LocalDate,
  period: PeriodWord,
  offset: number,
): LocalDate => {
  switch (period) {
    case 'week':
      return plusWeeks(startOfWeek(relativeTo, locale.firstDayOfWeek), offset);
    case 'month':
      return startOfMonth(plusMonths(relativeTo, offset));
    case 'year':
      return startOfYear(plusYears(relativeTo, offset));
    default:
      return assertNever(period);
  }
};

const resolveTarget = (
  locale: Locale,
  relativeTo: LocalDate,
  target: Target,
  direction: Direction,
): LocalDate => {
  const offset = DIRECTION_OFFSET[direction];
  if (target.kind === 'period') {
    return startOfPeriod(locale, relativeTo, target.period, offset);
  }
  return nextOrSame(startOfPeriod(locale, relativeTo, 'week', offset), target.day);
};

const resolveAmount = (
  relativeTo: LocalDate,
  captures: Captures | undefined,
  sign: 1 | -1,
): LocalDate | undefined =>
  captures?.amount === undefined || captures.unit === undefined
    ? undefined
    : moveBy(relativeTo, captures.unit, sign * captures.amount);

const resolveDirection = (
  locale: Locale,
  relativeTo: LocalDate,
  words: readonly string[],
): LocalDate | undefined =>
  DIRECTIONS.map((direction) => {
    const target = firstMatch(locale, locale.relativeGrammar[direction], words)?.target;
    return target === undefined ? undefined : resolveTarget(locale, relativeTo, target, direction);
  }).find((date) => date !== undefined);

const resolve = (locale: Locale, relativeTo: LocalDate, text: string): LocalDate | undefined => {
  const words = tokensOf(text);
  const grammar = locale.relativeGrammar;
  const specialDay = grammar.specialDays[words.join(' ')];
  if (specialDay !== undefined) {
    return plusDays(relativeTo, specialDay);
  }
  const loneWeekday = words.length === 1 ? weekdayOf(locale, words.join('')) : undefined;
  if (loneWeekday !== undefined) {
    return nextOrSame(relativeTo, loneWeekday);
  }
  return (
    resolveAmount(relativeTo, firstMatch(locale, grammar.future, words), 1) ??
    resolveAmount(relativeTo, firstMatch(locale, grammar.past, words), -1) ??
    resolveDirection(locale, relativeTo, words)
  );
};

/**
 * Internal: reads relative text such as `tomorrow`, `in 3 days`, `2 weeks ago`, `next friday`, `last month` or
 * `friday` with the locale's grammar; throws `DaisyParseError` for anything else.
 */
export const parseRelativeDate = (text: string, options: RelativeParseOptions = {}): LocalDate => {
  const locale = options.locale ?? getDefaultLocale();
  const relativeTo = options.relativeTo ?? LocalDate.today();
  const date = resolve(locale, relativeTo, text);
  if (date === undefined) {
    throw new DaisyParseError('Unrecognised relative date', { input: text });
  }
  return date;
};
