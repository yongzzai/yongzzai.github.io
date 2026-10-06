import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pickActiveSection } from './activeSection.js'

// `top` is each section's distance from the viewport top, in page order.
const at = (...tops) => tops.map((top, i) => ({ id: ['projects', 'conferences', 'publications'][i], top }))

test('no section is active while the intro is on screen', () => {
  assert.equal(pickActiveSection(at(600, 1400, 2400), 300), null)
})

test('the last section whose top has passed the probe line is active', () => {
  assert.equal(pickActiveSection(at(250, 1100, 2100), 300), 'projects')
  assert.equal(pickActiveSection(at(-900, 120, 1100), 300), 'conferences')
  assert.equal(pickActiveSection(at(-2000, -900, -40), 300), 'publications')
})

test('missing sections (e.g. on the 404 page) never activate', () => {
  assert.equal(pickActiveSection(at(Infinity, Infinity, Infinity), 300), null)
})
