import { DaisyParseError } from './errors';
import { minus, plus } from './functions/arithmetic';
import { equals } from './functions/equality';
import { abs, isNegative, isZero, negated, normalized } from './functions/amounts';
import { formatAmount } from './functions/amount-format';
import type { AmountFormatOptions } from './functions/amount-format';
import { assertInteger } from './internal/assert-integer';

export type PeriodFields = {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
};

const ISO_PERIOD_FORMAT =
  /^([+-])?P(?!$)(?:([+-]?\d+)Y)?(?:([+-]?\d+)M)?(?:([+-]?\d+)W)?(?:([+-]?\d+)D)?$/i;

const withoutNegativeZero = (value: number): number => value + 0;

const parseComponent = (digits: string | undefined, sign: 1 | -1, text: string): number => {
  const value = digits === undefined ? 0 : Number(digits);
  if (!Number.isSafeInteger(value)) {
    throw new DaisyParseError('Period component is too large', { input: text });
  }
  return sign * value;
};

const formatComponent = (value: number, designator: string): string =>
  value === 0 ? '' : `${String(value)}${designator}`;

/**
 * A date-based amount of time in years, months, weeks and days, such as `P1Y2M3D`. Components may have mixed signs.
 * Immutable; two periods are equal only if every component is equal, so `P12M` is not `P1Y`.
 */
export class Period {
  readonly years: number;
  readonly months: number;
  readonly weeks: number;
  readonly days: number;

  private constructor(years: number, months: number, weeks: number, days: number) {
    this.years = withoutNegativeZero(years);
    this.months = withoutNegativeZero(months);
    this.weeks = withoutNegativeZero(weeks);
    this.days = withoutNegativeZero(days);
    Object.freeze(this);
  }

  /** Creates a period from integer components; omitted components are zero. */
  static of({ years = 0, months = 0, weeks = 0, days = 0 }: PeriodFields): Period {
    assertInteger(years, 'Years');
    assertInteger(months, 'Months');
    assertInteger(weeks, 'Weeks');
    assertInteger(days, 'Days');
    return new Period(years, months, weeks, days);
  }

  static ofYears(years: number): Period {
    return Period.of({ years });
  }

  static ofMonths(months: number): Period {
    return Period.of({ months });
  }

  static ofWeeks(weeks: number): Period {
    return Period.of({ weeks });
  }

  static ofDays(days: number): Period {
    return Period.of({ days });
  }

  /** Parses an ISO 8601 period such as `P1Y2M3D`, `P2W`, `-P1M` or `P-1Y2M`; time parts (`PT1H`) are rejected. */
  static parse(text: string): Period {
    const match = ISO_PERIOD_FORMAT.exec(text);
    if (match === null) {
      throw new DaisyParseError('Expected an ISO 8601 period such as P1Y2M3D', { input: text });
    }
    const [, leadingSign, years, months, weeks, days] = match;
    const sign = leadingSign === '-' ? -1 : 1;
    return new Period(
      parseComponent(years, sign, text),
      parseComponent(months, sign, text),
      parseComponent(weeks, sign, text),
      parseComponent(days, sign, text),
    );
  }

  /** Adds `other` component by component: `P1Y2M` plus `P1M` is `P1Y3M`. */
  plus(other: Period): Period {
    return plus(this, other);
  }

  minus(other: Period): Period {
    return minus(this, other);
  }

  negated(): Period {
    return negated(this);
  }

  abs(): Period {
    return abs(this);
  }

  /** Folds months into years: `P14M` becomes `P1Y2M`; weeks and days stay unchanged. */
  normalized(): Period {
    return normalized(this);
  }

  isZero(): boolean {
    return isZero(this);
  }

  /** Returns true if any component is negative. */
  isNegative(): boolean {
    return isNegative(this);
  }

  /** Compares component by component, so `P12M` does not equal `P1Y`. */
  equals(other: Period): boolean {
    return equals(this, other);
  }

  /** Returns the ISO 8601 form, such as `P1Y2M3D`; the zero period is `P0D`. */
  toString(): string {
    const components =
      formatComponent(this.years, 'Y') +
      formatComponent(this.months, 'M') +
      formatComponent(this.weeks, 'W') +
      formatComponent(this.days, 'D');
    return components === '' ? 'P0D' : `P${components}`;
  }

  /** Writes the period as text: `P2W3D` is `2 weeks and 3 days`, or `2w 3d` with `{ style: 'narrow' }`. */
  format(options?: AmountFormatOptions): string {
    return formatAmount(this, options);
  }

  toJSON(): string {
    return this.toString();
  }

  /** Shows the period in `console.log` and Node's `util.inspect`, e.g. `Period(P1Y2M)`. */
  [Symbol.for('nodejs.util.inspect.custom')](): string {
    return `Period(${this.toString()})`;
  }
}
