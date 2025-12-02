export const ui = {
  showMessage(message, type = 'info') {
    const div = document.createElement('div')
    div.className = `message ${type} fade-in`
    div.textContent = message
    document.body.appendChild(div)
    setTimeout(() => div.remove(), 3000)
  },

  confirm(message) {
    return window.confirm(message)
  }
}
