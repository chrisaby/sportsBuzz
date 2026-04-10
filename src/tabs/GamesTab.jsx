// src/tabs/GamesTab.jsx
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import GamesHub from './GamesHub'
import CrosswordSection from './CrosswordSection'

export default function GamesTab() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<GamesHub />} />
        <Route path="/crossword" element={<CrosswordSection />} />
      </Routes>
    </MemoryRouter>
  )
}
