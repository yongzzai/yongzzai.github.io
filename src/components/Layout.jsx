import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { Intro } from './Intro'
import Particles from './ui/Particles'
import { introSeen, shouldShowIntro } from '../lib/intro'

// Blues that read on both the light and the dark background.
const PARTICLE_COLORS = ['#3b5bdb', '#748ffc', '#c5d0ff', '#a5b4fc', '#6366f1'] // theme-neutral

export function Layout() {
  const { pathname, hash, key } = useLocation()
  const firstNavigation = useRef(true)
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [intro, setIntro] = useState(() =>
    shouldShowIntro({ pathname, hash, seen: introSeen(), reducedMotion }),
  )
  const endIntro = useCallback(() => setIntro(false), [])

  // Every navigation lands somewhere explicit: the #section it names, or the
  // top. `key` makes a repeat click on the same link scroll again. The first
  // one jumps, since the browser's own anchor scroll ran before React rendered
  // the section; later ones glide.
  useEffect(() => {
    const behavior = firstNavigation.current ? 'instant' : 'smooth'
    firstNavigation.current = false
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)))
    if (target) target.scrollIntoView({ behavior })
    else window.scrollTo({ top: 0, behavior })
    document.title = pathname === '/' ? 'Yongjae Lee' : 'Page not found · Yongjae Lee'
  }, [pathname, hash, key])

  return (
    <div className="min-h-screen bg-bg" style={{ position: 'relative' }}>
      {/* Drifting particles behind everything that lean away from the cursor;
          outside the keyed block below so the intro's remount doesn't restart
          them. */}
      {!reducedMotion && (
        <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
          <Particles
            particleCount={200}
            particleSpread={12}
            speed={0.08}
            particleColors={PARTICLE_COLORS}
            alphaParticles
            particleBaseSize={100}
            sizeRandomness={1}
            moveParticlesOnHover
            particleHoverFactor={0.3}
            cameraDistance={22}
            pixelRatio={Math.min(window.devicePixelRatio || 1, 2)}
          />
        </div>
      )}
      <AnimatePresence>{intro && <Intro key="intro" onDone={endIntro} />}</AnimatePresence>
      {/* The site renders under the intro (so its content is always in the
          page) and remounts when the intro ends, so the hero's entrance
          animations play on reveal instead of behind the overlay. */}
      <div key={intro ? 'behind-intro' : 'live'}>
        <Navbar />
        <main className="relative z-10 min-h-screen flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
