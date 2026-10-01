import { dayOfWeekToIsoNumber } from '../day-of-week';
import { DaisyRangeError } from '../errors';
import {
  MILLISECONDS_PER_HOUR,
  MILLISECONDS_PER_MINUTE,
  MILLISECONDS_PER_SECOND,
} from '../internal/time-units';
import { getDefaultLocale } from '../locale/default-locale';
import { RELATIVE_STYLE } from '../locale/types';
import type { Locale, RelativeStyle, RelativeUnit } from '../locale/types';
import { LocalDate } from '../local-date';
import { LocalDateTime } from '../local-date-time';
import { startOfWeek } from './adjusters';
import { toMillis } from './amounts';
import { daysUntil, durationUntil, until } from './arithmetic';
import type { DateValue } from './date-part';
import { nameAt } from './format';

/** Whether relative text may use words (`tomorrow`, `next Friday`) or always numbers (`in 1 day`). */
export const RELATIVE_NUMERIC = ['auto', 'always'] as const;

export type RelativeNumeric = (typeof RELATIVE_NUMERIC)[number];

export type RelativeOptions = {
  /** The point the text is relative to; defaults to today (for a date) or now (for a date-time). */
  relativeTo?: DateValue;
  /** The locale for the phrases; defaults to `getDefaultLocale()`. */
  locale?: Locale;
  /** `'long'` (default) gives `in 3 days`, `'short'` gives `in 3 d`. */
  style?: RelativeStyle;
  /** `'auto'` (default) allows `tomorrow` and `next Friday`; `'always'` gives `in 1 day`. */
  numeric?: RelativeNumeric;
};

type RelativeSettings = {
  readonly locale: Locale;
  readonly style: RelativeStyle;
  readonly numeric: RelativeNumeric;
};

const MONTHS_PER_YEAR = 12;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH_THRESHOLD = 31;
const DAYS_PER_YEAR_THRESHOLD = 365;
const SPECIAL_DAY_REACH = 2;
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;

const resolveSettings = ({
  locale = getDefaultLocale(),
  style = 'long',
  numeric = 'auto',
}: RelativeOptions): RelativeSettings => {
  if (!RELATIVE_STYLE.includes(style)) {
    throw new DaisyRangeError(
      `Relative style must be one of ${RELATIVE_STYLE.join(', ')}, got ${style}`,
    );
  }
  if (!RELATIVE_NUMERIC.includes(numeric)) {
    throw new DaisyRangeError(
      `Relative numeric must be one of ${RELATIVE_NUMERIC.join(', ')}, got ${numeric}`,
    );
  }
  return { locale, style, numeric };
};

const phrase = (settings: RelativeSettings, unit: RelativeUnit, count: number): string => {
  const phrases = settings.locale.relative.units[unit][settings.style];
  const forms = count < 0 ? phrases.past : phrases.future;
  const magnitude = Math.abs(count);
  return (forms[settings.locale.plural(magnitude)] ?? forms.other).replace(
    '{0}',
    String(magnitude),
  );
};

const specialDay = (settings: RelativeSettings, days: number): string => {
  const { dayBeforeYesterday, yesterday, today, tomorrow, dayAfterTomorrow } =
    settings.locale.relative.days;
  return nameAt(
    [dayBeforeYesterday, yesterday, today, tomorrow, dayAfterTomorrow],
    days + SPECIAL_DAY_REACH,
  );
};

const weekdayPhrase = (
  settings: RelativeSettings,
  target: LocalDate,
  relativeTo: LocalDate,
): string => {
  const { locale } = settings;
  const weekOffset =
    daysUntil(
      startOfWeek(relativeTo, locale.firstDayOfWeek),
      startOfWeek(target, locale.firstDayOfWeek),
    ) / DAYS_PER_WEEK;
  const templates = locale.relative.weekdays;
  const template =
    weekOffset < 0 ? templates.last : weekOffset > 0 ? templates.next : templates.this;
  const weekdayName = nameAt(locale.weekdays.wide, dayOfWeekToIsoNumber(target.dayOfWeek) - 1);
  return template.replace('{0}', weekdayName);
};

const describeDays = (
  settings: RelativeSettings,
  target: LocalDate,
  relativeTo: LocalDate,
): string => {
  const days = daysUntil(relativeTo, target);
  const distance = Math.abs(days);
  const direction = Math.sign(days);
  if (settings.numeric === 'auto' && distance <= SPECIAL_DAY_REACH) {
    return specialDay(settings, days);
  }
  if (settings.numeric === 'auto' && distance < DAYS_PER_WEEK) {
    return weekdayPhrase(settings, target, relativeTo);
  }
  if (distance < DAYS_PER_WEEK) {
    return phrase(settings, 'day', days);
  }
  if (distance < DAYS_PER_MONTH_THRESHOLD) {
    return phrase(settings, 'week', direction * Math.floor(distance / DAYS_PER_WEEK));
  }
  const period = until(relativeTo, target);
  if (distance < DAYS_PER_YEAR_THRESHOLD || period.years === 0) {
    return phrase(settings, 'month', period.years * MONTHS_PER_YEAR + period.months);
  }
  return phrase(settings, 'year', period.years);
};

const describeClock = (
  settings: RelativeSettings,
  target: LocalDateTime,
  relativeTo: LocalDateTime,
): string => {
  const milliseconds = toMillis(durationUntil(relativeTo, target));
  const distance = Math.abs(milliseconds);
  const direction = Math.sign(milliseconds);
  if (distance >= MILLISECONDS_PER_DAY) {
    return describeDays(settings, target.toLocalDate(), relativeTo.toLocalDate());
  }
  if (distance >= MILLISECONDS_PER_HOUR) {
    return phrase(settings, 'hour', direction * Math.floor(distance / MILLISECONDS_PER_HOUR));
  }
  if (distance >= MILLISECONDS_PER_MINUTE) {
    return phrase(settings, 'minute', direction * Math.floor(distance / MILLISECONDS_PER_MINUTE));
  }
  const seconds = Math.floor(distance / MILLISECONDS_PER_SECOND);
  if (settings.numeric === 'auto' && seconds === 0) {
    return settings.locale.relative.now;
  }
  return phrase(settings, 'second', direction * seconds);
};

const asDate = (value: DateValue): LocalDate =>
  value instanceof LocalDateTime ? value.toLocalDate() : value;

const asDateTime = (value: DateValue): LocalDateTime =>
  value instanceof LocalDateTime ? value : value.atStartOfDay();

/**
 * Describes `value` relative to `options.relativeTo` (default: today or now): `tomorrow`, `next Friday`,
 * `in 3 days`, `2 weeks ago`, `in 4 months`. Date-times less than a day apart use hours, minutes and seconds.
 */
export const formatRelative = (value: DateValue, options: RelativeOptions = {}): string => {
  const settings = resolveSettings(options);
  if (value instanceof LocalDateTime) {
    return describeClock(settings, value, asDateTime(options.relativeTo ?? LocalDateTime.now()));
  }
  return describeDays(settings, value, asDate(options.relativeTo ?? LocalDate.today()));
};
