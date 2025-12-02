import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { storage } from '../utils/storage'
import { ui } from '../utils/ui'
import { date } from '../utils/date'

export default function Manage() {
  const [quizzes, setQuizzes] = useState([])
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    const qs = storage.getQuizzes()
    setQuizzes(qs)
    setFiltered(qs)
  }, [])

  const deleteQuiz = (id) => {
    if (!ui.confirm('Точно точно?')) return
    storage.deleteQuiz(id)
    ui.showMessage('Вікторину видалено', 'success')
    const qs = storage.getQuizzes()
    setQuizzes(qs)
    setFiltered(qs)
  }

  const filterQuizzes = (q) => {
    if (!q) return setFiltered(quizzes)
    const val = q.toLowerCase()
    setFiltered(quizzes.filter(qu => qu.title.toLowerCase().includes(val) || (qu.description || '').toLowerCase().includes(val)))
  }

  return (
    <div>
      <h2>Керування вікторинами</h2>
      <div className="search-bar">
        <input placeholder="Шукати..." onChange={e => filterQuizzes(e.target.value)} />
      </div>

      <div className="grid">
        {filtered.map(q => (
          <div key={q.id} className="quiz-card card fade-in">
            <button className="button delete-btn" onClick={() => deleteQuiz(q.id)}>×</button>
            <h3>{q.title}</h3>
            <p>{q.description}</p>
            <div className="quiz-stats">
              <p>Створено: {date.formatDate(q.createdAt)}</p>
              <p>Питань: {q.questions.length}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <Link to="/create" className="button">Створити вікторину</Link>
        <Link to="/" className="button">На головну</Link>
      </div>
    </div>
  )
}
