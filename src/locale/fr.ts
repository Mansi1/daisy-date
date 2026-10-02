import { selectPluralCategory } from './plural-rules';
import type { Locale, RelativePhrases } from './types';

const MONTHS = {
  wide: [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ],
  abbreviated: [
    'janv.',
    'févr.',
    'mars',
    'avr.',
    'mai',
    'juin',
    'juil.',
    'août',
    'sept.',
    'oct.',
    'nov.',
    'déc.',
  ],
  narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
} as const;

const relativePhrases = (singular: string, plural: string): RelativePhrases => ({
  future: { one: `dans {0} ${singular}`, other: `dans {0} ${plural}` },
  past: { one: `il y a {0} ${singular}`, other: `il y a {0} ${plural}` },
});

/** French. */
export const fr: Locale = {
  code: 'fr',
  firstDayOfWeek: 'monday',
  weekend: ['saturday', 'sunday'],
  months: { format: MONTHS, standalone: MONTHS },
  weekdays: {
    wide: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
    abbreviated: ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'],
    short: ['lu', 'ma', 'me', 'je', 've', 'sa', 'di'],
    narrow: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
  },
  quarters: {
    abbreviated: ['T1', 'T2', 'T3', 'T4'],
    wide: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  },
  dayPeriods: { am: 'AM', pm: 'PM' },
  plural: (count) => selectPluralCategory('fr', count),
  ordinal: (count) => `${String(count)}${count === 1 ? 'er' : 'e'}`,
  patterns: {
    date: {
      short: 'dd/MM/yyyy',
      medium: 'd MMM yyyy',
      long: 'd MMMM yyyy',
      full: 'EEEE d MMMM yyyy',
    },
    time: {
      short: 'HH:mm',
      medium: 'HH:mm:ss',
      long: 'HH:mm:ss',
      full: 'HH:mm:ss.SSS',
    },
    dateTime: {
      short: 'dd/MM/yyyy HH:mm',
      medium: 'd MMM yyyy, HH:mm:ss',
      long: "d MMMM yyyy 'à' HH:mm:ss",
      full: "EEEE d MMMM yyyy 'à' HH:mm:ss",
    },
  },
  units: {
    years: {
      long: { one: '{0} an', other: '{0} ans' },
      short: { one: '{0} an', other: '{0} ans' },
      narrow: { other: '{0}a' },
    },
    months: {
      long: { other: '{0} mois' },
      short: { other: '{0} m.' },
      narrow: { other: '{0}m.' },
    },
    weeks: {
      long: { one: '{0} semaine', other: '{0} semaines' },
      short: { other: '{0} sem.' },
      narrow: { other: '{0}sem.' },
    },
    days: {
      long: { one: '{0} jour', other: '{0} jours' },
      short: { other: '{0} j' },
      narrow: { other: '{0}j' },
    },
    hours: {
      long: { one: '{0} heure', other: '{0} heures' },
      short: { other: '{0} h' },
      narrow: { other: '{0}h' },
    },
    minutes: {
      long: { one: '{0} minute', other: '{0} minutes' },
      short: { other: '{0} min' },
      narrow: { other: '{0}min' },
    },
    seconds: {
      long: { one: '{0} seconde', other: '{0} secondes' },
      short: { other: '{0} s' },
      narrow: { other: '{0}s' },
    },
    milliseconds: {
      long: { one: '{0} milliseconde', other: '{0} millisecondes' },
      short: { other: '{0} ms' },
      narrow: { other: '{0}ms' },
    },
  },
  lists: {
    conjunction: { pair: ' et ', middle: ', ', end: ' et ' },
    unit: { pair: ', ', middle: ', ', end: ', ' },
    narrow: { pair: ' ', middle: ' ', end: ' ' },
  },
  rangeSeparator: '–',
  relative: {
    units: {
      year: { long: relativePhrases('an', 'ans'), short: relativePhrases('a', 'a') },
      month: { long: relativePhrases('mois', 'mois'), short: relativePhrases('m.', 'm.') },
      week: {
        long: relativePhrases('semaine', 'semaines'),
        short: relativePhrases('sem.', 'sem.'),
      },
      day: { long: relativePhrases('jour', 'jours'), short: relativePhrases('j', 'j') },
      hour: { long: relativePhrases('heure', 'heures'), short: relativePhrases('h', 'h') },
      minute: { long: relativePhrases('minute', 'minutes'), short: relativePhrases('min', 'min') },
      second: { long: relativePhrases('seconde', 'secondes'), short: relativePhrases('s', 's') },
    },
    days: {
      dayBeforeYesterday: 'avant-hier',
      yesterday: 'hier',
      today: 'aujourd’hui',
      tomorrow: 'demain',
      dayAfterTomorrow: 'après-demain',
    },
    now: 'maintenant',
    weekdays: { last: '{0} dernier', this: 'ce {0}', next: '{0} prochain' },
  },
};
