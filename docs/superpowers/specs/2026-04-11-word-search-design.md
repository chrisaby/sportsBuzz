# Word Search Game Design

**Date:** 2026-04-11  
**Status:** Approved

## Overview

Build a sports-themed word search (find-the-word) puzzle game in the Games section. The game is config-driven: each puzzle is defined in a JSON file. The design references a "Velocity Word Search" style — dark theme, accent yellow-green, timer, score, and momentum bonus.

## Architecture

A new route `/word-search` is added to `GamesTab`'s existing `MemoryRouter`. A second `GameCard` for "Word Search" is added to `GamesHub`. `WordSearchSection` manages navigation between the category hub and an active game.

```
GamesTab (MemoryRouter)
├── / → GamesHub (existing, gains Word Search card)
├── /crossword → CrosswordSection (unchanged)
└── /word-search → WordSearchSection
      ├── view: 'hub'  → WordSearchHub
      └── view: 'game' → WordSearchGame
```

## File Structure

```
src/config/wordSearch.json           — array of puzzle configs
src/config/wordSearchStorage.js      — localStorage key prefix constant
src/tabs/WordSearchSection.jsx       — hub ↔ game view state
src/tabs/WordSearchHub.jsx           — category selection screen
src/components/wordSearch/
  WordSearchGame.jsx                 — main game screen, owns all game state
  WordGrid.jsx                       — letter grid with touch drag selection
  WordChips.jsx                      — words-to-find chip list
```

## Config Format

`src/config/wordSearch.json` is an array of puzzle objects:

```json
[
  {
    "id": "nba-stars",
    "categoryLabel": "HARDWOOD HEROES",
    "title": "NBA Stars",
    "sport": "basketball",
    "timeSeconds": 180,
    "grid": [
      ["S","P","R","I","N","T","X","K","W","A"],
      ["O","B","A","L","L","G","V","S","E","R"],
      ["T","H","C","Y","M","P","O","C","R","B"],
      ["E","U","D","W","L","A","Z","O","I","K"],
      ["D","R","I","B","B","L","E","R","P","J"],
      ["F","V","X","G","Q","H","K","E","M","Y"],
      ["P","I","T","C","H","G","N","Y","L","A"],
      ["A","T","H","L","E","T","E","U","V","I"],
      ["C","O","U","T","E","N","N","I","S","P"],
      ["S","Q","U","A","D","F","L","O","A","G"]
    ],
    "words": ["SPRINT", "TENNIS", "SCORE", "ATHLETE", "DRIBBLE", "PITCH"]
  }
]
```

- `id` — unique key for localStorage
- `categoryLabel` — uppercase accent label shown on hub card (e.g. "HARDWOOD HEROES")
- `title` — human-readable puzzle name (e.g. "NBA Stars")
- `sport` — used for hub card styling/image slot (e.g. "basketball")
- `timeSeconds` — countdown duration
- `grid` — 2D array of uppercase letters, pre-authored (filler + hidden words)
- `words` — list of words hidden in the grid (the game auto-scans to find positions)

Word positions are **auto-detected** at load time by scanning all 8 directions. The config author does not need to specify coordinates.

## Screens

### WordSearchHub (category selection)

- Header: back arrow (→ `/`) + "VELOCITY WORD SEARCH" title
- "GAME LOBBY" label, "SELECT CATEGORY" heading, subtitle text
- Vertical list of category cards:
  - Sport image area (gradient placeholder) with word-count badge (top-right)
  - `categoryLabel` in secondary/accent color
  - `title` in white bold
  - Completion % in accent color (computed from localStorage: wordsFound.length / words.length)
  - Progress bar
- Below the list: **Season Performance** stats grid (computed from localStorage across all puzzles):
  - Time Played (sum of time spent)
  - Words Found (total across all puzzles)
  - Accuracy (correct selections / total drag attempts)
  - Global Rank (static placeholder: "#—")

### WordSearchGame (gameplay)

- **Header:** back arrow (→ hub) + "VELOCITY WORD SEARCH" + countdown timer (MM:SS)
- **Score / Level strip:** score (left) + puzzle title (right)
- **WordGrid:** full-width letter grid. Cells are equal-width squares. On drag: highlighted in accent yellow. On found: green background + strikethrough. Drag must form a straight line (8 directions); non-straight drags are ignored.
- **WordChips:** "WORDS TO FIND" label + "X/Y FOUND" count + chip grid. Found chips: accent border + strikethrough + checkmark. Unfound: muted border.
- **Momentum bar:** "MOMENTUM BONUS" label + "X1.5 BOOST" label (at threshold) + progress bar (blue→green gradient). Fills on word find (+0.3), decays over time (−0.05/s).
- **Game end overlay:** shown when timer hits 0 or all words found. Shows final score, words found count, and a "Play Again" / "Back to Hub" button.

## Game Mechanics

### Word Detection

At component mount, for each word in `puzzle.words`, scan the grid in all 8 directions `[dx, dy]` = `[±1, 0], [0, ±1], [±1, ±1]` to find the word's start cell and direction. Store as `{ word, startRow, startCol, dx, dy }`. This lookup is used to highlight found cells.

### Drag Selection

- `onTouchStart`: record the starting grid cell
- `onTouchMove`: use `document.elementFromPoint` to find the cell under the finger. Compute direction from start cell. If current cell is in the same direction (or direction not yet locked), add to selection path. If not in line, ignore.
- `onTouchEnd`: extract letters from selected cells in order. Check against all unfound words (forward and reverse). If match: mark found, add cells to foundCells set, update score. If no match: briefly flash selection red, clear selection.

### Scoring

- Per word found: `word.length × 100 × momentumMultiplier`
- Time bonus: `timeRemaining × 2` added at word-found moment
- `momentumMultiplier`: `1.5` if momentum ≥ 0.8, else `1.0`
- Best score saved to localStorage per puzzle id

### Timer

- Counts down from `puzzle.timeSeconds`
- Displayed as `MM:SS`
- Managed via `setInterval` in `useEffect`; cleared on unmount
- `visibilitychange` event pauses/resumes the interval
- On reach 0: game ends

### Momentum

- Float `0.0–1.0`, state in `WordSearchGame`
- Word found: `+0.3` (capped at 1.0)
- Passive decay: `-0.05` per second via a shared interval with the timer
- At ≥ 0.8: label shows "X1.5 BOOST", bar turns green

### Game End

Triggered when timer hits 0 or `wordsFound.length === puzzle.words.length`.

Saves to localStorage (key: `ws_progress_<id>`):
```json
{
  "wordsFound": ["SPRINT", "TENNIS"],
  "bestScore": 2400,
  "completed": true,
  "totalAttempts": 8
}
```

## GamesHub Integration

Add a second `GameCard` to `GamesHub.jsx`:
```js
{
  icon: Search,   // lucide-react
  name: 'Word Search',
  description: 'Find hidden sports terms in the grid.',
  badge: '4 puzzles',
  to: '/word-search',
}
```

Add `<Route path="/word-search" element={<WordSearchSection />} />` to `GamesTab`.

## localStorage Keys

- `ws_progress_<id>` — per-puzzle progress (wordsFound, bestScore, completed, totalAttempts)

Exported constant `STORAGE_PREFIX = 'ws_progress_'` from `src/config/wordSearchStorage.js`.
