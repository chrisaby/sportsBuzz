// src/components/wordSearch/WordChips.jsx
export default function WordChips({ words, foundWords }) {
  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-display font-bold uppercase tracking-widest text-on-surface-variant">
          Words to Find
        </p>
        <p className="text-xs font-display font-bold text-secondary">
          {foundWords.size}/{words.length} Found
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {words.map((word) => {
          const found = foundWords.has(word)
          return (
            <span
              key={word}
              className={`px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide border transition-all ${
                found
                  ? 'border-secondary text-secondary line-through opacity-60'
                  : 'border-white/20 text-white'
              }`}
            >
              {found && <span className="mr-1">✓</span>}
              {word}
            </span>
          )
        })}
      </div>
    </div>
  )
}
