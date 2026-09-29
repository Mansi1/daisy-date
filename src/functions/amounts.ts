import { Duration } from '../duration';
import {
  MILLISECONDS_PER_HOUR,
  MILLISECONDS_PER_MINUTE,
  MILLISECONDS_PER_SECOND,
} from '../internal/time-units';
import { Period } from '../period';

type AmountTransform = {
  (period: Period): Period;
  (duration: Duration): Duration;
};

const MONTHS_PER_YEAR = 12;

const mapPeriod = (period: Period, transform: (component: number) => number): Period =>
  Period.of({
    years: transform(period.years),
    months: transform(period.months),
    weeks: transform(period.weeks),
    days: transform(period.days),
  });

const mapDuration = (duration: Duration, transform: (component: number) => number): Duration =>
  Duration.of({
    hours: transform(duration.hours),
    minutes: transform(duration.minutes),
    seconds: transform(duration.seconds),
    milliseconds: transform(duration.milliseconds),
  });

const negate = (component: number): number => -component;

/** Returns the total length of `duration` in milliseconds. */
export const toMillis = (duration: Duration): number =>
  duration.hours * MILLISECONDS_PER_HOUR +
  duration.minutes * MILLISECONDS_PER_MINUTE +
  duration.seconds * MILLISECONDS_PER_SECOND +
  duration.milliseconds;

const durationOfMillis = (totalMilliseconds: number): Duration => {
  const sign = totalMilliseconds < 0 ? -1 : 1;
  const magnitude = Math.abs(totalMilliseconds);
  return Duration.of({
    hours: sign * Math.trunc(magnitude / MILLISECONDS_PER_HOUR),
    minutes: sign * Math.trunc((magnitude % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE),
    seconds: sign * Math.trunc((magnitude % MILLISECONDS_PER_MINUTE) / MILLISECONDS_PER_SECOND),
    milliseconds: sign * (magnitude % MILLISECONDS_PER_SECOND),
  });
};

/** Returns true for a period whose components are all zero, or a duration whose total length is zero. */
export const isZero = (amount: Period | Duration): boolean =>
  amount instanceof Duration
    ? toMillis(amount) === 0
    : amount.years === 0 && amount.months === 0 && amount.weeks === 0 && amount.days === 0;

/** Returns true for a period with any negative component, or a duration with a negative total length. */
export const isNegative = (amount: Period | Duration): boolean =>
  amount instanceof Duration
    ? toMillis(amount) < 0
    : amount.years < 0 || amount.months < 0 || amount.weeks < 0 || amount.days < 0;

/** Flips the sign of every component: `P1Y-2M` becomes `P-1Y2M`, `PT1H30M` becomes `PT-1H-30M`. */
export const negated = ((amount: Period | Duration) =>
  amount instanceof Duration
    ? mapDuration(amount, negate)
    : mapPeriod(amount, negate)) as AmountTransform;

/** Makes every period component positive (`P-1Y2M` becomes `P1Y2M`), or a duration's total length non-negative. */
export const abs = ((amount: Period | Duration) => {
  if (amount instanceof Duration) {
    return isNegative(amount) ? negated(amount) : amount;
  }
  return mapPeriod(amount, Math.abs);
}) as AmountTransform;

/**
 * Folds a period's months into years (`P14M` becomes `P1Y2M`; weeks and days stay), or balances a duration's total
 * length into hours, minutes, seconds and milliseconds (`PT90M` becomes `PT1H30M`).
 */
export const normalized = ((amount: Period | Duration) => {
  if (amount instanceof Duration) {
    return durationOfMillis(toMillis(amount));
  }
  const totalMonths = amount.years * MONTHS_PER_YEAR + amount.months;
  return Period.of({
    years: Math.trunc(totalMonths / MONTHS_PER_YEAR),
    months: totalMonths % MONTHS_PER_YEAR,
    weeks: amount.weeks,
    days: amount.days,
  });
}) as AmountTransform;
