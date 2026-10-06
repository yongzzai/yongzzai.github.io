/** @type {import('tailwindcss').Config} */

// Values live in src/index.css (:root = light, .dark = dark) as bare RGB
// channels, so opacity modifiers like `to-ink/20` keep working.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        nav: '901px',
      },
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
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
