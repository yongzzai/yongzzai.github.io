import { FaMoon, FaSun } from 'react-icons/fa'
import GlassSurface from './GlassSurface'
import { toggleTheme, useTheme } from '../../lib/theme'

export function ThemeToggle() {
  const dark = useTheme() === 'dark'
  const Icon = dark ? FaSun : FaMoon

  return (
    <GlassSurface width={42} height={42} borderRadius={21}>
      <button
        type="button"
        aria-label="Dark mode"
        aria-pressed={dark}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgb(var(--c-ink))',
        }}
      >
        <Icon size={16} />
      </button>
    </GlassSurface>
  )
}
