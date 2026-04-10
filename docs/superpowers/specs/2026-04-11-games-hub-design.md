# Games Hub Design

**Date:** 2026-04-11  
**Status:** Approved

## Overview

Add a games hub layer to the Games tab so multiple games can be surfaced as cards. The crossword content moves one level deeper, accessed via a Crossword game card.

## Architecture

`GamesTab` becomes a thin shell wrapping a `MemoryRouter` with two routes:

- `/` → `GamesHub` — landing screen with 2-column grid of game cards
- `/crossword` → `CrosswordSection` — the existing crossword selection + game flow

The existing view-state logic (`'selection' | 'game'`) in `GamesTab` moves into `CrosswordSection`, keeping that concern isolated.

## New Components

### `GameCard` (`src/components/GameCard.jsx`)
- Reusable card for the 2-column games grid
- Props: `icon`, `name`, `description`, `badge` (e.g. puzzle count or "New"), `to` (route path)
- Uses `useNavigate` internally to navigate on tap
- Styled consistently with existing app design system

### `GamesHub` (`src/tabs/GamesHub.jsx`)
- Landing screen for the Games tab
- Page title + 2-column grid of `GameCard`s
- Hardcodes the list of available games (icon, name, description, route)
- Currently one card: Crossword

### `CrosswordSection` (`src/tabs/CrosswordSection.jsx`)
- Absorbs all logic currently in `GamesTab`:
  - `view` state (`'selection' | 'game'`)
  - `progressMap` loading from localStorage
  - `handleSelect` and `handleBack` callbacks
- Renders `PuzzleSelectionScreen` or `CrosswordGame` based on view state
- Self-contained, no changes needed to existing crossword components

### `GamesTab` (refactored, `src/tabs/GamesTab.jsx`)
- Becomes a thin shell
- Renders `<MemoryRouter>` → `<Routes>` with two `<Route>` entries

## Data Flow

- `GamesHub` owns the static game registry (icon, name, description, route path)
- Each `GameCard` navigates independently via `useNavigate`
- `CrosswordSection` is fully self-contained — progress loading and game state stay local

## File Changes

| File | Change |
|------|--------|
| `src/tabs/GamesTab.jsx` | Refactor to thin MemoryRouter shell |
| `src/tabs/GamesHub.jsx` | New — games landing screen |
| `src/tabs/CrosswordSection.jsx` | New — crossword flow extracted from GamesTab |
| `src/components/GameCard.jsx` | New — reusable game card |

No changes required to existing crossword components (`PuzzleSelectionScreen`, `CrosswordGame`, `PuzzleCard`, etc.).

## Dependencies

- `react-router-dom` must be installed
