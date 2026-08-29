import { useRef, useState } from 'react'

export function HoloCard({ className = '' }) {
  const containerRef = useRef(null)
  const [transform, setTransform] = useState('perspective(350px) rotateX(0deg) rotateY(0deg)')
  const [overlayStyle, setOverlayStyle] = useState({ opacity: 0 })

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateY = -1 / 5 * x + 20
    const rotateX = 4 / 30 * y - 20
    setTransform(`perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
    setOverlayStyle({
      backgroundPosition: `${x / 5 + y / 5}%`,
      filter: `opacity(${x / 200}) brightness(1.2)`,
    })
  }

  const handleMouseOut = () => {
    setTransform('perspective(350px) rotateX(0deg) rotateY(0deg)')
    setOverlayStyle({ filter: 'opacity(0)' })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseOut}
      className={`relative rounded-xl overflow-hidden shadow-2xl cursor-pointer ${className}`}
      style={{
        width: 220,
        height: 310,
        transform,
        transition: 'transform 0.1s',
      }}
    >
      {/* Photo */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat rounded-xl"
        style={{
          backgroundImage: 'url(/assets/photo.jpg)',
          backgroundSize: '110% auto',
          backgroundColor: '#464646',
        }}
      />
      {/* Holographic overlay */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,219,112,0.8) 45%, rgba(132,50,255,0.6) 50%, transparent 54%)',
          backgroundSize: '150% 150%',
          mixBlendMode: 'color-dodge',
          transition: 'all 0.1s',
          ...overlayStyle,
        }}
      />
    </div>
  )
}
