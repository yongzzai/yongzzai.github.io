import { conferences } from '../data/conferences'
import { groupByYear, splitYear, withStagger } from '../lib/year'
import { BlurFade } from './ui/BlurFade'
import { YearHeading } from './ui/YearHeading'

export function Conferences() {
  const sections = withStagger(groupByYear(conferences))

  return (
    <section id="conferences" className="py-24 max-w-5xl mx-auto px-6">
      <BlurFade>
        <h2 className="text-3xl font-semibold text-ink mb-2">Conference Presentations</h2>
        <p className="text-xs text-muted mb-12">* Presenter only</p>
      </BlurFade>

      <div className="space-y-14">
        {sections.map(({ year, headingDelay, rows }) => (
          <div key={year}>
            <BlurFade delay={headingDelay}>
              <YearHeading year={year} count={rows.length} unit="presentation" />
            </BlurFade>

            <ol className="space-y-4">
              {rows.map(({ item, delay }) => (
                <BlurFade key={item.title} delay={delay}>
                  <li className="grid grid-cols-1 sm:grid-cols-[6rem_1fr] gap-1 sm:gap-6 border-b border-border pb-4 last:border-0">
                    <div className="font-mono text-xs text-mono pt-1 leading-snug sm:whitespace-pre-line">
                      {splitYear(item.year).month}
                      {'\n'}
                      {item.venue_short}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-ink leading-snug">{item.title}</h4>
                      <p className="text-sm text-muted italic">{item.venue}</p>
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
