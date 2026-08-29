// Emits a real index.html for every client-side route.
//
// GitHub Pages serves static files only -- it has no SPA rewrite, so a direct
// hit on /pubs would 404 with just dist/index.html on disk. Copying the shell
// to dist/<route>/index.html makes those URLs return a genuine 200, which the
// common 404.html redirect trick does not (it answers with a 404 status, so
// search engines refuse to index the page).
//
// Routes must match the <Route path> list in src/App.jsx.

import { copyFile, mkdir, writeFile } from 'node:fs/promises'

const ROUTES = ['proj', 'pubs', 'conf']
const dist = new URL('../dist/', import.meta.url)
const shell = new URL('index.html', dist)

for (const route of ROUTES) {
  const dir = new URL(`${route}/`, dist)
  await mkdir(dir, { recursive: true })
  await copyFile(shell, new URL('index.html', dir))
}

// Unknown paths fall back to the shell too, so the in-app 404 page renders
// instead of GitHub's default one.
await copyFile(shell, new URL('404.html', dist))

// Jekyll is off by default for Actions-published sites, but this keeps
// underscore-prefixed asset names safe if that ever changes.
await writeFile(new URL('.nojekyll', dist), '')

console.log(`Emitted ${ROUTES.length} route shells: ${ROUTES.map((r) => `/${r}`).join(', ')}`)
