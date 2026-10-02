import { selectPluralCategory } from './plural-rules';
import type { Locale, RelativePhrases } from './types';

const WIDE_MONTHS = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
] as const;

const NARROW_MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] as const;

const relativePhrases = (singular: string, plural: string): RelativePhrases => ({
  future: { one: `in {0} ${singular}`, other: `in {0} ${plural}` },
  past: { one: `vor {0} ${singular}`, other: `vor {0} ${plural}` },
});

/** German. */
export const de: Locale = {
  code: 'de',
  firstDayOfWeek: 'monday',
  weekend: ['saturday', 'sunday'],
  months: {
    format: {
      wide: WIDE_MONTHS,
      abbreviated: [
        'Jan.',
        'Feb.',
        'März',
        'Apr.',
        'Mai',
        'Juni',
        'Juli',
        'Aug.',
        'Sept.',
        'Okt.',
        'Nov.',
        'Dez.',
      ],
      narrow: NARROW_MONTHS,
    },
    standalone: {
      wide: WIDE_MONTHS,
      abbreviated: [
        'Jan',
        'Feb',
        'Mär',
        'Apr',
        'Mai',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Okt',
        'Nov',
        'Dez',
      ],
      narrow: NARROW_MONTHS,
    },
  },
  weekdays: {
    wide: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    abbreviated: ['Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.', 'So.'],
    short: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    narrow: ['M', 'D', 'M', 'D', 'F', 'S', 'S'],
  },
  quarters: {
    abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
    wide: ['1. Quartal', '2. Quartal', '3. Quartal', '4. Quartal'],
  },
  dayPeriods: { am: 'AM', pm: 'PM' },
  plural: (count) => selectPluralCategory('de', count),
  ordinal: (count) => `${String(count)}.`,
  patterns: {
    date: {
      short: 'dd.MM.yy',
      medium: 'dd.MM.yyyy',
      long: 'd. MMMM yyyy',
      full: 'EEEE, d. MMMM yyyy',
    },
    time: {
      short: 'HH:mm',
      medium: 'HH:mm:ss',
      long: 'HH:mm:ss',
      full: 'HH:mm:ss.SSS',
    },
    dateTime: {
      short: 'dd.MM.yy, HH:mm',
      medium: 'dd.MM.yyyy, HH:mm:ss',
      long: "d. MMMM yyyy 'um' HH:mm:ss",
      full: "EEEE, d. MMMM yyyy 'um' HH:mm:ss",
    },
  },
  units: {
    years: {
      long: { one: '{0} Jahr', other: '{0} Jahre' },
      short: { other: '{0} J.' },
      narrow: { other: '{0}J' },
    },
    months: {
      long: { one: '{0} Monat', other: '{0} Monate' },
      short: { other: '{0} Mon.' },
      narrow: { other: '{0}M' },
    },
    weeks: {
      long: { one: '{0} Woche', other: '{0} Wochen' },
      short: { other: '{0} Wo.' },
      narrow: { other: '{0}W' },
    },
    days: {
      long: { one: '{0} Tag', other: '{0} Tage' },
      short: { other: '{0} Tg.' },
      narrow: { other: '{0}T' },
    },
    hours: {
      long: { one: '{0} Stunde', other: '{0} Stunden' },
      short: { other: '{0} Std.' },
      narrow: { other: '{0}h' },
    },
    minutes: {
      long: { one: '{0} Minute', other: '{0} Minuten' },
      short: { other: '{0} Min.' },
      narrow: { other: '{0}min' },
    },
    seconds: {
      long: { one: '{0} Sekunde', other: '{0} Sekunden' },
      short: { other: '{0} Sek.' },
      narrow: { other: '{0}s' },
    },
    milliseconds: {
      long: { one: '{0} Millisekunde', other: '{0} Millisekunden' },
      short: { other: '{0} ms' },
      narrow: { other: '{0}ms' },
    },
  },
  lists: {
    conjunction: { pair: ' und ', middle: ', ', end: ' und ' },
    unit: { pair: ', ', middle: ', ', end: ', ' },
    narrow: { pair: ' ', middle: ' ', end: ' ' },
  },
  rangeSeparator: '–',
  relative: {
    units: {
      year: { long: relativePhrases('Jahr', 'Jahren'), short: relativePhrases('J.', 'J.') },
      month: { long: relativePhrases('Monat', 'Monaten'), short: relativePhrases('Mon.', 'Mon.') },
      week: { long: relativePhrases('Woche', 'Wochen'), short: relativePhrases('Wo.', 'Wo.') },
      day: { long: relativePhrases('Tag', 'Tagen'), short: relativePhrases('T.', 'T.') },
      hour: { long: relativePhrases('Stunde', 'Stunden'), short: relativePhrases('Std.', 'Std.') },
      minute: {
        long: relativePhrases('Minute', 'Minuten'),
        short: relativePhrases('Min.', 'Min.'),
      },
      second: {
        long: relativePhrases('Sekunde', 'Sekunden'),
        short: relativePhrases('Sek.', 'Sek.'),
      },
    },
    days: {
      dayBeforeYesterday: 'vorgestern',
      yesterday: 'gestern',
      today: 'heute',
      tomorrow: 'morgen',
      dayAfterTomorrow: 'übermorgen',
    },
    now: 'jetzt',
    weekdays: { last: 'letzten {0}', this: 'diesen {0}', next: 'nächsten {0}' },
  },
};
