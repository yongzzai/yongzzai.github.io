// Both publications and conferences store dates as 'YYYY.MM' (or bare 'YYYY'
// when Scholar only knows the year), so the year sections are derived rather
// than stored.

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// '2026.05' -> { year: '2026', month: 'May' };  '2026' -> { year: '2026', month: '' }
export function splitYear(value) {
  const [year, month] = String(value ?? '').split('.')
  return { year, month: MONTHS[Number(month) - 1] ?? '' }
}

// Returns [[year, items], ...] in first-seen order, so a list already sorted
// newest-first stays newest-first.
export function groupByYear(items) {
  const groups = new Map()
  for (const item of items) {
    const { year } = splitYear(item.year)
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year).push(item)
  }
  return [...groups]
}

// Flattens the groups into render-ready rows carrying their own stagger delay,
// so the BlurFade cascade keeps running across section boundaries. Recomputed
// from zero on every render, so StrictMode's double invoke is harmless.
export function withStagger(groups, step = 0.06) {
  let position = 0
  return groups.map(([year, items]) => ({
    year,
    headingDelay: position++ * step,
    rows: items.map((item) => ({ item, delay: position++ * step })),
  }))
}
