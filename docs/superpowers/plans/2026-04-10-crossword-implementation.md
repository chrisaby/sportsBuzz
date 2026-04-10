# Crossword Puzzle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a config-driven crossword puzzle feature to the Games tab with a puzzle selection screen, game engine, and localStorage persistence.

**Architecture:** `GamesTab` manages view state (`selection` | `game`). `PuzzleSelectionScreen` renders puzzle cards from `crosswords.json`. `CrosswordGame` accepts a puzzle config prop and handles all game logic. Progress persists to localStorage keyed by puzzle ID.

**Tech Stack:** React 18, Tailwind CSS, Vite, localStorage

**Spec:** `docs/superpowers/specs/2026-04-10-crossword-design.md`

---

## File Structure

```
src/
  config/
    crosswords.json                      ← NEW: 3 puzzle configs (Easy/Medium/Hard)
  tabs/
    GamesTab.jsx                         ← NEW: view state manager
  components/
    crossword/
      PuzzleSelectionScreen.jsx          ← NEW: selection list UI
      PuzzleCard.jsx                     ← NEW: individual puzzle card
      CrosswordGame.jsx                  ← NEW: game engine
  App.jsx                               ← MODIFY: wire GamesTab to 'games' tab
```

---

### Task 1: Create crosswords.json config

**Files:**
- Create: `src/config/crosswords.json`

- [ ] **Step 1: Create the config file with all 3 puzzles**

Create `src/config/crosswords.json` with the following content. Each puzzle is fully self-contained with its grid, solution, cell numbers, and word definitions.

**Easy puzzle** is adapted from the reference `crossword.jsx` (Cricket & Football, 11x9 grid, 11 words).
**Medium puzzle** is "Court Kings" (Basketball & Tennis, 7x8 grid, 8 words).
**Hard puzzle** is "Legends Arena" (Multi-sport, 8x10 grid, 12 words).

```json
[
  {
    "id": "sports-mix-easy",
    "title": "Sports Mix",
    "difficulty": "easy",
    "estimatedMinutes": 8,
    "description": "Classic cricket and football terms for beginners.",
    "rows": 11,
    "cols": 9,
    "solution": [
      [null,"C","O","R","N","E","R",null,null],
      ["P","E","N","A","L","T","Y",null,null],
      [null,"N",null,null,null,"G","O","A","L"],
      ["S","T","R","I","K","E","R","H",null],
      ["T","U",null,"W","I","C","K","E","T"],
      ["U","R",null,null,null,null,"E","A",null],
      ["M","Y",null,null,null,null,"R","D",null],
      ["P",null,null,null,"F",null,null,"E",null],
      ["S",null,null,null,"O","V","E","R",null],
      [null,null,null,null,"U",null,null,null,null],
      [null,null,null,null,"L",null,null,null,null]
    ],
    "cellNumbers": {
      "0,1": 1, "1,0": 2, "1,6": 3, "2,5": 4,
      "3,0": 5, "3,7": 6, "4,3": 7, "7,4": 8, "8,4": 9
    },
    "words": {
      "across": [
        { "num": 1, "row": 0, "col": 1, "len": 6, "answer": "CORNER", "clue": "Set piece taken from the corner flag in football" },
        { "num": 2, "row": 1, "col": 0, "len": 7, "answer": "PENALTY", "clue": "Spot kick awarded for a foul inside the box" },
        { "num": 4, "row": 2, "col": 5, "len": 4, "answer": "GOAL", "clue": "What a striker aims to score" },
        { "num": 5, "row": 3, "col": 0, "len": 7, "answer": "STRIKER", "clue": "Forward player whose main job is to score goals" },
        { "num": 7, "row": 4, "col": 3, "len": 6, "answer": "WICKET", "clue": "Three stumps and two bails a batsman defends" },
        { "num": 9, "row": 8, "col": 4, "len": 4, "answer": "OVER", "clue": "Six deliveries bowled by one bowler in cricket" }
      ],
      "down": [
        { "num": 1, "row": 0, "col": 1, "len": 7, "answer": "CENTURY", "clue": "A batsman's score of 100 runs" },
        { "num": 3, "row": 1, "col": 6, "len": 6, "answer": "YORKER", "clue": "Delivery aimed at or near the batsman's feet" },
        { "num": 5, "row": 3, "col": 0, "len": 6, "answer": "STUMPS", "clue": "Three upright posts at each end of the pitch" },
        { "num": 6, "row": 3, "col": 7, "len": 6, "answer": "HEADER", "clue": "Scoring or clearing the ball with your head" },
        { "num": 8, "row": 7, "col": 4, "len": 4, "answer": "FOUL", "clue": "An illegal play or infringement of rules" }
      ]
    }
  },
  {
    "id": "court-kings-medium",
    "title": "Court Kings",
    "difficulty": "medium",
    "estimatedMinutes": 12,
    "description": "Basketball and tennis terms for sports fans.",
    "rows": 7,
    "cols": 8,
    "solution": [
      ["A","C","E","B",null,null,null,null],
      [null,null,"M","A","T","C","H",null],
      ["S","M","A","S","H",null,null,null],
      ["D","U","N","K",null,null,null,null],
      [null,null,"S","E","R","V","E",null],
      [null,"N","E","T",null,null,null,null],
      [null,null,"T",null,null,null,null,null]
    ],
    "cellNumbers": {
      "0,0": 1, "0,3": 2, "1,2": 3, "2,0": 4,
      "3,0": 5, "4,2": 6, "5,1": 7
    },
    "words": {
      "across": [
        { "num": 1, "row": 0, "col": 0, "len": 3, "answer": "ACE", "clue": "A serve the opponent cannot return" },
        { "num": 3, "row": 1, "col": 2, "len": 5, "answer": "MATCH", "clue": "A competitive game between two sides" },
        { "num": 4, "row": 2, "col": 0, "len": 5, "answer": "SMASH", "clue": "Powerful overhead shot in tennis or badminton" },
        { "num": 5, "row": 3, "col": 0, "len": 4, "answer": "DUNK", "clue": "Slam the ball through the hoop from above" },
        { "num": 6, "row": 4, "col": 2, "len": 5, "answer": "SERVE", "clue": "Shot that starts each point in tennis" },
        { "num": 7, "row": 5, "col": 1, "len": 3, "answer": "NET", "clue": "Divider stretched across the center of the court" }
      ],
      "down": [
        { "num": 2, "row": 0, "col": 3, "len": 6, "answer": "BASKET", "clue": "The hoop and backboard target in basketball" },
        { "num": 6, "row": 4, "col": 2, "len": 3, "answer": "SET", "clue": "One section of a tennis match, first to six games" }
      ]
    }
  },
  {
    "id": "legends-arena-hard",
    "title": "Legends Arena",
    "difficulty": "hard",
    "estimatedMinutes": 20,
    "description": "Multi-sport challenge for true sports enthusiasts.",
    "rows": 8,
    "cols": 10,
    "solution": [
      ["T","A","C","K","L","E",null,null,null,null],
      ["R",null,null,null,"R","E","C","O","R","D"],
      ["A","S","S","I","S","T",null,null,null,"A"],
      ["C",null,null,null,"P","R","E","L","A","Y"],
      ["K","I","C","K","R",null,null,null,"R",null],
      [null,"S","T","R","I","D","E",null,"E",null],
      [null,null,null,null,"N","M","E","D","A","L"],
      ["P","O","I","N","T",null,null,null,null,null]
    ],
    "cellNumbers": {
      "0,0": 1, "1,4": 2, "1,9": 3, "2,0": 4, "2,4": 5,
      "3,5": 6, "3,8": 7, "4,0": 8, "5,1": 9, "6,5": 10, "7,0": 11
    },
    "words": {
      "across": [
        { "num": 1, "row": 0, "col": 0, "len": 6, "answer": "TACKLE", "clue": "Defensive play to dispossess an opponent of the ball" },
        { "num": 2, "row": 1, "col": 4, "len": 6, "answer": "RECORD", "clue": "A best-ever mark set in an athletic event" },
        { "num": 4, "row": 2, "col": 0, "len": 6, "answer": "ASSIST", "clue": "The pass that directly leads to a goal being scored" },
        { "num": 6, "row": 3, "col": 5, "len": 5, "answer": "RELAY", "clue": "A team race where runners take turns on legs" },
        { "num": 8, "row": 4, "col": 0, "len": 4, "answer": "KICK", "clue": "How a goal is scored from the penalty spot" },
        { "num": 9, "row": 5, "col": 1, "len": 6, "answer": "STRIDE", "clue": "A runner's long rhythmic step during a race" },
        { "num": 10, "row": 6, "col": 5, "len": 5, "answer": "MEDAL", "clue": "Gold, silver, or bronze award at the Olympics" },
        { "num": 11, "row": 7, "col": 0, "len": 5, "answer": "POINT", "clue": "Single unit of scoring in most sports" }
      ],
      "down": [
        { "num": 1, "row": 0, "col": 0, "len": 5, "answer": "TRACK", "clue": "The oval course where sprinters compete" },
        { "num": 5, "row": 2, "col": 4, "len": 6, "answer": "SPRINT", "clue": "A short fast race like the 100 meters" },
        { "num": 7, "row": 3, "col": 8, "len": 4, "answer": "AREA", "clue": "The penalty ___ where fouls give away spot kicks" },
        { "num": 3, "row": 1, "col": 9, "len": 3, "answer": "DAY", "clue": "Match ___, when the big game finally arrives" }
      ]
    }
  }
]
```

- [ ] **Step 2: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/config/crosswords.json','utf8')); console.log('Valid JSON')"`
Expected: `Valid JSON`

- [ ] **Step 3: Commit**

```bash
git add src/config/crosswords.json
git commit -m "feat: add crossword puzzle configs for 3 difficulty levels"
```

---

### Task 2: Create CrosswordGame component

**Files:**
- Create: `src/components/crossword/CrosswordGame.jsx`

This is the core game engine adapted from `crossword.jsx` to accept a puzzle config as a prop instead of hardcoded data.

- [ ] **Step 1: Create the component file**

Create `src/components/crossword/CrosswordGame.jsx`:

```jsx
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { ArrowLeft, Check, Eye, RotateCcw } from 'lucide-react'

const STORAGE_PREFIX = 'cw_progress_'

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
  localStorage.setItem(STORAGE_PREFIX + puzzleId, JSON.stringify(data))
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
    // Find first non-null cell
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
  const gridRef = useRef(null)

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
      setTimeout(() => setFlash(false), 2000)
      const saved = loadProgress(id) || {}
      saveProgress(id, { ...saved, userGrid, completed: true, completedAt: new Date().toISOString() })
    } else {
      setCompleted(false)
    }
  }, [userGrid, solution, rows, cols, revealed, id])

  const advance = (row, col, dir) => {
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
  }

  const retreat = (row, col, dir) => {
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
  }

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
    gridRef.current?.focus()
  }

  const handleClueClick = (num, dir) => {
    const list = dir === 'across' ? words.across : words.down
    const word = list.find((w) => w.num === num)
    if (word) {
      setSelected({ row: word.row, col: word.col })
      setDirection(dir)
      gridRef.current?.focus()
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
    [selected, direction, userGrid, activeWordNum, revealed, words, rows, cols]
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

  const CELL = 38
  const BORDER = 2

  const activeWordObj = activeWordNum
    ? (direction === 'across' ? words.across : words.down).find(
        (w) => w.num === activeWordNum
      )
    : null

  const diffBadgeColor = {
    easy: 'bg-secondary text-background',
    medium: 'bg-amber-500 text-background',
    hard: 'bg-red-500/20 text-red-300 border border-red-500/40',
  }

  return (
    <div className="pb-24">
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
            className={`inline-block text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-0.5 ${diffBadgeColor[difficulty]}`}
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
            ref={gridRef}
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

        {/* Active clue bar */}
        <div className="bg-surface-high/60 border border-white/10 rounded-xl px-4 py-2.5 mt-3 text-center w-full max-w-sm">
          {activeWordObj ? (
            <p className="font-body text-sm text-white/80">
              <span className="font-display font-bold text-secondary mr-1.5">
                {activeWordObj.num}
                {direction === 'across' ? 'A' : 'D'}
              </span>
              {activeWordObj.clue}
              <span className="text-on-surface-variant ml-1">
                ({activeWordObj.len})
              </span>
            </p>
          ) : (
            <p className="font-body text-sm text-on-surface-variant">
              Tap a cell to begin
            </p>
          )}
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

      {/* Clues */}
      <div className="px-4 mt-5 space-y-4">
        {['across', 'down'].map((dir) => (
          <div
            key={dir}
            className="bg-surface-high/40 border border-white/10 rounded-xl p-3"
          >
            <h3 className="font-display font-bold text-on-surface-variant text-xs uppercase tracking-widest mb-3 pb-2 border-b border-white/5">
              {dir === 'across' ? '\u2192 Across' : '\u2193 Down'}
            </h3>
            <div className="space-y-1">
              {words[dir].map((w) => {
                const isActive = direction === dir && activeWordNum === w.num
                return (
                  <button
                    key={`${dir}-${w.num}`}
                    className={`w-full flex items-start gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-secondary/10 border border-secondary/30'
                        : 'border border-transparent hover:bg-white/5'
                    }`}
                    onClick={() => handleClueClick(w.num, dir)}
                  >
                    <span
                      className={`font-display text-xs font-bold min-w-[20px] pt-0.5 ${
                        isActive ? 'text-secondary' : 'text-on-surface-variant/50'
                      }`}
                    >
                      {w.num}.
                    </span>
                    <span
                      className={`font-body text-sm leading-snug ${
                        isActive ? 'text-secondary/90' : 'text-on-surface-variant'
                      }`}
                    >
                      {w.clue}
                      <span className="text-on-surface-variant/40 ml-1">
                        ({w.len})
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/crossword/CrosswordGame.jsx
git commit -m "feat: add config-driven CrosswordGame component"
```

---

### Task 3: Create PuzzleCard component

**Files:**
- Create: `src/components/crossword/PuzzleCard.jsx`

- [ ] **Step 1: Create the component**

Create `src/components/crossword/PuzzleCard.jsx`:

```jsx
import { Clock, CheckCircle2 } from 'lucide-react'

const DIFF_STYLES = {
  easy: { badge: 'bg-secondary text-background', bar: 'bg-secondary' },
  medium: { badge: 'bg-amber-500 text-background', bar: 'bg-amber-500' },
  hard: { badge: 'bg-red-500/20 text-red-300 border border-red-500/40', bar: 'bg-red-400' },
}

export default function PuzzleCard({ puzzle, progress, onSelect }) {
  const { title, difficulty, estimatedMinutes, description, solution } = puzzle
  const styles = DIFF_STYLES[difficulty] || DIFF_STYLES.easy

  // Calculate progress %
  let totalCells = 0
  let filledCells = 0
  const grid = progress?.userGrid
  if (solution) {
    for (let r = 0; r < solution.length; r++)
      for (let c = 0; c < (solution[r]?.length || 0); c++)
        if (solution[r][c] !== null) {
          totalCells++
          if (grid?.[r]?.[c]) filledCells++
        }
  }
  const pct = totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0
  const isCompleted = progress?.completed === true
  const isStarted = filledCells > 0

  const label = isCompleted ? 'Play Again' : isStarted ? 'Resume' : 'Start'
  const status = isCompleted
    ? 'Completed'
    : isStarted
      ? 'In Progress'
      : 'Not Started'

  return (
    <div className="bg-surface-high rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <span
          className={`text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${styles.badge}`}
        >
          {difficulty}
        </span>
        <div className="flex items-center gap-1 text-on-surface-variant">
          {isCompleted ? (
            <CheckCircle2 size={14} className="text-green-400" />
          ) : (
            <Clock size={12} />
          )}
          <span className="font-body text-xs">
            {isCompleted ? 'Done' : `${estimatedMinutes} min`}
          </span>
        </div>
      </div>

      <h3 className="font-display font-bold text-white text-xl mb-1">
        {title}
      </h3>
      <p className="font-body text-on-surface-variant text-sm mb-3">
        {description}
      </p>

      {/* Progress bar */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-body text-on-surface-variant/60 text-xs uppercase tracking-wide">
          {status}
        </span>
        <span className="font-body text-on-surface-variant/60 text-xs">
          {pct}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-surface-highest rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all ${styles.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <button
        onClick={() => onSelect(puzzle)}
        className="w-full py-2.5 rounded-lg font-display text-sm font-bold uppercase tracking-wide border border-white/15 text-white hover:bg-white/5 transition-colors"
      >
        {label}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/crossword/PuzzleCard.jsx
git commit -m "feat: add PuzzleCard component with progress display"
```

---

### Task 4: Create PuzzleSelectionScreen component

**Files:**
- Create: `src/components/crossword/PuzzleSelectionScreen.jsx`

- [ ] **Step 1: Create the component**

Create `src/components/crossword/PuzzleSelectionScreen.jsx`:

```jsx
import { Grid3X3 } from 'lucide-react'
import PuzzleCard from './PuzzleCard'

export default function PuzzleSelectionScreen({ puzzles, progressMap, onSelect }) {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="px-4 pt-2 pb-4">
        <p className="text-secondary text-xs font-display font-semibold uppercase tracking-widest mb-1">
          Daily Challenge
        </p>
        <h2 className="font-display font-bold text-white text-3xl mb-3">
          Crosswords
        </h2>

        {/* Featured card */}
        <div
          className="rounded-xl p-5 mb-5"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-secondary/15 flex items-center justify-center">
              <Grid3X3 size={18} className="text-secondary" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">
                Sports Crossword
              </p>
              <p className="font-body text-on-surface-variant text-xs">
                Test your sports knowledge
              </p>
            </div>
          </div>
          <p className="font-body text-on-surface-variant/70 text-sm leading-relaxed">
            Solve clues across cricket, football, basketball, tennis, and
            Olympic sports. Three difficulty levels to challenge every fan.
          </p>
        </div>
      </section>

      {/* Puzzle list */}
      <section className="px-4">
        <div className="flex items-end justify-between mb-3">
          <h3 className="font-display font-bold text-white text-lg">
            Today's Puzzles
          </h3>
          <span className="font-body text-on-surface-variant text-xs">
            {puzzles.length} puzzles
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {puzzles.map((puzzle) => (
            <PuzzleCard
              key={puzzle.id}
              puzzle={puzzle}
              progress={progressMap[puzzle.id]}
              onSelect={onSelect}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/crossword/PuzzleSelectionScreen.jsx
git commit -m "feat: add PuzzleSelectionScreen with hero and puzzle list"
```

---

### Task 5: Create GamesTab and wire into App

**Files:**
- Create: `src/tabs/GamesTab.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create GamesTab**

Create `src/tabs/GamesTab.jsx`:

```jsx
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
```

- [ ] **Step 2: Wire GamesTab into App.jsx**

In `src/App.jsx`, add the GamesTab import and update `renderTab`:

Replace:
```jsx
import EmptyTab from './tabs/EmptyTab'
```
With:
```jsx
import EmptyTab from './tabs/EmptyTab'
import GamesTab from './tabs/GamesTab'
```

Replace:
```jsx
function renderTab(activeTab) {
  if (activeTab === 'pro') return <ProTab />
  const name = activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
  return <EmptyTab name={name} />
}
```
With:
```jsx
function renderTab(activeTab) {
  if (activeTab === 'pro') return <ProTab />
  if (activeTab === 'games') return <GamesTab />
  const name = activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
  return <EmptyTab name={name} />
}
```

- [ ] **Step 3: Commit**

```bash
git add src/tabs/GamesTab.jsx src/App.jsx
git commit -m "feat: add GamesTab with puzzle selection and wire into App"
```

---

### Task 6: Verify end-to-end

- [ ] **Step 1: Run the dev server**

Run: `cd /Users/antonychrisaby/Desktop/myProjects/sportsB/buzzApp && npm run dev`

- [ ] **Step 2: Manual verification checklist**

Open the app in browser and verify:

1. **Games tab** shows the puzzle selection screen with 3 puzzle cards
2. Each card shows correct difficulty badge, estimated time, description
3. Clicking "Start" on a puzzle opens the crossword game
4. Grid renders correctly with proper cell numbers
5. Clicking cells selects them (lime green highlight)
6. Typing letters fills cells and advances cursor
7. Arrow keys navigate, Tab cycles words
8. Backspace deletes current cell or retreats
9. "Check" button highlights correct (green) and incorrect (red) letters
10. "Reveal" fills the grid with answers
11. "Reset" clears all progress
12. Back button returns to selection screen
13. Progress bar on puzzle card updates after partially solving
14. Refreshing the page preserves typed letters (localStorage)
15. Completing a puzzle shows the celebration banner and "Done" badge on card

- [ ] **Step 3: Fix any issues found during verification**

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete crossword puzzle feature in Games tab"
```
