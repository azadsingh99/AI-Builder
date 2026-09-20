const assert = require('node:assert/strict');
const { test } = require('node:test');
const { normalizeModelName } = require('../utility/modelCreation');

test('normalizes valid model names', () => {
  assert.equal(normalizeModelName('User Profile'), 'UserProfile');
});

test('rejects invalid model names', () => {
  assert.throws(() => normalizeModelName('123User'));
});
