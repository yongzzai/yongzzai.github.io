import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function RotatingText({ texts, className = '', interval = 2600 }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % texts.length), interval)
    return () => clearInterval(id)
  }, [texts.length, interval])

  return (
    <span className="relative inline-block overflow-hidden" style={{ minWidth: '16ch' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className={`inline-block ${className}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
