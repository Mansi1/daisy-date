import { TemporalUnavailableError } from '../errors';

type TemporalClass = abstract new (...args: never[]) => unknown;

/** The part of the Temporal API daisy relies on, typed structurally so any spec-compliant implementation fits. */
export type TemporalLike = {
  readonly PlainDate: TemporalClass;
  readonly PlainDateTime: TemporalClass;
  readonly Duration: TemporalClass;
  readonly Now: object;
};

const REQUIRED_CLASSES = ['PlainDate', 'PlainDateTime', 'Duration'] as const;

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

let configuredTemporal: TemporalLike | undefined;
let detectedTemporal: TemporalLike | undefined;

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
  configuredTemporal = temporal;
  detectedTemporal = undefined;
};

/** Returns the configured Temporal implementation, detecting and caching the global one on first use. */
export const getTemporal = (): TemporalLike => {
  if (configuredTemporal !== undefined) {
    return configuredTemporal;
  }
  detectedTemporal ??= detectGlobalTemporal();
  return detectedTemporal;
};
