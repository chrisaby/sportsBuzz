// src/tabs/WordSearchHub.jsx
import { ArrowLeft } from 'lucide-react'
import { STORAGE_PREFIX } from '../config/wordSearchStorage'
import puzzles from '../config/wordSearch.json'

function loadAllProgress() {
  const map = {}
  puzzles.forEach((p) => {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + p.id)
      if (raw) map[p.id] = JSON.parse(raw)
    } catch { /* ignore */ }
  })
  return map
}

export default function WordSearchHub({ onSelect, onBack }) {
  const progressMap = loadAllProgress()

  const totalWordsFound = puzzles.reduce((sum, p) => {
    return sum + (progressMap[p.id]?.wordsFound?.length ?? 0)
  }, 0)

  const totalAttempts = puzzles.reduce((sum, p) => {
    return sum + (progressMap[p.id]?.totalAttempts ?? 0)
  }, 0)

  const accuracy = totalAttempts > 0
    ? Math.round((totalWordsFound / totalAttempts) * 100)
    : 0

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4">
        <button onClick={onBack} className="text-white p-1">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="text-xs font-display font-bold uppercase tracking-widest text-secondary">
            Velocity Word Search
          </p>
        </div>
      </div>

      <div className="px-4">
        <p className="text-secondary text-xs font-display font-semibold uppercase tracking-widest mb-1">
          Game Lobby
        </p>
        <h2 className="font-display font-bold text-white text-3xl mb-1">Select Category</h2>
        <p className="text-on-surface-variant font-body text-sm mb-6">
          Find all the hidden sports words before time runs out.
        </p>

        {/* Category cards */}
        <div className="flex flex-col gap-3 mb-8">
          {puzzles.map((puzzle) => {
            const progress = progressMap[puzzle.id]
            const found = progress?.wordsFound?.length ?? 0
            const pct = Math.round((found / puzzle.words.length) * 100)
            return (
              <button
                key={puzzle.id}
                onClick={() => onSelect(puzzle)}
                className="bg-surface-high rounded-xl overflow-hidden text-left w-full"
              >
                {/* Image area */}
                <div className="relative h-20 bg-gradient-to-r from-secondary/20 to-surface-highest flex items-end p-3">
                  <span className="absolute top-2 right-2 text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-background">
                    {puzzle.words.length} words
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-secondary text-[10px] font-display font-bold uppercase tracking-widest mb-0.5">
                    {puzzle.categoryLabel}
                  </p>
                  <p className="text-white font-display font-bold text-sm mb-2">{puzzle.title}</p>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-secondary text-xs font-display font-bold">{pct}% complete</p>
                  </div>
                  <div className="h-1 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Season Performance */}
        <p className="text-secondary text-xs font-display font-semibold uppercase tracking-widest mb-3">
          Season Performance
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Words Found', value: totalWordsFound },
            { label: 'Accuracy', value: `${accuracy}%` },
            { label: 'Puzzles', value: `${puzzles.length}` },
            { label: 'Global Rank', value: '#—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-surface-high rounded-xl p-4">
              <p className="text-white font-display font-bold text-2xl">{value}</p>
              <p className="text-on-surface-variant text-xs font-display uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
