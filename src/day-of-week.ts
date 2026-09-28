import { DaisyRangeError } from './errors';

/** Days of the week in ISO order, starting with Monday. */
export const DAY_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type DayOfWeek = (typeof DAY_OF_WEEK)[number];

const DAYS_PER_WEEK = DAY_OF_WEEK.length;

/** Returns true when `value` is one of the `DAY_OF_WEEK` names. */
export const isDayOfWeek = (value: unknown): value is DayOfWeek =>
  DAY_OF_WEEK.includes(value as DayOfWeek);

/** Converts an ISO day-of-week number (1 = Monday … 7 = Sunday), as used by Temporal, to a `DayOfWeek`. */
export const dayOfWeekFromIsoNumber = (isoNumber: number): DayOfWeek => {
  const dayOfWeek = Number.isInteger(isoNumber) ? DAY_OF_WEEK[isoNumber - 1] : undefined;
  if (dayOfWeek === undefined) {
    throw new DaisyRangeError(
      `ISO day of week must be an integer from 1 to 7, got ${String(isoNumber)}`,
    );
  }
  return dayOfWeek;
};

/** Converts a `DayOfWeek` to its ISO number (1 = Monday … 7 = Sunday). */
export const dayOfWeekToIsoNumber = (dayOfWeek: DayOfWeek): number =>
  DAY_OF_WEEK.indexOf(dayOfWeek) + 1;

/** Moves `dayOfWeek` by `days`, wrapping around the week in both directions. */
export const shiftDayOfWeek = (dayOfWeek: DayOfWeek, days: number): DayOfWeek => {
  if (!Number.isInteger(days)) {
    throw new DaisyRangeError(`Days must be an integer, got ${String(days)}`);
  }
  const shiftedIndex =
    (DAY_OF_WEEK.indexOf(dayOfWeek) + (days % DAYS_PER_WEEK) + DAYS_PER_WEEK) % DAYS_PER_WEEK;
  return dayOfWeekFromIsoNumber(shiftedIndex + 1);
};
