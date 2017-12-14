import { AssertionError } from 'assert';

import { ensure } from '../lib/utils';

test('throws AssertionError when called', () => {
  expect(() => ensure()).toThrow(AssertionError);
});

test('accepts name to customize message thrown', () => {
  expect(() => ensure`myProp`).toThrow(/myProp/);
});
