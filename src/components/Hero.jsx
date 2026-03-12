import { motion } from 'framer-motion'
import { FaLinkedinIn, FaGithub, FaResearchgate, FaFilePdf, FaCode, FaLayerGroup, FaFileCode, FaDatabase } from 'react-icons/fa'
import { FaGraduationCap } from 'react-icons/fa'
import { SplitText } from './ui/SplitText'
import { RotatingText } from './ui/RotatingText'
import { LetterGlitch } from './ui/LetterGlitch'
import { HoloCard } from './ui/HoloCard'
import CircularGallery from './ui/CircularGallery'

const socials = [
  { icon: FaGraduationCap, href: 'https://scholar.google.com/citations?user=YxFIm0AAAAAJ', label: 'Google Scholar', hoverColor: '#4285F4' },
  { icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/yongjae-lee-93b935312/', label: 'LinkedIn', hoverColor: '#1d7fb4' },
  { icon: FaResearchgate, href: 'https://www.researchgate.net/profile/Yongjae-Lee-14', label: 'ResearchGate', hoverColor: '#00CCBB', iconSize: 22 },
  { icon: FaGithub, href: 'https://github.com/yongzzai', label: 'GitHub', hoverColor: '#8b5cf6' },
]



const techCategories = [
  {
    Icon: FaCode,
    title: 'Programming',
    items: [
      { name: 'Python', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', tech: 'python' },
      { name: 'JavaScript', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', tech: 'javascript' },
    ],
  },
  {
    Icon: FaLayerGroup,
    title: 'Frameworks',
    items: [
      { name: 'PyTorch', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg', tech: 'pytorch' },
      { name: 'PyG', img: 'https://raw.githubusercontent.com/pyg-team/pyg_sphinx_theme/master/pyg_sphinx_theme/static/img/pyg_logo.png', tech: 'pyg' },
    ],
  },
  {
    Icon: FaFileCode,
    title: 'Markup & Styling',
    items: [
      { name: 'HTML5', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', tech: 'html' },
      { name: 'CSS3', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', tech: 'css' },
      { name: 'LaTeX', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/latex/latex-original.svg', tech: 'latex' },
    ],
  },
  {
    Icon: FaDatabase,
    title: 'Database',
    items: [
      { name: 'MySQL', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', tech: 'mysql' },
      { name: 'Neo4j', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neo4j/neo4j-original.svg', tech: 'neo4j' },
    ],
  },
]

const techHoverColors = {
  python: '#3776AB', javascript: '#F7DF1E', pytorch: '#EE4C2C',
  pyg: '#E8562A', html: '#E34F26', css: '#1572B6',
  latex: '#008080', mysql: '#4479A1', neo4j: '#008CC1',
}

function TechCard({ category }) {
  const Icon = category.Icon
  return (
    <div
      className="rounded-xl px-3 py-2 border border-border transition-all duration-300 relative overflow-hidden bg-white"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.borderColor = '#3b5bdb'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,91,219,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center bg-surface border border-border"
        >
          <Icon size={11} color="#1a1a1a" />
        </div>
        <span className="text-xs font-semibold text-ink font-sans">{category.title}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {category.items.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-border text-muted transition-all duration-300 cursor-default"
            style={{ fontSize: 10, background: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={(e) => {
              const color = techHoverColors[item.tech] || '#8a64ff'
              e.currentTarget.style.borderColor = color
              e.currentTarget.style.boxShadow = `0 0 12px ${color}44`
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = ''
              e.currentTarget.style.boxShadow = ''
              e.currentTarget.style.transform = ''
            }}
          >
            {item.img
              ? <img src={item.img} alt={item.name} style={{ width: 12, height: 12, objectFit: 'contain' }} />
              : <span style={{ fontSize: 12 }}>{item.icon}</span>
            }
            <span className="font-mono">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AboutLeeButton() {
  return (
    <a
      href="/assets/cv.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-ink text-ink bg-transparent rounded transition-all duration-300"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#3b5bdb'
        e.currentTarget.style.color = '#ffffff'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = ''
        e.currentTarget.style.color = ''
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <FaFilePdf size={16} />
      About Lee
    </a>
  )
}

function SocialIcon({ icon: Icon, href, label, hoverColor, iconSize = 18 }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-border text-muted transition-all duration-300"
      style={{ '--hover-color': hoverColor }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 5px 15px rgba(0,0,0,0.12)`
        e.currentTarget.style.color = hoverColor
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.color = ''
      }}
    >
      <Icon size={iconSize} />
    </a>
  )
}

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
})

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-start max-w-5xl mx-auto px-6 pt-28">
      <div className="grid md:grid-cols-[1fr_auto] gap-12 items-start">
        {/* Left: text */}
        <div className="flex flex-col justify-between md:min-h-[370px]">
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-ink leading-tight mb-5">
              <SplitText text="Yongjae Lee" delay={0.08} />
            </h1>

            <motion.div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base sm:text-lg font-light mb-6" {...fadeUp(0.55)}>
              <span className="text-ink font-medium">Associate Research Engineer</span>
              <span className="text-muted hidden sm:inline">·</span>
              <span className="text-muted">Studying</span>
              <RotatingText
                texts={['Process Intelligence', 'Data Science']}
                className="text-highlight font-medium"
              />
            </motion.div>

            <motion.div className="flex flex-col gap-3 mb-4" {...fadeUp(0.7)}>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-highlight text-lg mt-0.5 shrink-0">▸</span>
                <div>
                  <div className="text-body font-medium">Associate Research Engineer <span className="text-muted font-normal">(2026.03 ~ present)</span></div>
                  <div className="text-muted">Industrial Artificial Intelligence Research Institute (PNU)</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-muted text-lg mt-0.5 shrink-0">▸</span>
                <div>
                  <div className="text-body font-medium">M.Sc. in Industrial Data Science &amp; Engineering <span className="text-muted font-normal">(2024.03 ~ 2026.02)</span></div>
                  <div className="text-muted">Pusan National University</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-muted text-lg mt-0.5 shrink-0">▸</span>
                <div>
                  <div className="text-body font-medium">B.Sc. in Industrial Engineering <span className="text-muted font-normal">(2018.03 ~ 2024.02)</span></div>
                  <div className="text-muted">Pusan National University</div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div className="flex flex-wrap items-center gap-4 mt-6" {...fadeUp(0.85)}>
            <AboutLeeButton />
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label, hoverColor, iconSize }) => (
                <SocialIcon key={label} icon={Icon} href={href} label={label} hoverColor={hoverColor} iconSize={iconSize} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: photo with letter-glitch background */}
        <motion.div
          className="hidden md:flex justify-end"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          <div className="relative rounded-2xl overflow-hidden" style={{ width: 260, height: 370 }}>
            <LetterGlitch />
            <div className="absolute inset-0 flex items-center justify-center">
              <HoloCard />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tech Stack */}
      <motion.div className="mt-8 mb-8" {...fadeUp(1.0)}>
        <p className="font-mono text-xs text-mono uppercase tracking-widest mb-3">
          Tools &amp; Stack
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {techCategories.map((cat) => (
            <TechCard key={cat.title} category={cat} />
          ))}
        </div>
      </motion.div>

      {/* Where I've Been */}
      <motion.div className="mb-20" {...fadeUp(1.05)}>
        <p className="font-mono text-base tracking-widest mb-3 text-center">
          <span className="text-highlight font-bold">LEE</span>
          <span className="text-mono">vent Log</span>
        </p>
        <div style={{ height: '280px' }}>
          <CircularGallery
            items={[
              { image: '/assets/special/Daejeon.JPG', text: 'Daejeon' },
              { image: '/assets/special/Shanghai.JPG', text: 'Shanghai' },
              { image: '/assets/special/Hongkong.JPG', text: 'Hong Kong' },
              { image: '/assets/special/Lijiang.JPG', text: 'Lijiang' },
              { image: '/assets/special/Bogota.JPG', text: 'Bogotá' },
              { image: '/assets/special/Rome.jpg', text: 'Rome' },
              { image: '/assets/special/Toledo.jpg', text: 'Toledo' },
              { image: '/assets/special/Granada.jpg', text: 'Granada' },
              { image: '/assets/special/Granada2.jpg', text: 'Granada' },
              { image: '/assets/special/Jeju.jpg', text: 'Jeju' },
              { image: '/assets/special/Seoul.jpg', text: 'Seoul' },
              { image: '/assets/special/Army.JPG', text: 'Military' },
              { image: '/assets/special/BPM Conference.jpg', text: 'BPM2025' },
              { image: '/assets/special/ICPR Conference.JPG', text: 'ICPR28' },
              { image: '/assets/special/Graduation (BSc).jpg', text: 'B.Sc.' },
              { image: '/assets/special/Graduation(MSc).JPG', text: 'M.Sc.' },
            ]}
            bend={3}
            textColor="#1a1a1a"
            borderRadius={0.05}
            font="bold 26px sans-serif"
            scrollSpeed={2}
            scrollEase={0.4}
            autoPlay={1.5}
          />
        </div>
      </motion.div>

    </section>
  )
}
