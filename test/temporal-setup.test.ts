import type {} from 'temporal-polyfill/global';
import { expect, it } from 'vitest';

it('provides Temporal to every test through the polyfill setup file', () => {
  expect(Temporal.PlainDate.from('2026-09-28').dayOfWeek).toBe(1);
});
