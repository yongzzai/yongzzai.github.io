// Pure helpers for DotGrid, free of DOM access so they can be unit tested.

// Lays dots on a grid centred in width x height.
export function buildDots(width, height, size, gap) {
  const cell = size + gap
  const cols = Math.max(0, Math.floor((width + gap) / cell))
  const rows = Math.max(0, Math.floor((height + gap) / cell))
  const startX = (width - (cell * cols - gap)) / 2 + size / 2
  const startY = (height - (cell * rows - gap)) / 2 + size / 2
  const dots = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      dots.push({ cx: startX + x * cell, cy: startY + y * cell, xOffset: 0, yOffset: 0, pushed: false, moving: false })
    }
  }
  return dots
}

// 1 at the cursor, falling linearly to 0 at `radius`.
export function proximityT(dx, dy, radius) {
  if (Math.abs(dx) >= radius || Math.abs(dy) >= radius) return 0
  const d = Math.hypot(dx, dy)
  return d >= radius ? 0 : 1 - d / radius
}

export function hexToRgb(hex) {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex)
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 0, g: 0, b: 0 }
}

export function mixRgb(a, b, t) {
  const c = (k) => Math.round(a[k] + (b[k] - a[k]) * t)
  return `rgb(${c('r')},${c('g')},${c('b')})`
}

// Keyboard activation (Enter on a link) dispatches a click with detail 0 at
// clientX/Y 0; only real pointer clicks should set off a shockwave.
export function isPointerClick(e) {
  return e.detail > 0
}
