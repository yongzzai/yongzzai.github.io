import { Pager } from './Pager'
import { Motto } from './Motto'
import { Hero } from './Hero'
import { Journey } from './Journey'
import { Footer } from './Footer'
import { ResearchStatement } from './ResearchStatement'
import { Research } from './Research'
import { Conferences } from './Conferences'
import { Publications } from './Publications'

// The whole site is one page of swiped pages, in the order of PAGES in
// lib/pages.js (the dock and the URLs follow that list).
export function Home() {
  return (
    <Pager>
      <>
        <Motto />
        <Hero />
        <Journey />
        <Footer />
      </>
      <ResearchStatement />
      <Research />
      <Conferences />
      <Publications />
    </Pager>
  )
}
