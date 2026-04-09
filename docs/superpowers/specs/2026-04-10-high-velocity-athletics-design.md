# Design Spec: High-Velocity Athletics App

**Date:** 2026-04-10  
**Status:** Approved

---

## 1. Overview

A mobile-first, PWA-ready athlete training gamification app built with React + Tailwind CSS. The UI follows the "Kinetic Precision" design system defined in `DESIGN.md`. All data is mocked. The PRO tab is the single fully-implemented screen; Games, News, and More tabs are empty stubs.

---

## 2. Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | React (Vite) |
| Styling | Tailwind CSS (custom design tokens) |
| PWA | `vite-plugin-pwa` (Workbox, app-shell caching) |
| Routing | Tab state via `useState` in `App.jsx` — no React Router |
| Fonts | Lexend (display), Manrope (body) via Google Fonts |
| Offline | All data is static config — works offline once cached by SW |

---

## 3. Project Structure

```
buzzApp/
├── public/
│   └── icons/               # PWA icons (192×192, 512×512)
├── src/
│   ├── config/
│   │   ├── quests.json      # Quest/challenge card data (config-driven)
│   │   └── featured.json    # Featured content card data (config-driven)
│   ├── components/
│   │   ├── Header.jsx       # Glassmorphism sticky header
│   │   ├── StatusRing.jsx   # SVG circular XP ring + level display
│   │   ├── QuestCard.jsx    # Single challenge card with progress bar
│   │   ├── SkillTree.jsx    # 2×2 hardcoded skill node grid
│   │   ├── FeaturedCard.jsx # Full-bleed image content card
│   │   └── BottomNav.jsx    # Fixed 4-tab navigation bar
│   ├── tabs/
│   │   ├── ProTab.jsx       # Assembles all PRO tab sections
│   │   └── EmptyTab.jsx     # Stub component for other tabs
│   ├── App.jsx              # Root: tab state + active tab renderer
│   ├── main.jsx             # React entry point + SW registration
│   └── index.css            # Tailwind directives + base styles
├── tailwind.config.js       # Full design token extension
└── vite.config.js           # vite-plugin-pwa configuration
```

---

## 4. Design Tokens (Tailwind Extension)

Extends Tailwind with all tokens from `DESIGN.md`:

**Colors:**
- `background`: #0a0e14
- `primary`: #95aaff
- `primary-dim`: #3766ff
- `secondary`: #c3f400
- `surface-low`: #0f141a
- `surface-high`: #1b2028
- `surface-highest`: #232a33
- `surface-variant`: #1b2028 (used at 60% opacity for glassmorphism)
- `on-surface-variant`: #a8abb3

**Font families:**
- `display`: Lexend
- `body`: Manrope

**Icon library:** Lucide React (`lucide-react` npm package). Quest card icons map: `"steps"` → `Footprints`, `"workout"` → `Dumbbell`. Skill tree icons: `Zap` (Explosive Power), `Gauge` (Linear Speed), `Brain` (Mental Fortitude), `Utensils` (Precision Fuel). Nav icons: `Gamepad2`, `Newspaper`, `Trophy`, `MoreHorizontal`.

**Border radius tokens:** `sm` (2px), `md` (6px), `xl` (12px), `full`

---

## 5. Config Schemas

### `src/config/quests.json`
```json
[
  {
    "id": "steps-daily",
    "icon": "steps",
    "badge": "DAILY",
    "title": "10k Steps",
    "description": "Push your cardio limits with a daily movement goal.",
    "current": 8200,
    "goal": 10000,
    "unit": "steps"
  },
  {
    "id": "workout-weekly",
    "icon": "workout",
    "badge": "WEEKLY",
    "title": "Daily Workout",
    "description": "Complete your High-Intensity Interval training streak.",
    "current": 3,
    "goal": 5,
    "unit": "days"
  }
]
```

### `src/config/featured.json`
```json
[
  {
    "id": "dynamic-agility",
    "tag": "NEW WORKOUT",
    "title": "Dynamic Agility 2.0",
    "description": "Improve your change of direction in 15 mins.",
    "gradient": "from-indigo-900 via-blue-800 to-slate-900"
  },
  {
    "id": "recovery-flows",
    "tag": "PRO MASTERCLASS",
    "title": "Recovery Flows",
    "description": "Professional mobility routines for joint health.",
    "gradient": "from-teal-900 via-emerald-800 to-slate-900"
  }
]
```

---

## 6. Component Specifications

### `Header.jsx`
- Sticky, `z-50`
- Background: `surface_variant` at 60% opacity + `backdrop-blur-md` (glassmorphism)
- Left: circular avatar + "HIGH-VELOCITY" in Lexend bold, `primary` color
- Right: search icon button

### `StatusRing.jsx`
- SVG ring: outer track in `surface-highest`, fill arc in `primary`, stroke-linecap round
- Center: `LVL 24` in `display-lg` Lexend, `PRO ELITE` in `label-sm` `on-surface-variant`
- Below ring: `XP TO NEXT LEVEL` label + horizontal progress bar (1,240 / 2,000)

### `QuestCard.jsx`
Props: `{ icon, badge, title, description, current, goal, unit }`
- Background: `surface-high`, `xl` rounded
- Top-right: frequency badge (`secondary` bg, dark text, `label-sm` uppercase)
- Icon left, title in `headline-sm` Lexend, description in `body-sm` Manrope `on-surface-variant`
- Progress bar: `primary` fill on `surface-highest` track
- Bottom-right: `current / goal unit` fraction

### `SkillTree.jsx`
Hardcoded 2×2 grid:
| Skill | Status | Icon bg |
|-------|--------|---------|
| Explosive Power | MASTERED | `primary-dim` |
| Linear Speed | MASTERED | `primary-dim` |
| Mental Fortitude | 60% LOCKED | `surface-high` muted |
| Precision Fuel | LOCKED | `surface-high` muted |

- Each node: square card, centered icon, name in `label-sm`, status below in `on-surface-variant`

### `FeaturedCard.jsx`
Props: `{ tag, title, description, image, gradient }`
- Full-bleed image (aspect-video / 16:9). Since no real images exist yet, `image` field is optional; when absent, fall back to a CSS gradient defined by a `gradient` field in the config (e.g., `"from-blue-900 to-teal-700"`).
- Gradient overlay bottom half (transparent → `background`)
- `secondary` kicker tag (`label-sm` uppercase) bottom-left
- Title in `display-sm` Lexend white, description in `body-sm` `on-surface-variant`

### `BottomNav.jsx`
- Fixed bottom, `surface-low` bg + `backdrop-blur`
- 4 tabs: Games, News, PRO, More
- Active tab (PRO): icon in `primary`, small `secondary` dot indicator above
- Inactive: `on-surface-variant` icon

### `ProTab.jsx`
Renders top-to-bottom:
1. `CurrentStatus` section wrapper → `StatusRing`
2. `ChallengesSection` wrapper → maps `quests.json` → `QuestCard` + Pro Tips banner
3. `SkillTree`
4. `FeaturedSection` wrapper → maps `featured.json` → `FeaturedCard`

### `EmptyTab.jsx`
Centered placeholder: tab name in `on-surface-variant`, `body-md` Manrope. No other content.

---

## 7. PWA Configuration

`vite-plugin-pwa` with Workbox `GenerateSW` strategy:
- **App shell caching:** precache all built assets (`js`, `css`, `html`, `icons`)
- **Runtime caching:** stale-while-revalidate for images
- **Manifest:** name "High-Velocity", `background_color: #0a0e14`, `theme_color: #95aaff`, `display: standalone`, portrait orientation

---

## 8. Offline Strategy

Since all data comes from static JSON configs bundled with the app, the app is fully functional offline once the service worker has cached the app shell on first load. No network requests are made for data.

---

## 9. Constraints & Rules from DESIGN.md

- No 1px borders — use surface color shifting only
- No standard drop shadows — use tonal layering
- No 100% opaque white text — use `on-surface-variant` for secondary info
- Glassmorphism only for floating/sticky headers
- `secondary` (neon lime) reserved for: live indicators, winning scores, action CTAs, quest badges
- Fonts: Lexend for all headlines/display; Manrope for body/data
