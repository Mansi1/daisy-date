import { en } from './en';
import type { Locale } from './types';

const defaultLocale: { current: Locale } = { current: en };

/** Makes `locale` the default for every formatting and parsing call that doesn't pass `options.locale`. */
export const setDefaultLocale = (locale: Locale): void => {
  defaultLocale.current = locale;
};

/** Returns the locale used when a call doesn't pass `options.locale`; English unless `setDefaultLocale` changed it. */
export const getDefaultLocale = (): Locale => defaultLocale.current;
