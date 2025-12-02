const PAIRS = [
  { name: 'main', dark: '/src/styles/dt/main.css', light: '/src/styles/lt/main.css' },
  { name: 'quiz', dark: '/src/styles/dt/quiz.css', light: '/src/styles/lt/quiz.css' }
]

function ensureLink(id, href) {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('link')
    el.rel = 'stylesheet'
    el.id = id
    el.href = href
    document.head.appendChild(el)
  } else {
    el.href = href
  }
  return el
}

export function initTheme(defaultTheme = 'light') {
  if (typeof document === 'undefined') return
  // create both dark and light links for each pair and disable one
  PAIRS.forEach(p => {
    const darkId = `app-${p.name}-dark`
    const lightId = `app-${p.name}-light`
    const darkEl = ensureLink(darkId, p.dark)
    const lightEl = ensureLink(lightId, p.light)
    if (defaultTheme === 'dark') {
      darkEl.disabled = false
      lightEl.disabled = true
    } else {
      darkEl.disabled = true
      lightEl.disabled = false
    }
  })
  try { localStorage.setItem('theme', defaultTheme) } catch (e) {}
}

export function setTheme(theme) {
  if (typeof document === 'undefined') return
  PAIRS.forEach(p => {
    const darkEl = document.getElementById(`app-${p.name}-dark`)
    const lightEl = document.getElementById(`app-${p.name}-light`)
    if (darkEl && lightEl) {
      darkEl.disabled = theme !== 'dark'
      lightEl.disabled = theme === 'dark'
    }
  })
  try { localStorage.setItem('theme', theme) } catch (e) {}
}

export function getSavedTheme() {
  try { return localStorage.getItem('theme') || 'light' } catch (e) { return 'light' }
}

export default { initTheme, setTheme, getSavedTheme }
