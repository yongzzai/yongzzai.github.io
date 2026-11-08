// Stands in for content that hasn't been written yet; only the dev server
// renders it.
export function Pending({ file }) {
  return (
    <p className="rounded-xl border border-dashed border-border px-5 py-4 text-base text-muted">
      This comes from <code className="font-mono text-sm text-mono">{file}</code>, which is still empty. (This
      note only shows on the dev server.)
    </p>
  )
}

// Whether a section with `items` should render at all: on the live site an
// empty one is left out.
export const shouldShow = (items) => items.length > 0 || import.meta.env.DEV
