import { Clock, CheckCircle2 } from 'lucide-react'

const DIFF_STYLES = {
  easy: { badge: 'bg-secondary text-background', bar: 'bg-secondary' },
  medium: { badge: 'bg-amber-500 text-background', bar: 'bg-amber-500' },
  hard: { badge: 'bg-red-500/20 text-red-300 border border-red-500/40', bar: 'bg-red-400' },
}

export default function PuzzleCard({ puzzle, progress, onSelect }) {
  const { title, difficulty, estimatedMinutes, description, solution } = puzzle
  const styles = DIFF_STYLES[difficulty] || DIFF_STYLES.easy

  // Calculate progress %
  let totalCells = 0
  let filledCells = 0
  const grid = progress?.userGrid
  if (solution) {
    for (let r = 0; r < solution.length; r++)
      for (let c = 0; c < (solution[r]?.length || 0); c++)
        if (solution[r][c] !== null) {
          totalCells++
          if (grid?.[r]?.[c]) filledCells++
        }
  }
  const isCompleted = progress?.completed === true
  const pct = isCompleted ? 100 : totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0
  const isStarted = filledCells > 0

  const label = isCompleted ? 'Play Again' : isStarted ? 'Resume' : 'Start'
  const status = isCompleted
    ? 'Completed'
    : isStarted
      ? 'In Progress'
      : 'Not Started'

  return (
    <div className="bg-surface-high rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <span
          className={`text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${styles.badge}`}
        >
          {difficulty}
        </span>
        <div className="flex items-center gap-1 text-on-surface-variant">
          {isCompleted ? (
            <CheckCircle2 size={14} className="text-green-400" />
          ) : (
            <Clock size={12} />
          )}
          <span className="font-body text-xs">
            {isCompleted ? 'Done' : `${estimatedMinutes ?? '?'} min`}
          </span>
        </div>
      </div>

      <h3 className="font-display font-bold text-white text-xl mb-1">
        {title}
      </h3>
      <p className="font-body text-on-surface-variant text-sm mb-3">
        {description}
      </p>

      {/* Progress bar */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-body text-on-surface-variant/60 text-xs uppercase tracking-wide">
          {status}
        </span>
        <span className="font-body text-on-surface-variant/60 text-xs">
          {pct}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-surface-highest rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all ${styles.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <button
        onClick={() => onSelect(puzzle)}
        className="w-full py-2.5 rounded-lg font-display text-sm font-bold uppercase tracking-wide border border-white/15 text-white hover:bg-white/5 transition-colors"
      >
        {label}
      </button>
    </div>
  )
}
