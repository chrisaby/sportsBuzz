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
