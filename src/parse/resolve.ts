import { dayOfWeekToIsoNumber } from '../day-of-week';
import { DaisyFormatError, DaisyParseError, DaisyRangeError } from '../errors';
import { atTime } from '../functions/combine';
import { LocalDate } from '../local-date';
import type { LocalDateTime } from '../local-date-time';
import {
  failAt,
  missingDayMessage,
  missingYearMessage,
  parseWithPattern,
  resolveHour,
} from './pattern-parser';
import type { ParseContext, ParseOptions, PatternParse } from './pattern-parser';

const MONTHS_PER_QUARTER = 3;

const createDate = (context: ParseContext, create: () => LocalDate): LocalDate => {
  try {
    return create();
  } catch (error) {
    if (error instanceof DaisyRangeError) {
      throw new DaisyParseError(
        'The text names a date that does not exist',
        { input: context.text, pattern: context.pattern },
        { cause: error },
      );
    }
    throw error;
  }
};

/** Internal: builds the date from parsed fields; the pattern check already guarantees a year and a day. */
export const dateFromFields = ({ fields, context }: PatternParse): LocalDate => {
  const { year, month, day, dayOfYear } = fields;
  if (year === undefined) {
    throw new DaisyFormatError(missingYearMessage(context.pattern));
  }
  if (month !== undefined && day !== undefined) {
    return createDate(context, () => LocalDate.of(year.value, month.value, day.value));
  }
  if (dayOfYear !== undefined) {
    return createDate(context, () => LocalDate.ofYearDay(year.value, dayOfYear.value));
  }
  throw new DaisyFormatError(missingDayMessage(context.pattern));
};

const assertConsistent = ({ fields, context }: PatternParse, date: LocalDate): void => {
  const { month, day, dayOfYear, weekday, quarter } = fields;
  if (month !== undefined && month.value !== date.month) {
    failAt(
      context,
      `Month ${String(month.value)} does not match ${date.toString()}`,
      month.position,
    );
  }
  if (day !== undefined && day.value !== date.day) {
    failAt(context, `Day ${String(day.value)} does not match ${date.toString()}`, day.position);
  }
  if (dayOfYear !== undefined && dayOfYear.value !== date.dayOfYear) {
    failAt(
      context,
      `Day of year ${String(dayOfYear.value)} does not match ${date.toString()}`,
      dayOfYear.position,
    );
  }
  if (weekday !== undefined && weekday.value !== dayOfWeekToIsoNumber(date.dayOfWeek)) {
    failAt(context, `The weekday does not match ${date.toString()}`, weekday.position);
  }
  if (quarter !== undefined && quarter.value !== Math.ceil(date.month / MONTHS_PER_QUARTER)) {
    failAt(
      context,
      `Quarter ${String(quarter.value)} does not match ${date.toString()}`,
      quarter.position,
    );
  }
};

const resolveDate = (parse: PatternParse): LocalDate => {
  const date = dateFromFields(parse);
  assertConsistent(parse, date);
  return date;
};

/** Internal: parses `text` into a LocalDate with an LDML pattern or a date preset. */
export const parseDate = (text: string, pattern: string, options?: ParseOptions): LocalDate =>
  resolveDate(parseWithPattern(text, pattern, 'date', options));

/** Internal: parses `text` into a LocalDateTime with an LDML pattern or a date-time preset. */
export const parseDateTime = (
  text: string,
  pattern: string,
  options?: ParseOptions,
): LocalDateTime => {
  const parse = parseWithPattern(text, pattern, 'dateTime', options);
  const { minute, second, millisecond } = parse.fields;
  return atTime(
    resolveDate(parse),
    resolveHour(parse.fields),
    minute?.value ?? 0,
    second?.value ?? 0,
    millisecond?.value ?? 0,
  );
};

/** Internal: runs `parse` and returns `null` instead of throwing a `DaisyParseError`; other errors still throw. */
export const nullOnParseError = <T>(parse: () => T): T | null => {
  try {
    return parse();
  } catch (error) {
    if (error instanceof DaisyParseError) {
      return null;
    }
    throw error;
  }
};
