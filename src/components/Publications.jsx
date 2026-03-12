import { publications } from '../data/publications'
import { BlurFade } from './ui/BlurFade'

export function Publications() {
  return (
    <section id="publications" className="py-24 max-w-5xl mx-auto px-6">
      <BlurFade>
        <p className="font-mono text-xs text-mono uppercase tracking-widest mb-3">
          02 — Publications
        </p>
        <h2 className="text-3xl font-semibold text-ink mb-2">Publications</h2>
        <p className="text-xs text-muted mb-12">* Excluding Korean Publications</p>
      </BlurFade>

      <ol className="space-y-4">
        {publications.map((pub, i) => (
          <BlurFade key={i} delay={i * 0.08}>
            <li className="grid grid-cols-1 sm:grid-cols-[5rem_1fr] gap-1 sm:gap-6 border-b border-border pb-4 last:border-0">
              <span className="font-mono text-xs text-mono pt-1 leading-snug">{pub.year}</span>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-ink leading-snug">{pub.title}</h3>
                <p className="text-sm text-muted italic">{pub.venue}</p>
                <p className="text-sm text-muted">{pub.authors}</p>
              </div>
            </li>
          </BlurFade>
        ))}
      </ol>
    </section>
  )
}
