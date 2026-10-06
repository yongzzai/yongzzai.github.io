// Post-build files for GitHub Pages.
//
// The site is a single page (sections are reached by #id), so the only extra
// shell is 404.html: GitHub Pages serves it for unknown paths, and the app then
// renders its own 404 page instead of GitHub's default one.

import { copyFile, writeFile } from 'node:fs/promises'

const dist = new URL('../dist/', import.meta.url)

await copyFile(new URL('index.html', dist), new URL('404.html', dist))

// Jekyll is off by default for Actions-published sites, but this keeps
// underscore-prefixed asset names safe if that ever changes.
await writeFile(new URL('.nojekyll', dist), '')

console.log('Emitted 404.html')
