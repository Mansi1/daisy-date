import { TemporalUnavailableError } from '../errors';

type TemporalClass = abstract new (...args: never[]) => unknown;

type PlainDateFields = { year: number; month: number; day: number };

type OverflowOptions = { overflow?: 'constrain' | 'reject' };

/** Calendar amounts a PlainDate can be moved by; month and year steps clamp to the month end. */
export type DateDuration = { days?: number; weeks?: number; months?: number; years?: number };

/** The calendar fields that Temporal's `PlainDate` and `PlainDateTime` share. */
export type CalendarFields = {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly dayOfWeek: number;
  readonly dayOfYear: number;
  readonly weekOfYear: number | undefined;
  readonly yearOfWeek: number | undefined;
  readonly daysInMonth: number;
  readonly daysInYear: number;
  readonly inLeapYear: boolean;
};

/** The members of a `Temporal.PlainDate` instance daisy reads. */
export type PlainDateLike = CalendarFields & {
  add: (duration: DateDuration) => PlainDateLike;
  with: (fields: Partial<PlainDateFields>, options?: OverflowOptions) => PlainDateLike;
  until: (
    other: PlainDateLike,
    options?: { largestUnit?: 'year' },
  ) => { readonly years: number; readonly months: number; readonly days: number };
  toZonedDateTime: (options: { timeZone: string }) => { readonly epochMilliseconds: number };
  toString: () => string;
};

/** Wall-clock time fields, down to the millisecond daisy supports. */
export type TimeFields = { hour: number; minute: number; second: number; millisecond: number };

/** Clock amounts a PlainDateTime can be moved by. */
export type TimeDuration = {
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
};

type DateTimeDifference = {
  readonly years: number;
  readonly months: number;
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly milliseconds: number;
};

/** The members of a `Temporal.PlainDateTime` instance daisy reads. */
export type PlainDateTimeLike = CalendarFields &
  Readonly<TimeFields> & {
    add: (duration: DateDuration & TimeDuration) => PlainDateTimeLike;
    with: (
      fields: Partial<PlainDateFields & TimeFields & { microsecond: number; nanosecond: number }>,
      options?: OverflowOptions,
    ) => PlainDateTimeLike;
    until: (
      other: PlainDateTimeLike,
      options: { largestUnit: 'year' | 'hour' },
    ) => DateTimeDifference;
    toPlainDate: () => PlainDateLike;
    toZonedDateTime: (timeZone: string) => { readonly epochMilliseconds: number };
    toString: (options?: { fractionalSecondDigits?: 0 | 3 }) => string;
  };

type PlainDateTimeClass = TemporalClass & {
  from: (
    item: string | (PlainDateFields & Partial<TimeFields>),
    options?: OverflowOptions,
  ) => PlainDateTimeLike;
  compare: (one: PlainDateTimeLike, two: PlainDateTimeLike) => number;
};

type PlainDateClass = TemporalClass & {
  from: (item: string | PlainDateFields, options?: OverflowOptions) => PlainDateLike;
  compare: (one: PlainDateLike, two: PlainDateLike) => number;
};

type InstantClass = TemporalClass & {
  fromEpochMilliseconds: (epochMilliseconds: number) => {
    toZonedDateTimeISO: (timeZone: string) => {
      toPlainDate: () => PlainDateLike;
      toPlainDateTime: () => PlainDateTimeLike;
    };
  };
};

/** The part of the Temporal API daisy relies on, typed structurally so any spec-compliant implementation fits. */
export type TemporalLike = {
  readonly PlainDate: PlainDateClass;
  readonly PlainDateTime: PlainDateTimeClass;
  readonly Duration: TemporalClass;
  readonly Instant: InstantClass;
  readonly Now: {
    plainDateISO: (timeZone?: string) => PlainDateLike;
    plainDateTimeISO: (timeZone?: string) => PlainDateTimeLike;
    timeZoneId: () => string;
  };
};

const REQUIRED_CLASSES = ['PlainDate', 'PlainDateTime', 'Duration', 'Instant'] as const;

const isTemporalLike = (candidate: unknown): candidate is TemporalLike => {
  if (typeof candidate !== 'object' || candidate === null) {
    return false;
  }
  const namespace = candidate as Record<string, unknown>;
  return (
    REQUIRED_CLASSES.every((className) => typeof namespace[className] === 'function') &&
    typeof namespace['Now'] === 'object' &&
    namespace['Now'] !== null
  );
};

const temporalSource: {
  configured: TemporalLike | undefined;
  detected: TemporalLike | undefined;
} = { configured: undefined, detected: undefined };

const detectGlobalTemporal = (): TemporalLike => {
  const globalTemporal: unknown = (globalThis as { Temporal?: unknown }).Temporal;
  if (globalTemporal === undefined) {
    throw new TemporalUnavailableError();
  }
  if (!isTemporalLike(globalTemporal)) {
    throw new TemporalUnavailableError(
      'globalThis.Temporal is not a complete Temporal implementation.',
    );
  }
  return globalTemporal;
};

/** Uses `temporal` for all daisy operations instead of `globalThis.Temporal`; pass `undefined` to go back. */
export const configureTemporal = (temporal: TemporalLike | undefined): void => {
  if (temporal !== undefined && !isTemporalLike(temporal)) {
    throw new TemporalUnavailableError(
      'The object passed to configureTemporal() is not a Temporal implementation.',
    );
  }
  temporalSource.configured = temporal;
  temporalSource.detected = undefined;
};

/** Returns the configured Temporal implementation, detecting and caching the global one on first use. */
export const getTemporal = (): TemporalLike => {
  if (temporalSource.configured !== undefined) {
    return temporalSource.configured;
  }
  temporalSource.detected ??= detectGlobalTemporal();
  return temporalSource.detected;
};
