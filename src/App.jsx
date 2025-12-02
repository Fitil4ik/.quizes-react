import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Main from './pages/Main'
import Create from './pages/Create'
import Manage from './pages/Manage'
import Quiz from './pages/Quiz'
import Result from './pages/Result'

export default function App() {
  return (
    <div>
      <header className="header">
        <h1>Вікторини</h1>
        <div className="nav-buttons">
          <Link to="/create" className="button">Створити вікторину</Link>
          <Link to="/manage" className="button">Керувати вікторинами</Link>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/create" element={<Create />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <small>
          &copy; <span className="site-year">{new Date().getFullYear()}</span> — Розроблено: <span className="contributors">Євстаф'єв Євген, Демент'єв Микита, Артем Вигівський</span>.
        </small>
      </footer>
    </div>
  )
}
