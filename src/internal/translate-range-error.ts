import type { DaisyError } from '../errors';

/** Runs a Temporal call and replaces a `RangeError` it throws with the daisy error built by `toDaisyError`. */
export const translateRangeError = <T>(
  temporalCall: () => T,
  toDaisyError: (cause: RangeError) => DaisyError,
): T => {
  try {
    return temporalCall();
  } catch (error) {
    if (error instanceof RangeError) {
      throw toDaisyError(error);
    }
    throw error;
  }
};
