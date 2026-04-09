import { Search } from 'lucide-react'

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
      style={{ background: 'rgba(27, 32, 40, 0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary-dim flex items-center justify-center flex-shrink-0">
          <span className="font-display font-bold text-white text-xs">AC</span>
        </div>
        <span className="font-display font-bold text-primary tracking-wider text-sm uppercase">
          High-Velocity
        </span>
      </div>
      <button
        className="text-on-surface-variant hover:text-primary transition-colors p-1"
        type="button"
        aria-label="Search"
      >
        <Search size={20} />
      </button>
    </header>
  )
}
