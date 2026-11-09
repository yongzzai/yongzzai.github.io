import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { MOTTO_COLUMNS } from '../lib/motto'

// Each column is brushed in top to bottom, right column first, once the hero's
// name has started drawing. The clip box is wider than the column so the
// brush's overhangs aren't cut off once it's written.
const HIDDEN = 'inset(-20% -20% 100% -20%)'
const WRITTEN = 'inset(-20% -20% -20% -20%)'
const START = 1.2
const STROKE = 1.1
const EASE = [0.65, 0, 0.35, 1]

// The empty margin beside the max-w-5xl (64rem) content column, whose text
// starts 1.5rem (px-6) further in. In `left`, 100% is the home page's width
// without its scrollbar, the width the column is centred in; 100vw includes
// the scrollbar and would set the piece off by half of it wherever scrollbars
// take space. Font sizes can't take that %, so the size uses 100vw (close
// enough there).
const MARGIN = '(100% - 64rem) / 2'
const MARGIN_VW = '(100vw - 64rem) / 2'
const TEXT_START = `(${MARGIN} + 1.5rem)`
// Space between the piece and the text: grows with the margin, but stops at
// 4.5rem so on wide screens the piece stays hung beside the content instead of
// drifting out into the middle of the empty margin.
const GAP = `clamp(2rem, calc(${MARGIN} * 0.25), 4.5rem)`

// Two maxims hung in the home page's left margin like a scroll, fixed to the
// page: they scroll away with it, and leave with it when the pager turns to
// another one. Only from xl (1280px) up: below that the margin is too narrow
// and the piece would sit on the content, so it is left out rather than
// squeezed.
// Its right edge sits GAP left of the text and its size is a share of the
// margin, within readable bounds; its top sits on the hero's top line (Hero's
// pt-24), level with the name and the photo.
export function Motto() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const animate = !useReducedMotion()

  return (
    // A zero-height strip across the top of the page; the piece hangs from it.
    <div lang="ko" className="hidden xl:block relative z-0 h-0 pointer-events-none">
      <aside className="absolute top-24 -translate-x-full" style={{ left: `calc(${TEXT_START} - ${GAP})` }}>
        {/* DOM order is reading order; flex-row-reverse puts the first column on the right. */}
        <figure
          ref={ref}
          className="flex flex-row-reverse items-start gap-[0.08em] font-brush text-ink leading-none"
          style={{ fontSize: `clamp(2.75rem, calc(${MARGIN_VW} * 0.01), 5rem)` }}
        >
          {MOTTO_COLUMNS.map((column, i) => (
            <motion.span
              key={column}
              className="[writing-mode:vertical-rl] tracking-[-0.06em]"
              initial={animate ? { clipPath: HIDDEN } : false}
              animate={animate && inView ? { clipPath: WRITTEN } : undefined}
              transition={{ duration: STROKE, delay: START + i * (STROKE - 0.2), ease: EASE }}
            >
              {column}
            </motion.span>
          ))}
        </figure>
      </aside>
    </div>
  )
}
