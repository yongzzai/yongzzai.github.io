import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DotMatrixBg } from './ui/DotMatrixBg'
import Particles from './ui/Particles'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

const TITLES = {
  '/': 'Yongjae Lee',
  '/proj': 'Projects · Yongjae Lee',
  '/pubs': 'Publications · Yongjae Lee',
  '/conf': 'Conference Presentations · Yongjae Lee',
}

export function Layout() {
  const { pathname } = useLocation()

  // Browsers restore the previous scroll offset on client-side navigation, so
  // a fresh page would otherwise open halfway down.
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = TITLES[pathname] ?? 'Yongjae Lee'
  }, [pathname])

  return (
    <div className="min-h-screen bg-bg" style={{ position: 'relative' }}>
      {/* Mounted above the router outlet so the field keeps animating across
          navigations instead of restarting on every page. */}
      <DotMatrixBg />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Particles
          particleCount={250}
          particleSpread={12}
          speed={0.08}
          particleColors={['#3b5bdb', '#748ffc', '#c5d0ff', '#a5b4fc', '#6366f1']}
          alphaParticles={true}
          particleBaseSize={120}
          sizeRandomness={1.2}
          moveParticlesOnHover={true}
          particleHoverFactor={0.3}
          cameraDistance={22}
        />
      </div>
      <Navbar />
      <main className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  )
}
