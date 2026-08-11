import { useEffect, useRef } from 'react'

// Kept in the original green/teal/blue family, but dark enough to read against
// the light page background now that the panel fades into it.
const GLITCH_COLORS = ['#2b4539', '#2f8f63', '#2a6f96']
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789'
const CHAR_WIDTH = 10
const CHAR_HEIGHT = 20
const FONT_SIZE = 16
const GLITCH_SPEED = 50

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null
}

function interpolateColor(start, end, factor) {
  return `rgb(${Math.round(start.r + (end.r - start.r) * factor)},${Math.round(start.g + (end.g - start.g) * factor)},${Math.round(start.b + (end.b - start.b) * factor)})`
}

const chars = Array.from(CHARACTERS)
const randChar = () => chars[Math.floor(Math.random() * chars.length)]
const randColor = () => GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)]

export function LetterGlitch({ className = '', fadeColor = '#f9f8f6', spread = 0 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let letters = []
    let grid = { columns: 0, rows: 0 }
    let animId = null
    let lastGlitch = Date.now()

    function initGrid() {
      const dpr = window.devicePixelRatio || 1
      const parent = canvas.parentElement
      const w = parent.offsetWidth
      const h = parent.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const columns = Math.ceil(w / CHAR_WIDTH)
      const rows = Math.ceil(h / CHAR_HEIGHT)
      grid = { columns, rows }
      letters = Array.from({ length: columns * rows }, () => ({
        char: randChar(),
        color: randColor(),
        targetColor: randColor(),
        progress: 1,
      }))
      draw()
    }

    function draw() {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)
      ctx.clearRect(0, 0, w, h)
      ctx.font = `${FONT_SIZE}px monospace`
      ctx.textBaseline = 'top'
      letters.forEach((l, i) => {
        ctx.fillStyle = l.color
        ctx.fillText(l.char, (i % grid.columns) * CHAR_WIDTH, Math.floor(i / grid.columns) * CHAR_HEIGHT)
      })
    }

    function update() {
      const count = Math.max(1, Math.floor(letters.length * 0.05))
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * letters.length)
        letters[idx].char = randChar()
        letters[idx].targetColor = randColor()
        letters[idx].progress = 0
      }
    }

    function smooth() {
      let redraw = false
      letters.forEach((l) => {
        if (l.progress < 1) {
          l.progress = Math.min(1, l.progress + 0.05)
          const s = hexToRgb(l.color) || hexToRgb(GLITCH_COLORS[0])
          const e = hexToRgb(l.targetColor) || hexToRgb(GLITCH_COLORS[1])
          if (s && e) { l.color = interpolateColor(s, e, l.progress); redraw = true }
        }
      })
      if (redraw) draw()
    }

    function animate() {
      const now = Date.now()
      if (now - lastGlitch >= GLITCH_SPEED) {
        update(); draw(); lastGlitch = now
      }
      smooth()
      animId = requestAnimationFrame(animate)
    }

    initGrid()
    animate()

    let resizeTimer
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => { cancelAnimationFrame(animId); initGrid(); animate() }, 100)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [spread])

  // Fade the letters out into the page background instead of into black, so the
  // panel has no visible edge — only the characters appear to move. Interpolate
  // between explicit rgba stops of the same colour; going from the `transparent`
  // keyword would blend through rgba(0,0,0,0) and grey out the midpoint.
  const fade = hexToRgb(fadeColor) || { r: 249, g: 248, b: 246 }
  const rgba = (a) => `rgba(${fade.r},${fade.g},${fade.b},${a})`

  // A `farthest-corner` ellipse reaches 100% at the corners, so the midpoint of
  // each edge only sits at ~71% of the gradient. Reaching full page colour by
  // 72% is what guarantees the panel has no visible edge anywhere, not just at
  // the corners.
  return (
    <div className={`absolute pointer-events-none ${className}`} style={{ inset: -spread }}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${rgba(0)} 40%, ${rgba(0.55)} 56%, ${rgba(1)} 70%)`,
        }}
      />
    </div>
  )
}
