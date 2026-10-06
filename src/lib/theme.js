import { useMemo, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'theme'
const TOKENS = ['bg', 'surface', 'border', 'ink', 'body', 'muted', 'highlight', 'mono', 'dot']

// Mirrors the inline boot script in index.html, which runs before React loads.
export function resolveTheme(stored, prefersDark) {
  if (stored === 'light' || stored === 'dark') return stored
  return prefersDark ? 'dark' : 'light'
}

// "59 91 219" (a --c-* token value) -> "#3b5bdb"
export function channelsToHex(channels) {
  return `#${channels.trim().split(/\s+/).map((n) => Number(n).toString(16).padStart(2, '0')).join('')}`
}

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStored(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage blocked: the choice still applies, it just won't survive a reload.
  }
}

export function getTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

const listeners = new Set()

// Swapping the tokens would otherwise start a colour transition on everything
// that has one (cards, chips, links), fading them behind the theme switch.
function withoutTransitions(change) {
  const style = document.createElement('style')
  style.textContent = '*,*::before,*::after{transition:none!important}'
  document.head.appendChild(style)
  change()
  getComputedStyle(document.body).opacity // flush styles while transitions are off
  setTimeout(() => style.remove(), 1)
}

function apply(theme) {
  withoutTransitions(() => document.documentElement.classList.toggle('dark', theme === 'dark'))
  listeners.forEach((listener) => listener())
}

export function setTheme(theme) {
  writeStored(theme)
  apply(theme)
}

let followingOs = false

// Tracks the OS setting only until the visitor picks a theme themselves.
function followOs() {
  if (followingOs) return
  followingOs = true
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!readStored()) apply(resolveTheme(null, e.matches))
  })
}

function subscribe(listener) {
  followOs()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme)
}

// Resolved token colours for canvas/WebGL code, which can't read CSS variables.
export function useThemeColors() {
  const theme = useTheme()
  return useMemo(() => {
    const style = getComputedStyle(document.documentElement)
    return Object.fromEntries(TOKENS.map((t) => [t, channelsToHex(style.getPropertyValue(`--c-${t}`))]))
    // `theme` is the trigger: the values come from the DOM it just changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])
}

// Flips the theme behind a circle that grows from `origin` (viewport px).
export function toggleTheme(origin) {
  // Decided inside the update so back-to-back toggles each flip the state the
  // previous one left, even when a newer transition skips an older one.
  const flip = () => setTheme(getTheme() === 'dark' ? 'light' : 'dark')
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduceMotion || !origin) {
    flip()
    return
  }
  const { x, y } = origin
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  document
    .startViewTransition(flip)
    .ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 450, easing: 'ease-out', pseudoElement: '::view-transition-new(root)' },
      )
    })
    .catch(() => {}) // skipped by a newer toggle; that one animates instead
}
