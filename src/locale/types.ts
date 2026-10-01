import type { DayOfWeek } from '../day-of-week';

/** CLDR plural categories, as returned by `Intl.PluralRules#select`. */
export const PLURAL_CATEGORY = ['zero', 'one', 'two', 'few', 'many', 'other'] as const;

export type PluralCategory = (typeof PLURAL_CATEGORY)[number];

/** Text per plural category, with `{0}` standing for the number. `other` is required and covers missing categories. */
export type PluralForms = Readonly<Partial<Record<PluralCategory, string>>> & {
  readonly other: string;
};

/** Named pattern presets, from compact (`9/28/26`) to fully spelled out (`Monday, September 28, 2026`). */
export const PRESET_STYLE = ['short', 'medium', 'long', 'full'] as const;

export type PresetStyle = (typeof PRESET_STYLE)[number];

/** Units that period and duration text is written in. */
export const TEXT_UNIT = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
] as const;

export type TextUnit = (typeof TEXT_UNIT)[number];

/** How long unit names are: `2 weeks`, `2 wks` or `2w`. */
export const UNIT_STYLE = ['long', 'short', 'narrow'] as const;

export type UnitStyle = (typeof UNIT_STYLE)[number];

/** Units that relative text such as `in 3 days` is written in. */
export const RELATIVE_UNIT = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'] as const;

export type RelativeUnit = (typeof RELATIVE_UNIT)[number];

/** How long relative phrases are: `in 3 days` or `in 3 d`. */
export const RELATIVE_STYLE = ['long', 'short'] as const;

export type RelativeStyle = (typeof RELATIVE_STYLE)[number];

type MonthList = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

/** Seven names in ISO order, Monday first. */
type WeekdayList = readonly [string, string, string, string, string, string, string];

type QuarterList = readonly [string, string, string, string];

export type MonthNames = {
  readonly wide: MonthList;
  readonly abbreviated: MonthList;
  readonly narrow: MonthList;
};

export type WeekdayNames = {
  readonly wide: WeekdayList;
  readonly abbreviated: WeekdayList;
  readonly short: WeekdayList;
  readonly narrow: WeekdayList;
};

export type Presets = Readonly<Record<PresetStyle, string>>;

/** Separators for joining two items (`pair`) or three and more (`middle` between, `end` before the last). */
export type ListSeparators = {
  readonly pair: string;
  readonly middle: string;
  readonly end: string;
};

/** Relative phrases for one unit: `in {0} days` and `{0} days ago`. */
export type RelativePhrases = {
  readonly future: PluralForms;
  readonly past: PluralForms;
};

/**
 * Everything daisy needs to write and read dates in one language. A locale is plain data plus two small pure
 * helpers (`plural`, `ordinal`); import the packs you need from `daisy-date/locale/…`.
 */
export type Locale = {
  /** BCP 47 language code, also used for `Intl.PluralRules`. */
  readonly code: string;
  readonly firstDayOfWeek: DayOfWeek;
  readonly weekend: readonly DayOfWeek[];
  /** `format` names are used inside dates (`MMMM`), `standalone` names on their own (`LLLL`). */
  readonly months: { readonly format: MonthNames; readonly standalone: MonthNames };
  readonly weekdays: WeekdayNames;
  readonly quarters: { readonly abbreviated: QuarterList; readonly wide: QuarterList };
  readonly dayPeriods: { readonly am: string; readonly pm: string };
  readonly plural: (count: number) => PluralCategory;
  /** Writes `count` as an ordinal: `1st`, `1.`, `1er`. */
  readonly ordinal: (count: number) => string;
  readonly patterns: {
    readonly date: Presets;
    readonly time: Presets;
    readonly dateTime: Presets;
  };
  readonly units: Readonly<Record<TextUnit, Readonly<Record<UnitStyle, PluralForms>>>>;
  /** How amounts are joined: `2 weeks and 3 days` (conjunction), `2 weeks, 3 days` (unit), `2w 3d` (narrow). */
  readonly lists: {
    readonly conjunction: ListSeparators;
    readonly unit: ListSeparators;
    readonly narrow: ListSeparators;
  };
  /** Placed between the two ends of a formatted range: `1–3 Oct`. */
  readonly rangeSeparator: string;
  readonly relative: {
    readonly units: Readonly<
      Record<RelativeUnit, Readonly<Record<RelativeStyle, RelativePhrases>>>
    >;
    readonly days: {
      readonly dayBeforeYesterday: string;
      readonly yesterday: string;
      readonly today: string;
      readonly tomorrow: string;
      readonly dayAfterTomorrow: string;
    };
    /** The word for no difference at all, used with `numeric: 'auto'`: `now`. */
    readonly now: string;
    /** Templates with `{0}` for the weekday name: `next {0}`. */
    readonly weekdays: { readonly last: string; readonly this: string; readonly next: string };
  };
};
