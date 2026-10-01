import { Duration } from '../duration';
import { DaisyRangeError } from '../errors';
import { assertInteger } from '../internal/assert-integer';
import { getDefaultLocale } from '../locale/default-locale';
import { UNIT_STYLE } from '../locale/types';
import type { ListSeparators, Locale, TextUnit, UnitStyle } from '../locale/types';
import type { Period } from '../period';

/** How amount parts are joined: `2 weeks and 3 days`, `2 weeks, 3 days` or `2w 3d`. */
export const LIST_STYLE = ['conjunction', 'unit', 'narrow'] as const;

export type ListStyle = (typeof LIST_STYLE)[number];

/** Whether zero components are left out (`'omit'`, default) or written (`'show'`). */
export const ZERO_DISPLAY = ['omit', 'show'] as const;

export type ZeroDisplay = (typeof ZERO_DISPLAY)[number];

export type AmountFormatOptions = {
  /** The locale for unit names and list separators; defaults to `getDefaultLocale()`. */
  locale?: Locale;
  /** `'long'` (default) gives `2 weeks`, `'short'` gives `2 wks`, `'narrow'` gives `2w`. */
  style?: UnitStyle;
  /** Defaults to `'conjunction'`, or to `'narrow'` for the narrow style. */
  list?: ListStyle;
  zeros?: ZeroDisplay;
  /** Keeps only this many units, starting from the largest written one: 2 turns `1 year, 2 months, and 3 days` into `1 year and 2 months`. */
  largestUnits?: number;
};

type AmountPart = { readonly unit: TextUnit; readonly count: number };

const assertOneOf = <T extends string>(allowed: readonly T[], value: T, label: string): void => {
  if (!allowed.includes(value)) {
    throw new DaisyRangeError(`${label} must be one of ${allowed.join(', ')}, got ${value}`);
  }
};

const partsOf = (amount: Period | Duration): readonly AmountPart[] =>
  amount instanceof Duration
    ? [
        { unit: 'hours', count: amount.hours },
        { unit: 'minutes', count: amount.minutes },
        { unit: 'seconds', count: amount.seconds },
        { unit: 'milliseconds', count: amount.milliseconds },
      ]
    : [
        { unit: 'years', count: amount.years },
        { unit: 'months', count: amount.months },
        { unit: 'weeks', count: amount.weeks },
        { unit: 'days', count: amount.days },
      ];

const zeroPart = (amount: Period | Duration): AmountPart =>
  amount instanceof Duration ? { unit: 'seconds', count: 0 } : { unit: 'days', count: 0 };

const writePart = (locale: Locale, style: UnitStyle, { unit, count }: AmountPart): string => {
  const forms = locale.units[unit][style];
  return (forms[locale.plural(Math.abs(count))] ?? forms.other).replace('{0}', String(count));
};

/** Internal: joins list items with a locale's separators: `a`, `a and b`, `a, b, and c`. */
export const joinList = (items: readonly string[], separators: ListSeparators): string => {
  if (items.length <= 2) {
    return items.join(separators.pair);
  }
  return `${items.slice(0, -1).join(separators.middle)}${separators.end}${items.slice(-1).join('')}`;
};

/**
 * Writes a period or duration as text: `2 weeks and 3 days`, `1 hr and 30 min`, `2w 3d`. Components are written as
 * stored (`PT90M` is `90 minutes`; call `normalized()` first to get `1 hour and 30 minutes`); zero is `0 days` or
 * `0 seconds`.
 */
export const formatAmount = (
  amount: Period | Duration,
  options: AmountFormatOptions = {},
): string => {
  const {
    locale = getDefaultLocale(),
    style = 'long',
    zeros = 'omit',
    largestUnits = Number.POSITIVE_INFINITY,
  } = options;
  const list = options.list ?? (style === 'narrow' ? 'narrow' : 'conjunction');
  assertOneOf(UNIT_STYLE, style, 'Style');
  assertOneOf(LIST_STYLE, list, 'List');
  assertOneOf(ZERO_DISPLAY, zeros, 'Zeros');
  if (largestUnits !== Number.POSITIVE_INFINITY) {
    assertInteger(largestUnits, 'Largest units');
  }
  if (largestUnits < 1) {
    throw new DaisyRangeError(`Largest units must be at least 1, got ${String(largestUnits)}`);
  }
  const writtenParts = partsOf(amount).filter((part) => zeros === 'show' || part.count !== 0);
  const keptParts = (writtenParts.length === 0 ? [zeroPart(amount)] : writtenParts).slice(
    0,
    largestUnits,
  );
  return joinList(
    keptParts.map((part) => writePart(locale, style, part)),
    locale.lists[list],
  );
};
