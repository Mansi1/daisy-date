import { getTemporal } from './temporal';

/** Returns `timeZone`, or the system time zone when it is omitted. */
export const resolveTimeZone = (timeZone: string | undefined): string =>
  timeZone ?? getTemporal().Now.timeZoneId();
