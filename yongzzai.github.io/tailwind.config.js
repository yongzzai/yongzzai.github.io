/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: {
        nav: '901px',
      },
      colors: {
        bg: '#f9f8f6',
        surface: '#ffffff',
        border: '#e5e2dc',
        ink: '#1a1a1a',
        body: '#2d2d2d',
        muted: '#7a7a7a',
        highlight: '#3b5bdb',
        mono: '#6b7280',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
