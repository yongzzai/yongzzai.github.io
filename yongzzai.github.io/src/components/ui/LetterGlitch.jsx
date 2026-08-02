import { useEffect, useRef } from 'react'

const GLITCH_COLORS = ['#2b4539', '#61dca3', '#61b3dc']
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

export function LetterGlitch({ className = '' }) {
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
  }, [])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* outer vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }}
      />
    </div>
  )
}
