import { useSyncExternalStore } from 'react'

// The home page is a row of full-screen pages swiped sideways, like a phone's
// home screen (components/Pager.jsx). Home.jsx renders them in this order and
// the dock (components/Dock.jsx) has one icon per page.
export const PAGES = [
  { id: 'home', label: 'Home' },
  { id: 'research', label: 'Research' },
  { id: 'projects', label: 'Projects' },
  { id: 'conferences', label: 'Conferences' },
  { id: 'publications', label: 'Publications' },
]

// Home is the bare URL; every other page has its #id, so links and reloads
// land on the right page.
export function hashForPage(index) {
  return index > 0 ? `#${PAGES[index].id}` : ''
}

export function pageFromHash(hash) {
  const id = decodeURIComponent(String(hash ?? '').replace(/^#/, ''))
  return Math.max(0, PAGES.findIndex((p) => p.id === id))
}

// The page nearest the pager's scroll position; mid-swipe it flips at halfway.
export function pageAtScroll(scrollLeft, pageWidth, count = PAGES.length) {
  if (!pageWidth) return 0
  return Math.min(Math.max(Math.round(scrollLeft / pageWidth), 0), count - 1)
}

// The page on screen, shared between the pager and the dock (which live in
// different parts of the tree). null when no pager is mounted, e.g. on the 404
// page.
let activePage = null
const listeners = new Set()

export function setActivePage(index) {
  if (index === activePage) return
  activePage = index
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useActivePage() {
  return useSyncExternalStore(subscribe, () => activePage)
}
