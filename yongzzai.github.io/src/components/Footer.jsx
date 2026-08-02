import { FaLinkedinIn, FaGithub, FaResearchgate } from 'react-icons/fa'
import { FaGraduationCap } from 'react-icons/fa'

const socials = [
  { icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/yongjae-lee-93b935312/', label: 'LinkedIn' },
  { icon: FaResearchgate, href: 'https://www.researchgate.net/profile/Yongjae-Lee-14', label: 'ResearchGate' },
  { icon: FaGithub, href: 'https://github.com/yongzzai', label: 'GitHub' },
  { icon: FaGraduationCap, href: 'https://scholar.google.com/citations?user=YxFIm0AAAAAJ', label: 'Google Scholar' },
]

export function Footer() {
  return (
    <footer className="py-16 max-w-5xl mx-auto px-6 border-t border-border">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <p className="font-mono text-xs text-mono">
          Yongjae Lee · yongzzai.com
        </p>
        <div className="flex items-center gap-4">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-muted hover:text-ink transition-colors duration-200"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
