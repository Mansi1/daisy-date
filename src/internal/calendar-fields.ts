import { DaisyRangeError } from '../errors';
import type { CalendarFields } from './temporal';

/** Reads the ISO week number, which Temporal leaves undefined only for non-ISO calendars that daisy never creates. */
export const isoWeekOfYear = (fields: CalendarFields, description: string): number => {
  if (fields.weekOfYear === undefined) {
    throw new DaisyRangeError(`No ISO week of year for ${description}`);
  }
  return fields.weekOfYear;
};
