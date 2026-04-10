import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { ArrowLeft, Check, Eye, RotateCcw } from 'lucide-react'
import { STORAGE_PREFIX } from '../../config/crosswordStorage'
import ClueCarousel from './ClueCarousel'
import ClueBottomSheet from './ClueBottomSheet'

function buildCellWordMap(words, rows, cols) {
  const map = {}
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      map[`${r},${c}`] = { across: null, down: null }
  words.across.forEach((w) => {
    for (let i = 0; i < w.len; i++)
      map[`${w.row},${w.col + i}`].across = w.num
  })
  words.down.forEach((w) => {
    for (let i = 0; i < w.len; i++)
      map[`${w.row + i},${w.col}`].down = w.num
  })
  return map
}

function getWordCells(words, num, dir) {
  const list = dir === 'across' ? words.across : words.down
  const word = list.find((w) => w.num === num)
  if (!word) return []
  return Array.from({ length: word.len }, (_, i) =>
    dir === 'across' ? [word.row, word.col + i] : [word.row + i, word.col]
  )
}

function loadProgress(puzzleId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + puzzleId)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveProgress(puzzleId, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + puzzleId, JSON.stringify(data))
  } catch {
    // Storage quota exceeded or unavailable
  }
}

const SENTINEL = '\u200B'
const CELL = 38
const BORDER = 2

const DIFF_BADGE_COLOR = {
  easy: 'bg-secondary text-background',
  medium: 'bg-amber-500 text-background',
  hard: 'bg-red-500/20 text-red-300 border border-red-500/40',
}

export default function CrosswordGame({ puzzle, onBack }) {
  const { id, title, difficulty, rows, cols, solution, cellNumbers, words } = puzzle

  const cellWordMap = useMemo(() => buildCellWordMap(words, rows, cols), [words, rows, cols])

  const [userGrid, setUserGrid] = useState(() => {
    const saved = loadProgress(id)
    if (saved?.userGrid) return saved.userGrid
    return Array.from({ length: rows }, () => Array(cols).fill(''))
  })
  const [selected, setSelected] = useState(() => {
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (solution[r][c] !== null) return { row: r, col: c }
    return { row: 0, col: 0 }
  })
  const [direction, setDirection] = useState('across')
  const [checked, setChecked] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [flash, setFlash] = useState(false)
  const [showAllClues, setShowAllClues] = useState(false)
  const inputRef = useRef(null)

  const activeWordNum = selected
    ? cellWordMap[`${selected.row},${selected.col}`]?.[direction]
    : null
  const activeCells = new Set(
    activeWordNum
      ? getWordCells(words, activeWordNum, direction).map(([r, c]) => `${r},${c}`)
      : []
  )

  // Save progress on grid changes
  useEffect(() => {
    const saved = loadProgress(id) || {}
    saveProgress(id, {
      ...saved,
      userGrid,
      startedAt: saved.startedAt || new Date().toISOString(),
      completed: false,
      completedAt: null,
    })
  }, [userGrid, id])

  // Check completion
  useEffect(() => {
    let ok = true
    let any = false
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (solution[r][c] !== null) {
          any = true
          if (userGrid[r][c] !== solution[r][c]) { ok = false }
        }
    if (ok && any && !revealed) {
      setCompleted(true)
      setFlash(true)
      const timer = setTimeout(() => setFlash(false), 2000)
      const saved = loadProgress(id) || {}
      saveProgress(id, { ...saved, userGrid, completed: true, completedAt: new Date().toISOString() })
      return () => clearTimeout(timer)
    } else {
      setCompleted(false)
    }
  }, [userGrid, solution, rows, cols, revealed, id])

  const advance = useCallback((row, col, dir) => {
    const wn = cellWordMap[`${row},${col}`]?.[dir]
    if (!wn) return null
    const list = dir === 'across' ? words.across : words.down
    const word = list.find((w) => w.num === wn)
    if (dir === 'across') {
      const nc = col + 1
      if (nc < word.col + word.len) return { row, col: nc }
    } else {
      const nr = row + 1
      if (nr < word.row + word.len) return { row: nr, col }
    }
    return null
  }, [cellWordMap, words])

  const retreat = useCallback((row, col, dir) => {
    const wn = cellWordMap[`${row},${col}`]?.[dir]
    if (!wn) return null
    const list = dir === 'across' ? words.across : words.down
    const word = list.find((w) => w.num === wn)
    if (dir === 'across') {
      const pc = col - 1
      if (pc >= word.col) return { row, col: pc }
    } else {
      const pr = row - 1
      if (pr >= word.row) return { row: pr, col }
    }
    return null
  }, [cellWordMap, words])

  const handleCellClick = (row, col) => {
    if (solution[row][col] === null) return
    if (selected?.row === row && selected?.col === col) {
      const nd = direction === 'across' ? 'down' : 'across'
      if (cellWordMap[`${row},${col}`]?.[nd]) setDirection(nd)
    } else {
      setSelected({ row, col })
      if (!cellWordMap[`${row},${col}`]?.[direction]) {
        const od = direction === 'across' ? 'down' : 'across'
        if (cellWordMap[`${row},${col}`]?.[od]) setDirection(od)
      }
    }
    setChecked(false)
    inputRef.current?.focus()
  }

  const handleClueClick = (num, dir) => {
    const list = dir === 'across' ? words.across : words.down
    const word = list.find((w) => w.num === num)
    if (word) {
      setSelected({ row: word.row, col: word.col })
      setDirection(dir)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = useCallback(
    (e) => {
      if (!selected) return
      const { row, col } = selected
      if (e.key.match(/^[a-zA-Z]$/) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        if (revealed) return
        const letter = e.key.toUpperCase()
        setUserGrid((prev) => {
          const next = prev.map((r) => [...r])
          next[row][col] = letter
          return next
        })
        const nxt = advance(row, col, direction)
        if (nxt) setSelected(nxt)
        setChecked(false)
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        if (revealed) return
        if (userGrid[row][col]) {
          setUserGrid((prev) => {
            const next = prev.map((r) => [...r])
            next[row][col] = ''
            return next
          })
        } else {
          const prev = retreat(row, col, direction)
          if (prev) {
            setSelected(prev)
            setUserGrid((g) => {
              const next = g.map((r) => [...r])
              next[prev.row][prev.col] = ''
              return next
            })
          }
        }
        setChecked(false)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (direction !== 'across') { setDirection('across'); return }
        if (col + 1 < cols && solution[row][col + 1] !== null)
          setSelected({ row, col: col + 1 })
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (direction !== 'across') { setDirection('across'); return }
        if (col - 1 >= 0 && solution[row][col - 1] !== null)
          setSelected({ row, col: col - 1 })
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (direction !== 'down') { setDirection('down'); return }
        if (row + 1 < rows && solution[row + 1]?.[col] !== null)
          setSelected({ row: row + 1, col })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (direction !== 'down') { setDirection('down'); return }
        if (row - 1 >= 0 && solution[row - 1]?.[col] !== null)
          setSelected({ row: row - 1, col })
      } else if (e.key === 'Tab') {
        e.preventDefault()
        const allWords = [
          ...words.across.map((w) => ({ ...w, dir: 'across' })),
          ...words.down.map((w) => ({ ...w, dir: 'down' })),
        ]
        const ci = allWords.findIndex(
          (w) => w.num === activeWordNum && w.dir === direction
        )
        const ni = e.shiftKey
          ? (ci - 1 + allWords.length) % allWords.length
          : (ci + 1) % allWords.length
        const nw = allWords[ni]
        setSelected({ row: nw.row, col: nw.col })
        setDirection(nw.dir)
      }
    },
    [selected, direction, userGrid, activeWordNum, revealed, words, rows, cols, solution, advance, retreat]
  )

  // Handles mobile input (Android fires onChange instead of onKeyDown with real key)
  const handleMobileInput = useCallback(
    (e) => {
      const val = e.target.value
      if (!selected || revealed) {
        e.target.value = SENTINEL
        return
      }
      const { row, col } = selected
      const cleaned = val.replace(SENTINEL, '')
      if (cleaned.length === 0) {
        // Backspace pressed
        if (userGrid[row][col]) {
          setUserGrid((prev) => {
            const next = prev.map((r) => [...r])
            next[row][col] = ''
            return next
          })
        } else {
          const prev = retreat(row, col, direction)
          if (prev) {
            setSelected(prev)
            setUserGrid((g) => {
              const next = g.map((r) => [...r])
              next[prev.row][prev.col] = ''
              return next
            })
          }
        }
        setChecked(false)
      } else {
        const char = cleaned.slice(-1)
        if (char.match(/[a-zA-Z]/)) {
          const letter = char.toUpperCase()
          setUserGrid((prev) => {
            const next = prev.map((r) => [...r])
            next[row][col] = letter
            return next
          })
          const nxt = advance(row, col, direction)
          if (nxt) setSelected(nxt)
          setChecked(false)
        }
      }
      e.target.value = SENTINEL
    },
    [selected, direction, revealed, userGrid, advance, retreat]
  )

  const handleReveal = () => {
    setRevealed(true)
    setUserGrid(solution.map((row) => row.map((cell) => cell || '')))
    setChecked(false)
    setCompleted(false)
  }

  const handleReset = () => {
    setUserGrid(Array.from({ length: rows }, () => Array(cols).fill('')))
    setChecked(false)
    setRevealed(false)
    setCompleted(false)
    const firstCell = (() => {
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          if (solution[r][c] !== null) return { row: r, col: c }
      return { row: 0, col: 0 }
    })()
    setSelected(firstCell)
    setDirection('across')
    saveProgress(id, { userGrid: Array.from({ length: rows }, () => Array(cols).fill('')), completed: false, startedAt: null, completedAt: null })
  }

  return (
    <div className="pb-24">
      {/* Hidden input — receives focus on cell tap to trigger mobile keyboard */}
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
        defaultValue={SENTINEL}
        onFocus={(e) => { e.target.value = SENTINEL }}
        onKeyDown={handleKeyDown}
        onChange={handleMobileInput}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: -300,
          left: -300,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-surface-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
          aria-label="Back to puzzles"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-white text-lg leading-tight truncate">
            {title}
          </h2>
          <span
            className={`inline-block text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-0.5 ${DIFF_BADGE_COLOR[difficulty]}`}
          >
            {difficulty}
          </span>
        </div>
      </div>

      {/* Completed banner */}
      {completed && (
        <div
          className={`mx-4 mb-3 rounded-xl p-4 text-center border-2 border-green-500 ${flash ? 'animate-pulse' : ''}`}
          style={{ background: 'linear-gradient(135deg, #166534, #15803d)' }}
        >
          <div className="text-2xl mb-1">&#127881;</div>
          <p className="font-display font-bold text-green-300 text-lg">
            Puzzle Complete!
          </p>
          <p className="font-body text-green-200/70 text-xs mt-1">
            Well played, champion!
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="flex flex-col items-center px-4">
        <div className="bg-surface-high/40 rounded-xl p-3 border border-white/10 shadow-xl">
          <div
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="outline-none"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, ${CELL}px)`,
              gridTemplateRows: `repeat(${rows}, ${CELL}px)`,
              gap: BORDER,
              background: '#334155',
              border: `${BORDER}px solid #334155`,
              borderRadius: 4,
              cursor: 'default',
            }}
            aria-label="Crossword grid"
          >
            {Array.from({ length: rows }, (_, row) =>
              Array.from({ length: cols }, (_, col) => {
                const sol = solution[row][col]
                const isBlack = sol === null
                const key = `${row},${col}`
                const num = cellNumbers[key]
                const isSel = selected?.row === row && selected?.col === col
                const isAct = activeCells.has(key)
                const letter = userGrid[row][col]
                const textColor = isBlack
                  ? 'transparent'
                  : checked && letter
                    ? letter === sol ? '#16a34a' : '#dc2626'
                    : isSel ? '#1c1c2e' : isAct ? '#166534' : '#1c1c2e'
                const bg = isBlack
                  ? '#0f172a'
                  : isSel ? '#c3f400' : isAct ? '#d1fae5' : '#f8f9fa'

                return (
                  <div
                    key={key}
                    onClick={() => handleCellClick(row, col)}
                    style={{
                      width: CELL,
                      height: CELL,
                      background: bg,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isBlack ? 'default' : 'pointer',
                      transition: 'background 0.1s',
                      userSelect: 'none',
                    }}
                  >
                    {!isBlack && num && (
                      <span
                        className="font-body"
                        style={{
                          position: 'absolute',
                          top: 2,
                          left: 2,
                          fontSize: 9,
                          fontWeight: 700,
                          color: isSel ? '#3d5c00' : isAct ? '#166534' : '#475569',
                          lineHeight: 1,
                        }}
                      >
                        {num}
                      </span>
                    )}
                    {!isBlack && (
                      <span
                        className="font-body"
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: textColor,
                          lineHeight: 1,
                        }}
                      >
                        {letter}
                      </span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 mt-3">
          <button
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-display text-xs font-bold uppercase tracking-wide transition-colors ${
              checked
                ? 'bg-secondary text-background'
                : 'bg-surface-high text-on-surface-variant border border-white/10 hover:border-white/20'
            }`}
            onClick={() => setChecked((c) => !c)}
          >
            <Check size={14} />
            {checked ? 'Checking' : 'Check'}
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-display text-xs font-bold uppercase tracking-wide bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20 transition-colors"
            onClick={handleReveal}
          >
            <Eye size={14} />
            Reveal
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-display text-xs font-bold uppercase tracking-wide bg-surface-high text-on-surface-variant border border-white/10 hover:border-white/20 transition-colors"
            onClick={handleReset}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
        {checked && !completed && (
          <p className="font-body text-xs text-on-surface-variant mt-2 text-center">
            Green = correct &middot; Red = incorrect
          </p>
        )}
      </div>

      <ClueCarousel
        words={words}
        activeWordNum={activeWordNum}
        direction={direction}
        onDirectionChange={setDirection}
        onClueClick={handleClueClick}
        onViewAll={() => setShowAllClues(true)}
      />

      <ClueBottomSheet
        open={showAllClues}
        words={words}
        activeWordNum={activeWordNum}
        direction={direction}
        onClueClick={handleClueClick}
        onClose={() => setShowAllClues(false)}
      />
    </div>
  )
}
