// src/components/GameCard.jsx
import { useNavigate } from 'react-router-dom'

export default function GameCard({ icon: Icon, name, description, badge, to }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(to)}
      className="bg-surface-high rounded-xl p-4 flex flex-col items-start gap-3 text-left hover:bg-surface-highest transition-colors w-full"
    >
      <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center">
        <Icon size={20} className="text-secondary" />
      </div>

      <div className="flex-1">
        <p className="font-display font-bold text-white text-sm mb-0.5">{name}</p>
        <p className="font-body text-on-surface-variant text-xs leading-relaxed">{description}</p>
      </div>

      {badge && (
        <span className="text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-background">
          {badge}
        </span>
      )}
    </button>
  )
}
