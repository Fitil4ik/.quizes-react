import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { storage } from '../utils/storage'
import { ui } from '../utils/ui'

export default function Quiz() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    const q = storage.getQuizById(id)
    if (!q) {
      ui.showMessage('Вікторину не знайдено!', 'error')
      setTimeout(() => navigate('/'), 1000)
      return
    }
    setQuiz(q)
  }, [id])

  if (!quiz) return <div>Завантаження...</div>

  const selectOption = (optIdx) => {
    setAnswers(prev => {
      const copy = [...prev]
      copy[currentIndex] = optIdx
      return copy
    })
  }

  const next = () => {
    if (answers[currentIndex] === undefined) {
      ui.showMessage('Виберіть відповідь', 'warning')
      return
    }
    const nextIdx = currentIndex + 1
    if (nextIdx >= quiz.questions.length) {
      finish()
      return
    }
    setCurrentIndex(nextIdx)
  }

  const finish = () => {
    let score = 0
    answers.forEach((a, i) => { if (a === quiz.questions[i].correctAnswer) score++ })
    const result = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      score,
      totalQuestions: quiz.questions.length,
      date: new Date().toISOString(),
      userAnswers: answers
    }
    storage.saveResult(result)
    navigate('/result')
  }

  const q = quiz.questions[currentIndex]
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100

  return (
    <div>
      <div className="quiz-header card">
        <h2 id="quiz-title">{quiz.title}</h2>
        <p id="quiz-description">{quiz.description}</p>
      </div>

      <div className="progress-bar" style={{ marginTop: 12 }}>
        <div id="progress" className="progress" style={{ width: `${progress}%`, height: 8, background: 'var(--primary-color)', borderRadius: 6 }}></div>
      </div>

      <div className="question-container card" style={{ marginTop: 12 }}>
        <h3>{`Питання ${currentIndex + 1}: ${q.question}`}</h3>
        <div className="options-container">
          {q.options.map((opt, oi) => (
            <label key={oi} className="option-label">
              <input type="radio" name={`ans-${currentIndex}`} checked={answers[currentIndex] === oi} onChange={() => selectOption(oi)} />
              <span className="option-text">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="button" onClick={next}>{currentIndex === quiz.questions.length - 1 ? 'Завершити' : 'Далі'}</button>
        <button className="button" onClick={() => navigate('/')}>Вийти</button>
      </div>
    </div>
  )
}
