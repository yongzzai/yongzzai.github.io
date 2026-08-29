// Publications = Google Scholar (auto-synced) + hand-curated overrides.
//
// Do not edit publications.generated.json by hand -- `npm run sync:pubs`
// rewrites it, and a weekly GitHub Action opens a PR when Scholar changes.
// To correct a title, venue, or date, edit publications.overrides.js instead;
// those edits are keyed by Scholar id and survive every sync.

import generated from './publications.generated.json'
import { overrides } from './publications.overrides'

export const publications = generated
  .map((pub) => ({ ...pub, ...overrides[pub.id] }))
  .filter((pub) => !pub.hidden)
  .sort((a, b) => b.year.localeCompare(a.year) || b.sortKey.localeCompare(a.sortKey))
