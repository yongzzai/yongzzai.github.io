import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import tailwindConfig from '../tailwind.config.js'

const css = readFileSync(new URL('./index.css', import.meta.url), 'utf8')
const TOKENS = ['bg', 'surface', 'border', 'ink', 'body', 'muted', 'highlight', 'mono']
const TEXT = ['ink', 'body', 'muted', 'mono', 'highlight']

// Returns { token: [r, g, b] } for the --c-* variables in the block opened by `selector {`.
function tokens(selector) {
  const m = css.match(new RegExp(`^\\s*${selector}\\s*\\{([^}]*)\\}`, 'm'))
  assert.ok(m, `no "${selector} {" block in index.css`)
  return Object.fromEntries(
    [...m[1].matchAll(/--c-([\w-]+):\s*([\d\s]+);/g)].map(([, k, v]) => [k, v.trim().split(/\s+/).map(Number)]),
  )
}

const hex = ([r, g, b]) => `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`

function luminance(rgb) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

test('light and dark blocks define every token', () => {
  for (const sel of [':root', '\\.dark']) {
    assert.deepEqual(Object.keys(tokens(sel)).sort(), [...TOKENS].sort(), sel)
  }
})

for (const [name, sel] of [['light', ':root'], ['dark', '\\.dark']]) {
  test(`${name} text tokens reach 4.5:1 on bg and surface`, () => {
    const theme = tokens(sel)
    for (const t of TEXT) {
      for (const ground of ['bg', 'surface']) {
        const ratio = contrast(theme[t], theme[ground])
        assert.ok(ratio >= 4.5, `${t} on ${ground}: ${ratio.toFixed(2)} (${hex(theme[t])} on ${hex(theme[ground])})`)
      }
    }
  })
}

// The wallpaper behind the text is only readable under a veil of --c-bg; the
// token values in index.css were tuned against these strengths, so a theme
// without one (or with a much thinner one) puts text back on the bare photo.
test('each theme veils the wallpaper enough for its text tokens', () => {
  for (const sel of [':root', '\\.dark']) {
    const m = css.match(new RegExp(`^\\s*${sel}\\s*\\{[^}]*--veil:\\s*([\\d.]+);`, 'm'))
    assert.ok(m, `no --veil in "${sel} {"`)
    assert.ok(Number(m[1]) >= 0.5, `${sel} --veil ${m[1]} is below 0.5`)
  }
})

test('tailwind colors read the CSS variables', () => {
  const { colors } = tailwindConfig.theme.extend
  for (const t of TOKENS) {
    assert.equal(colors[t], `rgb(var(--c-${t}) / <alpha-value>)`, t)
  }
})
