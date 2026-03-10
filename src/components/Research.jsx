import { projects } from '../data/projects'
import { BlurFade } from './ui/BlurFade'
import { SpotlightCard } from './ui/SpotlightCard'

export function Research() {
  return (
    <section id="research" className="py-24 max-w-5xl mx-auto px-6">
      <BlurFade>
        <p className="font-mono text-xs text-mono uppercase tracking-widest mb-3">
          01 — Projects
        </p>
        <h2 className="text-3xl font-semibold text-ink mb-12">Projects</h2>
      </BlurFade>

      <div className="flex flex-col gap-4">
        {projects.map((project, i) => (
          <BlurFade key={i} delay={i * 0.1}>
            <SpotlightCard className="border border-border rounded-xl bg-surface p-6 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <h3 className="text-sm font-semibold text-ink leading-snug">{project.title}</h3>
                <p className="font-mono text-xs text-mono shrink-0">{project.period}</p>
              </div>
              <p className="text-sm text-muted leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-xs bg-bg border border-border rounded-full text-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </BlurFade>
        ))}
      </div>
    </section>
  )
}
