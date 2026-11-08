import { Link } from 'react-router-dom'
import { BlurFade } from './ui/BlurFade'
import { PAGES, hashForPage } from '../lib/pages'

export function NotFound() {
  return (
    <section className="pt-40 pb-40 max-w-5xl mx-auto px-6">
      <BlurFade>
        <p className="font-mono text-sm text-mono uppercase tracking-widest mb-3">404</p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink mb-4">Page not found</h2>
        <p className="text-base text-muted mb-8">
          That URL doesn&apos;t exist. Try one of these instead.
        </p>
        <nav className="flex flex-wrap gap-3">
          {PAGES.map(({ label }, i) => ({ to: `/${hashForPage(i)}`, label })).map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="px-4 py-2 text-base border border-border rounded-full bg-surface text-body hover:text-ink transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </BlurFade>
    </section>
  )
}
