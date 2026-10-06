import { useEffect, useState } from 'react'

// The home page's sections in page order, as rendered by Home.jsx. The navbar
// links to them by #id.
export const SECTIONS = [
  { id: 'projects', label: 'Projects' },
  { id: 'conferences', label: 'Conferences' },
  { id: 'publications', label: 'Publications' },
]

// `sections` are { id, top } in page order, `top` being the distance from the
// viewport top. The active one is the last whose top has scrolled past `probe`;
// none while the intro is still in view.
export function pickActiveSection(sections, probe) {
  let active = null
  for (const { id, top } of sections) {
    if (top <= probe) active = id
  }
  return active
}

// Id of the section currently being read, for highlighting it in the navbar.
export function useActiveSection() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const tops = SECTIONS.map(({ id }) => ({
        id,
        top: document.getElementById(id)?.getBoundingClientRect().top ?? Infinity,
      }))
      setActive(pickActiveSection(tops, window.innerHeight * 0.35))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return active
}
