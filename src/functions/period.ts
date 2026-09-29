import { Period } from '../period';

const MONTHS_PER_YEAR = 12;

const mapComponents = (period: Period, transform: (component: number) => number): Period =>
  Period.of({
    years: transform(period.years),
    months: transform(period.months),
    weeks: transform(period.weeks),
    days: transform(period.days),
  });

/** Returns `period` with every component's sign flipped: `P1Y-2M` becomes `P-1Y2M`. */
export const negated = (period: Period): Period => mapComponents(period, (component) => -component);

/** Returns `period` with every component made positive: `P-1Y2M` becomes `P1Y2M`. */
export const abs = (period: Period): Period => mapComponents(period, Math.abs);

export const isZero = (period: Period): boolean =>
  period.years === 0 && period.months === 0 && period.weeks === 0 && period.days === 0;

/** Returns true if any component is negative, as in java.time. */
export const isNegative = (period: Period): boolean =>
  period.years < 0 || period.months < 0 || period.weeks < 0 || period.days < 0;

/** Folds months into years (`P14M` becomes `P1Y2M`, `P1Y-1M` becomes `P11M`); weeks and days stay unchanged. */
export const normalized = (period: Period): Period => {
  const totalMonths = period.years * MONTHS_PER_YEAR + period.months;
  return Period.of({
    years: Math.trunc(totalMonths / MONTHS_PER_YEAR),
    months: totalMonths % MONTHS_PER_YEAR,
    weeks: period.weeks,
    days: period.days,
  });
};
