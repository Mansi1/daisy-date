import { describe, expect, it } from 'vitest';

import { LocalDate, LocalDateTime, en } from '../../../../src';
import { de } from '../../../../src/locale/de';
import { fr } from '../../../../src/locale/fr';

const LOCALES = { en, de, fr } as const;

type LocaleCode = keyof typeof LOCALES;

const LUXON_FIXTURE = LocalDateTime.parse('1982-05-25T09:23:54.123');

const fixtureWith = (
  fields: Partial<Record<'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond', number>>,
) =>
  LocalDateTime.of(
    1982,
    fields.month ?? 5,
    fields.day ?? 25,
    fields.hour ?? 9,
    fields.minute ?? 23,
    fields.second ?? 54,
    fields.millisecond ?? 123,
  );

const date = (text: string) => LocalDate.parse(text);

describe('Luxon datetime/toFormat, written with LDML letters', () => {
  it.each<[string, LocalDateTime, string, string]>([
    ['toFormat.test.js:32 (u)', LUXON_FIXTURE, 'SSS', '123'],
    ['toFormat.test.js:33 (u)', fixtureWith({ millisecond: 82 }), 'SSS', '082'],
    ['toFormat.test.js:34 (u)', fixtureWith({ millisecond: 2 }), 'SSS', '002'],
    ['toFormat.test.js:35 (u)', fixtureWith({ millisecond: 80 }), 'SSS', '080'],
    ['toFormat.test.js:39 (uu)', LUXON_FIXTURE, 'SS', '12'],
    ['toFormat.test.js:40 (uu)', fixtureWith({ millisecond: 82 }), 'SS', '08'],
    ['toFormat.test.js:41 (uu)', fixtureWith({ millisecond: 789 }), 'SS', '78'],
    ['toFormat.test.js:45 (uuu)', LUXON_FIXTURE, 'S', '1'],
    ['toFormat.test.js:46 (uuu)', fixtureWith({ millisecond: 82 }), 'S', '0'],
    ['toFormat.test.js:47 (uuu)', fixtureWith({ millisecond: 789 }), 'S', '7'],
    ['toFormat.test.js:51 (S)', LUXON_FIXTURE, 'SSS', '123'],
    ['toFormat.test.js:58', LUXON_FIXTURE, 'SSS', '123'],
    ['toFormat.test.js:60', fixtureWith({ millisecond: 82 }), 'SSS', '082'],
    ['toFormat.test.js:64', LUXON_FIXTURE, 's', '54'],
    ['toFormat.test.js:66', fixtureWith({ second: 6 }), 's', '6'],
    ['toFormat.test.js:70', LUXON_FIXTURE, 'ss', '54'],
    ['toFormat.test.js:72', fixtureWith({ second: 6 }), 'ss', '06'],
    ['toFormat.test.js:76', LUXON_FIXTURE, 'm', '23'],
    ['toFormat.test.js:78', fixtureWith({ minute: 6 }), 'm', '6'],
    ['toFormat.test.js:82', LUXON_FIXTURE, 'mm', '23'],
    ['toFormat.test.js:84', fixtureWith({ minute: 6 }), 'mm', '06'],
    ['toFormat.test.js:88', LUXON_FIXTURE, 'h', '9'],
    ['toFormat.test.js:90', fixtureWith({ hour: 0 }), 'h', '12'],
    ['toFormat.test.js:92', fixtureWith({ hour: 12 }), 'h', '12'],
    ['toFormat.test.js:93', fixtureWith({ hour: 13 }), 'h', '1'],
    ['toFormat.test.js:97', LUXON_FIXTURE, 'hh', '09'],
    ['toFormat.test.js:101', fixtureWith({ hour: 12 }), 'hh', '12'],
    ['toFormat.test.js:102', fixtureWith({ hour: 13 }), 'hh', '01'],
    ['toFormat.test.js:106', LUXON_FIXTURE, 'H', '9'],
    ['toFormat.test.js:108', fixtureWith({ hour: 12 }), 'H', '12'],
    ['toFormat.test.js:109', fixtureWith({ hour: 13 }), 'H', '13'],
    ['toFormat.test.js:113', LUXON_FIXTURE, 'HH', '09'],
    ['toFormat.test.js:115', fixtureWith({ hour: 12 }), 'HH', '12'],
    ['toFormat.test.js:116', fixtureWith({ hour: 13 }), 'HH', '13'],
    ['toFormat.test.js:164', LUXON_FIXTURE, 'a', 'AM'],
    ['toFormat.test.js:166', fixtureWith({ hour: 13 }), 'a', 'PM'],
    ['toFormat.test.js:171', LUXON_FIXTURE, 'd', '25'],
    ['toFormat.test.js:172', fixtureWith({ day: 1 }), 'd', '1'],
    ['toFormat.test.js:176', LUXON_FIXTURE, 'dd', '25'],
    ['toFormat.test.js:177', fixtureWith({ day: 1 }), 'dd', '01'],
    ['toFormat.test.js:181 (E)', LUXON_FIXTURE, 'e', '2'],
    ['toFormat.test.js:182 (c)', LUXON_FIXTURE, 'c', '2'],
    ['toFormat.test.js:186', LUXON_FIXTURE, 'EEE', 'Tue'],
    ['toFormat.test.js:191 (ccc)', LUXON_FIXTURE, 'EEE', 'Tue'],
    ['toFormat.test.js:196', LUXON_FIXTURE, 'EEEE', 'Tuesday'],
    ['toFormat.test.js:200 (cccc)', LUXON_FIXTURE, 'EEEE', 'Tuesday'],
    ['toFormat.test.js:204', LUXON_FIXTURE, 'EEEEE', 'T'],
    ['toFormat.test.js:205 (ccccc)', LUXON_FIXTURE, 'EEEEE', 'T'],
    ['toFormat.test.js:209', LUXON_FIXTURE, 'M', '5'],
    ['toFormat.test.js:210', LUXON_FIXTURE, 'L', '5'],
    ['toFormat.test.js:214', LUXON_FIXTURE, 'MM', '05'],
    ['toFormat.test.js:218', LUXON_FIXTURE, 'MMM', 'May'],
    ['toFormat.test.js:220', fixtureWith({ month: 8 }), 'MMM', 'Aug'],
    ['toFormat.test.js:224', LUXON_FIXTURE, 'LLL', 'May'],
    ['toFormat.test.js:226', fixtureWith({ month: 8 }), 'LLL', 'Aug'],
    ['toFormat.test.js:230', LUXON_FIXTURE, 'MMMM', 'May'],
    ['toFormat.test.js:231', fixtureWith({ month: 8 }), 'MMMM', 'August'],
    ['toFormat.test.js:236', LUXON_FIXTURE, 'LLLL', 'May'],
    ['toFormat.test.js:237', fixtureWith({ month: 8 }), 'LLLL', 'August'],
    ['toFormat.test.js:241', LUXON_FIXTURE, 'MMMMM', 'M'],
    ['toFormat.test.js:242', LUXON_FIXTURE, 'LLLLL', 'M'],
    ['toFormat.test.js:246', LUXON_FIXTURE, 'y', '1982'],
    ['toFormat.test.js:252', LUXON_FIXTURE, 'yy', '82'],
    ['toFormat.test.js:258', LUXON_FIXTURE, 'yyyy', '1982'],
    ['toFormat.test.js:279', LUXON_FIXTURE, 'yyyyyy', '001982'],
    ['toFormat.test.js:303 (W)', LUXON_FIXTURE, 'w', '21'],
    ['toFormat.test.js:308 (WW)', LUXON_FIXTURE, 'ww', '21'],
    ['toFormat.test.js:313 (kk)', LUXON_FIXTURE, 'YY', '82'],
    ['toFormat.test.js:317 (kkkk)', LUXON_FIXTURE, 'YYYY', '1982'],
    ['toFormat.test.js:321 (o)', LUXON_FIXTURE, 'D', '145'],
    ['toFormat.test.js:327 (ooo)', LUXON_FIXTURE, 'DDD', '145'],
    ['toFormat.test.js:333 (q)', LUXON_FIXTURE, 'Q', '2'],
    ['toFormat.test.js:334 (q)', fixtureWith({ month: 2 }), 'Q', '1'],
    ['toFormat.test.js:338 (qq)', LUXON_FIXTURE, 'QQ', '02'],
    ['toFormat.test.js:339 (qq)', fixtureWith({ month: 2 }), 'QQ', '01'],
    ['toFormat.test.js:343 (D)', LUXON_FIXTURE, 'M/d/yyyy', '5/25/1982'],
    ['toFormat.test.js:373 (t)', LUXON_FIXTURE, 'h:mm a', '9:23 AM'],
    ['toFormat.test.js:374 (t)', fixtureWith({ hour: 13 }), 'h:mm a', '1:23 PM'],
    ['toFormat.test.js:380 (T)', LUXON_FIXTURE, 'HH:mm', '09:23'],
    ['toFormat.test.js:381 (T)', fixtureWith({ hour: 13 }), 'HH:mm', '13:23'],
    ['toFormat.test.js:387 (tt)', LUXON_FIXTURE, 'h:mm:ss a', '9:23:54 AM'],
    ['toFormat.test.js:388 (tt)', fixtureWith({ hour: 13 }), 'h:mm:ss a', '1:23:54 PM'],
    ['toFormat.test.js:394 (TT)', LUXON_FIXTURE, 'HH:mm:ss', '09:23:54'],
    ['toFormat.test.js:395 (TT)', fixtureWith({ hour: 13 }), 'HH:mm:ss', '13:23:54'],
    ['toFormat.test.js:417 (f)', LUXON_FIXTURE, 'M/d/yyyy, h:mm a', '5/25/1982, 9:23 AM'],
    [
      'toFormat.test.js:418 (f)',
      fixtureWith({ hour: 13 }),
      'M/d/yyyy, h:mm a',
      '5/25/1982, 1:23 PM',
    ],
    ['toFormat.test.js:424 (ff)', LUXON_FIXTURE, 'MMM d, yyyy, h:mm a', 'May 25, 1982, 9:23 AM'],
    [
      'toFormat.test.js:425 (ff)',
      fixtureWith({ hour: 13 }),
      'MMM d, yyyy, h:mm a',
      'May 25, 1982, 1:23 PM',
    ],
    [
      'toFormat.test.js:426 (ff)',
      fixtureWith({ month: 8 }),
      'MMM d, yyyy, h:mm a',
      'Aug 25, 1982, 9:23 AM',
    ],
    ['toFormat.test.js:469 (F)', LUXON_FIXTURE, 'M/d/yyyy, h:mm:ss a', '5/25/1982, 9:23:54 AM'],
    [
      'toFormat.test.js:470 (F)',
      fixtureWith({ hour: 13 }),
      'M/d/yyyy, h:mm:ss a',
      '5/25/1982, 1:23:54 PM',
    ],
    ['toFormat.test.js:527', LUXON_FIXTURE, "dd/MM/yyyy 'at' hh:mm", '25/05/1982 at 09:23'],
    ['toFormat.test.js:528', LUXON_FIXTURE, "MMdd'T'hh", '0525T09'],
    ['toFormat.test.js:532', LUXON_FIXTURE, "dd/MM/yyyy 'at' ''hh:mm''", "25/05/1982 at '09:23'"],
  ])('%s: %s with %j is %j', (_source, value, pattern, expected) => {
    expect(value.format(pattern)).toBe(expected);
  });

  it.each<[string, LocalDateTime, string, LocaleCode, string]>([
    ['toFormat.test.js:26', LUXON_FIXTURE, 'LLLL', 'fr', 'mai'],
    ['toFormat.test.js:27', LUXON_FIXTURE, 'LLLL', 'fr', 'mai'],
    ['toFormat.test.js:187', LUXON_FIXTURE, 'EEE', 'de', 'Di.'],
    ['toFormat.test.js:219', LUXON_FIXTURE, 'MMM', 'de', 'Mai'],
    ['toFormat.test.js:225', LUXON_FIXTURE, 'LLL', 'de', 'Mai'],
    ['toFormat.test.js:375 (t)', LUXON_FIXTURE, 'HH:mm', 'fr', '09:23'],
    ['toFormat.test.js:376 (t)', fixtureWith({ hour: 13 }), 'HH:mm', 'fr', '13:23'],
    ['toFormat.test.js:382 (T)', LUXON_FIXTURE, 'HH:mm', 'fr', '09:23'],
    ['toFormat.test.js:383 (T)', fixtureWith({ hour: 13 }), 'HH:mm', 'fr', '13:23'],
    ['toFormat.test.js:389 (tt)', LUXON_FIXTURE, 'HH:mm:ss', 'fr', '09:23:54'],
    ['toFormat.test.js:390 (tt)', fixtureWith({ hour: 13 }), 'HH:mm:ss', 'fr', '13:23:54'],
    ['toFormat.test.js:396 (TT)', LUXON_FIXTURE, 'HH:mm:ss', 'fr', '09:23:54'],
    ['toFormat.test.js:397 (TT)', fixtureWith({ hour: 13 }), 'HH:mm:ss', 'fr', '13:23:54'],
    ['toFormat.test.js:427 (ff)', LUXON_FIXTURE, 'd MMM yyyy, HH:mm', 'fr', '25 mai 1982, 09:23'],
    [
      'toFormat.test.js:428 (ff)',
      fixtureWith({ month: 2 }),
      'd MMM yyyy, HH:mm',
      'fr',
      '25 févr. 1982, 09:23',
    ],
    [
      'toFormat.test.js:431 (ff)',
      fixtureWith({ hour: 13 }),
      'd MMM yyyy, HH:mm',
      'fr',
      '25 mai 1982, 13:23',
    ],
    ['toFormat.test.js:471 (F)', LUXON_FIXTURE, 'dd/MM/yyyy HH:mm:ss', 'fr', '25/05/1982 09:23:54'],
    [
      'toFormat.test.js:472 (F)',
      fixtureWith({ hour: 13 }),
      'dd/MM/yyyy HH:mm:ss',
      'fr',
      '25/05/1982 13:23:54',
    ],
  ])('%s: %s with %j in %s is %j', (_source, value, pattern, localeCode, expected) => {
    expect(value.format(pattern, { locale: LOCALES[localeCode] })).toBe(expected);
  });

  it.each<[string, LocalDate, string, string]>([
    ['toFormat.test.js:248', LocalDate.of(3, 5, 25), 'y', '3'],
    ['toFormat.test.js:254', LocalDate.of(3, 5, 25), 'yy', '03'],
    ['toFormat.test.js:260', LocalDate.of(3, 5, 25), 'yyyy', '0003'],
    ['toFormat.test.js:266', LocalDate.of(36000, 1, 1), 'yyyy', '36000'],
    ['toFormat.test.js:269', LocalDate.of(17, 1, 1), 'yyyy', '0017'],
    ['toFormat.test.js:274', LocalDate.of(136000, 1, 1), 'yyyyyy', '136000'],
    ['toFormat.test.js:277', LocalDate.of(36000, 1, 1), 'yyyyyy', '036000'],
    ['toFormat.test.js:282', LocalDate.of(17, 1, 1), 'yyyyyy', '000017'],
    ['toFormat.test.js:304 (W)', date('1982-02-02'), 'w', '5'],
    ['toFormat.test.js:309 (WW)', date('1982-02-02'), 'ww', '05'],
    ['toFormat.test.js:322 (o)', date('1982-01-13'), 'D', '13'],
    ['toFormat.test.js:323 (o)', date('1982-01-08'), 'D', '8'],
    ['toFormat.test.js:328 (ooo)', date('1982-01-13'), 'DDD', '013'],
    ['toFormat.test.js:329 (ooo)', date('1982-01-08'), 'DDD', '008'],
  ])('%s: %s with %j is %j', (_source, value, pattern, expected) => {
    expect(value.format(pattern)).toBe(expected);
  });

  it.each<[string, LocalDate | LocalDateTime, string, LocaleCode, string]>([
    ['toFormat.test.js:344 (D)', date('1982-05-25'), 'short', 'fr', '25/05/1982'],
    ['toFormat.test.js:348 (DD)', date('1982-05-25'), 'medium', 'en', 'May 25, 1982'],
    ['toFormat.test.js:349 (DD)', date('1982-08-25'), 'medium', 'en', 'Aug 25, 1982'],
    ['toFormat.test.js:350 (DD)', date('1982-05-25'), 'medium', 'fr', '25 mai 1982'],
    ['toFormat.test.js:351 (DD)', date('1982-02-25'), 'medium', 'fr', '25 févr. 1982'],
    ['toFormat.test.js:355 (DDD)', date('1982-05-25'), 'long', 'en', 'May 25, 1982'],
    ['toFormat.test.js:356 (DDD)', date('1982-08-25'), 'long', 'en', 'August 25, 1982'],
    ['toFormat.test.js:357 (DDD)', date('1982-05-25'), 'long', 'fr', '25 mai 1982'],
    ['toFormat.test.js:358 (DDD)', date('1982-02-25'), 'long', 'fr', '25 février 1982'],
    ['toFormat.test.js:364 (DDDD)', date('1982-05-25'), 'full', 'en', 'Tuesday, May 25, 1982'],
    ['toFormat.test.js:365 (DDDD)', date('1982-08-25'), 'full', 'en', 'Wednesday, August 25, 1982'],
    ['toFormat.test.js:366 (DDDD)', date('1982-05-25'), 'full', 'fr', 'mardi 25 mai 1982'],
    ['toFormat.test.js:367 (DDDD)', date('1982-02-25'), 'full', 'fr', 'jeudi 25 février 1982'],
    ['toFormat.test.js:419 (f)', LUXON_FIXTURE, 'short', 'fr', '25/05/1982 09:23'],
    ['toFormat.test.js:420 (f)', fixtureWith({ hour: 13 }), 'short', 'fr', '25/05/1982 13:23'],
    ['toFormat.test.js:478 (FF)', LUXON_FIXTURE, 'medium', 'en', 'May 25, 1982, 9:23:54 AM'],
    [
      'toFormat.test.js:479 (FF)',
      fixtureWith({ hour: 13 }),
      'medium',
      'en',
      'May 25, 1982, 1:23:54 PM',
    ],
    [
      'toFormat.test.js:480 (FF)',
      fixtureWith({ month: 8 }),
      'medium',
      'en',
      'Aug 25, 1982, 9:23:54 AM',
    ],
    ['toFormat.test.js:481 (FF)', LUXON_FIXTURE, 'medium', 'fr', '25 mai 1982, 09:23:54'],
    [
      'toFormat.test.js:482 (FF)',
      fixtureWith({ month: 2 }),
      'medium',
      'fr',
      '25 févr. 1982, 09:23:54',
    ],
    [
      'toFormat.test.js:485 (FF)',
      fixtureWith({ hour: 13 }),
      'medium',
      'fr',
      '25 mai 1982, 13:23:54',
    ],
  ])('%s: %s with the %s preset in %s is %j', (_source, value, preset, localeCode, expected) => {
    expect(value.format(preset, { locale: LOCALES[localeCode] })).toBe(expected);
  });
});

describe('Luxon datetime/toFormat (differs from Luxon on purpose)', () => {
  it('toFormat.test.js:192 (ccc): daisy weekday names have no standalone form (§6.1), so de EEE keeps the dot', () => {
    expect(LUXON_FIXTURE.format('EEE', { locale: de })).toBe('Di.');
  });

  it.each<[string, LocalDateTime, string, LocaleCode, string]>([
    [
      'toFormat.test.js:437 (fff)',
      LUXON_FIXTURE,
      "MMMM d, yyyy 'at' h:mm a",
      'en',
      'May 25, 1982 at 9:23 AM',
    ],
    [
      'toFormat.test.js:438 (fff)',
      fixtureWith({ hour: 13 }),
      "MMMM d, yyyy 'at' h:mm a",
      'en',
      'May 25, 1982 at 1:23 PM',
    ],
    [
      'toFormat.test.js:439 (fff)',
      fixtureWith({ month: 8 }),
      "MMMM d, yyyy 'at' h:mm a",
      'en',
      'August 25, 1982 at 9:23 AM',
    ],
    [
      'toFormat.test.js:440 (fff)',
      LUXON_FIXTURE,
      "d MMMM yyyy 'à' HH:mm",
      'fr',
      '25 mai 1982 à 09:23',
    ],
    [
      'toFormat.test.js:441 (fff)',
      fixtureWith({ month: 2 }),
      "d MMMM yyyy 'à' HH:mm",
      'fr',
      '25 février 1982 à 09:23',
    ],
    [
      'toFormat.test.js:444 (fff)',
      fixtureWith({ hour: 13 }),
      "d MMMM yyyy 'à' HH:mm",
      'fr',
      '25 mai 1982 à 13:23',
    ],
    [
      'toFormat.test.js:450 (ffff)',
      LUXON_FIXTURE,
      "EEEE, MMMM d, yyyy 'at' h:mm a",
      'en',
      'Tuesday, May 25, 1982 at 9:23 AM',
    ],
    [
      'toFormat.test.js:451 (ffff)',
      fixtureWith({ hour: 13 }),
      "EEEE, MMMM d, yyyy 'at' h:mm a",
      'en',
      'Tuesday, May 25, 1982 at 1:23 PM',
    ],
    [
      'toFormat.test.js:454 (ffff)',
      fixtureWith({ month: 2 }),
      "EEEE, MMMM d, yyyy 'at' h:mm a",
      'en',
      'Thursday, February 25, 1982 at 9:23 AM',
    ],
    [
      'toFormat.test.js:457 (ffff)',
      LUXON_FIXTURE,
      "EEEE d MMMM yyyy 'à' HH:mm",
      'fr',
      'mardi 25 mai 1982 à 09:23',
    ],
    [
      'toFormat.test.js:460 (ffff)',
      fixtureWith({ month: 2 }),
      "EEEE d MMMM yyyy 'à' HH:mm",
      'fr',
      'jeudi 25 février 1982 à 09:23',
    ],
    [
      'toFormat.test.js:463 (ffff)',
      fixtureWith({ hour: 13 }),
      "EEEE d MMMM yyyy 'à' HH:mm",
      'fr',
      'mardi 25 mai 1982 à 13:23',
    ],
    ['toFormat.test.js:491 (FFF)', LUXON_FIXTURE, 'long', 'en', 'May 25, 1982 at 9:23:54 AM'],
    [
      'toFormat.test.js:492 (FFF)',
      fixtureWith({ hour: 13 }),
      'long',
      'en',
      'May 25, 1982 at 1:23:54 PM',
    ],
    [
      'toFormat.test.js:493 (FFF)',
      fixtureWith({ month: 8 }),
      'long',
      'en',
      'August 25, 1982 at 9:23:54 AM',
    ],
    [
      'toFormat.test.js:494 (FFF)',
      LUXON_FIXTURE,
      "d MMMM yyyy 'à' H:mm:ss",
      'fr',
      '25 mai 1982 à 9:23:54',
    ],
    [
      'toFormat.test.js:495 (FFF)',
      fixtureWith({ month: 2 }),
      "d MMMM yyyy 'à' H:mm:ss",
      'fr',
      '25 février 1982 à 9:23:54',
    ],
    [
      'toFormat.test.js:498 (FFF)',
      fixtureWith({ hour: 13 }),
      "d MMMM yyyy 'à' H:mm:ss",
      'fr',
      '25 mai 1982 à 13:23:54',
    ],
    [
      'toFormat.test.js:504 (FFFF)',
      LUXON_FIXTURE,
      'full',
      'en',
      'Tuesday, May 25, 1982 at 9:23:54 AM',
    ],
    [
      'toFormat.test.js:505 (FFFF)',
      fixtureWith({ hour: 13 }),
      'full',
      'en',
      'Tuesday, May 25, 1982 at 1:23:54 PM',
    ],
    [
      'toFormat.test.js:508 (FFFF)',
      fixtureWith({ month: 2 }),
      'full',
      'en',
      'Thursday, February 25, 1982 at 9:23:54 AM',
    ],
    [
      'toFormat.test.js:511 (FFFF)',
      LUXON_FIXTURE,
      "EEEE d MMMM yyyy 'à' H:mm:ss",
      'fr',
      'mardi 25 mai 1982 à 9:23:54',
    ],
    [
      'toFormat.test.js:514 (FFFF)',
      fixtureWith({ month: 2 }),
      "EEEE d MMMM yyyy 'à' H:mm:ss",
      'fr',
      'jeudi 25 février 1982 à 9:23:54',
    ],
    [
      'toFormat.test.js:517 (FFFF)',
      fixtureWith({ hour: 13 }),
      "EEEE d MMMM yyyy 'à' H:mm:ss",
      'fr',
      'mardi 25 mai 1982 à 13:23:54',
    ],
  ])(
    '%s: values carry no zone (§2), so the zone name is left out: %s with %j in %s is %j',
    (_source, value, pattern, localeCode, expected) => {
      expect(value.format(pattern, { locale: LOCALES[localeCode] })).toBe(expected);
    },
  );
});
