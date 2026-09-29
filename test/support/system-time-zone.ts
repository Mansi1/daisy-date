import type {} from 'temporal-polyfill/global';

import { configureTemporal } from '../../src';

/** A zone at UTC+14, so a late-evening UTC instant already falls on the next day there. */
export const SYSTEM_TIME_ZONE = 'Pacific/Kiritimati';

/** Makes daisy treat `timeZone` as the system time zone; reset with `configureTemporal(undefined)`. */
export const useSystemTimeZone = (timeZone: string): void => {
  configureTemporal({
    PlainDate: Temporal.PlainDate,
    PlainDateTime: Temporal.PlainDateTime,
    Duration: Temporal.Duration,
    Instant: Temporal.Instant,
    Now: {
      plainDateISO: (zone) => Temporal.Now.plainDateISO(zone),
      plainDateTimeISO: (zone) => Temporal.Now.plainDateTimeISO(zone),
      timeZoneId: () => timeZone,
    },
  });
};
