import { test } from 'node:test'
import assert from 'node:assert/strict'
import { shouldShowIntro } from './intro.js'

const fresh = { pathname: '/', hash: '', seen: false, reducedMotion: false }

test('a first visit to the home page gets the intro', () => {
  assert.equal(shouldShowIntro(fresh), true)
})

test('it plays once per browser session', () => {
  assert.equal(shouldShowIntro({ ...fresh, seen: true }), false)
})

test('links into a section or other pages skip it', () => {
  assert.equal(shouldShowIntro({ ...fresh, hash: '#publications' }), false)
  assert.equal(shouldShowIntro({ ...fresh, pathname: '/nope' }), false)
})

test('visitors who prefer reduced motion skip it', () => {
  assert.equal(shouldShowIntro({ ...fresh, reducedMotion: true }), false)
})
