import { Children, useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PAGES, hashForPage, pageAtScroll, pageFromHash, setActivePage } from '../lib/pages'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isEditable = (el) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))

// How long the pager has to sit still before the URL follows a swipe.
const SETTLE_MS = 200

// Full-screen pages side by side, one per PAGES entry (children in that
// order), swiped like a phone's home screen. The browser's own scroll snapping
// does the swiping, so trackpads and touch screens keep their native momentum,
// and snap-always stops on every page instead of flinging past several. Each
// page scrolls up and down on its own. Horizontal swipes over the photo
// carousel turn the carousel instead (it takes the wheel and touch-action).
export function Pager({ children }) {
  const ref = useRef(null)
  const { hash, key, state } = useLocation()
  const navigate = useNavigate()
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate
  const current = useRef(null) // page on screen
  const urlPage = useRef(null) // page the URL names
  const first = useRef(true)

  // URL → page. The dock and links navigate to /#id (back/forward too). A tap
  // on the page already on screen takes it back to its top, like tapping a
  // phone's tab bar. URL updates the pager made itself after a swipe (below)
  // are just records and move nothing.
  useLayoutEffect(() => {
    const pager = ref.current
    const index = pageFromHash(hash)
    urlPage.current = index
    if (state?.fromPager && index === current.current) return
    const behavior = first.current || reducedMotion() ? 'instant' : 'smooth'
    if (!first.current && index === current.current) {
      pager.children[index]?.firstElementChild?.scrollTo({ top: 0, behavior })
    } else {
      pager.scrollTo({ left: index * pager.clientWidth, behavior })
    }
    first.current = false
    current.current = index
    setActivePage(index)
  }, [hash, key, state])

  // Swipe → page, live for the dock's dots, and → URL once the pager settles
  // (replacing the entry, so a swipe doesn't add history steps).
  useEffect(() => {
    const pager = ref.current
    let raf = 0
    let settle = 0
    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0
          current.current = pageAtScroll(pager.scrollLeft, pager.clientWidth)
          setActivePage(current.current)
        })
      }
      clearTimeout(settle)
      settle = setTimeout(() => {
        const index = pageAtScroll(pager.scrollLeft, pager.clientWidth)
        if (index === urlPage.current) return
        urlPage.current = index
        navigateRef.current({ pathname: '/', hash: hashForPage(index) }, { replace: true, state: { fromPager: true } })
      }, SETTLE_MS)
    }
    // A resize changes the page width; stay on the same page.
    const ro = new ResizeObserver(() => {
      pager.scrollTo({ left: (current.current ?? 0) * pager.clientWidth, behavior: 'instant' })
    })
    setActivePage(current.current)
    pager.addEventListener('scroll', onScroll, { passive: true })
    ro.observe(pager)
    return () => {
      pager.removeEventListener('scroll', onScroll)
      ro.disconnect()
      cancelAnimationFrame(raf)
      clearTimeout(settle)
      setActivePage(null)
    }
  }, [])

  // ← / → turn pages, unless something else (the carousel, a text field)
  // already took the key.
  useEffect(() => {
    const onKey = (e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || isEditable(e.target)) return
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
      if (!step) return
      e.preventDefault()
      const pager = ref.current
      const index = Math.min(Math.max((current.current ?? 0) + step, 0), PAGES.length - 1)
      pager.scrollTo({ left: index * pager.clientWidth, behavior: reducedMotion() ? 'instant' : 'smooth' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div
      ref={ref}
      className="pager flex h-dvh w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-contain"
    >
      {/* Two layers per page: the outer one is what snapping lines up, and it
          never moves; the inner one scrolls the page and is what folds in 3D
          (index.css). A folded box would shift its own snap position, and a
          long jump across pages chased that moving target and stalled short
          of it. */}
      {Children.map(children, (child, i) => (
        <div className="pager-page h-full w-full shrink-0 snap-start snap-always">
          <div
            role="region"
            aria-label={PAGES[i].label}
            className="pager-face h-full w-full overflow-y-auto overflow-x-hidden pb-36"
          >
            {child}
          </div>
        </div>
      ))}
    </div>
  )
}
