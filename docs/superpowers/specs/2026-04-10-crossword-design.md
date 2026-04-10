# Crossword Puzzle — Games Tab Design

**Date:** 2026-04-10  
**Status:** Approved

---

## Overview

Add a config-driven crossword puzzle feature to the Games tab of the BuzzApp sports app. The feature has two screens: a puzzle selection screen and the crossword game itself. Three puzzles ship in the initial config (Easy, Medium, Hard), all sports-themed. Progress persists via localStorage.

---

## Config Schema

**File:** `src/config/crosswords.json`

An array of puzzle objects. Each puzzle is fully self-contained — the engine reads nothing outside the object.

```json
[
  {
    "id": "football-easy",
    "title": "Football Basics",
    "difficulty": "easy",
    "estimatedMinutes": 9,
    "description": "Classic football terms every fan knows.",
    "rows": 11,
    "cols": 9,
    "solution": [[null, "C", "O", "R", ...], ...],
    "cellNumbers": { "0,1": 1, "1,0": 2 },
    "words": {
      "across": [
        { "num": 1, "row": 0, "col": 1, "len": 6, "answer": "CORNER", "clue": "Set piece from the corner flag", "sport": "⚽" }
      ],
      "down": [...]
    }
  }
]
```

**Difficulty values:** `"easy"` | `"medium"` | `"hard"`

The existing cricket & football puzzle from `crossword.jsx` is adapted as the Easy puzzle. Two new puzzles (Medium, Hard) are authored with different sports terms and grid layouts.

---

## File Structure

### New files

```
src/
  config/
    crosswords.json                      ← 3 puzzle configs
  tabs/
    GamesTab.jsx                         ← view state manager
  components/
    crossword/
      PuzzleSelectionScreen.jsx          ← selection list UI
      PuzzleCard.jsx                     ← individual puzzle card
      CrosswordGame.jsx                  ← game engine (adapted from crossword.jsx)
```

### Modified files

```
src/App.jsx   ← import GamesTab, wire to 'games' tab
```

`crossword.jsx` at the project root is **not modified** — it remains as a reference.

---

## Component Responsibilities

### `GamesTab.jsx`
- Imports `crosswords.json`
- Reads localStorage progress for each puzzle on mount
- Manages `view` state: `'selection' | 'game'`
- Manages `selectedPuzzle` state (null or puzzle config object)
- Renders `PuzzleSelectionScreen` or `CrosswordGame` based on view

### `PuzzleSelectionScreen.jsx`
- Receives: `puzzles[]`, `progressMap`, `onSelect(puzzle)`
- Renders a hero section at top (title, subtitle matching app design)
- Renders a `PuzzleCard` for each puzzle

### `PuzzleCard.jsx`
- Receives: `puzzle`, `progress`, `onSelect`
- Displays: difficulty badge (color-coded), estimated time, title, description, progress bar, action button
- Button label: "Start" (not started) | "Resume" (in progress) | "Play Again" (completed)
- Completed puzzles show a green checkmark badge

### `CrosswordGame.jsx`
- Receives: `puzzle` (config object), `onBack` (callback)
- Adapts logic from `crossword.jsx` — derives `CELL_WORD_MAP` and `getWordCells` from puzzle config at render time
- Reads initial `userGrid` from localStorage (`cw_progress_${puzzle.id}`) on mount
- Writes to localStorage on every `userGrid` change
- Renders: back button, puzzle title/difficulty, grid, active clue bar, Check / Reveal / Reset buttons, clues panel

---

## Data Flow

```
GamesTab
  ├── static import: crosswords.json
  ├── on mount: read localStorage → build progressMap { [puzzleId]: { userGrid, completed, startedAt, completedAt } }
  ├── view = 'selection'
  │     └── PuzzleSelectionScreen(puzzles, progressMap, onSelect)
  │           └── PuzzleCard × 3
  │                 └── tap → onSelect(puzzle) → GamesTab sets selectedPuzzle, view = 'game'
  └── view = 'game'
        └── CrosswordGame(puzzle, onBack)
              ├── mount: read localStorage for saved grid
              ├── every grid change: write localStorage
              └── onBack → GamesTab sets view = 'selection', selectedPuzzle = null
```

---

## localStorage Schema

**Key:** `cw_progress_${puzzleId}`  
**Value (JSON):**
```json
{
  "userGrid": [["", "C", ""], ...],
  "completed": false,
  "startedAt": "2026-04-10T10:00:00.000Z",
  "completedAt": null
}
```

`startedAt` is set on first keypress. `completedAt` is set when the puzzle is solved.

---

## Progress Calculation (for selection screen)

```
totalCells  = count of non-null cells in solution
filledCells = count of cells where userGrid[r][c] !== ''
progress %  = filledCells / totalCells
```

---

## Design Tokens

Matches the existing app design system:
- Background: `bg-background` (`#0a0e14`)
- Surfaces: `bg-surface-high`, `bg-surface-highest`
- Primary accent: `text-primary` (`#95aaff`)
- Secondary accent: `bg-secondary` (`#c3f400`) — used for difficulty badges (Easy)
- Danger: red tones for Hard difficulty badge
- Fonts: `font-display` (Lexend), `font-body` (Manrope)
- Crossword grid cells: inline styles (same as reference) for pixel-accurate sizing

---

## Difficulty Badge Colors

| Difficulty | Background | Text |
|------------|-----------|------|
| easy       | `#c3f400` (secondary) | `#0a0e14` (dark) |
| medium     | `#f59e0b` (amber) | `#0a0e14` |
| hard       | `rgba(220,38,38,0.2)` | `#fca5a5` |

---

## Out of Scope

- On-screen keyboard (native device keyboard used)
- Timer / countdown
- Hint system beyond Check/Reveal buttons
- User accounts or server-side persistence
- Puzzle archive or daily challenge rotation
