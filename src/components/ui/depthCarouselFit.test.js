import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fitScale, placeCard, stackReach } from './depthCarouselFit.js'

const hero = { cardWidth: 240, cardHeight: 320, spread: 50, depth: 220, perspective: 1400, visibleCards: 4 }

test('stackReach covers the front card and the furthest card behind it', () => {
  // Card d sits spread*d to the side and depth*d back, shrunk by perspective.
  const k4 = 1400 / (1400 + 220 * 4)
  assert.equal(stackReach(hero), (50 * 4 + 120) * k4)
  // With no spread the front card is the widest thing on screen.
  assert.equal(stackReach({ ...hero, spread: 0 }), 120)
})

test('the hero column (420 x 340) shows cards at full size', () => {
  assert.equal(fitScale(420, 340, hero), 1)
})

test('narrower containers shrink the stack just enough to fit', () => {
  const scale = fitScale(342, 340, hero)
  assert.ok(scale < 1)
  assert.ok(2 * stackReach(hero) * scale <= 342)
})

test('shorter containers shrink the cards to fit their height', () => {
  const scale = fitScale(420, 220, hero)
  assert.ok(scale < 1)
  assert.ok(hero.cardHeight * scale <= 220)
  // Width and height each cap the scale; the tighter one wins.
  assert.equal(fitScale(342, 220, hero), Math.min(fitScale(342, 340, hero), scale))
})

test('scale never drops below 0.4', () => {
  assert.equal(fitScale(100, 340, hero), 0.4)
  assert.equal(fitScale(420, 50, hero), 0.4)
})

// Every card is laid out on every frame, the invisible ones too. A card far
// past the front used to keep moving toward the viewer until it reached the
// camera (translateZ = perspective), where it projects to tens of thousands of
// pixels; Chrome still rasterises it (will-change), and under a pinch zoom that
// starved the visible cards of GPU memory and made them flicker.
test('no card is ever placed near the camera, wherever the stack is turned', () => {
  for (let d = -12; d <= 12; d += 0.01) {
    const { offset } = placeCard(d, hero)
    const tz = -hero.depth * offset
    assert.ok(tz < hero.perspective / 2, `d=${d.toFixed(2)} sits at translateZ ${tz.toFixed(0)}px`)
  }
})

test('visible cards keep their real place; only the others are parked and hidden', () => {
  for (let d = -12; d <= 12; d += 0.01) {
    const { offset, visible } = placeCard(d, hero)
    // Opacity is 1 + d while a card fades out past the front, and the stack
    // shows visibleCards behind it.
    assert.equal(visible, d > -1 && d <= hero.visibleCards + 0.5, `d=${d.toFixed(2)}`)
    if (visible) assert.equal(offset, d)
  }
})
