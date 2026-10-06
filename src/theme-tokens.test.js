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

test('light values are unchanged from the original palette', () => {
  const light = tokens(':root')
  assert.deepEqual(
    Object.fromEntries(Object.entries(light).map(([k, v]) => [k, hex(v)])),
    {
      bg: '#f9f8f6', surface: '#ffffff', border: '#e5e2dc', ink: '#1a1a1a', body: '#2d2d2d',
      muted: '#7a7a7a', highlight: '#3b5bdb', mono: '#6b7280',
    },
  )
})

test('dark text tokens reach 4.5:1 on bg and surface', () => {
  const dark = tokens('\\.dark')
  for (const t of TEXT) {
    for (const ground of ['bg', 'surface']) {
      const ratio = contrast(dark[t], dark[ground])
      assert.ok(ratio >= 4.5, `${t} on ${ground}: ${ratio.toFixed(2)}`)
    }
  }
})

test('tailwind colors read the CSS variables', () => {
  const { colors } = tailwindConfig.theme.extend
  for (const t of TOKENS) {
    assert.equal(colors[t], `rgb(var(--c-${t}) / <alpha-value>)`, t)
  }
})

// PillNav marks the current page with a dot drawn in --base (the surface token,
// white in light mode). In dark mode that is surface-on-glass and disappears, so
// a .dark override must give it at least the 3:1 non-text contrast of WCAG 1.4.11.
test('active-page nav dot stands out from the dark surface', () => {
  const pillCss = readFileSync(new URL('./components/ui/PillNav.css', import.meta.url), 'utf8')
  const m = pillCss.match(/\.dark\s+\.pill\.is-active::after\s*\{[^}]*background:\s*rgb\(var\(--c-([\w-]+)\)\)/)
  assert.ok(m, 'no .dark .pill.is-active::after { background: rgb(var(--c-*)) } rule in PillNav.css')
  const dark = tokens('\\.dark')
  const ratio = contrast(dark[m[1]], dark.surface)
  assert.ok(ratio >= 3, `${m[1]} on surface: ${ratio.toFixed(2)}`)
})
