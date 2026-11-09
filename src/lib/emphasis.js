// The site's text data (data/statement.js, data/journey.js, the authors in
// data/publications.js) marks emphasis the Markdown way: **bold**, *italic*,
// and ^superscript^ (as in Pandoc), e.g. an equal-contribution dagger:
// **Lee, Y.**^†^. This splits a string into runs to render as elements, so no
// HTML ever goes through the data. A marker without a partner (or followed by
// a space) stays a plain character.
const EMPHASIS = /\*\*(.+?)\*\*|\*([^*\s][^*]*?)\*|\^([^^\s][^^]*?)\^/g

export function parseEmphasis(text) {
  const runs = []
  let last = 0
  for (const m of text.matchAll(EMPHASIS)) {
    if (m.index > last) runs.push({ text: text.slice(last, m.index) })
    if (m[1] !== undefined) runs.push({ text: m[1], bold: true })
    else if (m[2] !== undefined) runs.push({ text: m[2], italic: true })
    else runs.push({ text: m[3], sup: true })
    last = m.index + m[0].length
  }
  if (last < text.length) runs.push({ text: text.slice(last) })
  return runs
}
