import { journey } from '../data/journey'
import { monthDotYear } from '../lib/year'
import { BlurFade } from './ui/BlurFade'
import { Pending, shouldShow } from './ui/Pending'
import { Rich } from './ui/Rich'

// Milestones, newest first, in one running list: the date in its own column
// (as in Publications and Conferences), then what happened, led by its emoji.
export function Journey() {
  if (!shouldShow(journey)) return null

  return (
    <section id="journey" className="max-w-5xl mx-auto px-6 pt-24 pb-8">
      <BlurFade>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink mb-12">Journey</h2>
      </BlurFade>

      {journey.length ? (
        <ol className="space-y-5">
          {journey.map((item, i) => (
            // The cascade stops growing after a few rows, so entries far down
            // the list don't wait long once they scroll into view.
            <BlurFade key={`${item.year} ${item.text}`} delay={Math.min(i, 6) * 0.05}>
              <li className="grid grid-cols-1 sm:grid-cols-[6rem_1fr] gap-1 sm:gap-6">
                <span className="font-mono text-sm text-mono pt-0.5 leading-snug whitespace-nowrap">
                  {monthDotYear(item.year)}
                </span>
                <p className="text-base text-body leading-relaxed">
                  <span className="mr-2" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <Rich text={item.text} />
                </p>
              </li>
            </BlurFade>
          ))}
        </ol>
      ) : (
        <Pending file="src/data/journey.js" />
      )}
    </section>
  )
}
