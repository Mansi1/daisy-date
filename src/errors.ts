export type DaisyErrorCode = 'TEMPORAL_UNAVAILABLE' | 'RANGE' | 'PARSE' | 'FORMAT';

/** Base class of every error daisy throws. Branch on `code`, which stays stable across versions. */
export class DaisyError extends Error {
  override readonly name: string = 'DaisyError';
  readonly code: DaisyErrorCode;

  constructor(code: DaisyErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.code = code;
  }
}

const TEMPORAL_INSTALL_HINT =
  "Install a polyfill with `npm i temporal-polyfill` and `import 'temporal-polyfill/global'` once at startup, " +
  'or pass an implementation to configureTemporal().';

/** Thrown when neither configureTemporal() nor globalThis.Temporal provides a Temporal implementation. */
export class TemporalUnavailableError extends DaisyError {
  override readonly name = 'TemporalUnavailableError';

  constructor(reason = 'Temporal is not available in this environment.') {
    super('TEMPORAL_UNAVAILABLE', `${reason} ${TEMPORAL_INSTALL_HINT}`);
  }
}

/** Thrown for out-of-range values, such as month 13 or a range that ends before it starts. */
export class DaisyRangeError extends DaisyError {
  override readonly name = 'DaisyRangeError';

  constructor(message: string, options?: ErrorOptions) {
    super('RANGE', message, options);
  }
}

export type ParseErrorDetails = {
  input: string;
  pattern?: string;
  index?: number;
};

const describeParseFailure = (reason: string, details: ParseErrorDetails): string => {
  const patternPart = details.pattern === undefined ? '' : ` with pattern "${details.pattern}"`;
  const indexPart = details.index === undefined ? '' : ` at index ${String(details.index)}`;
  return `${reason}: "${details.input}"${patternPart}${indexPart}`;
};

/** Thrown when text cannot be parsed. `index` points at the first character that did not match. */
export class DaisyParseError extends DaisyError {
  override readonly name = 'DaisyParseError';
  readonly input: string;
  readonly pattern: string | undefined;
  readonly index: number | undefined;

  constructor(reason: string, details: ParseErrorDetails, options?: ErrorOptions) {
    super('PARSE', describeParseFailure(reason, details), options);
    this.input = details.input;
    this.pattern = details.pattern;
    this.index = details.index;
  }
}

/** Thrown for invalid patterns, or pattern fields the formatted type does not have. */
export class DaisyFormatError extends DaisyError {
  override readonly name = 'DaisyFormatError';

  constructor(message: string, options?: ErrorOptions) {
    super('FORMAT', message, options);
  }
}
