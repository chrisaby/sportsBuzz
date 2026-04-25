// src/tabs/GamesTab.jsx
import { useEffect } from 'react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import GamesHub from './GamesHub'
import CrosswordSection from './CrosswordSection'
import WordSearchSection from './WordSearchSection'
import HangmanSection from './HangmanSection'

function RouteObserver({ onGameChange }) {
  const { pathname } = useLocation()
  useEffect(() => {
    onGameChange(pathname !== '/')
  }, [pathname, onGameChange])
  return null
}

export default function GamesTab({ onGameChange }) {
  return (
    <MemoryRouter>
      <RouteObserver onGameChange={onGameChange} />
      <Routes>
        <Route path="/" element={<GamesHub />} />
        <Route path="/crossword" element={<CrosswordSection />} />
        <Route path="/word-search" element={<WordSearchSection />} />
        <Route path="/hangman" element={<HangmanSection />} />
      </Routes>
    </MemoryRouter>
  )
}
