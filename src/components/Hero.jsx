import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaLinkedinIn, FaGithub, FaResearchgate, FaFilePdf } from 'react-icons/fa'
import { FaGraduationCap } from 'react-icons/fa'
import StrokeText from './ui/StrokeText'
import { RotatingText } from './ui/RotatingText'
import DepthCarousel from './ui/DepthCarousel'
import { useThemeColors } from '../lib/theme'

const socials = [
  { icon: FaGraduationCap, href: 'https://scholar.google.com/citations?user=YxFIm0AAAAAJ', label: 'Google Scholar', hoverColor: '#4285F4' },
  { icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/yongjae-lee-93b935312/', label: 'LinkedIn', hoverColor: '#1d7fb4' },
  { icon: FaResearchgate, href: 'https://www.researchgate.net/profile/Yongjae-Lee-14', label: 'ResearchGate', hoverColor: '#00CCBB', iconSize: 22 },
  { icon: FaGithub, href: 'https://github.com/yongzzai', label: 'GitHub', hoverColor: '#8b5cf6' },
]

// Photos in the LEEvent Log carousel, profile photo first; the caption under
// it shows the front one.
const EVENT_LOG = [
  { image: '/assets/photo_yj.jpg', title: 'Yongjae Lee' },
  { image: '/assets/special/Daejeon.webp', title: 'Daejeon', subtitle: 'born and raised' },
  { image: '/assets/special/Shanghai.webp', title: 'Shanghai', subtitle: 'with my brother' },
  { image: '/assets/special/Hongkong.webp', title: 'Hong Kong', subtitle: 'with city lights' },
  { image: '/assets/special/Lijiang.webp', title: 'Lijiang', subtitle: 'with my dad' },
  { image: '/assets/special/Bogota.webp', title: 'Bogotá', subtitle: 'with traditional clothes' },
  { image: '/assets/special/Rome.webp', title: 'Rome', subtitle: "in St. Peter's Basilica" },
  { image: '/assets/special/(Hala) Madrid.webp', title: 'Madrid', subtitle: 'Hala Madrid!!' },
  { image: '/assets/special/Paris.webp', title: 'Paris', subtitle: "Ici c'est Paris!!" },
  { image: '/assets/special/Toledo.webp', title: 'Toledo', subtitle: 'with Prof. Bae' },
  { image: '/assets/special/Granada.webp', title: 'Granada', subtitle: 'photo by Dohee 👍' },
  { image: '/assets/special/Osaka.webp', title: 'Osaka', subtitle: 'photo by my mom' },
  { image: '/assets/special/Jeju.webp', title: 'Jeju', subtitle: 'with my colleagues' },
  { image: '/assets/special/Seoul.webp', title: 'Seoul', subtitle: 'photo by Younghoon' },
  { image: '/assets/special/Army.webp', title: 'Military', subtitle: 'with Seungjoon' },
  { image: '/assets/special/BPM Conference.webp', title: 'BPM2025', subtitle: 'with BPM community' },
  { image: '/assets/special/ICPR Conference.webp', title: 'ICPR28', subtitle: 'photo by Eunhee' },
  { image: '/assets/special/LOGMS2023.webp', title: 'LOGMS2023', subtitle: 'first conference' },
  { image: '/assets/special/macao.webp', title: 'Macao', subtitle: "Taekhyun's presentation" },
  { image: '/assets/special/Graduation (BSc).webp', title: 'B.Sc.', subtitle: 'become a graduate' },
  { image: '/assets/special/Graduation(MSc).webp', title: 'M.Sc.', subtitle: 'become a researcher' },
  { image: '/assets/special/Berlin.webp', title: 'Berlin', subtitle: 'come to study' },
  { image: '/assets/special/Prague.webp', title: 'Prague', subtitle: 'with my brother' },
  { image: '/assets/special/Dresden.webp', title: 'Dresden', subtitle: 'watch world cup' },
]
const EVENT_SLIDES = EVENT_LOG.map(({ image, title, subtitle }) => ({
  image,
  alt: subtitle ? `${title}, ${subtitle}` : title,
}))

function AboutLeeButton() {
  return (
    <a
      href="/assets/cv.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium border border-ink text-ink bg-transparent rounded transition-all duration-300"
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
  const [eventIndex, setEventIndex] = useState(0)
  const event = EVENT_LOG[eventIndex]

  return (
    <section className="max-w-5xl mx-auto px-6 pt-24">
      <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">
        {/* Left: text */}
        <div className="flex flex-col justify-between lg:min-h-[384px]">
          <div>
            {/* StrokeText draws its own SVG type, so the size lives in props
                rather than in Tailwind text-* classes. */}
            <h1 className="mb-5">
              <StrokeText
                text="Yongjae Lee"
                fontSize={72}
                fontWeight={400}
                letterSpacing={-1}
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

            <motion.div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-lg sm:text-xl font-light mb-6" {...fadeUp(0.55)}>
              <span className="text-ink font-medium">Ph.D. Student</span>
              {/* Below lg the rotating phrase can't always fit beside the title, so
                  it gets its own line; otherwise it would hop between lines as the
                  phrase length changes. */}
              <span className="text-muted hidden lg:inline">·</span>
              <span className="flex items-center gap-x-2 text-base sm:text-lg basis-full lg:basis-auto">
                <span className="text-muted">Studying</span>
                <RotatingText
                  texts={['Business Process Management', 'Process-Aware Agentic Systems', 'Deep Learning for BPM']}
                  className="text-highlight font-medium"
                />
              </span>
            </motion.div>

            <motion.div className="flex flex-col gap-3 mb-4" {...fadeUp(0.7)}>
              <div className="flex items-start gap-2 text-base">
                <span className="text-highlight text-xl mt-0.5 shrink-0">▸</span>
                <div>
                  <div className="text-body font-bold">Ph.D. in Computer Science <span className="text-muted font-normal">(2026.08 ~ Present)</span></div>
                  <div className="text-muted">Hasso Plattner Institute (Universität Potsdam), Potsdam, Germany</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-base">
                <span className="text-muted text-xl mt-0.5 shrink-0">▸</span>
                <div>
                  <div className="text-body font-bold">M.Sc. in Industrial Data Science &amp; Engineering <span className="text-muted font-normal">(2024.03 ~ 2026.02)</span></div>
                  <div className="text-muted">Pusan National University, Busan, South Korea</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-base">
                <span className="text-muted text-xl mt-0.5 shrink-0">▸</span>
                <div>
                  <div className="text-body font-bold">B.Sc. in Industrial Engineering <span className="text-muted font-normal">(2018.03 ~ 2024.02)</span></div>
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

        {/* Right: the LEEvent Log, profile photo first. In the single-column
            layout below lg it moves above the bio. */}
        <motion.div
          className="order-first lg:order-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          {/* Shorter below lg, where it sits above the bio, so the cards
              shrink with it and don't take over a phone screen. */}
          <div className="h-[220px] lg:h-[340px]">
            <DepthCarousel
              items={EVENT_SLIDES}
              cardWidth={240}
              cardHeight={320}
              spread={50}
              showIndicators={false}
              onChange={setEventIndex}
            />
          </div>
          <div className="mt-2 text-center" aria-live="polite">
            <p className="text-base font-medium text-ink">{event.title}</p>
            {/* A blank line when there is no caption keeps the block from jumping. */}
            <p className="text-sm text-muted">{event.subtitle ?? '\u00a0'}</p>
            <p className="mt-1 font-mono text-xs text-mono">
              <span className="text-highlight">LEE</span>vent Log · {String(eventIndex + 1).padStart(2, '0')} /{' '}
              {EVENT_LOG.length}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
