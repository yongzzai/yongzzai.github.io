/** @type {import('tailwindcss').Config} */

// Values live in src/index.css (:root = light, .dark = dark) as bare RGB
// channels, so opacity modifiers like `to-ink/20` keep working.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        border: token('border'),
        ink: token('ink'),
        body: token('body'),
        muted: token('muted'),
        highlight: token('highlight'),
        mono: token('mono'),
      },
      // The typefaces themselves are CSS variables in src/index.css.
      fontFamily: {
        sans: ['var(--font-sans)'],
        // Section titles and years.
        display: ['var(--font-display)'],
        // Dates, counts and venues.
        mono: ['var(--font-mono)'],
        // The calligraphy motto only; loaded as a subset of its glyphs.
        brush: ['var(--font-brush)'],
      },
    },
  },
  plugins: [],
}
