import { useState, useCallback } from 'react'
import PuzzleSelectionScreen from '../components/crossword/PuzzleSelectionScreen'
import CrosswordGame from '../components/crossword/CrosswordGame'
import puzzles from '../config/crosswords.json'
import { STORAGE_PREFIX } from '../config/crosswordStorage'

function loadAllProgress() {
  const map = {}
  puzzles.forEach((p) => {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + p.id)
      if (raw) map[p.id] = JSON.parse(raw)
    } catch { /* ignore */ }
  })
  return map
}

export default function GamesTab() {
  const [view, setView] = useState('selection') // 'selection' | 'game'
  const [selectedPuzzle, setSelectedPuzzle] = useState(null)
  const [progressMap, setProgressMap] = useState(() => loadAllProgress())

  const handleSelect = useCallback((puzzle) => {
    setSelectedPuzzle(puzzle)
    setView('game')
  }, [])

  const handleBack = useCallback(() => {
    setSelectedPuzzle(null)
    setView('selection')
    setProgressMap(loadAllProgress()) // refresh progress on return
  }, [])

  if (view === 'game' && selectedPuzzle) {
    return <CrosswordGame puzzle={selectedPuzzle} onBack={handleBack} />
  }

  return (
    <PuzzleSelectionScreen
      puzzles={puzzles}
      progressMap={progressMap}
      onSelect={handleSelect}
    />
  )
}
