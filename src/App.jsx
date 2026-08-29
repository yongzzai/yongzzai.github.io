import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Hero } from './components/Hero'
import { Research } from './components/Research'
import { Publications } from './components/Publications'
import { Conferences } from './components/Conferences'
import { NotFound } from './components/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Hero />} />
        <Route path="proj" element={<Research />} />
        <Route path="pubs" element={<Publications />} />
        <Route path="conf" element={<Conferences />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
