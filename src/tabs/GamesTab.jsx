// src/tabs/GamesTab.jsx
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import GamesHub from './GamesHub'
import CrosswordSection from './CrosswordSection'
import WordSearchSection from './WordSearchSection'
import HangmanSection from './HangmanSection'

export default function GamesTab() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<GamesHub />} />
        <Route path="/crossword" element={<CrosswordSection />} />
        <Route path="/word-search" element={<WordSearchSection />} />
        <Route path="/hangman" element={<HangmanSection />} />
      </Routes>
    </MemoryRouter>
  )
}
