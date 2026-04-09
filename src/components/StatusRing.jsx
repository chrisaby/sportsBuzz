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
