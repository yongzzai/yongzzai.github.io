import { DotMatrixBg } from './components/ui/DotMatrixBg'
import Particles from './components/ui/Particles'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Research } from './components/Research'
import { Publications } from './components/Publications'
import { Conferences } from './components/Conferences'
import { Teaching } from './components/Teaching'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-bg" style={{ position: 'relative' }}>
      <DotMatrixBg />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Particles
          particleCount={250}
          particleSpread={12}
          speed={0.08}
          particleColors={['#3b5bdb', '#748ffc', '#c5d0ff', '#a5b4fc', '#6366f1']}
          alphaParticles={true}
          particleBaseSize={120}
          sizeRandomness={1.2}
          moveParticlesOnHover={true}
          particleHoverFactor={0.3}
          cameraDistance={22}
        />
      </div>
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Research />
        <Publications />
        <Conferences />
        <Teaching />
        <Footer />
      </main>
    </div>
  )
}
