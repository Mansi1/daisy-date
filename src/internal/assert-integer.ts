import { DaisyRangeError } from '../errors';

/** Throws `DaisyRangeError` unless `value` is a finite integer; `label` names it in the message. */
export const assertInteger = (value: number, label: string): void => {
  if (!Number.isInteger(value)) {
    throw new DaisyRangeError(`${label} must be an integer, got ${String(value)}`);
  }
};
