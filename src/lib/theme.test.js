import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { channelsToHex, resolveTheme } from './theme.js'

test('resolveTheme defaults to dark unless light was chosen', () => {
  assert.equal(resolveTheme('light'), 'light')
  assert.equal(resolveTheme('dark'), 'dark')
  assert.equal(resolveTheme(null), 'dark')
  assert.equal(resolveTheme('garbage'), 'dark')
})

test('channelsToHex converts token channels', () => {
  assert.equal(channelsToHex('59 91 219'), '#3b5bdb')
  assert.equal(channelsToHex(' 18 17 16 '), '#121110')
})

// The boot script in index.html runs before React and must agree with resolveTheme.
const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')
const boot = html.match(/<script>([\s\S]*?)<\/script>/)?.[1]

// `stored` is this visit's choice (sessionStorage); `legacy` is what older
// versions of the site left in localStorage.
function runBoot({ stored = null, legacy = null, prefersDark = false, storageThrows = false }) {
  const classes = new Set()
  const document = { documentElement: { classList: { add: (c) => classes.add(c) } } }
  const storage = (value) => ({
    getItem() {
      if (storageThrows) throw new Error('blocked')
      return value
    },
  })
  const matchMedia = () => ({ matches: prefersDark })
  new Function('document', 'sessionStorage', 'localStorage', 'matchMedia', boot)(
    document,
    storage(stored),
    storage(legacy),
    matchMedia,
  )
  return classes.has('dark') ? 'dark' : 'light'
}

test('index.html has an inline boot script', () => {
  assert.ok(boot, 'no plain <script> block in index.html')
})

test('boot script matches resolveTheme, whatever the OS prefers', () => {
  for (const stored of [null, 'light', 'dark']) {
    for (const prefersDark of [false, true]) {
      assert.equal(runBoot({ stored, prefersDark }), resolveTheme(stored), `${stored}/${prefersDark}`)
    }
  }
})

// Every visit starts dark: a light choice only lasts for the visit it was made
// in, and one an older version saved for good no longer counts.
test('boot script ignores a light choice left by an earlier visit', () => {
  assert.equal(runBoot({ legacy: 'light' }), 'dark')
})

test('boot script defaults to dark when storage is blocked', () => {
  assert.equal(runBoot({ storageThrows: true, prefersDark: false }), 'dark')
})

// Token changes would otherwise start a colour transition on every element that
// has one (cards, chips, links), so they visibly fade behind the theme switch.
test('setTheme flips the class with CSS transitions suspended, then restores them', async () => {
  const { setTheme } = await import('./theme.js')
  const log = []
  const head = {
    children: [],
    appendChild(el) { this.children.push(el); log.push('style added') },
  }
  const saved = { document: globalThis.document, sessionStorage: globalThis.sessionStorage, getComputedStyle: globalThis.getComputedStyle }
  let dark = false
  globalThis.document = {
    head,
    body: {},
    createElement: () => ({
      textContent: '',
      remove() { head.children = head.children.filter((c) => c !== this); log.push('style removed') },
    }),
    documentElement: {
      classList: {
        toggle(_, on) { dark = on; log.push(`class toggled, suppressing=${head.children.some((s) => /transition:\s*none/.test(s.textContent))}`) },
        contains: () => dark,
      },
    },
  }
  globalThis.sessionStorage = { getItem: () => null, setItem() {} }
  globalThis.getComputedStyle = () => ({})
  try {
    setTheme('dark')
    assert.deepEqual(log, ['style added', 'class toggled, suppressing=true'])
    await new Promise((r) => setTimeout(r, 20))
    assert.deepEqual(log, ['style added', 'class toggled, suppressing=true', 'style removed'])
    assert.equal(dark, true)
  } finally {
    Object.assign(globalThis, saved)
  }
})
