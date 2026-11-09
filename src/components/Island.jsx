import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { IoPause, IoPlay, IoPlayBack, IoPlayForward } from 'react-icons/io5'
import { MdAirplay } from 'react-icons/md'
import TextType from './ui/TextType'
import { nowPlaying } from '../data/nowPlaying'
import { clock, seek } from '../lib/clock'
import './Island.css'

const GREETINGS = ['Welcome to yongzzai.com!', 'Good to See You!']
const SKIP = 10 // seconds ⏪ and ⏩ jump

// The island's own size is animated (not scaled), so what it holds never
// squashes. It springs between shapes with a little overshoot, like the real
// one; while a greeting types it only follows the text, quickly, so it
// doesn't wobble per letter.
const MORPH = { type: 'spring', stiffness: 400, damping: 30 }
const FOLLOW_TEXT = { duration: 0.12, ease: 'easeOut' }
const PILL = 38 // height of the pill; COMPACT_WIDTH matches .island-compact
const COMPACT_WIDTH = 200
const OPEN_WIDTH = (viewport) => Math.min(400, viewport - 24) // matches .island-player

// What the island holds trades places around the morph: the old contents
// blur away first, the shape springs, then the new contents come into focus.
const leave = { opacity: 0, scale: 0.9, filter: 'blur(6px)', transition: { duration: 0.14 } }
const arrive = (delay) => ({
  opacity: 1,
  scale: 1,
  filter: 'blur(0px)',
  transition: { delay, duration: 0.26, ease: 'easeOut' },
})
const hidden = { opacity: 0, scale: 0.9, filter: 'blur(6px)' }
const keepOnMainLoop = () => {}

// A pretend player: the clock runs while playing and starts over at the end.
function usePlayer(active, duration) {
  const [playing, setPlaying] = useState(true)
  const [at, setAt] = useState(0)
  useEffect(() => {
    if (!active || !playing) return undefined
    const id = setInterval(() => setAt((t) => (t >= duration ? 0 : t + 1)), 1000)
    return () => clearInterval(id)
  }, [active, playing, duration])
  return {
    playing,
    at,
    toggle: () => setPlaying((p) => !p),
    skip: (by) => setAt((t) => seek(t, by, duration)),
  }
}

// The natural size of an element (pass it through a callback ref).
function useSize(el) {
  const [size, setSize] = useState(null)
  useLayoutEffect(() => {
    if (!el) return undefined
    const update = () => setSize({ width: el.offsetWidth, height: el.offsetHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [el])
  return size
}

function useViewportWidth() {
  const [width, setWidth] = useState(() => window.innerWidth)
  useEffect(() => {
    const update = () => setWidth(window.innerWidth)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return width
}

// Bars bouncing to the music; still while paused. Coloured from the cover in
// the open player, white in the compact island, as on iOS.
function Waveform({ playing, colors }) {
  return (
    <span
      className={`island-wave${playing ? '' : ' is-paused'}${colors ? ' is-colored' : ''}`}
      style={colors && { '--wave-low': colors[0], '--wave-high': colors[1] }}
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <i key={i} />
      ))}
    </span>
  )
}

// The top of the screen, a black pill like a phone's Dynamic Island. It types
// its greetings, then turns into a "now playing" island (cover and waveform,
// see data/nowPlaying.js); a tap opens it into the player, as on iOS.
export function Island() {
  const [music, setMusic] = useState(false)
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const player = usePlayer(music, nowPlaying.duration)
  const toggleRef = useRef(null)
  const refocus = useRef(false)
  const [greetingEl, setGreetingEl] = useState(null)
  const [playerEl, setPlayerEl] = useState(null)
  const greetingSize = useSize(greetingEl)
  const playerSize = useSize(playerEl)
  const viewport = useViewportWidth()
  const { title, artist, cover, duration, colors } = nowPlaying

  // Each content layer sits on top of the island at its natural size; the
  // island takes the size of the one showing.
  const size = !music
    ? { width: greetingSize?.width ?? 136, height: PILL }
    : open
      ? { width: OPEN_WIDTH(viewport), height: playerSize?.height ?? 182 }
      : { width: COMPACT_WIDTH, height: PILL }

  // Once the last greeting has typed and deleted itself, the music starts.
  const onSentenceComplete = useCallback((_, i) => {
    if (i === GREETINGS.length - 1) setMusic(true)
  }, [])

  // Closing hands focus back to the island, which takes it as it mounts.
  const close = useCallback(() => {
    refocus.current = true
    setOpen(false)
  }, [])
  const compactRef = useCallback((el) => {
    if (el && refocus.current) {
      refocus.current = false
      el.focus()
    }
  }, [])

  // Opening moves focus into the player; Escape closes it.
  useEffect(() => {
    if (!open) return undefined
    toggleRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  // Reduced motion: shapes and contents switch at once. The onUpdate keeps
  // these fades on framer-motion's own animation loop: handed to the browser
  // (WAAPI, its default for opacity and filter), the end of a fade showed
  // its starting value for a frame, a visible flicker.
  const layer = (delay) =>
    reduceMotion ? {} : { initial: hidden, animate: arrive(delay), exit: leave, onUpdate: keepOnMainLoop }

  return (
    <>
      {/* A click anywhere else closes the player. */}
      {open && <div className="fixed inset-0 z-40" onClick={close} aria-hidden="true" />}

      <div className="island-bar fixed inset-x-0 top-0 z-50 flex justify-center px-3 pointer-events-none">
        <motion.div
          className={`island${music ? ' is-music' : ''}`}
          initial={false}
          animate={{ ...size, borderRadius: open ? 34 : PILL / 2 }}
          transition={reduceMotion ? { duration: 0 } : music ? MORPH : FOLLOW_TEXT}
        >
          <AnimatePresence initial={false}>
            {!music && (
              <motion.div key="greeting" className="island-layer" {...layer(0)}>
                <div ref={setGreetingEl} className="island-greeting">
                  <TextType
                    text={GREETINGS}
                    loop
                    typingSpeed={60}
                    deletingSpeed={60}
                    pauseDuration={1500}
                    showCursor
                    cursorCharacter="|"
                    onSentenceComplete={onSentenceComplete}
                  />
                </div>
              </motion.div>
            )}

            {music && !open && (
              // Shown once the island has shrunk back around it.
              <motion.div key="compact" className="island-layer" {...layer(0.12)}>
                <button
                  ref={compactRef}
                  type="button"
                  className="island-compact"
                  aria-expanded="false"
                  aria-label={`Now playing: ${title} by ${artist}. Open the player`}
                  onClick={() => setOpen(true)}
                >
                  <img className="island-cover" src={cover} alt="" />
                  <Waveform playing={player.playing} />
                </button>
              </motion.div>
            )}

            {music && open && (
              <motion.div key="player" className="island-layer island-layer--player" {...layer(0.08)}>
                <div ref={setPlayerEl} className="island-player" role="dialog" aria-label="Now playing">
                  <div className="island-player__head">
                    <img className="island-cover island-cover--large" src={cover} alt="" />
                    <div className="island-player__titles">
                      <p className="island-player__title">{title}</p>
                      <p className="island-player__artist">{artist}</p>
                    </div>
                    <Waveform playing={player.playing} colors={colors} />
                  </div>

                  <div className="island-player__time">
                    <span>{clock(player.at)}</span>
                    <span
                      className="island-progress"
                      role="progressbar"
                      aria-label="Played"
                      aria-valuemin={0}
                      aria-valuemax={duration}
                      aria-valuenow={player.at}
                      aria-valuetext={`${clock(player.at)} of ${clock(duration)}`}
                    >
                      <span style={{ width: `${(player.at / duration) * 100}%` }} />
                    </span>
                    <span>-{clock(duration - player.at)}</span>
                  </div>

                  <div className="island-player__controls">
                    <button type="button" aria-label={`Back ${SKIP} seconds`} onClick={() => player.skip(-SKIP)}>
                      <IoPlayBack aria-hidden="true" />
                    </button>
                    <button
                      ref={toggleRef}
                      type="button"
                      className="is-main"
                      aria-label={player.playing ? 'Pause' : 'Play'}
                      onClick={player.toggle}
                    >
                      {player.playing ? <IoPause aria-hidden="true" /> : <IoPlay aria-hidden="true" />}
                    </button>
                    <button type="button" aria-label={`Forward ${SKIP} seconds`} onClick={() => player.skip(SKIP)}>
                      <IoPlayForward aria-hidden="true" />
                    </button>
                    {/* Only the picture of AirPlay: there is nothing to send. */}
                    <MdAirplay className="island-player__airplay" aria-hidden="true" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}
