import { test } from 'node:test'
import assert from 'node:assert/strict'
import { startGlitches } from './letterGlitchGrid.js'

const grid = (n) => Array.from({ length: n }, () => ({ char: 'A', targetColor: '#000000', progress: 1 }))

// Below md the panel is display:none, so the grid is built with zero letters;
// a glitch tick must not crash the animation loop (it used to throw on letters[0]).
test('startGlitches is a no-op on an empty grid', () => {
  assert.doesNotThrow(() => startGlitches([], () => 'Z', () => '#ffffff'))
})

test('startGlitches restarts about 5% of the letters', () => {
  const letters = grid(200)
  startGlitches(letters, () => 'Z', () => '#ffffff')
  const restarted = letters.filter((l) => l.progress === 0)
  assert.ok(restarted.length >= 1 && restarted.length <= 10, `${restarted.length} restarted`)
  for (const l of restarted) assert.deepEqual([l.char, l.targetColor], ['Z', '#ffffff'])
})
