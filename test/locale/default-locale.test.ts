import { afterEach, describe, expect, it } from 'vitest';

import { en, getDefaultLocale, setDefaultLocale } from '../../src';
import type { Locale } from '../../src';

const britishEnglish: Locale = { ...en, code: 'en-GB', patterns: { ...en.patterns } };

afterEach(() => {
  setDefaultLocale(en);
});

describe('default locale', () => {
  it('is English out of the box', () => {
    expect(getDefaultLocale()).toBe(en);
  });

  it('switches to the locale passed to setDefaultLocale', () => {
    setDefaultLocale(britishEnglish);
    expect(getDefaultLocale()).toBe(britishEnglish);
  });

  it('switches back', () => {
    setDefaultLocale(britishEnglish);
    setDefaultLocale(en);
    expect(getDefaultLocale()).toBe(en);
  });
});
