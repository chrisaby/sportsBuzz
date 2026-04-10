import { useRef, useEffect, useState, useCallback } from 'react'
import { AlignJustify } from 'lucide-react'

export default function ClueCarousel({ words, activeWordNum, direction, onDirectionChange, onClueClick, onViewAll }) {
  const trackRef = useRef(null)
  const clues = direction === 'across' ? words.across : words.down
  const [visibleIdx, setVisibleIdx] = useState(0)

  // Auto-scroll to match active word when grid selection changes
  useEffect(() => {
    setVisibleIdx(0)
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
        }}
      >
        {clues.map((w) => {
          const isActive = w.num === activeWordNum
          return (
            <button
              key={w.num}
              type="button"
              onClick={() => onClueClick(w.num, direction)}
              style={{ flex: '0 0 100%', scrollSnapAlign: 'start', textAlign: 'left' }}
              className={`bg-surface-high/60 border rounded-xl px-4 py-3 transition-colors ${
                isActive ? 'border-secondary/30' : 'border-white/10'
              }`}
            >
              {activeWordNum === null && clues.indexOf(w) === visibleIdx ? (
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
            </button>
          )
        })}
      </div>

      {/* View All button */}
      <button
        onClick={onViewAll}
        className="w-full mt-2 py-2 text-xs font-display font-bold uppercase tracking-wide text-on-surface-variant border border-white/10 rounded-xl hover:border-white/20 transition-colors"
      >
        <AlignJustify size={12} className="inline mr-1.5" />View All Clues
      </button>
    </div>
  )
}
