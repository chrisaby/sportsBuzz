// src/components/hangman/HangmanFigure.jsx

const STROKE = '#c3f400'        // secondary
const FRAME_STROKE = '#3d4754'  // surface-highest

export default function HangmanFigure({ wrongCount = 0 }) {
  return (
    <svg
      viewBox="0 0 120 140"
      width="120"
      height="140"
      aria-label={`Hangman figure with ${wrongCount} wrong guesses`}
    >
      {/* Gallows — always visible */}
      <line x1="10" y1="135" x2="110" y2="135" stroke={FRAME_STROKE} strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="135" x2="30" y2="10"  stroke={FRAME_STROKE} strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="10"  x2="80" y2="10"  stroke={FRAME_STROKE} strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="10"  x2="80" y2="28"  stroke={FRAME_STROKE} strokeWidth="3" strokeLinecap="round" />

      {/* 1 — Head */}
      {wrongCount >= 1 && (
        <circle cx="80" cy="38" r="10" stroke={STROKE} strokeWidth="2.5" fill="none" />
      )}

      {/* 2 — Body */}
      {wrongCount >= 2 && (
        <line x1="80" y1="48" x2="80" y2="88" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" />
      )}

      {/* 3 — Left arm */}
      {wrongCount >= 3 && (
        <line x1="80" y1="60" x2="60" y2="75" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" />
      )}

      {/* 4 — Right arm */}
      {wrongCount >= 4 && (
        <line x1="80" y1="60" x2="100" y2="75" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" />
      )}

      {/* 5 — Left leg */}
      {wrongCount >= 5 && (
        <line x1="80" y1="88" x2="62" y2="112" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" />
      )}

      {/* 6 — Right leg */}
      {wrongCount >= 6 && (
        <line x1="80" y1="88" x2="98" y2="112" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" />
      )}
    </svg>
  )
}
