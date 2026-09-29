import type { PluralCategory } from './types';

const pluralRulesByLocale = new Map<string, Intl.PluralRules>();

/** Selects the CLDR plural category of `count` in `code`, reusing one `Intl.PluralRules` per language and type. */
export const selectPluralCategory = (
  code: string,
  count: number,
  type: Intl.PluralRuleType = 'cardinal',
): PluralCategory => {
  const key = `${code}/${type}`;
  const cachedRules = pluralRulesByLocale.get(key);
  if (cachedRules !== undefined) {
    return cachedRules.select(count);
  }
  const rules = new Intl.PluralRules(code, { type });
  pluralRulesByLocale.set(key, rules);
  return rules.select(count);
};
