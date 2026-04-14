# PWA Update Toast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a top-of-screen toast when a new service worker is waiting, letting users reload to get the latest version or auto-dismiss after 8 seconds.

**Architecture:** `App.jsx` calls `useRegisterSW` from `virtual:pwa-register/react` and conditionally renders `<UpdateToast>` when a new SW is waiting. `UpdateToast` manages its own dismiss timer and progress bar animation, and calls `updateServiceWorker(true)` on "Reload" tap.

**Tech Stack:** React (JSX), Tailwind CSS, `vite-plugin-pwa` (`virtual:pwa-register/react`)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/UpdateToast.jsx` | Create | Toast UI, timer, progress bar, reload action |
| `src/App.jsx` | Modify | Call `useRegisterSW`, render `<UpdateToast>` |

---

### Task 1: Create UpdateToast component

**Files:**
- Create: `src/components/UpdateToast.jsx`

- [ ] **Step 1: Create the file with the full component**

```jsx
// src/components/UpdateToast.jsx
import { useEffect, useRef, useState } from 'react'

const DISMISS_MS = 8000

export default function UpdateToast({ updateServiceWorker, onDismiss }) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    // Trigger slide-in on next frame
    const raf = requestAnimationFrame(() => setVisible(true))

    timerRef.current = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300) // wait for slide-out transition
    }, DISMISS_MS)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timerRef.current)
    }
  }, [onDismiss])

  function handleReload() {
    clearTimeout(timerRef.current)
    updateServiceWorker(true)
  }

  return (
    <div
      className={`
        fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md
        transition-all duration-300 ease-out
        ${visible ? 'top-4 opacity-100' : '-top-full opacity-0'}
      `}
    >
      <div className="bg-surface-high rounded-xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-on-surface-variant">New version available</span>
          <button
            onClick={handleReload}
            className="text-sm font-semibold text-primary ml-4 shrink-0"
          >
            Reload
          </button>
        </div>
        <div className="h-0.5 bg-surface-highest">
          <div
            className="h-full bg-primary origin-left"
            style={{
              animation: `shrink ${DISMISS_MS}ms linear forwards`,
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/UpdateToast.jsx
git commit -m "feat: add UpdateToast component"
```

---

### Task 2: Wire UpdateToast into App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Read current App.jsx to confirm its exact content before editing**

Current content (from spec exploration):
```jsx
import { useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import ProTab from './tabs/ProTab'
import EmptyTab from './tabs/EmptyTab'
import GamesTab from './tabs/GamesTab'

function renderTab(activeTab) {
  if (activeTab === 'pro') return <ProTab />
  if (activeTab === 'games') return <GamesTab />
  const name = activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
  return <EmptyTab name={name} />
}

export default function App() {
  const [activeTab, setActiveTab] = useState('pro')

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <Header />
      <main>
        {renderTab(activeTab)}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
```

- [ ] **Step 2: Replace App.jsx with the updated version**

```jsx
import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import ProTab from './tabs/ProTab'
import EmptyTab from './tabs/EmptyTab'
import GamesTab from './tabs/GamesTab'
import UpdateToast from './components/UpdateToast'

function renderTab(activeTab) {
  if (activeTab === 'pro') return <ProTab />
  if (activeTab === 'games') return <GamesTab />
  const name = activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
  return <EmptyTab name={name} />
}

export default function App() {
  const [activeTab, setActiveTab] = useState('pro')
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      {needRefresh && (
        <UpdateToast
          updateServiceWorker={updateServiceWorker}
          onDismiss={() => setNeedRefresh(false)}
        />
      )}
      <Header />
      <main>
        {renderTab(activeTab)}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
```

- [ ] **Step 3: Verify the app builds without errors**

```bash
npm run build
```

Expected: build completes with no errors. If `virtual:pwa-register/react` is not found, ensure `vite-plugin-pwa` is installed: `npm list vite-plugin-pwa`.

- [ ] **Step 4: Smoke test in dev**

```bash
npm run dev
```

Open the app. No toast should appear on first load (no waiting SW). Toast appears only when a new SW is waiting — to test locally, build and serve, then modify a file, rebuild, and reload.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire PWA update toast into App"
```
