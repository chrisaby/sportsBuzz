import { useRef, useEffect, useState, useCallback } from 'react'
import { AlignJustify, ChevronLeft, ChevronRight } from 'lucide-react'

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

      {/* Scroll-snap track + floating arrows */}
      <div className="relative">
        {/* Prev arrow */}
        {visibleIdx > 0 && (
          <button
            type="button"
            onClick={() => {
              const next = visibleIdx - 1
              setVisibleIdx(next)
              trackRef.current?.scrollTo({ left: next * trackRef.current.offsetWidth, behavior: 'smooth' })
            }}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-surface-high/90 border border-white/10 text-on-surface-variant shadow-md"
            aria-label="Previous clue"
          >
            <ChevronLeft size={14} />
          </button>
        )}

        {/* Next arrow */}
        {visibleIdx < clues.length - 1 && (
          <button
            type="button"
            onClick={() => {
              const next = visibleIdx + 1
              setVisibleIdx(next)
              trackRef.current?.scrollTo({ left: next * trackRef.current.offsetWidth, behavior: 'smooth' })
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-surface-high/90 border border-white/10 text-on-surface-variant shadow-md"
            aria-label="Next clue"
          >
            <ChevronRight size={14} />
          </button>
        )}

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
              className={`bg-surface-high/60 border rounded-xl px-10 py-4 transition-colors ${
                isActive ? 'border-secondary/30' : 'border-white/10'
              }`}
            >
              {activeWordNum === null && clues[visibleIdx] === w ? (
                <p className="font-body text-on-surface-variant">Tap a cell to begin</p>
              ) : (
                <p className="font-body text-white/80">
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
