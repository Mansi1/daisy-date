import { describe, expect, it } from 'vitest';

import { LocalDateTime } from '../../../../src';

describe('Luxon datetime/transform: toJSDate', () => {
  it('transform.test.js:60: toDate returns a native Date for the same instant', () => {
    const jsDate = LocalDateTime.of(1982, 5, 25, 9, 23, 54, 123).toDate('UTC');
    expect(jsDate).toBeInstanceOf(Date);
    expect(jsDate.getTime()).toBe(Date.UTC(1982, 4, 25, 9, 23, 54, 123));
  });
});
