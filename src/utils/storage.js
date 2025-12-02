export const storage = {
  getQuizzes() {
    return JSON.parse(localStorage.getItem('quizzes')) || []
  },

  saveQuiz(quiz) {
    const quizzes = this.getQuizzes()
    quizzes.push(quiz)
    localStorage.setItem('quizzes', JSON.stringify(quizzes))
  },

  deleteQuiz(quizId) {
    let quizzes = this.getQuizzes()
    quizzes = quizzes.filter(q => q.id !== quizId)
    localStorage.setItem('quizzes', JSON.stringify(quizzes))
    this.deleteQuizResults(quizId)
  },

  getQuizById(quizId) {
    const quizzes = this.getQuizzes()
    return quizzes.find(q => q.id === quizId)
  },

  getResults() {
    return JSON.parse(localStorage.getItem('quizResults')) || []
  },

  saveResult(result) {
    const results = this.getResults()
    results.push(result)
    localStorage.setItem('quizResults', JSON.stringify(results))
    localStorage.setItem('currentResult', JSON.stringify(result))
  },

  deleteQuizResults(quizId) {
    let results = this.getResults()
    results = results.filter(r => r.quizId !== quizId)
    localStorage.setItem('quizResults', JSON.stringify(results))
  },

  setCurrentQuiz(quizId) {
    localStorage.setItem('currentQuizId', quizId)
  },

  getCurrentQuiz() {
    const quizId = localStorage.getItem('currentQuizId')
    return this.getQuizById(quizId)
  },

  getCurrentResult() {
    return JSON.parse(localStorage.getItem('currentResult')) || null
  }
}
