import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { storage } from '../utils/storage'
import { ui } from '../utils/ui'
import { form } from '../utils/form'

function NewOption({ name, value, onChange, onRemove, checked, onSelect }) {
  return (
    <div className="option-row">
      <label className="option-label">
        <input type="radio" name={name} checked={checked} onChange={onSelect} />
        <input type="text" className="option-text" placeholder="Варіант відповіді" value={value} onChange={e => onChange(e.target.value)} />
      </label>
      <button type="button" className="button delete-btn" onClick={onRemove}>Видалити</button>
    </div>
  )
}

export default function Create() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState([
    { question: '', options: ['', ''], correctAnswer: 0 }
  ])
  const navigate = useNavigate()

  const addQuestion = () => {
    setQuestions(prev => [...prev, { question: '', options: ['', ''], correctAnswer: 0 }])
  }

  const removeQuestion = (index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index))
  }

  const addOption = (qIdx) => {
    setQuestions(prev => prev.map((q, i) => i === qIdx ? { ...q, options: [...q.options, ''] } : q))
  }

  const updateOption = (qIdx, optIdx, val) => {
    setQuestions(prev => prev.map((q, i) => i === qIdx ? { ...q, options: q.options.map((o, oi) => oi === optIdx ? val : o) } : q))
  }

  const selectCorrect = (qIdx, optIdx) => {
    setQuestions(prev => prev.map((q, i) => i === qIdx ? { ...q, correctAnswer: optIdx } : q))
  }

  const removeOption = (qIdx, optIdx) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q
      const newOptions = q.options.filter((_, idx) => idx !== optIdx)
      let newCorrect = q.correctAnswer
      if (q.correctAnswer === optIdx) {
        // if removed option was marked correct, reset to first option (if exists)
        newCorrect = newOptions.length > 0 ? 0 : null
      } else if (q.correctAnswer > optIdx) {
        // shift index left
        newCorrect = q.correctAnswer - 1
      }
      return { ...q, options: newOptions, correctAnswer: newCorrect }
    }))
  }

  const saveQuiz = () => {
    try {
      form.validateRequired(title, 'Назва вікторини')
      form.validateMinLength(title, 'Назва вікторини', 3)
      form.validateArray(questions, 'Питання')

      const sanitizedQuestions = questions.map((q, idx) => {
        form.validateRequired(q.question, `Питання ${idx + 1}`)
        form.validateArray(q.options, `Варіанти відповіді для питання ${idx + 1}`)
        q.options.forEach((opt, optIdx) => form.validateRequired(opt, `Варіант відповіді ${optIdx + 1} питання ${idx + 1}`))

        let correct = q.correctAnswer
        if (correct === null || correct === undefined) correct = 0
        correct = Number(correct)
        if (Number.isNaN(correct) || correct < 0 || correct >= q.options.length) {
          throw new Error(`Невірний індекс правильної відповіді для питання ${idx + 1}`)
        }

        return {
          question: q.question,
          options: q.options,
          correctAnswer: correct
        }
      })

      const quiz = {
        id: Date.now().toString(),
        title,
        description,
        questions: sanitizedQuestions,
        createdAt: new Date().toISOString()
      }

      storage.saveQuiz(quiz)
      ui.showMessage('Вікторину збережено', 'success')
      setTimeout(() => navigate('/'), 800)
    } catch (err) {
      ui.showMessage(err.message, 'error')
    }
  }

  return (
    <div>
      <h2>Створити вікторину</h2>
      <div className="card">
        <label>Назва:</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
        <label>Опис:</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </div>

      <div id="questions-container">
        {questions.map((q, qi) => (
          <div key={qi} className="question-block card">
            <label>Питання:</label>
            <input type="text" className="question-text" value={q.question} onChange={e => setQuestions(prev => prev.map((p, i) => i === qi ? { ...p, question: e.target.value } : p))} />

            <div className="options-container">
              {q.options.map((opt, oi) => (
                <NewOption
                  key={oi}
                  name={`correct-${qi}`}
                  value={opt}
                  onChange={v => updateOption(qi, oi, v)}
                  onRemove={() => removeOption(qi, oi)}
                  checked={q.correctAnswer === oi}
                  onSelect={() => selectCorrect(qi, oi)}
                />
              ))}
            </div>

            <div className="question-actions">
              <button type="button" className="button" onClick={() => addOption(qi)}>Додати варіант</button>
              <button type="button" className="button delete-btn" onClick={() => removeQuestion(qi)}>Видалити питання</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="button" onClick={addQuestion}>Додати питання</button>
        <button className="button" onClick={saveQuiz}>Зберегти</button>
        <button className="button" onClick={() => navigate('/')}>На головну</button>
      </div>
    </div>
  )
}
