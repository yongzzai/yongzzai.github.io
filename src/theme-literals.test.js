import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

// Files that must take every theme-dependent colour from tokens. Brand colours
// (social/tech hover colours) are allowed; light-theme literals are not, except
// on lines marked `theme-neutral` (decoration deliberately drawn over both).
const THEMED = ['components/Navbar.jsx', 'components/ui/ThemeToggle.jsx', 'components/ui/SpotlightCard.jsx', 'components/Hero.jsx', 'components/Layout.jsx']

const LIGHT_ONLY = [
  /#1a1a1a/i,
  /#3b5bdb/i,
  /rgba\(\s*59\s*,\s*91\s*,\s*219/,
  /#f9f8f6/i,
  /#ffffff\b/i,
  /\bbg-white\b/,
  /rgba\(\s*255\s*,\s*255\s*,\s*255/,
  /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0?\.0\d/, // faint black tints vanish on a dark bg
]

for (const file of THEMED) {
  test(`${file} has no light-only colour literals`, () => {
    const src = readFileSync(new URL(file, import.meta.url), 'utf8')
      .split('\n')
      .filter((line) => !line.includes('theme-neutral'))
      .join('\n')
    const hits = LIGHT_ONLY.filter((re) => re.test(src)).map(String)
    assert.deepEqual(hits, [])
  })
}
