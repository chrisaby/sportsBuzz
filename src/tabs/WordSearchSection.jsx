// src/tabs/WordSearchSection.jsx
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import WordSearchHub from './WordSearchHub'
import WordSearchGame from '../components/wordSearch/WordSearchGame'

export default function WordSearchSection() {
  const navigate = useNavigate()
  const [view, setView] = useState('hub')
  const [selectedPuzzle, setSelectedPuzzle] = useState(null)

  const handleSelect = useCallback((puzzle) => {
    setSelectedPuzzle(puzzle)
    setView('game')
  }, [])

  const handleBackToHub = useCallback(() => {
    setSelectedPuzzle(null)
    setView('hub')
  }, [])

  const handleBackToGames = useCallback(() => {
    navigate('/')
  }, [navigate])

  if (view === 'game' && selectedPuzzle) {
    return <WordSearchGame puzzle={selectedPuzzle} onBack={handleBackToHub} />
  }

  return <WordSearchHub onSelect={handleSelect} onBack={handleBackToGames} />
}
