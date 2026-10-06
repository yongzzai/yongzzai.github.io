import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildDots, hexToRgb, isPointerClick, mixRgb, proximityT } from './dotGridMath.js'

test('buildDots centres a grid that fits the box', () => {
  // cell = 22 -> 5 columns (90px wide) and 3 rows (46px tall)
  const dots = buildDots(100, 50, 2, 20)
  assert.equal(dots.length, 15)
  const xs = dots.map((d) => d.cx)
  const ys = dots.map((d) => d.cy)
  assert.equal(Math.min(...xs), 100 - Math.max(...xs))
  assert.equal(Math.min(...ys), 50 - Math.max(...ys))
  assert.deepEqual(
    { xOffset: dots[0].xOffset, yOffset: dots[0].yOffset, pushed: dots[0].pushed, moving: dots[0].moving },
    { xOffset: 0, yOffset: 0, pushed: false, moving: false },
  )
})

test('buildDots returns nothing for an empty box', () => {
  assert.deepEqual(buildDots(0, 0, 2.5, 20), [])
})

test('proximityT is 1 at the cursor and 0 at or beyond the radius', () => {
  assert.equal(proximityT(0, 0, 140), 1)
  assert.equal(proximityT(70, 0, 140), 0.5)
  assert.equal(proximityT(140, 0, 140), 0)
  assert.equal(proximityT(99, 99, 140), 0) // hypot ≈ 140.007
  assert.equal(proximityT(500, 0, 140), 0)
})

test('hexToRgb parses #rrggbb and falls back to black', () => {
  assert.deepEqual(hexToRgb('#3b5bdb'), { r: 59, g: 91, b: 219 })
  assert.deepEqual(hexToRgb('nope'), { r: 0, g: 0, b: 0 })
})

test('mixRgb interpolates between two colours', () => {
  const a = { r: 0, g: 100, b: 200 }
  const b = { r: 100, g: 200, b: 0 }
  assert.equal(mixRgb(a, b, 0), 'rgb(0,100,200)')
  assert.equal(mixRgb(a, b, 1), 'rgb(100,200,0)')
  assert.equal(mixRgb(a, b, 0.5), 'rgb(50,150,100)')
})

test('isPointerClick ignores keyboard-activated clicks', () => {
  assert.equal(isPointerClick({ detail: 0 }), false) // Enter on a link
  assert.equal(isPointerClick({ detail: 1 }), true)
})
