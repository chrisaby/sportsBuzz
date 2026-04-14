// src/components/hangman/HangmanGame.jsx
import { useState, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import HangmanFigure from './HangmanFigure'

const MAX_WRONG = 6

const KEYBOARD_ROWS = [
  ['A','B','C','D','E','F','G'],
  ['H','I','J','K','L','M','N'],
  ['O','P','Q','R','S','T','U'],
  ['V','W','X','Y','Z'],
]

export default function HangmanGame({ question, onBack, onNext }) {
  const [guessed, setGuessed] = useState(new Set())
  const [hintsRevealed, setHintsRevealed] = useState(1) // 1 = only hint 1 shown

  const answerLetters = question.answer.split('') // e.g. ['R','O','N','A','L','D','O']
  const wrongGuesses = [...guessed].filter(l => !question.answer.includes(l))
  const wrongCount = wrongGuesses.length

  const isWon = answerLetters
    .filter(l => l !== ' ')
    .every(l => guessed.has(l))
  const isLost = wrongCount >= MAX_WRONG
  const gameOver = isWon || isLost

  const handleGuess = useCallback((letter) => {
    if (gameOver || guessed.has(letter)) return
    setGuessed(prev => new Set([...prev, letter]))
  }, [gameOver, guessed])

  const handleRevealHint = useCallback((hintIndex) => {
    // hintIndex is 1-based. Reveal if previous hint is already revealed.
    if (hintIndex === hintsRevealed + 1) {
      setHintsRevealed(hintIndex)
    }
  }, [hintsRevealed])

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button type="button" onClick={onBack} className="p-1" aria-label="Back to games">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div>
          <p className="text-secondary text-xs font-display font-semibold uppercase tracking-widest">
            Sports Hangman
          </p>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Gallows */}
        <div className="bg-surface-low rounded-xl flex items-center justify-center py-4">
          <HangmanFigure wrongCount={wrongCount} />
        </div>

        {/* Category */}
        <p className="text-on-surface-variant text-xs font-display font-semibold uppercase tracking-widest text-center">
          {question.category}
        </p>

        {/* Answer blanks */}
        <div className="flex flex-wrap justify-center gap-2">
          {answerLetters.map((letter, i) => {
            if (letter === ' ') {
              return <div key={i} className="w-4" />
            }
            const revealed = guessed.has(letter)
            return (
              <div key={i} className="flex flex-col items-center">
                <span className="font-display font-bold text-2xl tracking-widest min-w-[1.5rem] text-center text-white">
                  {revealed ? letter : '\u00A0'}
                </span>
                <div className="h-0.5 w-6 bg-on-surface-variant mt-1" />
              </div>
            )
          })}
        </div>

        {/* Game over modal */}
        {gameOver && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6">
            <div className="bg-surface-high rounded-xl p-6 w-full max-w-sm flex flex-col items-center gap-4">
              <p className="text-4xl">{isWon ? '🎉' : '😔'}</p>
              <p className="font-display font-bold text-white text-xl text-center">
                {isWon ? 'Well played!' : 'Better luck next time!'}
              </p>
              {isWon && (
                <p className="font-display font-bold text-secondary text-2xl tracking-widest text-center">
                  {question.answer}
                </p>
              )}
              <button
                type="button"
                onClick={onNext}
                className="w-full py-3 rounded-xl bg-secondary text-background font-display font-bold text-sm uppercase tracking-wider"
              >
                {isWon ? 'Next Question →' : 'Try Next →'}
              </button>
            </div>
          </div>
        )}

        {/* Hints */}
        <div className="bg-surface-low rounded-xl overflow-hidden">
          {question.hints.map((hint, i) => {
            const hintNumber = i + 1            // 1-based
            const isVisible = hintNumber <= hintsRevealed
            const canReveal = hintNumber === hintsRevealed + 1
            return (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 border-b border-surface-high last:border-0"
              >
                <span className="text-base mt-0.5">💡</span>
                {isVisible ? (
                  <p className="font-body text-white text-sm leading-relaxed">{hint}</p>
                ) : (
                  <div className="flex flex-1 items-center justify-between">
                    <p className="font-body text-on-surface-variant text-sm italic">
                      Hint {hintNumber}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRevealHint(hintNumber)}
                      disabled={!canReveal}
                      className={`px-3 py-1 rounded-md font-display font-bold text-xs uppercase tracking-wider ${
                        canReveal
                          ? 'bg-secondary text-background'
                          : 'bg-surface-highest text-on-surface-variant cursor-not-allowed'
                      }`}
                    >
                      {canReveal ? 'Reveal' : 'Locked'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Keyboard */}
        <div className="flex flex-col items-center gap-2">
          {KEYBOARD_ROWS.map((row, ri) => (
            <div key={ri} className="flex gap-1.5 justify-center flex-wrap">
              {row.map((letter) => {
                const isCorrect = guessed.has(letter) && question.answer.includes(letter)
                const isWrong  = guessed.has(letter) && !question.answer.includes(letter)
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => handleGuess(letter)}
                    disabled={gameOver || guessed.has(letter)}
                    className={`w-9 h-9 rounded-md font-display font-bold text-sm transition-colors ${
                      isCorrect
                        ? 'bg-green-500 text-white'
                        : isWrong
                        ? 'bg-red-500 text-white cursor-not-allowed'
                        : 'bg-surface-high text-white active:bg-surface-highest'
                    }`}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
