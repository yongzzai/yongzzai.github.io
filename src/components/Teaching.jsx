import { teaching } from '../data/teaching'
import { BlurFade } from './ui/BlurFade'

export function Teaching() {
  return (
    <section id="teaching" className="py-24 max-w-5xl mx-auto px-6">
      <BlurFade>
        <p className="font-mono text-xs text-mono uppercase tracking-widest mb-3">
          04 — Teaching
        </p>
        <h2 className="text-3xl font-semibold text-ink mb-12">Teaching</h2>
      </BlurFade>

      <ul className="space-y-4">
        {teaching.map((item, i) => (
          <BlurFade key={i} delay={i * 0.08}>
            <li className="grid grid-cols-[8rem_1fr] gap-6 border-b border-border pb-4 last:border-0">
              <span className="font-mono text-xs text-mono pt-1 leading-snug">{item.period}</span>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-ink">{item.role}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            </li>
          </BlurFade>
        ))}
      </ul>
    </section>
  )
}
