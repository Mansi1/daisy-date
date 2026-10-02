import { selectPluralCategory } from './plural-rules';
import type { Locale, RelativePhrases } from './types';

const MONTHS = {
  wide: [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ],
  abbreviated: [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sept',
    'oct',
    'nov',
    'dic',
  ],
  narrow: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
} as const;

const relativePhrases = (singular: string, plural: string): RelativePhrases => ({
  future: { one: `dentro de {0} ${singular}`, other: `dentro de {0} ${plural}` },
  past: { one: `hace {0} ${singular}`, other: `hace {0} ${plural}` },
});

/** Spanish. */
export const es: Locale = {
  code: 'es',
  firstDayOfWeek: 'monday',
  weekend: ['saturday', 'sunday'],
  months: { format: MONTHS, standalone: MONTHS },
  weekdays: {
    wide: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    abbreviated: ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'],
    short: ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'],
    narrow: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
  },
  quarters: {
    abbreviated: ['T1', 'T2', 'T3', 'T4'],
    wide: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  },
  dayPeriods: { am: 'a. m.', pm: 'p. m.' },
  plural: (count) => selectPluralCategory('es', count),
  ordinal: (count) => `${String(count)}.º`,
  patterns: {
    date: {
      short: 'd/M/yy',
      medium: 'd MMM yyyy',
      long: "d 'de' MMMM 'de' yyyy",
      full: "EEEE, d 'de' MMMM 'de' yyyy",
    },
    time: {
      short: 'H:mm',
      medium: 'H:mm:ss',
      long: 'H:mm:ss',
      full: 'H:mm:ss.SSS',
    },
    dateTime: {
      short: 'd/M/yy, H:mm',
      medium: 'd MMM yyyy, H:mm:ss',
      long: "d 'de' MMMM 'de' yyyy, H:mm:ss",
      full: "EEEE, d 'de' MMMM 'de' yyyy, H:mm:ss",
    },
  },
  units: {
    years: {
      long: { one: '{0} año', other: '{0} años' },
      short: { other: '{0} a' },
      narrow: { other: '{0}a' },
    },
    months: {
      long: { one: '{0} mes', other: '{0} meses' },
      short: { other: '{0} m' },
      narrow: { other: '{0}m' },
    },
    weeks: {
      long: { one: '{0} semana', other: '{0} semanas' },
      short: { other: '{0} sem.' },
      narrow: { other: '{0}sem' },
    },
    days: {
      long: { one: '{0} día', other: '{0} días' },
      short: { other: '{0} d' },
      narrow: { other: '{0}d' },
    },
    hours: {
      long: { one: '{0} hora', other: '{0} horas' },
      short: { other: '{0} h' },
      narrow: { other: '{0}h' },
    },
    minutes: {
      long: { one: '{0} minuto', other: '{0} minutos' },
      short: { other: '{0} min' },
      narrow: { other: '{0}min' },
    },
    seconds: {
      long: { one: '{0} segundo', other: '{0} segundos' },
      short: { other: '{0} s' },
      narrow: { other: '{0}s' },
    },
    milliseconds: {
      long: { one: '{0} milisegundo', other: '{0} milisegundos' },
      short: { other: '{0} ms' },
      narrow: { other: '{0}ms' },
    },
  },
  lists: {
    conjunction: { pair: ' y ', middle: ', ', end: ' y ' },
    unit: { pair: ', ', middle: ', ', end: ', ' },
    narrow: { pair: ' ', middle: ' ', end: ' ' },
  },
  rangeSeparator: '–',
  relative: {
    units: {
      year: { long: relativePhrases('año', 'años'), short: relativePhrases('a', 'a') },
      month: { long: relativePhrases('mes', 'meses'), short: relativePhrases('m', 'm') },
      week: { long: relativePhrases('semana', 'semanas'), short: relativePhrases('sem.', 'sem.') },
      day: { long: relativePhrases('día', 'días'), short: relativePhrases('d', 'd') },
      hour: { long: relativePhrases('hora', 'horas'), short: relativePhrases('h', 'h') },
      minute: { long: relativePhrases('minuto', 'minutos'), short: relativePhrases('min', 'min') },
      second: { long: relativePhrases('segundo', 'segundos'), short: relativePhrases('s', 's') },
    },
    days: {
      dayBeforeYesterday: 'anteayer',
      yesterday: 'ayer',
      today: 'hoy',
      tomorrow: 'mañana',
      dayAfterTomorrow: 'pasado mañana',
    },
    now: 'ahora',
    weekdays: { last: 'el {0} pasado', this: 'este {0}', next: 'el próximo {0}' },
  },
};
