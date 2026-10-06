import { Hero } from './Hero'
import { Research } from './Research'
import { Conferences } from './Conferences'
import { Publications } from './Publications'

// The whole site is one page; the navbar scrolls to these sections by id
// (see SECTIONS in lib/activeSection.js, which must follow the same order).
export function Home() {
  return (
    <>
      <Hero />
      <Research />
      <Conferences />
      <Publications />
    </>
  )
}
