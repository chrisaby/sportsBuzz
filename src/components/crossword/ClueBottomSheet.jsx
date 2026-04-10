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
