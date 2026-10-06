// Trimmed from React Bits' PromptBar (Micro/PromptBar) for the site intro: just
// the field and the send button whose arrow morphs into a stop square while
// busy. It is display-only and driven by props (Intro.jsx types into it); the
// menus, attachments, model/effort pickers and dictation are dropped.
import { useEffect, useRef } from 'react'
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'
import './PromptBar.css'

const ARROW_UP = [12, 4.5, 18.5, 11, 14.25, 11, 14.25, 19.5, 9.75, 19.5, 9.75, 11, 5.5, 11]
const SQUARE = [12, 6, 18, 6, 18, 12, 18, 18, 6, 18, 6, 12, 6, 6]
const EASE_IN_OUT = [0.77, 0, 0.175, 1]

const mix = (a, b, t) => a + (b - a) * t
const pathAt = (a, b, t) => {
  let d = ''
  for (let i = 0; i < a.length; i += 2) {
    d += `${i ? 'L' : 'M'}${mix(a[i], b[i], t).toFixed(2)} ${mix(a[i + 1], b[i + 1], t).toFixed(2)}`
  }
  return `${d}Z`
}

function SendGlyph({ busy, morphDuration, squash, tilt }) {
  const reduce = useReducedMotion()
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const dir = useRef(busy ? 1 : -1)
  const t = useMotionValue(busy ? 1 : 0)

  useEffect(() => {
    const target = busy ? 1 : 0
    dir.current = busy ? 1 : -1
    if (t.get() === target) return undefined
    const controls = animate(t, target, reduce ? { duration: 0 } : { duration: morphDuration / 1000, ease: EASE_IN_OUT })
    return () => controls.stop()
  }, [busy, morphDuration, reduce, t])

  useMotionValueEvent(t, 'change', (v) => {
    pathRef.current?.setAttribute('d', pathAt(ARROW_UP, SQUARE, v))
    const goo = reduce ? 0 : Math.sin(v * Math.PI)
    const sx = 1 - squash * goo
    if (svgRef.current) {
      svgRef.current.style.transform = goo ? `rotate(${dir.current * tilt * goo}deg) scale(${sx}, ${1 / sx})` : ''
    }
  })

  return (
    <svg
      ref={svgRef}
      className="prompt-bar__glyph"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path ref={pathRef} d={pathAt(ARROW_UP, SQUARE, t.get())} />
    </svg>
  )
}

export default function PromptBar({
  value = '',
  placeholder = 'Ask anything',
  busy = false,
  pressed = false,
  width = 520,
  radius = 18,
  morphDuration = 240,
  squash = 0.12,
  tilt = 8,
  pressScale = 0.96,
  className = '',
}) {
  const armed = busy || value.trim().length > 0

  return (
    <div
      className={`prompt-bar ${className}`.trim()}
      style={{ '--pb-w': `${width}px`, '--pb-radius': `${radius}px`, '--pb-press': pressScale }}
    >
      <div className="prompt-bar__field">
        <div className="prompt-bar__input">
          {value ? value : <span className="prompt-bar__placeholder">{placeholder}</span>}
          {!busy && <span className="prompt-bar__caret" />}
        </div>
        <div className="prompt-bar__bar">
          <span className="prompt-bar__tool">
            <FiPlus size={16} />
          </span>
          <span className="prompt-bar__spacer" />
          <span
            className="prompt-bar__send"
            data-armed={armed ? '' : undefined}
            data-pressed={pressed ? '' : undefined}
          >
            <SendGlyph busy={busy} morphDuration={morphDuration} squash={squash} tilt={tilt} />
          </span>
        </div>
      </div>
    </div>
  )
}
