import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import PromptBar from './ui/PromptBar'
import { INTRO_PROMPT, markIntroSeen } from '../lib/intro'

// Typing rhythm: a little slower on spaces so it reads like a person typing.
const keyDelay = (char, i) => (char === ' ' ? 200 : 95 + (i % 3) * 25)

// Full-screen opening: the prompt bar types INTRO_PROMPT, "sends" it, and then
// this overlay fades away to reveal the site, which has been rendered beneath
// it all along. A click or key press skips straight to the reveal.
export function Intro({ onDone }) {
  const [text, setText] = useState('')
  const [pressed, setPressed] = useState(false)
  const [busy, setBusy] = useState(false)
  const done = useRef(false)

  useEffect(() => {
    const finish = () => {
      if (done.current) return
      done.current = true
      markIntroSeen()
      onDone()
    }

    const timers = []
    const at = (ms, fn) => timers.push(setTimeout(fn, ms))
    let t = 700 // let the bar settle in first
    for (let i = 1; i <= INTRO_PROMPT.length; i++) {
      t += keyDelay(INTRO_PROMPT[i - 1], i)
      at(t, () => setText(INTRO_PROMPT.slice(0, i)))
    }
    at((t += 1450), () => setPressed(true)) // a beat to read the question
    // The question stays in the field while the "answer" loads.
    at((t += 140), () => {
      setPressed(false)
      setBusy(true)
    })
    at((t += 900), finish)

    const root = document.documentElement
    const overflow = root.style.overflow
    root.style.overflow = 'hidden'
    window.addEventListener('pointerdown', finish)
    window.addEventListener('keydown', finish)
    return () => {
      timers.forEach(clearTimeout)
      root.style.overflow = overflow
      window.removeEventListener('pointerdown', finish)
      window.removeEventListener('keydown', finish)
    }
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg px-6"
      aria-hidden="true"
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.03 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <motion.div
        className="w-full flex justify-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <PromptBar value={text} pressed={pressed} busy={busy} />
      </motion.div>
    </motion.div>
  )
}
