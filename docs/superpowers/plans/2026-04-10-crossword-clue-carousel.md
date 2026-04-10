# Crossword Clue Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static clue list in `CrosswordGame` with a horizontally swipeable clue carousel and a "View All Clues" bottom sheet.

**Architecture:** Two new components (`ClueCarousel`, `ClueBottomSheet`) are created and wired into `CrosswordGame`. The carousel uses CSS scroll-snap for native swipe physics. The bottom sheet uses a CSS transform slide-up with touch drag-to-dismiss.

**Tech Stack:** React 18, Tailwind CSS 3, Lucide React, Vite (no test framework — verification via `npm run build` + `npm run lint`)

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/components/crossword/ClueCarousel.jsx` | Swipeable single-clue strip with direction tabs |
| Create | `src/components/crossword/ClueBottomSheet.jsx` | Full clue list in a bottom sheet |
| Modify | `src/components/crossword/CrosswordGame.jsx` | Wire in new components, remove old clue UI |

---

## Task 1: Create ClueCarousel.jsx

**Files:**
- Create: `src/components/crossword/ClueCarousel.jsx`

- [ ] **Step 1: Create the file with the full component**

`src/components/crossword/ClueCarousel.jsx`:

```jsx
import { useRef, useEffect, useState, useCallback } from 'react'

export default function ClueCarousel({ words, activeWordNum, direction, onDirectionChange, onClueClick, onViewAll }) {
  const trackRef = useRef(null)
  const clues = direction === 'across' ? words.across : words.down
  const [visibleIdx, setVisibleIdx] = useState(0)

  // Auto-scroll to match active word when grid selection changes
  useEffect(() => {
    const idx = clues.findIndex((w) => w.num === activeWordNum)
    if (idx >= 0 && trackRef.current) {
      setVisibleIdx(idx)
      trackRef.current.scrollTo({ left: idx * trackRef.current.offsetWidth, behavior: 'smooth' })
    }
  }, [activeWordNum, direction, clues])

  // Update counter on manual swipe
  const handleScroll = useCallback(() => {
    if (!trackRef.current) return
    const idx = Math.round(trackRef.current.scrollLeft / trackRef.current.offsetWidth)
    setVisibleIdx(idx)
  }, [])

  return (
    <div className="px-4 mt-3">
      {/* Direction tabs + counter */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1 bg-surface-low rounded-xl p-1">
          {['across', 'down'].map((dir) => (
            <button
              key={dir}
              onClick={() => onDirectionChange(dir)}
              className={`px-3 py-1 rounded-xl text-xs font-display font-bold uppercase tracking-wide transition-colors ${
                direction === dir
                  ? 'bg-secondary text-background'
                  : 'text-on-surface-variant'
              }`}
            >
              {dir === 'across' ? '\u2192 Across' : '\u2193 Down'}
            </button>
          ))}
        </div>
        <span className="text-xs font-body text-on-surface-variant">
          {visibleIdx + 1} / {clues.length}
        </span>
      </div>

      {/* Scroll-snap track */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-scroll [&::-webkit-scrollbar]:hidden"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {clues.map((w) => {
          const isActive = w.num === activeWordNum
          return (
            <div
              key={w.num}
              onClick={() => onClueClick(w.num, direction)}
              style={{ flex: '0 0 100%', scrollSnapAlign: 'start' }}
              className={`bg-surface-high/60 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                isActive ? 'border-secondary/30' : 'border-white/10'
              }`}
            >
              {activeWordNum === null && w === clues[visibleIdx] ? (
                <p className="font-body text-sm text-on-surface-variant">Tap a cell to begin</p>
              ) : (
                <p className="font-body text-sm text-white/80">
                  <span className="font-display font-bold text-secondary mr-1.5">
                    {w.num}{direction === 'across' ? 'A' : 'D'}
                  </span>
                  {w.clue}
                  <span className="text-on-surface-variant ml-1">({w.len})</span>
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* View All button */}
      <button
        onClick={onViewAll}
        className="w-full mt-2 py-2 text-xs font-display font-bold uppercase tracking-wide text-on-surface-variant border border-white/10 rounded-xl hover:border-white/20 transition-colors"
      >
        &#9776; View All Clues
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify the file has no syntax errors**

```bash
cd /Users/antonychrisaby/Desktop/myProjects/sportsB/buzzApp && npm run lint -- src/components/crossword/ClueCarousel.jsx 2>&1 | head -30
```

Expected: no errors (warnings about prop-types are acceptable).

- [ ] **Step 3: Commit**

```bash
cd /Users/antonychrisaby/Desktop/myProjects/sportsB/buzzApp && git add src/components/crossword/ClueCarousel.jsx && git commit -m "feat: add ClueCarousel component with scroll-snap and direction tabs"
```

---

## Task 2: Create ClueBottomSheet.jsx

**Files:**
- Create: `src/components/crossword/ClueBottomSheet.jsx`

- [ ] **Step 1: Create the file with the full component**

`src/components/crossword/ClueBottomSheet.jsx`:

```jsx
import { useRef } from 'react'
import { X } from 'lucide-react'

export default function ClueBottomSheet({ open, words, activeWordNum, direction, onClueClick, onClose }) {
  const sheetRef = useRef(null)
  const startYRef = useRef(null)

  const handleTouchStart = (e) => {
    startYRef.current = e.touches[0].clientY
  }

  const handleTouchMove = (e) => {
    if (startYRef.current === null) return
    const delta = e.touches[0].clientY - startYRef.current
    if (delta > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${delta}px)`
    }
  }

  const handleTouchEnd = (e) => {
    if (startYRef.current === null) return
    const delta = e.changedTouches[0].clientY - startYRef.current
    if (delta > 50) {
      onClose()
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = ''
    }
    startYRef.current = null
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'rgba(0,0,0,0.6)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          maxHeight: '70vh',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="bg-surface-high rounded-t-2xl border-t border-white/10"
      >
        {/* Drag handle area */}
        <div
          className="flex flex-col items-center pt-3 pb-2 cursor-grab"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-8 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-white/10">
          <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest">
            All Clues
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable clue list */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-4">
          {['across', 'down'].map((dir) => (
            <div key={dir}>
              <h4 className="font-display font-bold text-on-surface-variant text-xs uppercase tracking-widest mb-2 pb-1 border-b border-white/5">
                {dir === 'across' ? '\u2192 Across' : '\u2193 Down'}
              </h4>
              <div className="space-y-1">
                {words[dir].map((w) => {
                  const isActive = direction === dir && activeWordNum === w.num
                  return (
                    <button
                      key={`${dir}-${w.num}`}
                      onClick={() => {
                        onClueClick(w.num, dir)
                        onClose()
                      }}
                      className={`w-full flex items-start gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-secondary/10 border-l-2 border-secondary pl-1.5'
                          : 'border border-transparent hover:bg-white/5'
                      }`}
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
                        <span className="text-on-surface-variant/40 ml-1">({w.len})</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify the file has no syntax errors**

```bash
cd /Users/antonychrisaby/Desktop/myProjects/sportsB/buzzApp && npm run lint -- src/components/crossword/ClueBottomSheet.jsx 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/antonychrisaby/Desktop/myProjects/sportsB/buzzApp && git add src/components/crossword/ClueBottomSheet.jsx && git commit -m "feat: add ClueBottomSheet component with drag-to-dismiss"
```

---

## Task 3: Wire components into CrosswordGame.jsx

**Files:**
- Modify: `src/components/crossword/CrosswordGame.jsx`

- [ ] **Step 1: Add imports at the top of CrosswordGame.jsx**

Find the existing imports block:
```jsx
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { ArrowLeft, Check, Eye, RotateCcw } from 'lucide-react'
import { STORAGE_PREFIX } from '../../config/crosswordStorage'
```

Replace with:
```jsx
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { ArrowLeft, Check, Eye, RotateCcw } from 'lucide-react'
import { STORAGE_PREFIX } from '../../config/crosswordStorage'
import ClueCarousel from './ClueCarousel'
import ClueBottomSheet from './ClueBottomSheet'
```

- [ ] **Step 2: Add showAllClues state**

Find:
```jsx
  const [flash, setFlash] = useState(false)
  const gridRef = useRef(null)
```

Replace with:
```jsx
  const [flash, setFlash] = useState(false)
  const [showAllClues, setShowAllClues] = useState(false)
  const gridRef = useRef(null)
```

- [ ] **Step 3: Remove the activeWordObj variable (it's only used by the active clue bar we're removing)**

Find and remove this block entirely:
```jsx
  const activeWordObj = activeWordNum
    ? (direction === 'across' ? words.across : words.down).find(
        (w) => w.num === activeWordNum
      )
    : null
```

- [ ] **Step 4: Remove the active clue bar JSX**

Find and remove this entire block (it's inside the `flex flex-col items-center px-4` div, after the grid container):
```jsx
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
```

- [ ] **Step 5: Remove the existing clue list JSX block**

Find and remove this entire block (near the bottom of the return, after the buttons section):
```jsx
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
```

- [ ] **Step 6: Add ClueCarousel and ClueBottomSheet in place of the removed blocks**

After the closing `</div>` of the buttons section (the `flex gap-2.5 mt-3` div and the check hint paragraph), add:

```jsx
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
```

- [ ] **Step 7: Verify build passes**

```bash
cd /Users/antonychrisaby/Desktop/myProjects/sportsB/buzzApp && npm run build 2>&1 | tail -20
```

Expected: `✓ built in` with no errors. If there are errors, fix them before the next step.

- [ ] **Step 8: Commit**

```bash
cd /Users/antonychrisaby/Desktop/myProjects/sportsB/buzzApp && git add src/components/crossword/CrosswordGame.jsx && git commit -m "feat: replace static clue list with carousel and bottom sheet"
```

---

## Self-Review Notes

- **Spec coverage:** All spec sections have corresponding tasks: carousel (Task 1), bottom sheet (Task 2), CrosswordGame wiring (Task 3). Auto-scroll, direction tabs, counter, drag-to-dismiss, backdrop tap, clue tap → navigate + close all covered.
- **No placeholders:** All steps contain exact code.
- **Type consistency:** `onClueClick(num, dir)` matches `handleClueClick(num, dir)` in CrosswordGame. `onDirectionChange(dir)` receives `setDirection` which accepts a string. `open` boolean consistent across Tasks 2 and 3.
- **activeWordObj removal:** Removed in Task 3 Step 3 since it's only consumed by the active clue bar being removed.
