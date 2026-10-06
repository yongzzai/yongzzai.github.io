import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function Layout() {
  const { pathname, hash, key } = useLocation()
  const firstNavigation = useRef(true)

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
