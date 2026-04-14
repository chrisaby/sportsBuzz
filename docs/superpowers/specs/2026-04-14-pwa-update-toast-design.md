# PWA Update Toast — Design Spec

**Date:** 2026-04-14  
**Status:** Approved

## Problem

Users see stale UI after a PWA update unless they hard-reload. The service worker updates silently in the background but the new version doesn't activate until the next navigation.

## Solution

Show a non-blocking toast at the top of the screen when a new service worker is waiting. The user can tap "Reload" to activate the update immediately, or let it auto-dismiss after 8 seconds without forcing a reload.

---

## Architecture

### SW Registration Hook

Use `useRegisterSW` from `virtual:pwa-register/react` (shipped by `vite-plugin-pwa`). This hook exposes:
- `needRefresh: [boolean, setter]` — true when a new SW is waiting
- `updateServiceWorker(reloadPage: boolean)` — activates the waiting SW, optionally reloading the page

No changes to `vite.config.js`. The existing `registerType: 'autoUpdate'` handles first-install precaching; the hook handles subsequent update notifications.

### Component Tree

```
App.jsx
  └── UpdateToast (new component)
        props: needRefresh, updateServiceWorker
```

`App.jsx` calls `useRegisterSW`, reads `needRefresh[0]`, and renders `<UpdateToast>` only when true.

---

## UpdateToast Component

**File:** `src/components/UpdateToast.jsx`

### Behaviour
- Mounts when `needRefresh[0]` is `true`
- Auto-dismisses after **8 seconds** via `setTimeout`
- "Reload" button calls `updateServiceWorker(true)` — activates SW and reloads the page
- Auto-dismiss (timeout) calls `setNeedRefresh(false)` only — does NOT force update; the SW remains waiting and will activate on next natural navigation

### Visual
- **Position:** fixed top, horizontally centered, inside the `max-w-md` container
- **Slide-in:** translates from `-top-full` to `top-4` with a CSS transition on mount
- **Layout:** single row — message text left, "Reload" button right
- **Progress bar:** thin bar at the bottom of the toast, drains left-to-right over 8s using a CSS animation, styled with `primary` color
- **Colors:** `surface-high` background, `primary` for button + progress bar, `on-surface-variant` for message text
- **Border radius:** `xl` (12px), consistent with app card style

### Tokens used
| Token | Usage |
|---|---|
| `surface-high` (#1b2028) | Toast background |
| `primary` (#95aaff) | Reload button, progress bar |
| `on-surface-variant` (#a8abb3) | Message text |
| `xl` border-radius | Toast corners |

---

## Data Flow

```
vite-plugin-pwa (SW lifecycle)
  → useRegisterSW hook
    → needRefresh[0] = true
      → <UpdateToast> renders
        → user taps Reload → updateServiceWorker(true) → page reloads with new SW
        → 8s timeout → setNeedRefresh(false) → toast hides, SW still waiting
```

---

## Out of Scope

- Multiple stacked toasts (only one update can be pending at a time)
- Offline/online status indicator
- Force-reload on auto-dismiss
