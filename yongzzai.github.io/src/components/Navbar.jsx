import { FaHome, FaBars } from 'react-icons/fa'
import { useRef, useState } from 'react'
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileMenuRef = useRef(null)

  const handleLogoEnter = () => {
    logoTweenRef.current?.kill()
    gsap.set(logoRef.current, { rotate: 0 })
    logoTweenRef.current = gsap.to(logoRef.current, {
      rotate: 360,
      duration: 0.25,
      ease: 'power2.easeOut',
    })
  }

  const toggleMobile = () => {
    const next = !mobileOpen
    setMobileOpen(next)
    const menu = mobileMenuRef.current
    if (!menu) return
    if (next) {
      gsap.set(menu, { visibility: 'visible' })
      gsap.fromTo(menu, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' })
    } else {
      gsap.to(menu, { opacity: 0, y: -10, duration: 0.2, ease: 'power2.in', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) })
    }
  }

  const closeMobile = () => {
    if (!mobileOpen) return
    setMobileOpen(false)
    const menu = mobileMenuRef.current
    if (menu) {
      gsap.to(menu, { opacity: 0, y: -10, duration: 0.2, ease: 'power2.in', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) })
    }
  }

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, pointerEvents: 'none' }}>
      {/* Desktop navbar (901px+) */}
      <div className="hidden nav:flex justify-center">
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
      </div>

      {/* Mobile navbar (<=900px) */}
      <div className="flex nav:hidden justify-center">
        <div
          style={{
            width: '100%',
            padding: '0.75em 1rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'none',
          }}
        >
          <div style={{ flex: 1, minWidth: 0, pointerEvents: 'auto' }}>
            <GlassSurface width="100%" height={42} borderRadius={21}>
              <div style={{ paddingLeft: '16px', paddingRight: '16px', width: '100%', overflow: 'hidden' }}>
                <TextType
                  text={['Welcome!', 'yongzzai.com']}
                  loop={true}
                  typingSpeed={60}
                  deletingSpeed={40}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="|"
                  style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', lineHeight: 1, whiteSpace: 'nowrap' }}
                />
              </div>
            </GlassSurface>
          </div>

          <div style={{ pointerEvents: 'auto', flexShrink: 0 }}>
            <GlassSurface width={42} height={42} borderRadius={21}>
              <a
                href="#"
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

          <div style={{ pointerEvents: 'auto', flexShrink: 0 }}>
            <GlassSurface width={42} height={42} borderRadius={21}>
              <button
                onClick={toggleMobile}
                aria-label="Toggle menu"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <FaBars size={16} color="#1a1a1a" />
              </button>
            </GlassSurface>
          </div>
        </div>
      </div>

      {/* Mobile dropdown - rendered outside GlassSurface to avoid clipping */}
      <div
        ref={mobileMenuRef}
        className="nav:hidden"
        style={{
          position: 'fixed',
          top: '4em',
          left: '1rem',
          right: '1rem',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '20px',
          zIndex: 998,
          pointerEvents: 'auto',
          padding: '4px',
          visibility: 'hidden',
          opacity: 0,
        }}
      >
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={closeMobile}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  color: '#1a1a1a',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 500,
                  borderRadius: '16px',
                  background: 'rgba(0, 0, 0, 0.03)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59, 91, 219, 0.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)' }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
