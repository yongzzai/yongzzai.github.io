// Grid logic for LetterGlitch, kept out of the component so it can be unit tested.

// Sets about 5% of the letters glitching toward a new character and colour.
// The grid is empty while the panel is hidden (below md), and the animation
// loop must survive that so it is still running when the panel reappears.
export function startGlitches(letters, nextChar, nextColor) {
  if (letters.length === 0) return
  const count = Math.max(1, Math.floor(letters.length * 0.05))
  for (let i = 0; i < count; i++) {
    const letter = letters[Math.floor(Math.random() * letters.length)]
    letter.char = nextChar()
    letter.targetColor = nextColor()
    letter.progress = 0
  }
}
