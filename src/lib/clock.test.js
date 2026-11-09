import { test } from 'node:test'
import assert from 'node:assert/strict'
import { clock, seek } from './clock.js'

test('seconds read as m:ss, like a music player', () => {
  assert.equal(clock(0), '0:00')
  assert.equal(clock(9), '0:09')
  assert.equal(clock(128), '2:08')
  assert.equal(clock(213), '3:33')
})

test('a skip moves by the step but stays inside the song', () => {
  assert.equal(seek(100, 10, 213), 110)
  assert.equal(seek(100, -10, 213), 90)
  assert.equal(seek(4, -10, 213), 0)
  assert.equal(seek(209, 10, 213), 213)
})
