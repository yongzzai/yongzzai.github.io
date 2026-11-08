import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MOTTO_GLYPHS } from './motto.js'

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')

// The brush font is a CJK face (megabytes in full), so index.css asks Google
// Fonts for only the glyphs the piece uses. A glyph missing from that list
// would silently render in the system font instead; an extra one is dead weight.
test('the brush font subset is exactly the glyphs the motto draws', () => {
  const m = css.match(/@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=Zhi\+Mang\+Xing&text=([^&']+)/)
  assert.ok(m, 'no Zhi Mang Xing @import with a text= subset in index.css')
  const sorted = (s) => [...s].sort().join('')
  assert.equal(sorted(decodeURIComponent(m[1])), sorted(MOTTO_GLYPHS))
})
