import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { useThemeColors } from '../../lib/theme'
import { buildDots, hexToRgb, isPointerClick, mixRgb, proximityT } from './dotGridMath'

gsap.registerPlugin(InertiaPlugin)

// Adapted from React Bits' DotGrid (Backgrounds/DotGrid). Unlike upstream it
// draws on demand rather than every frame, batches resting dots into a single
// path, tracks the glow on every pointer move (only the fling is throttled),
// and takes its colours from the theme.
export function DotGrid({
  dotSize = 2.5,
  gap = 20,
  proximity = 140,
  maxScale = 2,
  speedTrigger = 100,
  maxSpeed = 5000,
  shockRadius = 250,
  shockStrength = 3,
  resistance = 750,
  returnDuration = 1.5,
}) {
  const canvasRef = useRef(null)
  const colors = useThemeColors()
  const colorsRef = useRef(colors)
  const requestDrawRef = useRef(() => {})
  colorsRef.current = colors

  useEffect(() => {
    requestDrawRef.current()
  }, [colors])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: -1e4, y: -1e4, lastX: 0, lastY: 0, lastTime: 0, lastFling: 0 }
    let dots = []
    let moving = 0 // dots with a push or return tween in flight
    let raf = 0
    let dpr = 1
    let width = 0
    let height = 0

    const draw = () => {
      const { dot, highlight } = colorsRef.current
      const base = hexToRgb(dot)
      const active = hexToRgb(highlight)
      const r = dotSize / 2
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      // Resting dots share one path, so the whole field is a single fill().
      const lit = []
      ctx.beginPath()
      for (const d of dots) {
        const x = d.cx + d.xOffset
        const y = d.cy + d.yOffset
        const t = proximityT(d.cx - pointer.x, d.cy - pointer.y, proximity)
        if (t > 0) {
          lit.push(x, y, t)
          continue
        }
        ctx.moveTo(x + r, y)
        ctx.arc(x, y, r, 0, Math.PI * 2)
      }
      ctx.fillStyle = dot
      ctx.fill()

      for (let i = 0; i < lit.length; i += 3) {
        const t = lit[i + 2]
        ctx.beginPath()
        ctx.arc(lit[i], lit[i + 1], r * (1 + (maxScale - 1) * t), 0, Math.PI * 2)
        ctx.fillStyle = mixRgb(base, active, t)
        ctx.fill()
      }
    }

    const frame = () => {
      raf = 0
      draw()
      if (moving > 0) requestDraw()
    }
    const requestDraw = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    requestDrawRef.current = requestDraw

    const push = (d, vx, vy) => {
      gsap.killTweensOf(d)
      if (!d.moving) {
        d.moving = true
        moving++
      }
      d.pushed = true
      gsap.to(d, {
        inertia: { xOffset: vx, yOffset: vy, resistance },
        onComplete: () => {
          d.pushed = false
          gsap.to(d, {
            xOffset: 0,
            yOffset: 0,
            duration: returnDuration,
            ease: 'elastic.out(1,0.75)',
            onComplete: () => {
              d.moving = false
              moving--
            },
          })
        },
      })
      requestDraw()
    }

    const resize = () => {
      gsap.killTweensOf(dots)
      moving = 0
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      dots = buildDots(width, height, dotSize, gap)
      requestDraw()
    }

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      const now = performance.now()
      // After the cursor re-enters there is no previous sample, so no velocity.
      const fresh = !pointer.lastTime
      const dt = Math.max(now - pointer.lastTime, 1)
      let vx = fresh ? 0 : ((e.clientX - pointer.lastX) / dt) * 1000
      let vy = fresh ? 0 : ((e.clientY - pointer.lastY) / dt) * 1000
      const speed = Math.hypot(vx, vy)
      if (speed > maxSpeed) {
        vx *= maxSpeed / speed
        vy *= maxSpeed / speed
      }
      Object.assign(pointer, { x: e.clientX, y: e.clientY, lastX: e.clientX, lastY: e.clientY, lastTime: now })
      requestDraw()

      if (reduceMotion || speed < speedTrigger || now - pointer.lastFling < 50) return
      pointer.lastFling = now
      for (const d of dots) {
        if (d.pushed || proximityT(d.cx - pointer.x, d.cy - pointer.y, proximity) === 0) continue
        push(d, d.cx - pointer.x + vx * 0.005, d.cy - pointer.y + vy * 0.005)
      }
    }

    // relatedTarget is null when the cursor leaves the window entirely.
    const onOut = (e) => {
      if (e.relatedTarget) return
      pointer.x = pointer.y = -1e4
      pointer.lastTime = 0
      requestDraw()
    }

    const onClick = (e) => {
      if (reduceMotion || !isPointerClick(e)) return
      for (const d of dots) {
        const dist = Math.hypot(d.cx - e.clientX, d.cy - e.clientY)
        if (d.pushed || dist >= shockRadius) continue
        const falloff = 1 - dist / shockRadius
        push(d, (d.cx - e.clientX) * shockStrength * falloff, (d.cy - e.clientY) * shockStrength * falloff)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('mouseout', onOut)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('mouseout', onOut)
      window.removeEventListener('click', onClick)
      cancelAnimationFrame(raf)
      gsap.killTweensOf(dots)
      requestDrawRef.current = () => {}
    }
  }, [dotSize, gap, proximity, maxScale, speedTrigger, maxSpeed, shockRadius, shockStrength, resistance, returnDuration])

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 w-full h-full pointer-events-none z-0" />
}
