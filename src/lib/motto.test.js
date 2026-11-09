import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MOTTO_GLYPHS } from './motto.js'

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')

// The brush font is a CJK face (megabytes in full), so index.css asks Google
// Fonts for only the glyphs the piece uses: the one @import with a text= list.
const subsetImport = () => {
  const m = css.match(/@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=([^&']+)&text=([^&']+)/)
  assert.ok(m, 'no @import with a text= subset in index.css')
  return { family: m[1].replace(/\+/g, ' '), glyphs: decodeURIComponent(m[2]) }
}

// A glyph missing from that list would silently render in the system font
// instead; an extra one is dead weight.
test('the brush font subset is exactly the glyphs the motto draws', () => {
  const sorted = (s) => [...s].sort().join('')
  assert.equal(sorted(subsetImport().glyphs), sorted(MOTTO_GLYPHS))
})

// Swapping the brush font means changing both; one alone leaves the motto in
// a font that isn't loaded.
test('the subset loaded is the font the motto is set in', () => {
  const m = css.match(/--font-brush:\s*'([^']+)'/)
  assert.ok(m, 'no --font-brush in index.css')
  assert.equal(subsetImport().family, m[1])
})
