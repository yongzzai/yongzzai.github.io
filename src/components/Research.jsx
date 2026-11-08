import { projects } from '../data/projects'
import { BlurFade } from './ui/BlurFade'
import { SpotlightCard } from './ui/SpotlightCard'

export function Research() {
  return (
    <section id="projects" className="py-24 max-w-5xl mx-auto px-6">
      <BlurFade>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink mb-12">Projects</h2>
      </BlurFade>

      <div className="flex flex-col gap-4">
        {projects.map((project, i) => (
          <BlurFade key={i} delay={i * 0.1}>
            <SpotlightCard className="border border-border rounded-xl bg-surface p-6 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <h3 className="text-base font-semibold text-ink leading-snug">{project.title}</h3>
                <p className="font-mono text-sm text-mono shrink-0">{project.period}</p>
              </div>
              <p className="text-base text-muted leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-sm bg-bg border border-border rounded-full text-mono">
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
