import { DaisyFormatError, DaisyParseError } from '../errors';
import { compilePattern } from '../format/pattern';
import type { FieldSymbol, PatternToken } from '../format/pattern';
import { assertNever } from '../internal/assert-never';
import { getDefaultLocale } from '../locale/default-locale';
import { PRESET_STYLE } from '../locale/types';
import type { Locale, PresetStyle } from '../locale/types';

export type ParseOptions = {
  /** The locale for names and presets; defaults to `getDefaultLocale()`. */
  locale?: Locale;
  /** `true` (default): numeric fields need their exact width, names their exact form, and no text may follow. */
  strict?: boolean;
};

/** What a pattern is parsed into: a date only, or a date with a time. */
export type ParseTarget = 'date' | 'dateTime';

export type FieldKey =
  | 'year'
  | 'month'
  | 'day'
  | 'dayOfYear'
  | 'weekday'
  | 'quarter'
  | 'hour'
  | 'clockHour'
  | 'dayPeriod'
  | 'minute'
  | 'second'
  | 'millisecond';

/** A parsed value and the index in the text where it was read. */
export type ParsedField = { readonly value: number; readonly position: number };

export type ParsedFields = Readonly<Partial<Record<FieldKey, ParsedField>>>;

type ParseState = { readonly position: number; readonly fields: ParsedFields };

export type ParseContext = {
  readonly text: string;
  readonly pattern: string;
  readonly locale: Locale;
  readonly strict: boolean;
};

type FieldValue = { readonly key: FieldKey; readonly value: number; readonly length: number };

const UNPARSEABLE_SYMBOLS: ReadonlySet<FieldSymbol> = new Set(['Y', 'w', 'e', 'c']);
const NARROW_WIDTH = 5;
const MILLISECOND_DIGITS = 3;
const HOURS_PER_HALF_DAY = 12;
const TWO_DIGIT_YEAR_BASE = 2000;
const PM = 1;

const MAXIMUM_DIGITS: Readonly<Record<FieldSymbol, number>> = {
  y: 6,
  Y: 6,
  M: 2,
  L: 2,
  d: 2,
  D: 3,
  E: 0,
  e: 1,
  c: 1,
  w: 2,
  Q: 1,
  a: 0,
  H: 2,
  h: 2,
  K: 2,
  k: 2,
  m: 2,
  s: 2,
  S: 3,
};

const isPresetStyle = (pattern: string): pattern is PresetStyle =>
  PRESET_STYLE.includes(pattern as PresetStyle);

/** Internal: throws a `DaisyParseError` for the parsed text, pointing at `index`. */
export const failAt = (context: ParseContext, reason: string, index: number): never => {
  throw new DaisyParseError(reason, { input: context.text, pattern: context.pattern, index });
};

const hasSymbol = (tokens: readonly PatternToken[], symbols: readonly FieldSymbol[]): boolean =>
  tokens.some((token) => token.kind === 'field' && symbols.includes(token.symbol));

/** Internal: the error message for a parse pattern without a year. */
export const missingYearMessage = (pattern: string): string =>
  `Pattern "${pattern}" has no year (y), so it can't be parsed into a date`;

/** Internal: the error message for a parse pattern without a month and day or a day of year. */
export const missingDayMessage = (pattern: string): string =>
  `Pattern "${pattern}" needs a month and a day (M and d) or a day of year (D) to be parsed into a date`;

/** Internal: rejects patterns that can't be parsed back into the target, before any text is read. */
export const assertParseablePattern = (
  tokens: readonly PatternToken[],
  pattern: string,
  target: ParseTarget,
): void => {
  const fields = tokens.filter((token) => token.kind === 'field');
  const unparseable = fields.find((token) => UNPARSEABLE_SYMBOLS.has(token.symbol));
  if (unparseable !== undefined) {
    throw new DaisyFormatError(
      `Pattern letter "${unparseable.symbol}" in "${pattern}" can be formatted but not parsed`,
    );
  }
  const narrow = fields.find(
    (token) => ['M', 'L', 'E'].includes(token.symbol) && token.width === NARROW_WIDTH,
  );
  if (narrow !== undefined) {
    throw new DaisyFormatError(
      `Narrow names ("${narrow.symbol.repeat(NARROW_WIDTH)}") in "${pattern}" are ambiguous and can't be parsed`,
    );
  }
  if (target === 'date' && hasSymbol(tokens, ['a', 'H', 'h', 'K', 'k', 'm', 's', 'S'])) {
    throw new DaisyFormatError(`Pattern "${pattern}" has time fields, but a LocalDate has no time`);
  }
  if (hasSymbol(tokens, ['h', 'K']) && !hasSymbol(tokens, ['a'])) {
    throw new DaisyFormatError(
      `Pattern "${pattern}" has a 12-hour field (h or K) but no AM/PM (a)`,
    );
  }
  if (hasSymbol(tokens, ['H', 'k']) && hasSymbol(tokens, ['a'])) {
    throw new DaisyFormatError(
      `Pattern "${pattern}" mixes a 24-hour field (H or k) with AM/PM (a)`,
    );
  }
  if (!hasSymbol(tokens, ['y'])) {
    throw new DaisyFormatError(missingYearMessage(pattern));
  }
  if (!hasSymbol(tokens, ['D']) && !(hasSymbol(tokens, ['M', 'L']) && hasSymbol(tokens, ['d']))) {
    throw new DaisyFormatError(missingDayMessage(pattern));
  }
};

const readDigits = (
  context: ParseContext,
  position: number,
  symbol: FieldSymbol,
  width: number,
): { readonly digits: string } => {
  const exactWidth = context.strict && width > 1;
  const minimum = exactWidth ? width : 1;
  const maximum = exactWidth ? width : Math.max(width, MAXIMUM_DIGITS[symbol]);
  const digits = new RegExp(`^\\d{${String(minimum)},${String(maximum)}}`).exec(
    context.text.slice(position),
  )?.[0];
  if (digits === undefined) {
    const expected = minimum === maximum ? `${String(minimum)} digits` : 'a number';
    return failAt(context, `Expected ${expected} for "${symbol.repeat(width)}"`, position);
  }
  return { digits };
};

const readName = (
  context: ParseContext,
  position: number,
  candidates: readonly (readonly string[])[],
  description: string,
): { readonly index: number; readonly length: number } => {
  const remainingText = context.text.slice(position).toLowerCase();
  const matches = candidates.flatMap((names) =>
    names.flatMap((name, index) =>
      remainingText.startsWith(name.toLowerCase()) ? [{ index, length: name.length }] : [],
    ),
  );
  const longestMatch = matches.reduce<{ index: number; length: number } | undefined>(
    (longest, match) => (longest === undefined || match.length > longest.length ? match : longest),
    undefined,
  );
  return longestMatch ?? failAt(context, `Expected ${description}`, position);
};

const namesFor = (
  context: ParseContext,
  width: number,
  abbreviated: readonly string[],
  wide: readonly string[],
): readonly (readonly string[])[] => {
  if (!context.strict) {
    return [abbreviated, wide];
  }
  return width === 4 ? [wide] : [abbreviated];
};

const numeric = (
  context: ParseContext,
  position: number,
  symbol: FieldSymbol,
  width: number,
  key: FieldKey,
): FieldValue => {
  const { digits } = readDigits(context, position, symbol, width);
  return { key, value: Number(digits), length: digits.length };
};

const yearValue = (context: ParseContext, position: number, width: number): FieldValue => {
  const { digits } = readDigits(context, position, 'y', width);
  const twoDigitYear = width === 2 && digits.length <= 2;
  return {
    key: 'year',
    value: twoDigitYear ? TWO_DIGIT_YEAR_BASE + Number(digits) : Number(digits),
    length: digits.length,
  };
};

const monthValue = (
  context: ParseContext,
  position: number,
  symbol: 'M' | 'L',
  width: number,
): FieldValue => {
  if (width <= 2) {
    return numeric(context, position, symbol, width, 'month');
  }
  const names = symbol === 'M' ? context.locale.months.format : context.locale.months.standalone;
  const match = readName(
    context,
    position,
    namesFor(context, width, names.abbreviated, names.wide),
    'a month name',
  );
  return { key: 'month', value: match.index + 1, length: match.length };
};

const weekdayValue = (context: ParseContext, position: number, width: number): FieldValue => {
  const { weekdays } = context.locale;
  const candidates =
    width === 6 && context.strict
      ? [weekdays.short]
      : namesFor(context, width, weekdays.abbreviated, weekdays.wide);
  const match = readName(
    context,
    position,
    context.strict ? candidates : [...candidates, weekdays.short],
    'a weekday name',
  );
  return { key: 'weekday', value: match.index + 1, length: match.length };
};

const quarterValue = (context: ParseContext, position: number, width: number): FieldValue => {
  if (width <= 2) {
    return numeric(context, position, 'Q', width, 'quarter');
  }
  const { quarters } = context.locale;
  const match = readName(
    context,
    position,
    namesFor(context, width, quarters.abbreviated, quarters.wide),
    'a quarter',
  );
  return { key: 'quarter', value: match.index + 1, length: match.length };
};

const dayPeriodValue = (context: ParseContext, position: number): FieldValue => {
  const { am, pm } = context.locale.dayPeriods;
  const match = readName(context, position, [[am, pm]], `${am} or ${pm}`);
  return { key: 'dayPeriod', value: match.index, length: match.length };
};

const fractionValue = (context: ParseContext, position: number, width: number): FieldValue => {
  const { digits } = readDigits(context, position, 'S', width);
  return {
    key: 'millisecond',
    value: Number(digits.padEnd(MILLISECOND_DIGITS, '0')),
    length: digits.length,
  };
};

/** Internal: reads one field at `position`; the pattern was checked by `assertParseablePattern` first. */
export const readField = (
  context: ParseContext,
  position: number,
  symbol: FieldSymbol,
  width: number,
): FieldValue => {
  switch (symbol) {
    case 'y':
      return yearValue(context, position, width);
    case 'M':
    case 'L':
      return monthValue(context, position, symbol, width);
    case 'd':
      return numeric(context, position, symbol, width, 'day');
    case 'D':
      return numeric(context, position, symbol, width, 'dayOfYear');
    case 'E':
      return weekdayValue(context, position, width);
    case 'Q':
      return quarterValue(context, position, width);
    case 'a':
      return dayPeriodValue(context, position);
    case 'H':
    case 'k':
      return numeric(context, position, symbol, width, 'hour');
    case 'h':
    case 'K':
      return numeric(context, position, symbol, width, 'clockHour');
    case 'm':
      return numeric(context, position, symbol, width, 'minute');
    case 's':
      return numeric(context, position, symbol, width, 'second');
    case 'S':
      return fractionValue(context, position, width);
    case 'Y':
    case 'w':
    case 'e':
    case 'c':
      throw new DaisyFormatError(`Pattern letter "${symbol}" can be formatted but not parsed`);
    default:
      return assertNever(symbol);
  }
};

const FIELD_RANGE: Readonly<Partial<Record<FieldSymbol, readonly [number, number]>>> = {
  M: [1, 12],
  L: [1, 12],
  d: [1, 31],
  D: [1, 366],
  Q: [1, 4],
  H: [0, 23],
  k: [1, 24],
  h: [1, 12],
  K: [0, 11],
  m: [0, 59],
  s: [0, 59],
};

const storeField = (
  context: ParseContext,
  state: ParseState,
  token: Extract<PatternToken, { kind: 'field' }>,
): ParseState => {
  const field = readField(context, state.position, token.symbol, token.width);
  const range = FIELD_RANGE[token.symbol];
  if (range !== undefined && (field.value < range[0] || field.value > range[1])) {
    failAt(
      context,
      `"${token.symbol.repeat(token.width)}" must be from ${String(range[0])} to ${String(range[1])}, got ${String(field.value)}`,
      state.position,
    );
  }
  const value = token.symbol === 'k' ? field.value % (2 * HOURS_PER_HALF_DAY) : field.value;
  const earlierField = state.fields[field.key];
  if (earlierField !== undefined && earlierField.value !== value) {
    failAt(
      context,
      `"${token.symbol.repeat(token.width)}" contradicts an earlier field`,
      state.position,
    );
  }
  return {
    position: state.position + field.length,
    fields: { ...state.fields, [field.key]: { value, position: state.position } },
  };
};

const parseToken = (context: ParseContext, state: ParseState, token: PatternToken): ParseState => {
  if (token.kind === 'field') {
    return storeField(context, state, token);
  }
  if (!context.text.startsWith(token.text, state.position)) {
    failAt(context, `Expected "${token.text}"`, state.position);
  }
  return { ...state, position: state.position + token.text.length };
};

/** Internal: the 24-hour hour from `H`/`k`, or from `h`/`K` with AM/PM; 0 if the pattern has no hour. */
export const resolveHour = ({ hour, clockHour, dayPeriod }: ParsedFields): number => {
  if (clockHour === undefined) {
    return hour?.value ?? 0;
  }
  return (
    (clockHour.value % HOURS_PER_HALF_DAY) + (dayPeriod?.value === PM ? HOURS_PER_HALF_DAY : 0)
  );
};

/** The raw result of reading text with a pattern: the fields, each with its position, and the context. */
export type PatternParse = { readonly fields: ParsedFields; readonly context: ParseContext };

/**
 * Internal: reads `text` with an LDML pattern or preset into raw fields. Throws `DaisyFormatError` for patterns
 * that can't be parsed and `DaisyParseError` (with the failing index) for text that doesn't match.
 */
export const parseWithPattern = (
  text: string,
  pattern: string,
  target: ParseTarget,
  options: ParseOptions = {},
): PatternParse => {
  const locale = options.locale ?? getDefaultLocale();
  const presets = target === 'date' ? locale.patterns.date : locale.patterns.dateTime;
  const resolvedPattern = isPresetStyle(pattern) ? presets[pattern] : pattern;
  const { tokens } = compilePattern(resolvedPattern);
  assertParseablePattern(tokens, resolvedPattern, target);
  const context: ParseContext = {
    text,
    pattern: resolvedPattern,
    locale,
    strict: options.strict ?? true,
  };
  const { position, fields } = tokens.reduce<ParseState>(
    (state, token) => parseToken(context, state, token),
    { position: 0, fields: {} },
  );
  if (context.strict && position < text.length) {
    failAt(context, 'Unexpected text after the date', position);
  }
  return { fields, context };
};
