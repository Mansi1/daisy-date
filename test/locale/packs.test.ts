import { describe, expect, it } from 'vitest';

import * as daisy from '../../src';
import { Duration, LocalDate, LocalDateTime, Period } from '../../src';
import type { Locale, PresetStyle } from '../../src';
import { de } from '../../src/locale/de';
import { es } from '../../src/locale/es';
import { fr } from '../../src/locale/fr';

const MONDAY = LocalDate.parse('2026-09-28');
const FRIDAY = LocalDate.parse('2026-10-02');
const AFTERNOON = LocalDateTime.parse('2026-09-28T14:05:09');
const NOON = LocalDateTime.parse('2026-09-28T12:00');

type PackCase = {
  readonly locale: Locale;
  readonly datePresets: Readonly<Record<PresetStyle, string>>;
  /** The formatted text and the date-time it parses back to (the short preset has no seconds). */
  readonly dateTimePresets: Readonly<Record<PresetStyle, readonly [string, string]>>;
  readonly names: readonly (readonly [string, string])[];
  readonly ordinals: readonly (readonly [number, string])[];
  readonly relativeDates: readonly (readonly [string, string])[];
  readonly relativeFromFriday: readonly (readonly [string, string])[];
  readonly numericRelative: readonly (readonly [string, string])[];
  readonly shortRelative: readonly (readonly [string, string])[];
  readonly relativeClock: readonly (readonly [string, string])[];
  readonly amounts: readonly (readonly [string, string])[];
  readonly shortAmounts: readonly (readonly [string, string])[];
};

const PACKS: readonly (readonly [string, PackCase])[] = [
  [
    'de',
    {
      locale: de,
      datePresets: {
        short: '28.09.26',
        medium: '28.09.2026',
        long: '28. September 2026',
        full: 'Montag, 28. September 2026',
      },
      dateTimePresets: {
        short: ['28.09.26, 14:05', '2026-09-28T14:05'],
        medium: ['28.09.2026, 14:05:09', '2026-09-28T14:05:09'],
        long: ['28. September 2026 um 14:05:09', '2026-09-28T14:05:09'],
        full: ['Montag, 28. September 2026 um 14:05:09', '2026-09-28T14:05:09'],
      },
      names: [
        ['d. MMM yyyy', '28. Sept. 2026'],
        ['LLL', 'Sep'],
        ['EEE', 'Mo.'],
        ['EEEEEE', 'Mo'],
        ['QQQQ', '3. Quartal'],
      ],
      ordinals: [
        [1, '1.'],
        [28, '28.'],
      ],
      relativeDates: [
        ['2026-09-28', 'heute'],
        ['2026-09-29', 'morgen'],
        ['2026-09-27', 'gestern'],
        ['2026-09-30', 'übermorgen'],
        ['2026-09-26', 'vorgestern'],
        ['2026-10-01', 'diesen Donnerstag'],
        ['2026-09-25', 'letzten Freitag'],
        ['2026-10-05', 'in 1 Woche'],
        ['2026-10-12', 'in 2 Wochen'],
        ['2026-10-29', 'in 1 Monat'],
        ['2027-09-28', 'in 1 Jahr'],
        ['2024-09-28', 'vor 2 Jahren'],
      ],
      relativeFromFriday: [['2026-10-05', 'nächsten Montag']],
      numericRelative: [
        ['2026-09-29', 'in 1 Tag'],
        ['2026-09-25', 'vor 3 Tagen'],
      ],
      shortRelative: [['2026-10-12', 'in 2 Wo.']],
      relativeClock: [
        ['2026-09-28T12:00', 'jetzt'],
        ['2026-09-28T12:00:30', 'in 30 Sekunden'],
        ['2026-09-28T11:00', 'vor 1 Stunde'],
      ],
      amounts: [
        ['P2W3D', '2 Wochen und 3 Tage'],
        ['P1Y2M3D', '1 Jahr, 2 Monate und 3 Tage'],
        ['P1D', '1 Tag'],
        ['P0D', '0 Tage'],
        ['PT1H30M', '1 Stunde und 30 Minuten'],
      ],
      shortAmounts: [['P2W3D', '2 Wo. und 3 Tg.']],
    },
  ],
  [
    'fr',
    {
      locale: fr,
      datePresets: {
        short: '28/09/2026',
        medium: '28 sept. 2026',
        long: '28 septembre 2026',
        full: 'lundi 28 septembre 2026',
      },
      dateTimePresets: {
        short: ['28/09/2026 14:05', '2026-09-28T14:05'],
        medium: ['28 sept. 2026, 14:05:09', '2026-09-28T14:05:09'],
        long: ['28 septembre 2026 à 14:05:09', '2026-09-28T14:05:09'],
        full: ['lundi 28 septembre 2026 à 14:05:09', '2026-09-28T14:05:09'],
      },
      names: [
        ['MMM', 'sept.'],
        ['EEE', 'lun.'],
        ['EEEEEE', 'lu'],
        ['QQQ', 'T3'],
        ['QQQQ', '3e trimestre'],
      ],
      ordinals: [
        [1, '1er'],
        [2, '2e'],
        [28, '28e'],
      ],
      relativeDates: [
        ['2026-09-28', 'aujourd’hui'],
        ['2026-09-29', 'demain'],
        ['2026-09-27', 'hier'],
        ['2026-09-30', 'après-demain'],
        ['2026-09-26', 'avant-hier'],
        ['2026-10-01', 'ce jeudi'],
        ['2026-09-25', 'vendredi dernier'],
        ['2026-10-12', 'dans 2 semaines'],
        ['2026-10-29', 'dans 1 mois'],
        ['2027-09-28', 'dans 1 an'],
        ['2024-09-28', 'il y a 2 ans'],
      ],
      relativeFromFriday: [['2026-10-05', 'lundi prochain']],
      numericRelative: [
        ['2026-09-28', 'dans 0 jour'],
        ['2026-09-29', 'dans 1 jour'],
        ['2026-09-25', 'il y a 3 jours'],
      ],
      shortRelative: [['2026-10-12', 'dans 2 sem.']],
      relativeClock: [
        ['2026-09-28T12:00', 'maintenant'],
        ['2026-09-28T12:00:30', 'dans 30 secondes'],
        ['2026-09-28T11:00', 'il y a 1 heure'],
      ],
      amounts: [
        ['P2W3D', '2 semaines et 3 jours'],
        ['P1Y2M3D', '1 an, 2 mois et 3 jours'],
        ['P0D', '0 jour'],
        ['PT1H30M', '1 heure et 30 minutes'],
      ],
      shortAmounts: [['P2W3D', '2 sem. et 3 j']],
    },
  ],
  [
    'es',
    {
      locale: es,
      datePresets: {
        short: '28/9/26',
        medium: '28 sept 2026',
        long: '28 de septiembre de 2026',
        full: 'lunes, 28 de septiembre de 2026',
      },
      dateTimePresets: {
        short: ['28/9/26, 14:05', '2026-09-28T14:05'],
        medium: ['28 sept 2026, 14:05:09', '2026-09-28T14:05:09'],
        long: ['28 de septiembre de 2026, 14:05:09', '2026-09-28T14:05:09'],
        full: ['lunes, 28 de septiembre de 2026, 14:05:09', '2026-09-28T14:05:09'],
      },
      names: [
        ['MMM', 'sept'],
        ['EEE', 'lun'],
        ['EEEEE', 'L'],
        ['h:mm a', '2:05 p. m.'],
        ['QQQQ', '3.er trimestre'],
      ],
      ordinals: [
        [1, '1.º'],
        [28, '28.º'],
      ],
      relativeDates: [
        ['2026-09-28', 'hoy'],
        ['2026-09-29', 'mañana'],
        ['2026-09-27', 'ayer'],
        ['2026-09-30', 'pasado mañana'],
        ['2026-09-26', 'anteayer'],
        ['2026-10-01', 'este jueves'],
        ['2026-09-25', 'el viernes pasado'],
        ['2026-10-12', 'dentro de 2 semanas'],
        ['2026-10-29', 'dentro de 1 mes'],
        ['2027-09-28', 'dentro de 1 año'],
        ['2024-09-28', 'hace 2 años'],
      ],
      relativeFromFriday: [['2026-10-05', 'el próximo lunes']],
      numericRelative: [
        ['2026-09-29', 'dentro de 1 día'],
        ['2026-09-25', 'hace 3 días'],
      ],
      shortRelative: [['2026-10-12', 'dentro de 2 sem.']],
      relativeClock: [
        ['2026-09-28T12:00', 'ahora'],
        ['2026-09-28T12:00:30', 'dentro de 30 segundos'],
        ['2026-09-28T11:00', 'hace 1 hora'],
      ],
      amounts: [
        ['P2W3D', '2 semanas y 3 días'],
        ['P1Y2M3D', '1 año, 2 meses y 3 días'],
        ['P0D', '0 días'],
        ['PT1H30M', '1 hora y 30 minutos'],
      ],
      shortAmounts: [['P2W3D', '2 sem. y 3 d']],
    },
  ],
];

const PRESETS: readonly PresetStyle[] = ['short', 'medium', 'long', 'full'];

describe.each(PACKS)('%s locale pack', (_code, pack) => {
  const { locale } = pack;

  it.each(PRESETS)('formats and parses back the %s date preset', (preset) => {
    const text = pack.datePresets[preset];
    expect(MONDAY.format(preset, { locale })).toBe(text);
    expect(LocalDate.parse(text, preset, { locale })).toEqual(MONDAY);
  });

  it.each(PRESETS)('formats and parses back the %s date-time preset', (preset) => {
    const [text, parsedBack] = pack.dateTimePresets[preset];
    expect(AFTERNOON.format(preset, { locale })).toBe(text);
    expect(LocalDateTime.parse(text, preset, { locale })).toEqual(LocalDateTime.parse(parsedBack));
  });

  it('writes names, quarters and day periods', () => {
    for (const [pattern, expected] of pack.names) {
      expect(AFTERNOON.format(pattern, { locale })).toBe(expected);
    }
  });

  it('writes ordinals', () => {
    for (const [count, expected] of pack.ordinals) {
      expect(locale.ordinal(count)).toBe(expected);
    }
  });

  it('writes relative dates', () => {
    for (const [text, expected] of pack.relativeDates) {
      expect(LocalDate.parse(text).formatRelative({ relativeTo: MONDAY, locale })).toBe(expected);
    }
    for (const [text, expected] of pack.relativeFromFriday) {
      expect(LocalDate.parse(text).formatRelative({ relativeTo: FRIDAY, locale })).toBe(expected);
    }
    for (const [text, expected] of pack.numericRelative) {
      expect(
        LocalDate.parse(text).formatRelative({ relativeTo: MONDAY, locale, numeric: 'always' }),
      ).toBe(expected);
    }
    for (const [text, expected] of pack.shortRelative) {
      expect(
        LocalDate.parse(text).formatRelative({ relativeTo: MONDAY, locale, style: 'short' }),
      ).toBe(expected);
    }
  });

  it('writes relative clock times', () => {
    for (const [text, expected] of pack.relativeClock) {
      expect(LocalDateTime.parse(text).formatRelative({ relativeTo: NOON, locale })).toBe(expected);
    }
  });

  it('writes periods and durations', () => {
    for (const [text, expected] of pack.amounts) {
      const amount = text.startsWith('PT') ? Duration.parse(text) : Period.parse(text);
      expect(daisy.format(amount, { locale })).toBe(expected);
    }
    for (const [text, expected] of pack.shortAmounts) {
      expect(Period.parse(text).format({ locale, style: 'short' })).toBe(expected);
    }
  });
});

describe('locale entry points', () => {
  it('keep the extra packs out of the package root', () => {
    expect(Object.keys(daisy)).toContain('en');
    expect(Object.keys(daisy)).not.toContain('de');
    expect(Object.keys(daisy)).not.toContain('fr');
    expect(Object.keys(daisy)).not.toContain('es');
  });

  it.each([
    [de, 'de'],
    [fr, 'fr'],
    [es, 'es'],
  ] as const)('exports a pack with code %s', (locale, code) => {
    expect(locale.code).toBe(code);
  });

  it('parses Spanish day periods', () => {
    expect(LocalDateTime.parse('28/9/26 2:05 p. m.', 'd/M/yy h:mm a', { locale: es })).toEqual(
      LocalDateTime.parse('2026-09-28T14:05'),
    );
  });
});
