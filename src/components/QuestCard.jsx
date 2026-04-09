import { Footprints, Dumbbell } from 'lucide-react'

const ICON_MAP = {
  steps: Footprints,
  workout: Dumbbell,
}

export default function QuestCard({ icon, badge, title, description, current, goal, unit }) {
  const Icon = ICON_MAP[icon] ?? Dumbbell
  const progress = Math.min(current / goal, 1)

  return (
    <div className="bg-surface-high rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-surface-highest flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>
        <span className="bg-secondary text-background text-xs font-display font-bold uppercase tracking-wide px-2 py-0.5 rounded-md">
          {badge}
        </span>
      </div>
      <h3 className="font-display font-bold text-white text-lg mb-1">{title}</h3>
      <p className="font-body text-on-surface-variant text-sm mb-4">{description}</p>
      <div className="w-full h-1.5 bg-surface-highest rounded-full overflow-hidden mb-2">
        <div
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={goal}
          aria-label={`${title} progress`}
          className="h-full bg-primary rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <p className="font-body text-on-surface-variant text-xs text-right">
        {current.toLocaleString()} / {goal.toLocaleString()} {unit}
      </p>
    </div>
  )
}
