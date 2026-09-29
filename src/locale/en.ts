import { selectPluralCategory } from './plural-rules';
import type { Locale, PluralCategory, RelativePhrases } from './types';

const ORDINAL_SUFFIX: Readonly<Partial<Record<PluralCategory, string>>> = {
  one: 'st',
  two: 'nd',
  few: 'rd',
};

const MONTHS = {
  wide: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
} as const;

const relativePhrases = (singular: string, plural: string): RelativePhrases => ({
  future: { one: `in {0} ${singular}`, other: `in {0} ${plural}` },
  past: { one: `{0} ${singular} ago`, other: `{0} ${plural} ago` },
});

/** English, the default locale. */
export const en: Locale = {
  code: 'en',
  firstDayOfWeek: 'monday',
  weekend: ['saturday', 'sunday'],
  months: { format: MONTHS, standalone: MONTHS },
  weekdays: {
    wide: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    abbreviated: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    short: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    narrow: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  },
  quarters: {
    abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
    wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  },
  dayPeriods: { am: 'AM', pm: 'PM' },
  plural: (count) => selectPluralCategory('en', count),
  ordinal: (count) =>
    `${String(count)}${ORDINAL_SUFFIX[selectPluralCategory('en', count, 'ordinal')] ?? 'th'}`,
  patterns: {
    date: {
      short: 'M/d/yy',
      medium: 'MMM d, yyyy',
      long: 'MMMM d, yyyy',
      full: 'EEEE, MMMM d, yyyy',
    },
    time: {
      short: 'h:mm a',
      medium: 'h:mm:ss a',
      long: 'h:mm:ss a',
      full: 'h:mm:ss.SSS a',
    },
    dateTime: {
      short: 'M/d/yy, h:mm a',
      medium: 'MMM d, yyyy, h:mm:ss a',
      long: "MMMM d, yyyy 'at' h:mm:ss a",
      full: "EEEE, MMMM d, yyyy 'at' h:mm:ss a",
    },
  },
  units: {
    years: {
      long: { one: '{0} year', other: '{0} years' },
      short: { one: '{0} yr', other: '{0} yrs' },
      narrow: { other: '{0}y' },
    },
    months: {
      long: { one: '{0} month', other: '{0} months' },
      short: { one: '{0} mo', other: '{0} mos' },
      narrow: { other: '{0}mo' },
    },
    weeks: {
      long: { one: '{0} week', other: '{0} weeks' },
      short: { one: '{0} wk', other: '{0} wks' },
      narrow: { other: '{0}w' },
    },
    days: {
      long: { one: '{0} day', other: '{0} days' },
      short: { other: '{0} d' },
      narrow: { other: '{0}d' },
    },
    hours: {
      long: { one: '{0} hour', other: '{0} hours' },
      short: { one: '{0} hr', other: '{0} hrs' },
      narrow: { other: '{0}h' },
    },
    minutes: {
      long: { one: '{0} minute', other: '{0} minutes' },
      short: { other: '{0} min' },
      narrow: { other: '{0}m' },
    },
    seconds: {
      long: { one: '{0} second', other: '{0} seconds' },
      short: { other: '{0} sec' },
      narrow: { other: '{0}s' },
    },
    milliseconds: {
      long: { one: '{0} millisecond', other: '{0} milliseconds' },
      short: { other: '{0} ms' },
      narrow: { other: '{0}ms' },
    },
  },
  lists: {
    conjunction: { pair: ' and ', middle: ', ', end: ', and ' },
    unit: { pair: ', ', middle: ', ', end: ', ' },
  },
  rangeSeparator: '–',
  relative: {
    units: {
      year: { long: relativePhrases('year', 'years'), short: relativePhrases('yr', 'yrs') },
      month: { long: relativePhrases('month', 'months'), short: relativePhrases('mo', 'mos') },
      week: { long: relativePhrases('week', 'weeks'), short: relativePhrases('wk', 'wks') },
      day: { long: relativePhrases('day', 'days'), short: relativePhrases('d', 'd') },
      hour: { long: relativePhrases('hour', 'hours'), short: relativePhrases('hr', 'hrs') },
      minute: { long: relativePhrases('minute', 'minutes'), short: relativePhrases('min', 'min') },
      second: { long: relativePhrases('second', 'seconds'), short: relativePhrases('sec', 'sec') },
    },
    days: {
      dayBeforeYesterday: 'the day before yesterday',
      yesterday: 'yesterday',
      today: 'today',
      tomorrow: 'tomorrow',
      dayAfterTomorrow: 'the day after tomorrow',
    },
    weekdays: { last: 'last {0}', this: 'this {0}', next: 'next {0}' },
  },
  relativeGrammar: {
    future: ['in {amount} {unit}'],
    past: ['{amount} {unit} ago'],
    specialDays: {
      'the day before yesterday': -2,
      'day before yesterday': -2,
      yesterday: -1,
      today: 0,
      tomorrow: 1,
      'day after tomorrow': 2,
      'the day after tomorrow': 2,
    },
    numbers: {
      a: 1,
      an: 1,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
    },
    units: {
      year: 'year',
      years: 'year',
      yr: 'year',
      yrs: 'year',
      month: 'month',
      months: 'month',
      mo: 'month',
      mos: 'month',
      week: 'week',
      weeks: 'week',
      wk: 'week',
      wks: 'week',
      day: 'day',
      days: 'day',
      d: 'day',
      hour: 'hour',
      hours: 'hour',
      hr: 'hour',
      hrs: 'hour',
      minute: 'minute',
      minutes: 'minute',
      min: 'minute',
      second: 'second',
      seconds: 'second',
      sec: 'second',
    },
    next: ['next {target}'],
    last: ['last {target}'],
    this: ['this {target}'],
    periods: { week: 'week', month: 'month', year: 'year' },
  },
};
