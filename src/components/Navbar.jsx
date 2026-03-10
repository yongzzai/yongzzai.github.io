import { FaHome } from 'react-icons/fa'
import PillNav from './ui/PillNav'
import TextType from './ui/TextType'

const navItems = [
  { label: 'Projects', href: '#research' },
  { label: 'Publications', href: '#publications' },
  { label: 'Conferences', href: '#conferences' },
  { label: 'Teaching', href: '#teaching' },
]

const HomeIcon = () => (
  <FaHome size={18} color="#ffffff" />
)

export function Navbar() {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '64rem',
          padding: '0 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto', paddingTop: '1em' }}>
          <TextType
            text={['Welcome to yongzzai.com!', 'Good to See You!']}
            loop={true}
            typingSpeed={60}
            deletingSpeed={40}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4 }}
          />
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          <PillNav
          logoComponent={<HomeIcon />}
          items={navItems}
          ease="power2.easeOut"
          baseColor="#555555"
          pillColor="#1a1a1a"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#ffffff"
          hoverCircleColor="#3b5bdb"
          initialLoadAnimation={false}
          />
        </div>
      </div>
    </header>
  )
}
