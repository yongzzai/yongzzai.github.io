// Scrapes the Google Scholar profile into src/data/publications.generated.json.
//
// Google Scholar has no public API, so this parses the profile HTML. The output
// is committed to the repo and merged with publications.overrides.js at build
// time, so the site never talks to Scholar at runtime -- a blocked run costs a
// weekly refresh, nothing more.
//
// Usage: npm run sync:pubs

import { writeFile } from 'node:fs/promises'
import { setTimeout as sleep } from 'node:timers/promises'

const SCHOLAR_ID = 'YxFIm0AAAAAJ'
const OUT = new URL('../src/data/publications.generated.json', import.meta.url)

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
const DELAY_MS = 1500

async function fetchPage(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
    })
    const html = await res.text()

    if (/id="gs_captcha_c"|unusual traffic from your computer/i.test(html)) {
      throw new Error('Google Scholar served a CAPTCHA -- this IP is rate limited.')
    }
    if (res.ok) return html

    if (attempt === 3) throw new Error(`HTTP ${res.status} for ${url}`)
    await sleep(DELAY_MS * 2 ** attempt)
  }
}

const stripTags = (s) =>
  decodeEntities(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()

function decodeEntities(s) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([\da-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&(\w+);/g, (m, n) => named[n] ?? m)
}

// "Yongjae Lee, Eunhee Park, Hyerim Bae" -> "Lee, Y., Park, E., & Bae, H."
// Korean names arrive without spaces (and often with a full-width comma), so
// they are passed through untouched -- including the trailing ampersand, which
// only reads correctly for the Latin-name style.
function formatAuthors(raw) {
  if (!raw) return ''
  let reformatted = false

  const names = raw
    .split(/\s*[,，]\s*/)
    .filter(Boolean)
    .map((name) => {
      const parts = name.split(/\s+/)
      if (parts.length < 2) return name
      const surname = parts.pop()
      const initials = parts.map((p) => `${p[0].toUpperCase()}.`).join('')
      reformatted = true
      return `${surname}, ${initials}`
    })

  if (reformatted && names.length > 1) names[names.length - 1] = `& ${names.at(-1)}`
  return names.join(', ')
}

// Scholar splits the source across Journal/Conference/Book + Volume/Issue/Pages.
function composeVenue(f) {
  const base = f.Journal || f.Conference || f.Book || f.Source || f.Publisher || ''
  if (!base) return ''

  // arXiv preprints already read as a full citation.
  if (/^arxiv/i.test(base)) return base

  const bits = [base]
  if (f.Volume) bits.push(f.Issue ? `${f.Volume}(${f.Issue})` : f.Volume)
  if (f.Pages) bits.push(f.Pages)
  return bits.join(', ')
}

// "2026/5" -> { year: "2026.05", sortKey: "2026-05-01" }
function parseDate(raw) {
  if (!raw) return { year: '', sortKey: '0000-00-00' }
  const [y, m, d] = raw.split('/')
  const pad = (v) => String(v).padStart(2, '0')
  return {
    year: m ? `${y}.${pad(m)}` : y,
    sortKey: `${y}-${m ? pad(m) : '00'}-${d ? pad(d) : '00'}`,
  }
}

function parseDetail(html) {
  const titleMatch = html.match(/id="gsc_oci_title"[^>]*>([\s\S]*?)<\/div>/)
  const fields = {}
  const re =
    /class="gsc_oci_field">([\s\S]*?)<\/div>\s*<div class="gsc_oci_value">([\s\S]*?)<\/div>/g
  for (const [, k, v] of html.matchAll(re)) fields[stripTags(k)] = stripTags(v)

  return { title: titleMatch ? stripTags(titleMatch[1]) : '', fields }
}

async function main() {
  const listUrl = `https://scholar.google.com/citations?user=${SCHOLAR_ID}&hl=en&cstart=0&pagesize=100`
  console.log('Fetching profile...')
  const list = await fetchPage(listUrl)

  const ids = [...new Set([...list.matchAll(/citation_for_view=([\w-]+:[\w-]+)/g)].map((m) => m[1]))]
  if (ids.length === 0) {
    throw new Error('No publications found -- Scholar markup may have changed.')
  }
  console.log(`Found ${ids.length} publications.`)

  const entries = []
  for (const [i, id] of ids.entries()) {
    await sleep(DELAY_MS)
    const url = `https://scholar.google.com/citations?view_op=view_citation&hl=en&user=${SCHOLAR_ID}&citation_for_view=${id}`
    const { title, fields } = parseDetail(await fetchPage(url))
    const { year, sortKey } = parseDate(fields['Publication date'])

    console.log(`  [${i + 1}/${ids.length}] ${year} ${title.slice(0, 60)}`)
    entries.push({
      id,
      title,
      authors: formatAuthors(fields.Authors),
      venue: composeVenue(fields),
      year,
      sortKey,
      scholarUrl: url,
    })
  }

  entries.sort((a, b) => b.sortKey.localeCompare(a.sortKey))
  await writeFile(OUT, `${JSON.stringify(entries, null, 2)}\n`)
  console.log(`\nWrote ${entries.length} entries to src/data/publications.generated.json`)
}

main().catch((err) => {
  console.error(`\nsync:pubs failed -- ${err.message}`)
  process.exit(1)
})
