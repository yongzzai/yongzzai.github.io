import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

// Files that must take every theme-dependent colour from tokens. Brand colours
// (social/tech hover colours) are allowed; light-theme literals are not.
const THEMED = ['components/Navbar.jsx', 'components/ui/ThemeToggle.jsx']

const LIGHT_ONLY = [
  /#1a1a1a/i,
  /#3b5bdb/i,
  /#f9f8f6/i,
  /#ffffff\b/i,
  /\bbg-white\b/,
  /rgba\(\s*255\s*,\s*255\s*,\s*255/,
  /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0?\.0\d/, // faint black tints vanish on a dark bg
]

for (const file of THEMED) {
  test(`${file} has no light-only colour literals`, () => {
    const src = readFileSync(new URL(file, import.meta.url), 'utf8')
    const hits = LIGHT_ONLY.filter((re) => re.test(src)).map(String)
    assert.deepEqual(hits, [])
  })
}
