# Hangman Game — Design Spec
**Date:** 2026-04-14  
**Status:** Approved

---

## Overview

A sports-themed hangman game added to the Games section. Questions are config-driven (JSON) so new questions can be swapped in from a backend server in the future. The experience is an endless arcade — questions load one after another with no selection screen.

---

## Architecture

Follows the same pattern as the existing Crossword and Word Search games.

| File | Purpose |
|---|---|
| `src/config/hangman.json` | Question bank — config-driven, backend-swappable |
| `src/tabs/HangmanSection.jsx` | Stateful section: picks next question, owns game state |
| `src/components/hangman/HangmanGame.jsx` | Full game UI |
| `src/components/hangman/HangmanFigure.jsx` | SVG gallows drawn progressively |
| `src/tabs/GamesTab.jsx` | Add `/hangman` route |
| `src/tabs/GamesHub.jsx` | Add Hangman card |

---

## Config Schema (`hangman.json`)

```json
[
  {
    "id": "football-ronaldo",
    "category": "Football",
    "answer": "RONALDO",
    "hints": [
      "He won the Ballon d'Or a record 8 times",
      "He plays for Al-Nassr and has represented Portugal",
      "His nickname is CR7"
    ]
  }
]
```

**Rules:**
- `answer` is always uppercase. Multi-word answers use spaces.
- Exactly 3 hints per question.
- `category` is a free-form sport label (e.g. "Cricket", "Football", "Basketball").
- `id` is a unique kebab-case string — used as a React key.

---

## Screen Layout (top → bottom)

### 1. Header
- Back arrow (navigates to GamesHub) + `"SPORTS HANGMAN"` title
- Title: `font-display font-bold text-white`
- Back label: `text-secondary text-xs font-display font-semibold uppercase tracking-widest`

### 2. Gallows SVG (`HangmanFigure`)
- Rendered inside a `surface-low` rounded card
- Gallows base and pole always visible (drawn in `surface-highest`)
- Body parts drawn in `secondary` (#c3f400), revealed one per wrong guess in this order:
  1. Head (circle)
  2. Body (vertical line)
  3. Left arm
  4. Right arm
  5. Left leg
  6. Right leg
- 6 wrong guesses = full figure = game over

### 3. Category Pill
- Small uppercase label: `text-on-surface-variant text-xs font-display font-semibold uppercase tracking-widest`
- e.g. `FOOTBALL`

### 4. Answer Blanks
- One `_` per letter, spaces between words shown as visible gaps
- `font-display font-bold text-white text-2xl tracking-widest`
- Correctly guessed letters replace their blank immediately
- On game lost: full answer revealed in `text-primary`

### 5. Hints Panel
- Three rows on `surface-low` background, each with a 💡 icon
- **Hint 1:** Always visible on game start
- **Hint 2:** Hidden behind a `"REVEAL"` button (`bg-secondary text-background font-display font-bold text-xs`). Tapping reveals the text and removes the button.
- **Hint 3:** Same as Hint 2, but the REVEAL button is disabled/locked until Hint 2 has been revealed.

### 6. Alphabet Keyboard
- 4 rows, centrally aligned:
  - Row 1: `Q W E R T Y U I O P`
  - Row 2: `A S D F G H J K L`
  - Row 3: `Z X C V B N M`
  - Row 4: remaining letters (none in standard 26-letter set — Row 3 completes the alphabet)
- Each letter is a pill/button:
  - **Unguessed:** `bg-surface-high text-white`
  - **Correct guess:** `bg-secondary text-background`
  - **Wrong guess:** `bg-surface-highest text-on-surface-variant` (dimmed, pointer-events none)
- All buttons disabled after game won or lost

---

## Game States

| State | Trigger | UI |
|---|---|---|
| `playing` | Game start | Normal interaction |
| `won` | All letters guessed | Answer filled in, success message, "NEXT QUESTION →" button in `secondary` |
| `lost` | 6 wrong guesses | Full gallows shown, answer revealed in `primary`, "TRY NEXT →" button |

---

## Endless Arcade Flow

- `HangmanSection` holds a shuffled copy of the question array and a current index.
- "Next Question" / "Try Next" increments the index (wraps around at end).
- No puzzle selection screen — first question loads immediately on entering the section.
- No persistent progress storage needed (stateless between sessions).

---

## Design System Constraints

- **Colors:** `background` #0a0e14, `secondary` #c3f400, `primary` #95aaff, `surface-low` #0f141a, `surface-high` #1b2028, `surface-highest` #232a33, `on-surface-variant` #a8abb3
- **Fonts:** `font-display` (Lexend) for titles, labels, buttons; `font-body` (Manrope) for hint text
- **Border radius:** `rounded-xl` (12px) for cards, `rounded-md` (6px) for pills/buttons

---

## Out of Scope

- Backend API integration (config is local JSON; schema is designed to be backend-compatible)
- Persistent high scores or win streaks
- Difficulty levels or category filtering
- Animations beyond letter/figure reveal
