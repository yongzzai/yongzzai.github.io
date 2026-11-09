import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { IoBook, IoFlask, IoFolderOpen, IoHome, IoMic, IoMoon, IoSunny } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { PAGES, hashForPage, useActivePage } from '../lib/pages'
import { toggleTheme, useTheme } from '../lib/theme'
import GlassSurface from './ui/GlassSurface'
import './Dock.css'

// Each page is an app icon with its own colour pair. Theme-neutral: like real
// app icons they keep their colours on either wallpaper (Dock.css swaps where
// the colour goes in dark mode).
const APPS = {
  home: { Icon: IoHome, from: '#5fb4ff', to: '#1f6ff0' },
  research: { Icon: IoFlask, from: '#c39bff', to: '#7a4de8' },
  projects: { Icon: IoFolderOpen, from: '#5ee08f', to: '#14a37f' },
  conferences: { Icon: IoMic, from: '#ff7a95', to: '#e0245e' },
  publications: { Icon: IoBook, from: '#ffbf5e', to: '#f27a0c' },
}
const SETTINGS = { from: '#b0b0b8', to: '#5d5d66' }

// Magnification, as in the macOS Dock: icons within REACH px of the pointer
// grow from BASE up to PEAK (about 1.45x; the Dock's own 1.9x read as too
// big here), along a raised-cosine bell so neighbours swell and settle
// smoothly, on a quick spring. The bar's proportions follow the Dock's
// (Dock.css). BASE matches the resting --size there.
const BASE = 44
const PEAK = 64
const REACH = 260
const SPRING = { mass: 0.1, stiffness: 170, damping: 14 }

// 1 under the pointer, easing to 0 at REACH (a raised cosine).
const bell = (d) => {
  const t = Math.max(0, 1 - Math.abs(d) / REACH)
  return 0.5 - 0.5 * Math.cos(Math.PI * t)
}

// Only with a mouse or trackpad. Touch screens have nothing to hover, and the
// mouse events a tap sends would leave an icon swollen. Reduced motion keeps
// the still dock too.
const MAGNIFY_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

function useMagnify() {
  const [on, setOn] = useState(() => window.matchMedia(MAGNIFY_QUERY).matches)
  useEffect(() => {
    const query = window.matchMedia(MAGNIFY_QUERY)
    const update = () => setOn(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return on
}

// One app: its icon tile, its name, and (magnifying dock) a name bubble while
// hovered and a dot under the page on screen, like a running app's.
function DockApp({ as: Tag, mouseX, magnify, Icon, colours, label, tip, current, ...props }) {
  const ref = useRef(null)
  const [pointed, setPointed] = useState(false)
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect()
    return r ? x - (r.left + r.width / 2) : Infinity
  })
  const size = useSpring(useTransform(distance, (d) => BASE + (PEAK - BASE) * bell(d)), SPRING)

  return (
    <Tag
      ref={ref}
      className="dock-app"
      aria-current={current ? 'page' : undefined}
      onMouseEnter={() => setPointed(true)}
      onMouseLeave={() => setPointed(false)}
      onFocus={(e) => setPointed(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => setPointed(false)}
      {...props}
    >
      <AnimatePresence>
        {magnify && pointed && (
          <motion.span
            className="dock-tip"
            aria-hidden="true"
            style={{ x: '-50%' }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
          >
            {tip}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span
        className="dock-icon"
        // Always set, even when still: framer-motion leaves a style it once
        // wrote in place, so a dock that stops magnifying (a tablet losing
        // its trackpad) would otherwise keep the last size. The glyph is
        // sized from the tile in Dock.css, so the two grow together.
        style={{
          '--app-from': colours.from,
          '--app-to': colours.to,
          width: magnify ? size : 'var(--size)',
          height: magnify ? size : 'var(--size)',
        }}
      >
        <Icon aria-hidden="true" />
      </motion.span>
      <span className="dock-label">{label}</span>
      <span className="dock-run" aria-hidden="true" />
    </Tag>
  )
}

// The bottom of the screen. With a mouse or trackpad it's a macOS-style dock:
// icons magnify under the pointer, names show in a bubble, and a dot marks the
// page on screen. On touch screens it's a phone's home screen instead: page
// dots for the pager (components/Pager.jsx) above a dock with each name
// written under its icon, the page on screen in bold.
export function Dock() {
  const active = useActivePage()
  const navigate = useNavigate()
  const dark = useTheme() === 'dark'
  const magnify = useMagnify()
  const mouseX = useMotionValue(Infinity)

  // Real links, so middle-click and "open in new tab" still work; this only
  // takes over the plain left click. The pager turns to the #page.
  const go = (e, to) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    navigate(to)
  }

  const shared = { mouseX, magnify }

  return (
    <div className="dock-bar fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2.5 px-4 pointer-events-none">
      {/* No pager on the 404 page, so no dots there. */}
      {!magnify && active !== null && (
        <div className="dock-dots" aria-hidden="true">
          {PAGES.map((page, i) => (
            <span key={page.id} className={`dock-dot${i === active ? ' is-active' : ''}`} />
          ))}
        </div>
      )}

      <nav
        aria-label="Pages"
        className={`dock pointer-events-auto${magnify ? ' is-magnifying' : ''}`}
        onMouseMove={magnify ? (e) => mouseX.set(e.clientX) : undefined}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {/* The bar's glass; its radius matches .dock's border-radius. */}
        <GlassSurface className="dock-glass" width="100%" height="100%" borderRadius={18} />
        {PAGES.map((page, i) => {
          const { Icon, ...colours } = APPS[page.id]
          const href = `/${hashForPage(i)}`
          return (
            <DockApp
              key={page.id}
              as="a"
              href={href}
              onClick={(e) => go(e, href)}
              Icon={Icon}
              colours={colours}
              label={page.label}
              tip={page.label}
              current={i === active}
              {...shared}
            />
          )
        })}

        <span className="dock-divider" aria-hidden="true" />

        {/* Named for what it does: switch to the other theme. */}
        <DockApp
          as="button"
          type="button"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
          }}
          Icon={dark ? IoSunny : IoMoon}
          colours={SETTINGS}
          label={dark ? 'Light' : 'Dark'}
          tip={dark ? 'Light mode' : 'Dark mode'}
          {...shared}
        />
      </nav>
    </div>
  )
}
