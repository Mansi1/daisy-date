import { describe, expect, it } from 'vitest';

import { en, getDefaultLocale, setDefaultLocale } from '../../../../src';
import { de } from '../../../../src/locale/de';

describe('Luxon info/localeWeek, Info week data as locale.firstDayOfWeek and locale.weekend', () => {
  it('localeWeek.test.js:7: German weeks start on Monday', () => {
    expect(de.firstDayOfWeek).toBe('monday');
  });

  it('localeWeek.test.js:29: the English weekend is Saturday and Sunday', () => {
    expect(en.weekend).toEqual(['saturday', 'sunday']);
  });

  it('localeWeek.test.js:39: week data follows the default locale', () => {
    try {
      expect(getDefaultLocale().weekend).toEqual(['saturday', 'sunday']);
      setDefaultLocale(de);
      expect(getDefaultLocale().firstDayOfWeek).toBe('monday');
    } finally {
      setDefaultLocale(en);
    }
  });
});
