// src/components/wordSearch/WordSearchGame.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import WordGrid, { findWordInGrid, buildCells, cellKey } from './WordGrid'
import WordChips from './WordChips'
import { STORAGE_PREFIX } from '../../config/wordSearchStorage'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function loadProgress(id) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + id)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveProgress(id, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(data))
  } catch { /* ignore */ }
}

export default function WordSearchGame({ puzzle, onBack }) {
  // Pre-compute word positions
  const wordPositions = useRef(
    puzzle.words.reduce((acc, word) => {
      const pos = findWordInGrid(puzzle.grid, word)
      if (pos) acc[word] = pos
      return acc
    }, {})
  )

  const [timeLeft, setTimeLeft] = useState(puzzle.timeSeconds)
  const [score, setScore] = useState(0)
  const [momentum, setMomentum] = useState(0)
  const [foundWords, setFoundWords] = useState(new Set())
  const [foundCells, setFoundCells] = useState(new Set())
  const [selectionCells, setSelectionCells] = useState(new Set())
  const [missedCells, setMissedCells] = useState(new Set())
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const dragStart = useRef(null)
  const dragDir = useRef(null)
  const dragPath = useRef([])
  const foundWordsRef = useRef(new Set())

  // Timer + momentum decay
  useEffect(() => {
    if (gameOver) return
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true)
          return 0
        }
        return t - 1
      })
      setMomentum((m) => Math.max(0, m - 0.05))
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [gameOver])

  // Save on game over
  useEffect(() => {
    if (!gameOver) return
    const prev = loadProgress(puzzle.id)
    const bestScore = Math.max(score, prev?.bestScore ?? 0)
    saveProgress(puzzle.id, {
      wordsFound: [...foundWords],
      bestScore,
      completed: foundWords.size === puzzle.words.length,
      totalAttempts,
    })
  }, [gameOver]) // eslint-disable-line react-hooks/exhaustive-deps

  // All words found → game over
  useEffect(() => {
    if (foundWords.size > 0 && foundWords.size === puzzle.words.length) {
      setGameOver(true)
    }
  }, [foundWords, puzzle.words.length])

  const getCellFromTouch = useCallback((touch) => {
    const el = document.elementFromPoint(touch.clientX, touch.clientY)
    const cell = el?.closest('[data-cell]')
    if (!cell) return null
    return { row: parseInt(cell.dataset.row), col: parseInt(cell.dataset.col) }
  }, [])

  const computeDir = (from, to) => {
    const dr = Math.sign(to.row - from.row)
    const dc = Math.sign(to.col - from.col)
    if (dr === 0 && dc === 0) return null
    return { dr, dc }
  }

  const buildPath = useCallback((start, dir, current) => {
    const path = []
    let r = start.row
    let c = start.col
    while (true) {
      path.push({ row: r, col: c })
      if (r === current.row && c === current.col) break
      r += dir.dr
      c += dir.dc
      if (r < 0 || r >= puzzle.grid.length || c < 0 || c >= puzzle.grid[0].length) break
    }
    return path
  }, [puzzle.grid])

  const onTouchStart = useCallback((e) => {
    if (gameOver) return
    const cell = getCellFromTouch(e.touches[0])
    if (!cell) return
    dragStart.current = cell
    dragDir.current = null
    dragPath.current = [cell]
    setSelectionCells(new Set([cellKey(cell.row, cell.col)]))
  }, [gameOver, getCellFromTouch])

  const onTouchMove = useCallback((e) => {
    if (!dragStart.current || gameOver) return
    const cell = getCellFromTouch(e.touches[0])
    if (!cell) return

    const dir = computeDir(dragStart.current, cell)
    if (!dir) return

    if (!dragDir.current) dragDir.current = dir
    if (dragDir.current.dr !== dir.dr || dragDir.current.dc !== dir.dc) return

    const path = buildPath(dragStart.current, dragDir.current, cell)
    dragPath.current = path
    setSelectionCells(new Set(path.map((p) => cellKey(p.row, p.col))))
  }, [gameOver, getCellFromTouch, buildPath])

  const onTouchEnd = useCallback(() => {
    if (!dragStart.current || gameOver) return

    const path = dragPath.current
    const selected = path.map((p) => puzzle.grid[p.row][p.col]).join('')
    const reversed = selected.split('').reverse().join('')

    setTotalAttempts((n) => n + 1)

    const matched = puzzle.words.find(
      (w) => !foundWordsRef.current.has(w) && (w === selected || w === reversed)
    )

    if (matched) {
      const pos = wordPositions.current[matched]
      if (pos) {
        const cells = buildCells(pos.startRow, pos.startCol, pos.dx, pos.dy, matched.length)
        setFoundCells((prev) => {
          const next = new Set(prev)
          cells.forEach((c) => next.add(cellKey(c.row, c.col)))
          return next
        })
      }
      setFoundWords((prev) => {
        const next = new Set([...prev, matched])
        foundWordsRef.current = next
        return next
      })
      const multiplier = momentum >= 0.8 ? 1.5 : 1.0
      setScore((s) => s + matched.length * 100 * multiplier + timeLeft * 2)
      setMomentum((m) => Math.min(1, m + 0.3))
    } else {
      // flash missed
      const missedSet = new Set(path.map((p) => cellKey(p.row, p.col)))
      setMissedCells(missedSet)
      setTimeout(() => setMissedCells(new Set()), 400)
    }

    dragStart.current = null
    dragDir.current = null
    dragPath.current = []
    setSelectionCells(new Set())
  }, [gameOver, momentum, timeLeft, puzzle]) // eslint-disable-line react-hooks/exhaustive-deps

  const resetGame = useCallback(() => {
    setTimeLeft(puzzle.timeSeconds)
    setScore(0)
    setMomentum(0)
    setFoundWords(new Set())
    setFoundCells(new Set())
    setSelectionCells(new Set())
    setMissedCells(new Set())
    setTotalAttempts(0)
    setGameOver(false)
    dragStart.current = null
    dragDir.current = null
    dragPath.current = []
    foundWordsRef.current = new Set()
  }, [puzzle.timeSeconds])

  const momentumPct = Math.round(momentum * 100)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3">
        <button onClick={onBack} className="text-white p-1">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <p className="text-xs font-display font-bold uppercase tracking-widest text-secondary">
            Velocity Word Search
          </p>
        </div>
        <p className={`font-display font-bold text-lg tabular-nums ${timeLeft <= 30 ? 'text-red-400' : 'text-white'}`}>
          {formatTime(timeLeft)}
        </p>
      </div>

      {/* Score strip */}
      <div className="flex items-center justify-between px-4 pb-3">
        <p className="font-display font-bold text-secondary text-xl tabular-nums">{Math.round(score)}</p>
        <p className="text-xs font-display font-semibold uppercase tracking-wider text-on-surface-variant">{puzzle.title}</p>
      </div>

      {/* Grid */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <WordGrid
          grid={puzzle.grid}
          foundCells={foundCells}
          selectionCells={selectionCells}
          missedCells={missedCells}
        />
      </div>

      {/* Word chips */}
      <WordChips words={puzzle.words} foundWords={foundWords} />

      {/* Momentum bar */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-display font-bold uppercase tracking-widest text-on-surface-variant">
            Momentum Bonus
          </p>
          {momentum >= 0.8 && (
            <p className="text-xs font-display font-bold text-secondary">X1.5 BOOST</p>
          )}
        </div>
        <div className="h-1.5 bg-surface-high rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${momentum >= 0.8 ? 'bg-green-400' : 'bg-blue-400'}`}
            style={{ width: `${momentumPct}%` }}
          />
        </div>
      </div>

      {/* Game Over overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center z-50 px-8">
          <p className="text-secondary font-display font-bold text-xs uppercase tracking-widest mb-2">
            {foundWords.size === puzzle.words.length ? 'Puzzle Complete!' : 'Time\'s Up!'}
          </p>
          <p className="text-white font-display font-bold text-5xl mb-1 tabular-nums">{Math.round(score)}</p>
          <p className="text-on-surface-variant font-body text-sm mb-8">
            {foundWords.size} / {puzzle.words.length} words found
          </p>
          <button
            onClick={resetGame}
            className="w-full bg-secondary text-background font-display font-bold py-3 rounded-xl mb-3"
          >
            Play Again
          </button>
          <button
            onClick={onBack}
            className="w-full bg-surface-high text-white font-display font-bold py-3 rounded-xl"
          >
            Back to Hub
          </button>
        </div>
      )}
    </div>
  )
}
