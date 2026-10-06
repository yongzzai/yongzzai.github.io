import { motion } from 'framer-motion'
import { FaLinkedinIn, FaGithub, FaResearchgate, FaFilePdf } from 'react-icons/fa'
import { FaGraduationCap } from 'react-icons/fa'
import StrokeText from './ui/StrokeText'
import { RotatingText } from './ui/RotatingText'
import { LetterGlitch } from './ui/LetterGlitch'
import { HoloCard } from './ui/HoloCard'
import CircularGallery from './ui/CircularGallery'
import { useThemeColors } from '../lib/theme'

const socials = [
  { icon: FaGraduationCap, href: 'https://scholar.google.com/citations?user=YxFIm0AAAAAJ', label: 'Google Scholar', hoverColor: '#4285F4' },
  { icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/yongjae-lee-93b935312/', label: 'LinkedIn', hoverColor: '#1d7fb4' },
  { icon: FaResearchgate, href: 'https://www.researchgate.net/profile/Yongjae-Lee-14', label: 'ResearchGate', hoverColor: '#00CCBB', iconSize: 22 },
  { icon: FaGithub, href: 'https://github.com/yongzzai', label: 'GitHub', hoverColor: '#8b5cf6' },
]

function AboutLeeButton() {
  return (
    <a
      href="/assets/cv.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-ink text-ink bg-transparent rounded transition-all duration-300"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgb(var(--c-highlight))'
        e.currentTarget.style.color = 'rgb(var(--c-bg))'
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
  const colors = useThemeColors()

  return (
    <section className="relative min-h-screen flex flex-col justify-start max-w-5xl mx-auto px-6 pt-24">
      <div className="grid md:grid-cols-[1fr_auto] gap-12 items-start">
        {/* Left: text */}
        <div className="flex flex-col justify-between md:min-h-[370px]">
          <div>
            {/* StrokeText draws its own SVG type, so the size lives in props
                rather than in Tailwind text-* classes. */}
            <h1 className="mb-5">
              <StrokeText
                text="Yongjae Lee"
                fontSize={72}
                fontWeight={600}
                letterSpacing={-2}
                strokeWidth={1.2}
                strokeColor={colors.highlight}
                fillColor={colors.ink}
                drawDuration={1.4}
                fillDelay={0.15}
                stagger={0.04}
                trigger="mount"
                fillMode="wipe"
              />
            </h1>

            <motion.div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base sm:text-lg font-light mb-6" {...fadeUp(0.55)}>
              <span className="text-ink font-medium">Ph.D. Student</span>
              {/* Below lg the rotating phrase can't always fit beside the title, so
                  it gets its own line; otherwise it would hop between lines as the
                  phrase length changes. */}
              <span className="text-muted hidden lg:inline">·</span>
              <span className="flex items-center gap-x-2 text-sm sm:text-base basis-full lg:basis-auto">
                <span className="text-muted">Studying</span>
                <RotatingText
                  texts={['Business Process Management', 'Process-Aware Agentic Systems', 'Deep Learning for BPM']}
                  className="text-highlight font-medium"
                />
              </span>
            </motion.div>

            <motion.div className="flex flex-col gap-3 mb-4" {...fadeUp(0.7)}>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-highlight text-lg mt-0.5 shrink-0">▸</span>
                <div>
                  <div className="text-body font-medium">Ph.D. in Computer Science <span className="text-muted font-normal">(2026.08 ~ Present)</span></div>
                  <div className="text-muted">Hasso Plattner Institute (Universität Potsdam), Potsdam, Germany</div>
                </div>
              </div>
              {/* <div className="flex items-start gap-2 text-sm">
                <span className="text-muted text-lg mt-0.5 shrink-0">▸</span>
                <div>
                  <div className="text-body font-medium">Associate Research Engineer <span className="text-muted font-normal">(2026.03 ~ 2026.06)</span></div>
                  <div className="text-muted">Industrial Artificial Intelligence Research Institute, Busan, South Korea</div>
                </div>
              </div> */}
              <div className="flex items-start gap-2 text-sm">
                <span className="text-muted text-lg mt-0.5 shrink-0">▸</span>
                <div>
                  <div className="text-body font-medium">M.Sc. in Industrial Data Science &amp; Engineering <span className="text-muted font-normal">(2024.03 ~ 2026.02)</span></div>
                  <div className="text-muted">Pusan National University, Busan, South Korea</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-muted text-lg mt-0.5 shrink-0">▸</span>
                <div>
                  <div className="text-body font-medium">B.Sc. in Industrial Engineering <span className="text-muted font-normal">(2018.03 ~ 2024.02)</span></div>
                  <div className="text-muted">Pusan National University, Busan, South Korea</div>
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
          {/* The glitch field spills past this box via `spread` so it can be large
              without widening the column and squeezing the bio text. */}
          <div className="relative" style={{ width: 260, height: 370 }}>
            <LetterGlitch spread={80} fadeColor={colors.bg} />
            <div className="absolute inset-0 flex items-center justify-center">
              <HoloCard />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Where I've Been */}
      <motion.div className="mt-6 mb-20" {...fadeUp(1.0)}>
        {/* The rules sit inline with the label, so the row is exactly as tall
            as the text and the gallery below keeps its position. They fade out
            towards the edges to pull the eye to the centre. */}
        <div className="flex items-center gap-4 mb-2">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-ink/20" />
          <p className="font-mono text-xl font-bold tracking-widest whitespace-nowrap">
            <span className="text-highlight">LEE</span>
            <span className="text-ink">vent Log</span>
          </p>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-ink/20" />
        </div>
        <div style={{ height: '280px' }}>
          <CircularGallery
            items={[
              { image: '/assets/special/Daejeon.webp', text: 'Daejeon', caption: 'born and raised'},
              { image: '/assets/special/Shanghai.webp', text: 'Shanghai', caption: 'with my brother'},
              { image: '/assets/special/Hongkong.webp', text: 'Hong Kong', caption: 'with city lights'},
              { image: '/assets/special/Lijiang.webp', text: 'Lijiang', caption: 'with my dad' },
              { image: '/assets/special/Bogota.webp', text: 'Bogotá', caption: 'with traditional clothes' },
              { image: '/assets/special/Rome.webp', text: 'Rome', caption: "in St. Peter's Basilica" },
              { image: '/assets/special/(Hala) Madrid.webp', text: 'Madrid', caption: 'Hala Madrid!!' },
              { image: '/assets/special/Paris.webp', text: 'Paris', caption: "Ici c'est Paris!!" },
              { image: '/assets/special/Toledo.webp', text: 'Toledo', caption: 'with Prof. Bae' },
              { image: '/assets/special/Granada.webp', text: 'Granada', caption: 'photo by Dohee 👍' },
              { image: '/assets/special/Osaka.webp', text: 'Osaka', caption: 'photo by my mom' },
              { image: '/assets/special/Jeju.webp', text: 'Jeju', caption: 'with my colleagues' },
              { image: '/assets/special/Seoul.webp', text: 'Seoul', caption: 'photo by Younghoon' },
              { image: '/assets/special/Army.webp', text: 'Military', caption: 'with Seungjoon' },
              { image: '/assets/special/BPM Conference.webp', text: 'BPM2025', caption: 'with BPM community' },
              { image: '/assets/special/ICPR Conference.webp', text: 'ICPR28', caption: 'photo by Eunhee' },
              { image: '/assets/special/LOGMS2023.webp', text: 'LOGMS2023', caption: 'first conference' },
              { image: '/assets/special/macao.webp', text: 'Macao', caption: "Taekhyun's presentation" },
              { image: '/assets/special/Graduation (BSc).webp', text: 'B.Sc.', caption: 'become a graduate' },
              { image: '/assets/special/Graduation(MSc).webp', text: 'M.Sc.', caption: 'become a researcher' },
              { image: '/assets/special/Berlin.webp', text: 'Berlin', caption: 'come to study' },
              { image: '/assets/special/Prague.webp', text: 'Prague', caption: 'with my brother' },
              { image: '/assets/special/Dresden.webp', text: 'Dresden', caption: 'watch world cup' },
            ]}
            bend={3}
            textColor={colors.ink}
            captionColor={colors.muted}
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
