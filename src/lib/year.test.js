import { test } from 'node:test'
import assert from 'node:assert/strict'
import { monthDotYear } from './year.js'

test("a 'YYYY.MM' date reads month first, as MM.YYYY", () => {
  assert.equal(monthDotYear('2026.08'), '08.2026')
  assert.equal(monthDotYear('2022.09'), '09.2022')
})

test('a bare year stays a bare year', () => {
  assert.equal(monthDotYear('2026'), '2026')
})
