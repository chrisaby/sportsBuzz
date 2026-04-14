// src/tabs/HangmanSection.jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import HangmanGame from '../components/hangman/HangmanGame'
import questions from '../config/hangman.json'

function shuffleArray(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function HangmanSection() {
  const navigate = useNavigate()
  const shuffled = useMemo(() => shuffleArray(questions), [])
  const [index, setIndex] = useState(0)

  const currentQuestion = shuffled[index]

  const handleNext = () => {
    setIndex(prev => (prev + 1) % shuffled.length)
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <HangmanGame
      key={currentQuestion.id + '-' + index}
      question={currentQuestion}
      onBack={handleBack}
      onNext={handleNext}
    />
  )
}
