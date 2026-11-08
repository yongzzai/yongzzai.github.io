import { statement } from '../data/statement'
import { BlurFade } from './ui/BlurFade'
import { Pending } from './ui/Pending'
import { Rich } from './ui/Rich'

// The Research page. It is in the dock either way, so until the statement is
// written the live site says so instead of showing an empty page (the dev
// server points to the file to fill in).
export function ResearchStatement() {
  return (
    <section id="research" className="py-24 max-w-5xl mx-auto px-6">
      <BlurFade>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink mb-12">Research Statement</h2>
      </BlurFade>
      {statement.length ? (
        <div className="max-w-[68ch] space-y-4 text-[17px] leading-relaxed text-body">
          {statement.map((paragraph, i) => (
            <BlurFade key={i} delay={i * 0.05}>
              <p>
                <Rich text={paragraph} />
              </p>
            </BlurFade>
          ))}
        </div>
      ) : import.meta.env.DEV ? (
        <Pending file="src/data/statement.js" />
      ) : (
        <p className="text-base text-muted">Coming soon.</p>
      )}
    </section>
  )
}
