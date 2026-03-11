import { FaHome } from 'react-icons/fa'
import { useRef } from 'react'
import { gsap } from 'gsap'
import PillNav from './ui/PillNav'
import TextType from './ui/TextType'
import GlassSurface from './ui/GlassSurface'

const navItems = [
  { label: 'Projects', href: '#research' },
  { label: 'Publications', href: '#publications' },
  { label: 'Conferences', href: '#conferences' },
  { label: 'Teaching', href: '#teaching' },
]

export function Navbar() {
  const logoRef = useRef(null)
  const logoTweenRef = useRef(null)

  const handleLogoEnter = () => {
    logoTweenRef.current?.kill()
    gsap.set(logoRef.current, { rotate: 0 })
    logoTweenRef.current = gsap.to(logoRef.current, {
      rotate: 360,
      duration: 0.25,
      ease: 'power2.easeOut',
    })
  }

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
          padding: '1em 1.5rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          pointerEvents: 'none',
        }}
      >
        {/* Left: GlassSurface pill with typing text */}
        <div style={{ flex: 1, pointerEvents: 'auto' }}>
          <GlassSurface width="100%" height={42} borderRadius={21}>
            <div style={{ paddingLeft: '20px', paddingRight: '20px', width: '100%' }}>
              <TextType
                text={['Welcome to yongzzai.com!', 'Good to See You!']}
                loop={true}
                typingSpeed={60}
                deletingSpeed={40}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a1a1a', lineHeight: 1, whiteSpace: 'nowrap' }}
              />
            </div>
          </GlassSurface>
        </div>

        {/* Center: GlassSurface home button */}
        <div style={{ pointerEvents: 'auto', flexShrink: 0 }}>
          <GlassSurface width={42} height={42} borderRadius={21}>
            <a
              href="#"
              ref={logoRef}
              onMouseEnter={handleLogoEnter}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                textDecoration: 'none',
              }}
            >
              <FaHome size={18} color="#1a1a1a" />
            </a>
          </GlassSurface>
        </div>

        {/* Right: GlassSurface pill nav */}
        <div style={{ flex: 1, pointerEvents: 'auto' }}>
          <GlassSurface width="100%" height={42} borderRadius={21}>
            <PillNav
              items={navItems}
              ease="power2.easeOut"
              pillColor="rgba(0, 0, 0, 0.07)"
              hoveredPillTextColor="#1a1a1a"
              pillTextColor="#1a1a1a"
              hoverCircleColor="rgba(0, 0, 0, 0.1)"
              initialLoadAnimation={false}
              fullWidth={true}
            />
          </GlassSurface>
        </div>
      </div>
    </header>
  )
}
