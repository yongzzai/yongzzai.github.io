import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseEmphasis } from './emphasis.js'

test('plain text is one plain run', () => {
  assert.deepEqual(parseEmphasis('I completed my degree!'), [{ text: 'I completed my degree!' }])
})

test('**…** is bold and *…* is italic, in place', () => {
  assert.deepEqual(parseEmphasis('I won the **Grand Prize** at *PNU*!'), [
    { text: 'I won the ' },
    { text: 'Grand Prize', bold: true },
    { text: ' at ' },
    { text: 'PNU', italic: true },
    { text: '!' },
  ])
})

test('emphasis at the edges leaves no empty runs', () => {
  assert.deepEqual(parseEmphasis('**Bold** start and end **here**'), [
    { text: 'Bold', bold: true },
    { text: ' start and end ' },
    { text: 'here', bold: true },
  ])
})

test('a lone asterisk is just a character', () => {
  assert.deepEqual(parseEmphasis('5 * 3 = 15'), [{ text: '5 * 3 = 15' }])
  assert.deepEqual(parseEmphasis('a ** b'), [{ text: 'a ** b' }])
})

test('^…^ is superscript, e.g. an equal-contribution dagger after a name', () => {
  assert.deepEqual(parseEmphasis('Park, T.^†^, **Lee, Y.**^†^, & Bae, H.'), [
    { text: 'Park, T.' },
    { text: '†', sup: true },
    { text: ', ' },
    { text: 'Lee, Y.', bold: true },
    { text: '†', sup: true },
    { text: ', & Bae, H.' },
  ])
  assert.deepEqual(parseEmphasis('2^ 3'), [{ text: '2^ 3' }])
})
