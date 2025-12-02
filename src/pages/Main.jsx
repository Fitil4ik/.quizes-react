import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { storage } from '../utils/storage'

function QuizCard({ quiz }) {
  const navigate = useNavigate()
  return (
    <div className="quiz-card card fade-in" onClick={() => navigate(`/quiz/${quiz.id}`)}>
      <h3>{quiz.title}</h3>
      <p>{quiz.description || 'Немає опису'}</p>
      <div className="quiz-stats">
        <p>Питань: {quiz.questions.length}</p>
      </div>
    </div>
  )
}

export default function Main() {
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    setQuizzes(storage.getQuizzes())
  }, [])

  return (
    <div>
      {quizzes.length === 0 ? (
        <div className="empty-state card fade-in">
          <h3>Вікторин тут немає</h3>
          <p>Створіть нову вікторину!</p>
          <Link to="/create" className="button">Створити</Link>
        </div>
      ) : (
        <div className="grid">
          {quizzes.map(q => (
            <QuizCard key={q.id} quiz={q} />
          ))}
        </div>
      )}
    </div>
  )
}
