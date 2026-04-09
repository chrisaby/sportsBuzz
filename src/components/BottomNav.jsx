import { Gamepad2, Newspaper, Trophy, MoreHorizontal } from 'lucide-react'

const TABS = [
  { id: 'games', label: 'Games', Icon: Gamepad2 },
  { id: 'news',  label: 'News',  Icon: Newspaper },
  { id: 'pro',   label: 'Pro',   Icon: Trophy },
  { id: 'more',  label: 'More',  Icon: MoreHorizontal },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 max-w-md mx-auto"
      style={{ background: 'rgba(15, 20, 26, 0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center gap-1 px-4 py-1 relative"
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            {isActive && (
              <span className="absolute -top-1 w-1 h-1 rounded-full bg-secondary" />
            )}
            <Icon
              size={22}
              className={isActive ? 'text-primary' : 'text-on-surface-variant'}
            />
            <span
              className={`text-xs font-body ${
                isActive ? 'text-primary font-semibold' : 'text-on-surface-variant'
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
