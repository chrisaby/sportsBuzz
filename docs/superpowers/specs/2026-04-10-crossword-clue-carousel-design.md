# Crossword Clue Carousel & Bottom Sheet

**Date:** 2026-04-10  
**Status:** Approved  

---

## Summary

Replace the static full-clue list in `CrosswordGame` with:
1. A horizontally swipeable clue carousel showing one clue at a time
2. A "View All Clues" button that opens a scrollable bottom sheet

---

## Component Architecture

Two new components extracted from `CrosswordGame.jsx`:

| Component | File | Responsibility |
|---|---|---|
| `ClueCarousel` | `src/components/crossword/ClueCarousel.jsx` | Swipeable single-clue strip |
| `ClueBottomSheet` | `src/components/crossword/ClueBottomSheet.jsx` | Full bottom sheet with all clues |

`CrosswordGame.jsx` removes the existing clue list block (lines 469–515) and renders `<ClueCarousel>` and `<ClueBottomSheet>` instead.

### Props

**ClueCarousel**
```
words          — { across: [...], down: [...] }
activeWordNum  — number | null
direction      — 'across' | 'down'
onClueClick    — (num, dir) => void
onViewAll      — () => void
```

**ClueBottomSheet**
```
open           — boolean
words          — { across: [...], down: [...] }
activeWordNum  — number | null
direction      — 'across' | 'down'
onClueClick    — (num, dir) => void
onClose        — () => void
```

---

## ClueCarousel

### Layout
- **Across / Down tabs** — top-left, active tab filled lime (`#c3f400` bg, dark text); inactive muted
- **Counter** — top-right, format `N / Total` (e.g. `2 / 5`), muted color
- **Clue card** — full-width, shows: clue number (lime, bold), clue text, length in parens
- **"View All Clues" button** — below the card, full-width, subtle border style

### Swipe Behaviour
- Hidden scrollable track with `overflow-x: scroll`, `scroll-snap-type: x mandatory`
- Each card has `scroll-snap-align: start`, `flex: 0 0 100%`
- Browser handles swipe physics natively — no JS touch math
- Scrollbar hidden via `::-webkit-scrollbar { display: none }` + `scrollbar-width: none`

### Auto-scroll
- When `activeWordNum` or `direction` changes, programmatically scroll the track to the matching card using `scrollTo({ left: index * cardWidth, behavior: 'smooth' })`
- Uses a `useEffect` watching `[activeWordNum, direction]`

### Tap to navigate
- Tapping the visible card calls `onClueClick(card.num, direction)` — same as existing clue list behaviour

### Direction tab switch
- Tapping the inactive tab sets direction to that tab's value and scrolls to the first clue in that direction

---

## ClueBottomSheet

### Layout
- Full-width sheet, max height `70vh`, slides up from bottom
- Drag handle bar centered at top
- Header row: "All Clues" title + close button (×)
- Scrollable content area with two sections:
  - **→ Across** section header, then numbered clue rows
  - **↓ Down** section header, then numbered clue rows
- Active clue row highlighted with lime left border + subtle lime background tint

### Open / Close
- Controlled by `open` prop in `CrosswordGame` state (`showAllClues`)
- Opens when "View All Clues" is tapped
- Closes when:
  - Backdrop is tapped
  - Sheet is dragged down > 50px (touch delta via `touchstart`/`touchmove`/`touchend`)
  - A clue row is tapped

### Clue row tap
1. Calls `onClueClick(num, dir)` — navigates grid to that word
2. Calls `onClose()` — dismisses the sheet

### Animation
- Entry: CSS `transform: translateY(100%)` → `translateY(0)` with `transition: transform 0.3s ease`
- Exit: reverse
- Overlay: `opacity: 0` → `opacity: 1`, `transition: opacity 0.25s`
- Rendered always in DOM (avoids mount/unmount flash); visibility controlled by `open`

### Drag-to-dismiss
- Track `touchstart` Y position
- On `touchmove`, apply `translateY(Math.max(0, delta))` live to give tactile feedback
- On `touchend`, if delta > 50px → close; else snap back to 0

---

## Changes to CrosswordGame.jsx

1. Remove clue list block (the `{['across', 'down'].map(...)}` section)
2. Add `const [showAllClues, setShowAllClues] = useState(false)`
3. Render `<ClueCarousel ... onViewAll={() => setShowAllClues(true)} />`
4. Render `<ClueBottomSheet open={showAllClues} ... onClose={() => setShowAllClues(false)} />`
5. No changes to existing state, keyboard handling, or grid logic

---

## Out of Scope

- Animations beyond slide-up/down
- Filtering or searching clues within the bottom sheet
- Scroll position persistence across sessions
