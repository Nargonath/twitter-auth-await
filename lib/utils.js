import * as assert from 'assert';

export function ensure(paramName) {
  let message = 'A param';

  if (paramName) {
    message = `${paramName}`;
  }

  message = `${message} is required`;

  assert.fail(message);
}
