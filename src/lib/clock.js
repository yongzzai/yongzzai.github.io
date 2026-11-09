// Time helpers for the Dynamic Island's (pretend) music player.

// 128 -> '2:08'
export function clock(seconds) {
  const s = Math.max(0, Math.round(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// Skip `by` seconds (negative goes back), without leaving the song.
export function seek(at, by, duration) {
  return Math.min(Math.max(at + by, 0), duration)
}
