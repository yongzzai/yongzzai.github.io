export function DotMatrixBg() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        opacity: 0.045,
      }}
    />
  )
}
