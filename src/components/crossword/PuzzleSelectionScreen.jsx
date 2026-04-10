import { Grid3X3 } from 'lucide-react'
import PuzzleCard from './PuzzleCard'

export default function PuzzleSelectionScreen({ puzzles, progressMap, onSelect }) {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="px-4 pt-2 pb-4">
        <p className="text-secondary text-xs font-display font-semibold uppercase tracking-widest mb-1">
          Daily Challenge
        </p>
        <h2 className="font-display font-bold text-white text-3xl mb-3">
          Crosswords
        </h2>

        {/* Featured card */}
        <div
          className="rounded-xl p-5 mb-5"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-secondary/15 flex items-center justify-center">
              <Grid3X3 size={18} className="text-secondary" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">
                Sports Crossword
              </p>
              <p className="font-body text-on-surface-variant text-xs">
                Test your sports knowledge
              </p>
            </div>
          </div>
          <p className="font-body text-on-surface-variant/70 text-sm leading-relaxed">
            Solve clues across cricket, football, basketball, tennis, and
            Olympic sports. Three difficulty levels to challenge every fan.
          </p>
        </div>
      </section>

      {/* Puzzle list */}
      <section className="px-4">
        <div className="flex items-end justify-between mb-3">
          <h3 className="font-display font-bold text-white text-lg">
            Today&apos;s Puzzles
          </h3>
          <span className="font-body text-on-surface-variant text-xs">
            {puzzles.length} puzzles
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {puzzles.map((puzzle) => (
            <PuzzleCard
              key={puzzle.id}
              puzzle={puzzle}
              progress={progressMap[puzzle.id]}
              onSelect={onSelect}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
