# High-Velocity Athletics App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first PWA athlete training gamification app with a fully-implemented PRO tab (status ring, quests, skill tree, featured content) and stubbed Games/News/More tabs.

**Architecture:** Vite + React SPA with tab state managed in `App.jsx` via `useState` — no router. Config-driven quest cards and featured content cards read from JSON files in `src/config/`. `vite-plugin-pwa` with Workbox handles app-shell caching for offline support.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, `vite-plugin-pwa`, Lucide React, Google Fonts (Lexend + Manrope)

---

## File Map

| File | Responsibility |
|------|----------------|
| `vite.config.js` | Vite + PWA plugin config |
| `tailwind.config.js` | Design tokens (colors, fonts, radius) |
| `src/index.css` | Tailwind directives + Google Fonts import |
| `src/main.jsx` | React entry point |
| `src/App.jsx` | Tab state + layout shell |
| `src/config/quests.json` | Quest card data (config-driven) |
| `src/config/featured.json` | Featured content data (config-driven) |
| `src/components/Header.jsx` | Glassmorphism sticky header |
| `src/components/StatusRing.jsx` | SVG circular XP ring + level |
| `src/components/QuestCard.jsx` | Individual challenge card |
| `src/components/SkillTree.jsx` | 2×2 hardcoded skill grid |
| `src/components/FeaturedCard.jsx` | Full-bleed gradient content card |
| `src/components/BottomNav.jsx` | Fixed 4-tab nav bar |
| `src/tabs/ProTab.jsx` | Assembles all PRO tab sections |
| `src/tabs/EmptyTab.jsx` | Stub for Games/News/More |
| `public/icons/icon.svg` | PWA icon (SVG fallback) |

---

## Task 1: Scaffold project + install dependencies

**Files:**
- Create: `package.json`, `vite.config.js` (initial), `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`

- [ ] **Step 1: Scaffold Vite React project**

Run in `/Users/antonychrisaby/Desktop/myProjects/sportsB/buzzApp`:
```bash
npm create vite@latest . -- --template react --force
```
Expected: Vite scaffold files created (`src/App.jsx`, `src/main.jsx`, `index.html`, etc.)

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install lucide-react
npm install -D tailwindcss@3 postcss autoprefixer vite-plugin-pwa
npx tailwindcss init -p
```
Expected: `node_modules/` created, `tailwind.config.js` and `postcss.config.js` generated.

- [ ] **Step 3: Initialize git**

```bash
git init
echo "node_modules\ndist\n.DS_Store" > .gitignore
git add .
git commit -m "chore: scaffold vite react project"
```

---

## Task 2: Tailwind design tokens

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`

- [ ] **Step 1: Replace tailwind.config.js with full design token set**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './src/config/**/*.json',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0e14',
        primary: '#95aaff',
        'primary-dim': '#3766ff',
        secondary: '#c3f400',
        'surface-low': '#0f141a',
        'surface-high': '#1b2028',
        'surface-highest': '#232a33',
        'surface-variant': '#1b2028',
        'on-surface-variant': '#a8abb3',
      },
      fontFamily: {
        display: ['Lexend', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        sm: '2px',
        md: '6px',
        xl: '12px',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Replace src/index.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    -webkit-tap-highlight-color: transparent;
  }
  body {
    @apply bg-background font-body text-white;
    overscroll-behavior: none;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.js src/index.css
git commit -m "chore: add tailwind design tokens and google fonts"
```

---

## Task 3: PWA configuration

**Files:**
- Modify: `vite.config.js`
- Create: `public/icons/icon.svg`

- [ ] **Step 1: Replace vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'High-Velocity',
        short_name: 'HV',
        description: 'Athlete training gamification app',
        theme_color: '#95aaff',
        background_color: '#0a0e14',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
})
```

- [ ] **Step 2: Create SVG icon**

Create `public/icons/icon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#0a0e14"/>
  <circle cx="256" cy="256" r="140" fill="none" stroke="#95aaff" stroke-width="24"/>
  <text x="256" y="230" font-family="sans-serif" font-size="80" font-weight="bold" fill="#95aaff" text-anchor="middle" dominant-baseline="middle">HV</text>
  <circle cx="256" cy="330" r="10" fill="#c3f400"/>
</svg>
```

- [ ] **Step 3: Commit**

```bash
git add vite.config.js public/icons/
git commit -m "chore: configure vite-plugin-pwa with workbox"
```

---

## Task 4: Config files

**Files:**
- Create: `src/config/quests.json`
- Create: `src/config/featured.json`

- [ ] **Step 1: Create src/config/quests.json**

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

- [ ] **Step 2: Create src/config/featured.json**

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

- [ ] **Step 3: Commit**

```bash
git add src/config/
git commit -m "feat: add quest and featured config data"
```

---

## Task 5: Header component

**Files:**
- Create: `src/components/Header.jsx`

- [ ] **Step 1: Create src/components/Header.jsx**

```jsx
import { Search } from 'lucide-react'

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
      style={{ background: 'rgba(27, 32, 40, 0.6)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary-dim flex items-center justify-center flex-shrink-0">
          <span className="font-display font-bold text-white text-xs">AC</span>
        </div>
        <span className="font-display font-bold text-primary tracking-wider text-sm uppercase">
          High-Velocity
        </span>
      </div>
      <button
        className="text-on-surface-variant hover:text-primary transition-colors p-1"
        aria-label="Search"
      >
        <Search size={20} />
      </button>
    </header>
  )
}
```

- [ ] **Step 2: Verify renders — update src/App.jsx temporarily**

Replace `src/App.jsx` with:
```jsx
import Header from './components/Header'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
    </div>
  )
}
```

- [ ] **Step 3: Run dev server and visually verify**

```bash
npm run dev
```
Expected: Dark background, glassmorphism header with "AC" avatar, "HIGH-VELOCITY" in electric blue, search icon on right.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.jsx src/App.jsx
git commit -m "feat: add glassmorphism Header component"
```

---

## Task 6: StatusRing component

**Files:**
- Create: `src/components/StatusRing.jsx`

- [ ] **Step 1: Create src/components/StatusRing.jsx**

```jsx
const RADIUS = 80
const CIRC = 2 * Math.PI * RADIUS
const XP_CURRENT = 1240
const XP_TOTAL = 2000
const XP_PROGRESS = XP_CURRENT / XP_TOTAL

export default function StatusRing() {
  const dashOffset = CIRC * (1 - XP_PROGRESS)

  return (
    <section className="flex flex-col items-center px-6 pt-8 pb-4">
      <p className="text-secondary text-xs font-display font-semibold uppercase tracking-widest mb-5">
        Current Status
      </p>

      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200" aria-hidden="true">
          {/* Track */}
          <circle
            cx="100" cy="100" r={RADIUS}
            fill="none" stroke="#232a33" strokeWidth="12"
          />
          {/* Progress arc */}
          <circle
            cx="100" cy="100" r={RADIUS}
            fill="none" stroke="#95aaff" strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-5xl text-white leading-none tracking-tight">
            LVL 24
          </span>
          <span className="font-body text-xs text-on-surface-variant uppercase tracking-widest mt-1">
            Pro Elite
          </span>
        </div>
      </div>

      <div className="w-full mt-5">
        <p className="text-on-surface-variant text-xs font-body uppercase tracking-widest text-center mb-2">
          XP to Next Level
        </p>
        <div className="w-full h-1.5 bg-surface-highest rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${XP_PROGRESS * 100}%` }}
          />
        </div>
        <p className="text-white font-display font-semibold text-center mt-2 text-lg tracking-wide">
          {XP_CURRENT.toLocaleString()} / {XP_TOTAL.toLocaleString()}
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to App.jsx to verify**

```jsx
import Header from './components/Header'
import StatusRing from './components/StatusRing'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <StatusRing />
    </div>
  )
}
```

- [ ] **Step 3: Visually verify**

Expected: Neon lime "CURRENT STATUS" label, circular ring with blue arc at ~62% fill, "LVL 24" centered, "PRO ELITE" subtitle, XP progress bar below.

- [ ] **Step 4: Commit**

```bash
git add src/components/StatusRing.jsx src/App.jsx
git commit -m "feat: add StatusRing SVG component"
```

---

## Task 7: QuestCard component

**Files:**
- Create: `src/components/QuestCard.jsx`

- [ ] **Step 1: Create src/components/QuestCard.jsx**

```jsx
import { Footprints, Dumbbell } from 'lucide-react'

const ICON_MAP = {
  steps: Footprints,
  workout: Dumbbell,
}

export default function QuestCard({ icon, badge, title, description, current, goal, unit }) {
  const Icon = ICON_MAP[icon] ?? Dumbbell
  const progress = Math.min(current / goal, 1)

  return (
    <div className="bg-surface-high rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-surface-highest flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>
        <span className="bg-secondary text-background text-xs font-display font-bold uppercase tracking-wide px-2 py-0.5 rounded-md">
          {badge}
        </span>
      </div>
      <h3 className="font-display font-bold text-white text-lg mb-1">{title}</h3>
      <p className="font-body text-on-surface-variant text-sm mb-4">{description}</p>
      <div className="w-full h-1.5 bg-surface-highest rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <p className="font-body text-on-surface-variant text-xs text-right">
        {current.toLocaleString()} / {goal.toLocaleString()} {unit}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Add to App.jsx to verify**

```jsx
import Header from './components/Header'
import QuestCard from './components/QuestCard'
import quests from './config/quests.json'

export default function App() {
  return (
    <div className="min-h-screen bg-background p-4">
      <Header />
      <div className="flex flex-col gap-3 mt-4">
        {quests.map((q) => <QuestCard key={q.id} {...q} />)}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Visually verify**

Expected: Two dark cards on dark background. Each has: icon top-left, neon lime badge top-right, bold title, muted description, blue progress bar, fraction bottom-right. No borders visible — tonal depth only.

- [ ] **Step 4: Commit**

```bash
git add src/components/QuestCard.jsx src/App.jsx
git commit -m "feat: add config-driven QuestCard component"
```

---

## Task 8: SkillTree component

**Files:**
- Create: `src/components/SkillTree.jsx`

- [ ] **Step 1: Create src/components/SkillTree.jsx**

```jsx
import { Zap, Gauge, Brain, Utensils } from 'lucide-react'

const SKILLS = [
  { id: 'power',  Icon: Zap,      name: 'Explosive Power',   status: 'MASTERED',    mastered: true },
  { id: 'speed',  Icon: Gauge,    name: 'Linear Speed',      status: 'MASTERED',    mastered: true },
  { id: 'mental', Icon: Brain,    name: 'Mental Fortitude',  status: '60% LOCKED',  mastered: false },
  { id: 'fuel',   Icon: Utensils, name: 'Precision Fuel',    status: 'LOCKED',      mastered: false },
]

export default function SkillTree() {
  return (
    <section className="px-4 py-6">
      <p className="text-secondary text-xs font-display font-semibold uppercase tracking-widest mb-1">
        Growth Pathway
      </p>
      <h2 className="font-display font-bold text-white text-3xl mb-6">Skill Tree</h2>

      <div className="grid grid-cols-2 gap-3">
        {SKILLS.map(({ id, Icon, name, status, mastered }) => (
          <div
            key={id}
            className={`bg-surface-high rounded-xl p-4 flex flex-col items-center gap-3 ${
              mastered ? '' : 'opacity-60'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                mastered ? 'bg-primary-dim' : 'bg-surface-highest'
              }`}
            >
              <Icon
                size={22}
                className={mastered ? 'text-white' : 'text-on-surface-variant'}
              />
            </div>
            <p className="font-body text-white text-xs font-semibold text-center leading-tight">
              {name}
            </p>
            <p className="font-body text-on-surface-variant text-xs uppercase tracking-wide">
              {status}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to App.jsx to verify**

```jsx
import Header from './components/Header'
import SkillTree from './components/SkillTree'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SkillTree />
    </div>
  )
}
```

- [ ] **Step 3: Visually verify**

Expected: 2×2 grid. Top row: "Explosive Power" + "Linear Speed" with blue icon backgrounds, full opacity. Bottom row: "Mental Fortitude" + "Precision Fuel" with muted icon backgrounds, 60% opacity.

- [ ] **Step 4: Commit**

```bash
git add src/components/SkillTree.jsx src/App.jsx
git commit -m "feat: add hardcoded SkillTree component"
```

---

## Task 9: FeaturedCard component

**Files:**
- Create: `src/components/FeaturedCard.jsx`

- [ ] **Step 1: Create src/components/FeaturedCard.jsx**

```jsx
export default function FeaturedCard({ tag, title, description, gradient }) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${gradient}`}
      style={{ aspectRatio: '16/9' }}
    >
      {/* Bottom fade overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="inline-block bg-secondary text-background text-xs font-display font-bold uppercase tracking-wide px-2 py-0.5 rounded-md mb-2">
          {tag}
        </span>
        <h3 className="font-display font-bold text-white text-2xl leading-tight mb-1">
          {title}
        </h3>
        <p className="font-body text-on-surface-variant text-sm">{description}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add to App.jsx to verify**

```jsx
import Header from './components/Header'
import FeaturedCard from './components/FeaturedCard'
import featured from './config/featured.json'

export default function App() {
  return (
    <div className="min-h-screen bg-background p-4">
      <Header />
      <div className="flex flex-col gap-4 mt-4">
        {featured.map((item) => <FeaturedCard key={item.id} {...item} />)}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Visually verify**

Expected: Two 16:9 cards with gradient backgrounds (indigo-blue and teal-emerald). Bottom half fades to near-black. Neon lime kicker badge, large white title, muted description text.

- [ ] **Step 4: Commit**

```bash
git add src/components/FeaturedCard.jsx src/App.jsx
git commit -m "feat: add config-driven FeaturedCard component"
```

---

## Task 10: BottomNav component

**Files:**
- Create: `src/components/BottomNav.jsx`

- [ ] **Step 1: Create src/components/BottomNav.jsx**

```jsx
import { Gamepad2, Newspaper, Trophy, MoreHorizontal } from 'lucide-react'

const TABS = [
  { id: 'games', label: 'Games', Icon: Gamepad2 },
  { id: 'news',  label: 'News',  Icon: Newspaper },
  { id: 'pro',   label: 'Pro',   Icon: Trophy },
  { id: 'more',  label: 'More',  Icon: MoreHorizontal },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 max-w-md mx-auto"
      style={{ background: 'rgba(15, 20, 26, 0.9)', backdropFilter: 'blur(12px)' }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center gap-1 px-4 py-1 relative"
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            {isActive && (
              <span className="absolute -top-1 w-1 h-1 rounded-full bg-secondary" />
            )}
            <Icon
              size={22}
              className={isActive ? 'text-primary' : 'text-on-surface-variant'}
            />
            <span
              className={`text-xs font-body ${
                isActive ? 'text-primary font-semibold' : 'text-on-surface-variant'
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2: Add to App.jsx to verify**

```jsx
import { useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'

export default function App() {
  const [activeTab, setActiveTab] = useState('pro')
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-96" />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
```

- [ ] **Step 3: Visually verify**

Expected: Fixed bottom nav bar, glassmorphism background. "Pro" tab active: Trophy icon in electric blue, label in blue, neon lime dot above. Other tabs in muted grey. Clicking tabs switches active state.

- [ ] **Step 4: Commit**

```bash
git add src/components/BottomNav.jsx src/App.jsx
git commit -m "feat: add BottomNav with active tab state"
```

---

## Task 11: EmptyTab + ProTab

**Files:**
- Create: `src/tabs/EmptyTab.jsx`
- Create: `src/tabs/ProTab.jsx`

- [ ] **Step 1: Create src/tabs/EmptyTab.jsx**

```jsx
export default function EmptyTab({ name }) {
  return (
    <div className="flex items-center justify-center" style={{ height: '60vh' }}>
      <p className="font-body text-on-surface-variant text-base">{name}</p>
    </div>
  )
}
```

- [ ] **Step 2: Create src/tabs/ProTab.jsx**

```jsx
import { BookOpen } from 'lucide-react'
import StatusRing from '../components/StatusRing'
import QuestCard from '../components/QuestCard'
import SkillTree from '../components/SkillTree'
import FeaturedCard from '../components/FeaturedCard'
import quests from '../config/quests.json'
import featured from '../config/featured.json'

export default function ProTab() {
  return (
    <div className="pb-24">
      {/* Current Status */}
      <StatusRing />

      {/* Active Quests / Challenges */}
      <section className="px-4 pt-2 pb-4">
        <p className="text-secondary text-xs font-display font-semibold uppercase tracking-widest mb-1">
          Active Quests
        </p>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display font-bold text-white text-3xl">Challenges</h2>
          <button className="font-body text-primary text-sm font-bold underline underline-offset-2 decoration-secondary">
            View All
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {quests.map((quest) => (
            <QuestCard key={quest.id} {...quest} />
          ))}
        </div>

        {/* Pro Tips Banner */}
        <div className="mt-3 rounded-xl p-4 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, #3766ff, #95aaff)' }}>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <BookOpen size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-white text-xs uppercase tracking-wide">
              Pro Tips: Peak Recovery
            </p>
            <p className="font-body text-white/60 text-xs mt-0.5 truncate">
              Unlock the secrets of athlete sleep cycles.
            </p>
          </div>
          <button className="bg-white text-primary-dim text-xs font-display font-bold uppercase px-3 py-2 rounded-md flex-shrink-0">
            Read Now
          </button>
        </div>
      </section>

      {/* Skill Tree */}
      <SkillTree />

      {/* Featured Content */}
      <section className="px-4 pb-4">
        <div className="flex flex-col gap-4">
          {featured.map((item) => (
            <FeaturedCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/tabs/
git commit -m "feat: add ProTab and EmptyTab"
```

---

## Task 12: Wire App.jsx + final verification

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`

- [ ] **Step 1: Replace src/App.jsx with final version**

```jsx
import { useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import ProTab from './tabs/ProTab'
import EmptyTab from './tabs/EmptyTab'

const TABS = {
  games: <EmptyTab name="Games" />,
  news:  <EmptyTab name="News" />,
  pro:   <ProTab />,
  more:  <EmptyTab name="More" />,
}

export default function App() {
  const [activeTab, setActiveTab] = useState('pro')

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <Header />
      <main>
        {TABS[activeTab]}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
```

- [ ] **Step 2: Replace src/main.jsx**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 3: Remove boilerplate from Vite scaffold**

Delete `src/App.css` and `src/assets/react.svg` (they were created by the scaffold and are unused):
```bash
rm -f src/App.css src/assets/react.svg
```

- [ ] **Step 4: Run dev server and do full visual verification**

```bash
npm run dev
```

Open `http://localhost:5173` in a browser, resize to ~390px wide (iPhone viewport). Verify:
- [ ] Glassmorphism header sticks at top while scrolling
- [ ] "CURRENT STATUS" label in neon lime
- [ ] SVG ring at ~62% fill in electric blue
- [ ] "LVL 24 / PRO ELITE" centered in ring
- [ ] XP bar + "1,240 / 2,000" below ring
- [ ] "ACTIVE QUESTS / CHALLENGES" section with "VIEW ALL" link
- [ ] Two quest cards with neon lime badges, progress bars, fractions
- [ ] Gradient "PRO TIPS: PEAK RECOVERY" banner with "READ NOW" button
- [ ] "GROWTH PATHWAY / SKILL TREE" section with 2×2 grid
- [ ] Top-row skills bright, bottom-row skills muted
- [ ] Two 16:9 featured content cards with gradient backgrounds + kicker tags
- [ ] Fixed bottom nav: "PRO" active (blue icon + neon dot), others muted
- [ ] Tapping Games/News/More shows empty tab, tapping Pro returns to full content
- [ ] No visible 1px borders anywhere — only tonal depth

- [ ] **Step 5: Build and check PWA**

```bash
npm run build
npm run preview
```

Open browser devtools → Application → Service Workers. Verify SW is registered. Check Manifest tab for correct name, colors, and icon.

- [ ] **Step 6: Final commit**

```bash
git add src/App.jsx src/main.jsx
git rm src/App.css src/assets/react.svg 2>/dev/null || true
git commit -m "feat: wire App.jsx with tab state — complete PRO tab implementation"
```
