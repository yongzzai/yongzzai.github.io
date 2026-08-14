import { Link } from 'react-router-dom'
import { BlurFade } from './ui/BlurFade'

export function NotFound() {
  return (
    <section className="pt-40 pb-24 max-w-5xl mx-auto px-6">
      <BlurFade>
        <p className="font-mono text-xs text-mono uppercase tracking-widest mb-3">404</p>
        <h2 className="text-3xl font-semibold text-ink mb-4">Page not found</h2>
        <p className="text-sm text-muted mb-8">
          That URL doesn&apos;t exist. Try one of these instead.
        </p>
        <nav className="flex flex-wrap gap-3">
          {[
            { to: '/', label: 'Home' },
            { to: '/proj', label: 'Projects' },
            { to: '/pubs', label: 'Publications' },
            { to: '/conf', label: 'Conferences' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="px-4 py-2 text-sm border border-border rounded-full bg-surface text-body hover:text-ink transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </BlurFade>
    </section>
  )
}
