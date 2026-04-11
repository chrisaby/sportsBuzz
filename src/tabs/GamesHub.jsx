// src/tabs/GamesHub.jsx
import { Grid3X3, Search } from 'lucide-react'
import GameCard from '../components/GameCard'

const GAMES = [
  {
    icon: Grid3X3,
    name: 'Crossword',
    description: 'Sports clues across cricket, football, basketball & more.',
    badge: '3 puzzles',
    to: '/crossword',
  },
  {
    icon: Search,
    name: 'Word Search',
    description: 'Find hidden sports terms in the grid.',
    badge: '4 puzzles',
    to: '/word-search',
  },
]

export default function GamesHub() {
  return (
    <div className="pb-24 px-4 pt-4">
      <p className="text-secondary text-xs font-display font-semibold uppercase tracking-widest mb-1">
        Play
      </p>
      <h2 className="font-display font-bold text-white text-3xl mb-6">
        Games
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {GAMES.map((game) => (
          <GameCard key={game.to} {...game} />
        ))}
      </div>
    </div>
  )
}
