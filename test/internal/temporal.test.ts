import type {} from 'temporal-polyfill/global';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TemporalUnavailableError, configureTemporal } from '../../src';
import type { TemporalLike } from '../../src';
import { getTemporal } from '../../src/internal/temporal';

const polyfillTemporal = globalThis.Temporal;

const createTemporalCopy = (): TemporalLike => ({
  PlainDate: polyfillTemporal.PlainDate,
  PlainDateTime: polyfillTemporal.PlainDateTime,
  Duration: polyfillTemporal.Duration,
  Instant: polyfillTemporal.Instant,
  Now: polyfillTemporal.Now,
});

afterEach(() => {
  vi.unstubAllGlobals();
  configureTemporal(undefined);
});

describe('getTemporal', () => {
  it('uses globalThis.Temporal when nothing is configured', () => {
    expect(getTemporal()).toBe(polyfillTemporal);
  });

  it('prefers a configured implementation over the global one', () => {
    const configured = createTemporalCopy();
    configureTemporal(configured);
    expect(getTemporal()).toBe(configured);
  });

  it('falls back to the global again after configuring undefined', () => {
    configureTemporal(createTemporalCopy());
    configureTemporal(undefined);
    expect(getTemporal()).toBe(polyfillTemporal);
  });

  it('caches the detected global until configureTemporal is called', () => {
    expect(getTemporal()).toBe(polyfillTemporal);
    const replacement = createTemporalCopy();
    vi.stubGlobal('Temporal', replacement);
    expect(getTemporal()).toBe(polyfillTemporal);
    configureTemporal(undefined);
    expect(getTemporal()).toBe(replacement);
  });

  it('throws with the install hint when no Temporal exists', () => {
    configureTemporal(undefined);
    vi.stubGlobal('Temporal', undefined);
    expect(getTemporal).toThrow(TemporalUnavailableError);
    expect(getTemporal).toThrow(/npm i temporal-polyfill/);
  });

  it('does not cache a failed detection', () => {
    vi.stubGlobal('Temporal', undefined);
    expect(getTemporal).toThrow(TemporalUnavailableError);
    vi.stubGlobal('Temporal', polyfillTemporal);
    expect(getTemporal()).toBe(polyfillTemporal);
  });

  it.each([
    ['a string', 'Temporal'],
    ['null', null],
    ['an object without Now', { ...createTemporalCopy(), Now: undefined }],
    ['an object with Now set to null', { ...createTemporalCopy(), Now: null }],
    ['an object without PlainDateTime', { ...createTemporalCopy(), PlainDateTime: undefined }],
    ['an object without Instant', { ...createTemporalCopy(), Instant: undefined }],
  ])('rejects %s as globalThis.Temporal', (_description, fakeTemporal) => {
    vi.stubGlobal('Temporal', fakeTemporal);
    expect(getTemporal).toThrow(/globalThis\.Temporal is not a complete Temporal implementation/);
  });
});

describe('configureTemporal', () => {
  it('accepts the polyfill namespace without casts', () => {
    expect(() => {
      configureTemporal(polyfillTemporal);
    }).not.toThrow();
  });

  it('rejects objects that are not Temporal implementations', () => {
    expect(() => {
      configureTemporal({} as TemporalLike);
    }).toThrow(/not a Temporal implementation/);
  });

  it('keeps the previous implementation when the new one is rejected', () => {
    const configured = createTemporalCopy();
    configureTemporal(configured);
    expect(() => {
      configureTemporal({} as TemporalLike);
    }).toThrow(TemporalUnavailableError);
    expect(getTemporal()).toBe(configured);
  });
});
