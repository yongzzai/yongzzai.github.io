import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fitScale, stackReach } from './depthCarouselFit.js'

const hero = { cardWidth: 240, spread: 50, depth: 220, perspective: 1400, visibleCards: 4 }

test('stackReach covers the front card and the furthest card behind it', () => {
  // Card d sits spread*d to the side and depth*d back, shrunk by perspective.
  const k4 = 1400 / (1400 + 220 * 4)
  assert.equal(stackReach(hero), (50 * 4 + 120) * k4)
  // With no spread the front card is the widest thing on screen.
  assert.equal(stackReach({ ...hero, spread: 0 }), 120)
})

test('the hero column (420px) shows cards at full size', () => {
  assert.equal(fitScale(420, hero), 1)
})

test('narrower containers shrink the stack just enough to fit', () => {
  const scale = fitScale(342, hero)
  assert.ok(scale < 1)
  assert.ok(2 * stackReach(hero) * scale <= 342)
})

test('scale never drops below 0.4', () => {
  assert.equal(fitScale(100, hero), 0.4)
})
