import { describe, expect, it } from 'vitest';

import { LocalDate } from '../../../../src';
import type { DayOfWeek } from '../../../../src';

describe('Luxon datetime/reconfigure: week start', () => {
  it.each<[string, DayOfWeek]>([
    ['reconfigure.test.js:45: a week starting on Saturday starts on a Saturday', 'saturday'],
    ['reconfigure.test.js:53: a week starting on Wednesday starts on a Wednesday', 'wednesday'],
  ])('%s', (_name, firstDay) => {
    expect(LocalDate.of(2022, 1, 4).startOfWeek(firstDay).dayOfWeek).toBe(firstDay);
  });
});
