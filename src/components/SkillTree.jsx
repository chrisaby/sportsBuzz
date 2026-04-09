import { Zap, Gauge, Brain, Utensils } from 'lucide-react'

const SKILLS = [
  { id: 'power',  Icon: Zap,      name: 'Explosive Power',   status: 'MASTERED',    mastered: true },
  { id: 'speed',  Icon: Gauge,    name: 'Linear Speed',      status: 'MASTERED',    mastered: true },
  { id: 'mental', Icon: Brain,    name: 'Mental Fortitude',  status: '60% LOCKED',  mastered: false },
  { id: 'fuel',   Icon: Utensils, name: 'Precision Fuel',    status: 'LOCKED',      mastered: false },
]

export default function SkillTree() {
  return (
    <section className="px-4 py-6">
      <p className="text-secondary text-xs font-display font-semibold uppercase tracking-widest mb-1">
        Growth Pathway
      </p>
      <h2 className="font-display font-bold text-white text-3xl mb-6">Skill Tree</h2>

      <div className="grid grid-cols-2 gap-3">
        {SKILLS.map(({ id, Icon, name, status, mastered }) => (
          <div
            key={id}
            className={`bg-surface-high rounded-xl p-4 flex flex-col items-center gap-3 ${
              mastered ? '' : 'opacity-60'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                mastered ? 'bg-primary-dim' : 'bg-surface-highest'
              }`}
            >
              <Icon
                size={22}
                className={mastered ? 'text-white' : 'text-on-surface-variant'}
              />
            </div>
            <p className="font-body text-white text-xs font-semibold text-center leading-tight">
              {name}
            </p>
            <p className="font-body text-on-surface-variant text-xs uppercase tracking-wide">
              {status}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
