import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Island } from './Island'
import { Dock } from './Dock'
import { Intro } from './Intro'
import { introSeen, shouldShowIntro } from '../lib/intro'

export function Layout() {
  const { pathname, hash } = useLocation()
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [intro, setIntro] = useState(() =>
    shouldShowIntro({ pathname, hash, seen: introSeen(), reducedMotion }),
  )
  const endIntro = useCallback(() => setIntro(false), [])

  // On the home page the pager turns to the #page itself (Pager.jsx); any
  // other page starts at its top.
  useEffect(() => {
    if (pathname !== '/') window.scrollTo({ top: 0, behavior: 'instant' })
    document.title = pathname === '/' ? 'Yongjae Lee' : 'Page not found · Yongjae Lee'
  }, [pathname])

  return (
    <div className="min-h-dvh bg-bg" style={{ position: 'relative' }}>
      {/* A still wallpaper behind everything, one per theme, veiled so the
          text stays readable (.wallpaper in index.css). bg-bg above shows
          until it loads. */}
      <div aria-hidden="true" className="wallpaper fixed inset-0 z-0 pointer-events-none" />
      <AnimatePresence>{intro && <Intro key="intro" onDone={endIntro} />}</AnimatePresence>
      {/* The site renders under the intro (so its content is always in the
          page) and remounts when the intro ends, so the hero's entrance
          animations play on reveal instead of behind the overlay. */}
      <div key={intro ? 'behind-intro' : 'live'}>
        <Island />
        <main className="relative z-10">
          <Outlet />
        </main>
        <Dock />
      </div>
    </div>
  )
}
