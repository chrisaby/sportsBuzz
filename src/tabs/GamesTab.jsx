import { useState, useCallback, useMemo } from 'react'
import PuzzleSelectionScreen from '../components/crossword/PuzzleSelectionScreen'
import CrosswordGame from '../components/crossword/CrosswordGame'
import puzzles from '../config/crosswords.json'

const STORAGE_PREFIX = 'cw_progress_'

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
  const [refreshKey, setRefreshKey] = useState(0)

  const progressMap = useMemo(() => loadAllProgress(), [refreshKey])

  const handleSelect = useCallback((puzzle) => {
    setSelectedPuzzle(puzzle)
    setView('game')
  }, [])

  const handleBack = useCallback(() => {
    setSelectedPuzzle(null)
    setView('selection')
    setRefreshKey((k) => k + 1) // refresh progress on return
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
