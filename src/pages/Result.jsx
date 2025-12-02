import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { storage } from '../utils/storage'

export default function Result() {
  const [result, setResult] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const r = storage.getCurrentResult()
    if (!r) {
      setTimeout(() => navigate('/'), 800)
      return
    }
    setResult(r)
    setQuiz(storage.getQuizById(r.quizId))
  }, [])

  if (!result) return <div>Loading...</div>

  const percentage = ((result.score / result.totalQuestions) * 100).toFixed(1)

  return (
    <div>
      <h2>Результат</h2>
      <h3>{result.quizTitle}</h3>

      <div className="score-container card">
        <h3>Оцінка:</h3>
        <div className="score"><span id="score">{result.score}</span>/<span id="total">{result.totalQuestions}</span></div>
        <p id="percentage">{percentage}% Правильно</p>
      </div>

      <div className="review-container card" style={{ marginTop: 12 }}>
        <h3>Перевір свої відповіді</h3>
        {quiz && quiz.questions.map((q, idx) => {
          const user = result.userAnswers[idx]
          const correct = q.correctAnswer
          return (
            <div key={idx} className={`question-review card ${user === correct ? 'correct' : 'incorrect'}`}>
              <h4>{`Питання ${idx + 1}: ${q.question}`}</h4>
              <div className="options-review">
                {q.options.map((opt, oi) => (
                  <div key={oi} className={`option ${oi === user ? 'selected' : ''} ${oi === correct ? 'correct-answer' : ''}`}>
                    {opt} {oi === user ? <em>(Твоя відповідь)</em> : ''} {oi === correct ? <strong> (Правильна)</strong> : ''}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 12 }} className="nav-buttons">
        <button className="button" onClick={() => navigate('/')}>На головну</button>
        <button className="button" onClick={() => {
          if (result) { storage.setCurrentQuiz(result.quizId); navigate(`/quiz/${result.quizId}`) }
        }}>Почати знову</button>
      </div>
    </div>
  )
}
