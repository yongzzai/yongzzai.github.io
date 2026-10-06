import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { channelsToHex, resolveTheme } from './theme.js'

test('resolveTheme prefers a stored choice, else the OS', () => {
  assert.equal(resolveTheme('dark', false), 'dark')
  assert.equal(resolveTheme('light', true), 'light')
  assert.equal(resolveTheme(null, true), 'dark')
  assert.equal(resolveTheme(null, false), 'light')
  assert.equal(resolveTheme('garbage', true), 'dark')
})

test('channelsToHex converts token channels', () => {
  assert.equal(channelsToHex('59 91 219'), '#3b5bdb')
  assert.equal(channelsToHex(' 18 17 16 '), '#121110')
})

// The boot script in index.html runs before React and must agree with resolveTheme.
const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')
const boot = html.match(/<script>([\s\S]*?)<\/script>/)?.[1]

function runBoot({ stored = null, prefersDark = false, storageThrows = false }) {
  const classes = new Set()
  const document = { documentElement: { classList: { add: (c) => classes.add(c) } } }
  const localStorage = {
    getItem() {
      if (storageThrows) throw new Error('blocked')
      return stored
    },
  }
  const matchMedia = () => ({ matches: prefersDark })
  new Function('document', 'localStorage', 'matchMedia', boot)(document, localStorage, matchMedia)
  return classes.has('dark') ? 'dark' : 'light'
}

test('index.html has an inline boot script', () => {
  assert.ok(boot, 'no plain <script> block in index.html')
})

test('boot script matches resolveTheme', () => {
  for (const stored of [null, 'light', 'dark']) {
    for (const prefersDark of [false, true]) {
      assert.equal(runBoot({ stored, prefersDark }), resolveTheme(stored, prefersDark), `${stored}/${prefersDark}`)
    }
  }
})

test('boot script falls back to the OS when storage is blocked', () => {
  assert.equal(runBoot({ storageThrows: true, prefersDark: true }), 'dark')
  assert.equal(runBoot({ storageThrows: true, prefersDark: false }), 'light')
})
