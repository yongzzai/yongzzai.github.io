// The calligraphy hung in the page's left margin (components/Motto.jsx).
// Columns are read the traditional way: top to bottom, right to left.
//
// 即, not 卽: they are the same character (즉), but no free brush font in a
// running hand has the 卽 form, and one glyph from a fallback font would break
// the hand of the whole piece.
export const MOTTO_COLUMNS = ['必死即生', '骨肉之情']

// Every glyph the piece draws. index.css loads the brush font subset to exactly
// these (`text=`), so the two must change together (motto.test.js checks).
export const MOTTO_GLYPHS = [...new Set(MOTTO_COLUMNS.join(''))].join('')
