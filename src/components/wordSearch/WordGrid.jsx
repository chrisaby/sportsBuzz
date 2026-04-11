// src/components/wordSearch/WordGrid.jsx

// Returns array of {row, col} from start in direction for word.length steps
function buildCells(startRow, startCol, dx, dy, length) {
  return Array.from({ length }, (_, i) => ({
    row: startRow + i * dy,
    col: startCol + i * dx,
  }))
}

// Scans grid for a word in all 8 directions; returns {startRow,startCol,dx,dy} or null
export function findWordInGrid(grid, word) {
  const rows = grid.length
  const cols = grid[0].length
  const dirs = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ]
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      for (const [dx, dy] of dirs) {
        let match = true
        for (let i = 0; i < word.length; i++) {
          const nr = r + i * dy
          const nc = c + i * dx
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr][nc] !== word[i]) {
            match = false
            break
          }
        }
        if (match) return { startRow: r, startCol: c, dx, dy }
      }
    }
  }
  return null
}

function cellKey(row, col) {
  return `${row}-${col}`
}

export default function WordGrid({ grid, foundCells, selectionCells, missedCells }) {
  return (
    <div
      className="px-4 mb-4 select-none"
      style={{ touchAction: 'none' }}
    >
      <div
        className="grid gap-0.5"
        style={{ gridTemplateColumns: `repeat(${grid[0].length}, 1fr)` }}
      >
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const key = cellKey(r, c)
            const isFound = foundCells.has(key)
            const isSelected = selectionCells.has(key)
            const isMissed = missedCells.has(key)
            return (
              <div
                key={key}
                data-cell
                data-row={r}
                data-col={c}
                className={`
                  aspect-square flex items-center justify-center
                  text-xs font-display font-bold uppercase rounded-sm
                  transition-colors duration-100
                  ${isFound ? 'bg-green-500/80 text-white' : ''}
                  ${isSelected && !isFound ? 'bg-secondary text-background' : ''}
                  ${isMissed && !isFound ? 'bg-red-500/60 text-white' : ''}
                  ${!isFound && !isSelected && !isMissed ? 'bg-surface-high text-white' : ''}
                `}
              >
                {letter}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export { buildCells, cellKey }
