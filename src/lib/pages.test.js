import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PAGES, hashForPage, pageAtScroll, pageFromHash } from './pages.js'

test('the pages run home, research, projects, conferences, publications', () => {
  assert.deepEqual(PAGES.map((p) => p.id), ['home', 'research', 'projects', 'conferences', 'publications'])
})

test('home lives at the bare URL; the others at their #id', () => {
  assert.equal(hashForPage(0), '')
  assert.equal(hashForPage(1), '#research')
  assert.equal(hashForPage(2), '#projects')
  assert.equal(hashForPage(4), '#publications')
})

test('a hash opens its page, and anything unknown opens home', () => {
  PAGES.forEach((_, i) => assert.equal(pageFromHash(hashForPage(i)), i))
  assert.equal(pageFromHash('#home'), 0)
  assert.equal(pageFromHash('#nope'), 0)
  assert.equal(pageFromHash(''), 0)
  assert.equal(pageFromHash(undefined), 0)
})

test('the page on screen is the one the pager is nearest to', () => {
  assert.equal(pageAtScroll(0, 1200), 0)
  assert.equal(pageAtScroll(1200 * 2, 1200), 2)
  assert.equal(pageAtScroll(1200 * 1.49, 1200), 1) // mid-swipe, not past halfway
  assert.equal(pageAtScroll(1200 * 1.51, 1200), 2)
})

test('overscroll and an unmeasured pager stay on a real page', () => {
  assert.equal(pageAtScroll(-80, 1200), 0)
  assert.equal(pageAtScroll(1200 * 9, 1200), PAGES.length - 1)
  assert.equal(pageAtScroll(500, 0), 0)
})
