import { ComparableValue, toComparisonResult } from './comparable';
import type { ComparisonResult } from './comparable';
import { DaisyParseError, DaisyRangeError } from './errors';
import { abs, isNegative, isZero, negated, normalized, toMillis } from './functions/amounts';
import { minus, plus } from './functions/arithmetic';
import { assertInteger } from './internal/assert-integer';
import { MILLISECONDS_PER_SECOND } from './internal/time-units';

export type DurationFields = {
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
};

const ISO_DURATION_FORMAT =
  /^([+-])?PT(?!$)(?:([+-]?\d+)H)?(?:([+-]?\d+)M)?(?:([+-]?)(\d+)(?:[.,](\d{1,9}))?S)?$/i;

const MILLISECOND_DIGITS = 3;

const withoutNegativeZero = (value: number): number => value + 0;

const parseWholeNumber = (digits: string | undefined, text: string): number => {
  const value = digits === undefined ? 0 : Number(digits);
  if (!Number.isSafeInteger(value)) {
    throw new DaisyParseError('Duration component is too large', { input: text });
  }
  return value;
};

const parseMilliseconds = (fraction: string | undefined, text: string): number => {
  if (fraction === undefined) {
    return 0;
  }
  if (/[1-9]/.test(fraction.slice(MILLISECOND_DIGITS))) {
    throw new DaisyParseError('Durations are precise to milliseconds', { input: text });
  }
  return Number(fraction.slice(0, MILLISECOND_DIGITS).padEnd(MILLISECOND_DIGITS, '0'));
};

const formatSeconds = (totalMilliseconds: number): string => {
  if (totalMilliseconds === 0) {
    return '';
  }
  const sign = totalMilliseconds < 0 ? '-' : '';
  const magnitude = Math.abs(totalMilliseconds);
  const wholeSeconds = Math.trunc(magnitude / MILLISECONDS_PER_SECOND);
  const fraction = String(magnitude % MILLISECONDS_PER_SECOND)
    .padStart(MILLISECOND_DIGITS, '0')
    .replace(/0+$/, '');
  return `${sign}${String(wholeSeconds)}${fraction === '' ? '' : `.${fraction}`}S`;
};

const formatComponent = (value: number, designator: string): string =>
  value === 0 ? '' : `${String(value)}${designator}`;

/**
 * A time-based amount in hours, minutes, seconds and milliseconds, such as `PT2H30M`. Immutable and ordered by its
 * total length, so `PT1H` equals `PT60M`; components keep the units they were created with until `normalized()`.
 */
export class Duration extends ComparableValue<Duration> {
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly milliseconds: number;

  private constructor(hours: number, minutes: number, seconds: number, milliseconds: number) {
    super();
    this.hours = withoutNegativeZero(hours);
    this.minutes = withoutNegativeZero(minutes);
    this.seconds = withoutNegativeZero(seconds);
    this.milliseconds = withoutNegativeZero(milliseconds);
    if (!Number.isSafeInteger(toMillis(this))) {
      throw new DaisyRangeError('A duration must stay within ±9007199254740991 milliseconds');
    }
    Object.freeze(this);
  }

  /** Creates a duration from integer components; omitted components are zero. */
  static of({ hours = 0, minutes = 0, seconds = 0, milliseconds = 0 }: DurationFields): Duration {
    assertInteger(hours, 'Hours');
    assertInteger(minutes, 'Minutes');
    assertInteger(seconds, 'Seconds');
    assertInteger(milliseconds, 'Milliseconds');
    return new Duration(hours, minutes, seconds, milliseconds);
  }

  static ofHours(hours: number): Duration {
    return Duration.of({ hours });
  }

  static ofMinutes(minutes: number): Duration {
    return Duration.of({ minutes });
  }

  static ofSeconds(seconds: number): Duration {
    return Duration.of({ seconds });
  }

  static ofMilliseconds(milliseconds: number): Duration {
    return Duration.of({ milliseconds });
  }

  /**
   * Parses an ISO 8601 time duration such as `PT2H30M`, `PT0.5S` or `-PT1H`. Only seconds may have a fraction, down
   * to milliseconds; date parts (`P1D`) belong to `Period` and are rejected.
   */
  static parse(text: string): Duration {
    const match = ISO_DURATION_FORMAT.exec(text);
    if (match === null) {
      throw new DaisyParseError('Expected an ISO 8601 duration such as PT2H30M', { input: text });
    }
    const [, leadingSign, hours, minutes, secondsSign, seconds, fraction] = match;
    const sign = leadingSign === '-' ? -1 : 1;
    const secondsDirection = secondsSign === '-' ? -sign : sign;
    return new Duration(
      sign * parseWholeNumber(hours, text),
      sign * parseWholeNumber(minutes, text),
      secondsDirection * parseWholeNumber(seconds, text),
      secondsDirection * parseMilliseconds(fraction, text),
    );
  }

  /** Adds `other` component by component: `PT1H` plus `PT30M` is `PT1H30M`. */
  plus(other: Duration): Duration {
    return plus(this, other);
  }

  minus(other: Duration): Duration {
    return minus(this, other);
  }

  negated(): Duration {
    return negated(this);
  }

  /** Returns the duration with a non-negative total length. */
  abs(): Duration {
    return abs(this);
  }

  /** Balances the total length into hours, minutes, seconds and milliseconds: `PT90M` becomes `PT1H30M`. */
  normalized(): Duration {
    return normalized(this);
  }

  /** Returns true if the total length is zero, so `PT1H-60M` counts as zero. */
  isZero(): boolean {
    return isZero(this);
  }

  /** Returns true if the total length is negative. */
  isNegative(): boolean {
    return isNegative(this);
  }

  toMillis(): number {
    return toMillis(this);
  }

  compareTo(other: Duration): ComparisonResult {
    return toComparisonResult(toMillis(this) - toMillis(other));
  }

  /** Returns the ISO 8601 form, such as `PT2H30M` or `PT1.5S`; the zero duration is `PT0S`. */
  override toString(): string {
    const components =
      formatComponent(this.hours, 'H') +
      formatComponent(this.minutes, 'M') +
      formatSeconds(this.seconds * MILLISECONDS_PER_SECOND + this.milliseconds);
    return components === '' ? 'PT0S' : `PT${components}`;
  }

  toJSON(): string {
    return this.toString();
  }

  /** Shows the duration in `console.log` and Node's `util.inspect`, e.g. `Duration(PT2H30M)`. */
  [Symbol.for('nodejs.util.inspect.custom')](): string {
    return `Duration(${this.toString()})`;
  }
}
