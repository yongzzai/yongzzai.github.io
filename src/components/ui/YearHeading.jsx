// Shared so the Publications and Conferences sections read as the same system.
export function YearHeading({ year, count, unit }) {
  return (
    <div className="flex items-baseline gap-3 border-b-2 border-ink pb-2 mb-6">
      <h3 className="font-mono text-3xl font-bold text-ink leading-none tracking-tight">{year}</h3>
      <span className="font-mono text-xs text-mono">
        {count} {unit}
        {count === 1 ? '' : 's'}
      </span>
    </div>
  )
}
