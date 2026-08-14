import { publications } from '../data/publications'
import { groupByYear, splitYear, withStagger } from '../lib/year'
import { BlurFade } from './ui/BlurFade'
import { YearHeading } from './ui/YearHeading'

export function Publications() {
  const sections = withStagger(groupByYear(publications))

  return (
    <section id="publications" className="py-24 max-w-5xl mx-auto px-6">
      <BlurFade>
        <h2 className="text-3xl font-semibold text-ink mb-2">Publications</h2>
        <p className="text-xs text-muted mb-12">* Excluding Korean Publications</p>
      </BlurFade>

      <div className="space-y-14">
        {sections.map(({ year, headingDelay, rows }) => (
          <div key={year}>
            <BlurFade delay={headingDelay}>
              <YearHeading year={year} count={rows.length} unit="paper" />
            </BlurFade>

            <ol className="space-y-4">
              {rows.map(({ item, delay }) => (
                <BlurFade key={item.id ?? item.title} delay={delay}>
                  <li className="grid grid-cols-1 sm:grid-cols-[6rem_1fr] gap-1 sm:gap-6 border-b border-border pb-4 last:border-0">
                    {/* The year lives in the section heading, so the row only
                        needs the month to stay ordered at a glance. */}
                    <span className="font-mono text-xs text-mono pt-1 leading-snug">
                      {splitYear(item.year).month}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-ink leading-snug">{item.title}</h4>
                      <p className="text-sm text-muted italic">{item.venue}</p>
                      <p className="text-sm text-muted">{item.authors}</p>
                    </div>
                  </li>
                </BlurFade>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  )
}
