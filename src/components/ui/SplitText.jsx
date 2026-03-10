import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function SplitText({ text, className = '', wordClassName = '', delay = 0.07 }) {
  const words = text.split(' ')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className={`mr-[0.28em] ${wordClassName}`}
          initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.45, delay: i * delay, ease: 'easeOut' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}
