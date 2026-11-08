// The site's text data (data/statement.js, data/journey.js) marks emphasis the
// Markdown way: **bold** and *italic*. This splits a string into runs to render
// as elements, so no HTML ever goes through the data. An asterisk without a
// partner (or followed by a space) stays a plain character.
const EMPHASIS = /\*\*(.+?)\*\*|\*([^*\s][^*]*?)\*/g

export function parseEmphasis(text) {
  const runs = []
  let last = 0
  for (const m of text.matchAll(EMPHASIS)) {
    if (m.index > last) runs.push({ text: text.slice(last, m.index) })
    runs.push(m[1] !== undefined ? { text: m[1], bold: true } : { text: m[2], italic: true })
    last = m.index + m[0].length
  }
  if (last < text.length) runs.push({ text: text.slice(last) })
  return runs
}
