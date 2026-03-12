import { conferences } from '../data/conferences'
import { BlurFade } from './ui/BlurFade'

export function Conferences() {
  return (
    <section id="conferences" className="py-24 max-w-5xl mx-auto px-6">
      <BlurFade>
        <p className="font-mono text-xs text-mono uppercase tracking-widest mb-3">
          03 — Conferences
        </p>
        <h2 className="text-3xl font-semibold text-ink mb-2">Conference Presentations</h2>
        <p className="text-xs text-muted mb-12">* First-author and presenter only</p>
      </BlurFade>

      <ol className="space-y-4">
        {conferences.map((conf, i) => (
          <BlurFade key={i} delay={i * 0.08}>
            <li className="grid grid-cols-1 sm:grid-cols-[5rem_1fr] gap-1 sm:gap-6 border-b border-border pb-4 last:border-0">
              <div className="font-mono text-xs text-mono pt-1 leading-snug whitespace-pre-line">
                {conf.year}{'\n'}{conf.venue_short}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-ink leading-snug">{conf.title}</h3>
                <p className="text-sm text-muted italic">{conf.venue}</p>
              </div>
            </li>
          </BlurFade>
        ))}
      </ol>
    </section>
  )
}
