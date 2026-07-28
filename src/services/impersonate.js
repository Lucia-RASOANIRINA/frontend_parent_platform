/**
 * Permet à l'administrateur de visiter le site en tant que parent, éducatrice ou psy.
 * Le vrai compte admin est conservé dans "adminReal" et restauré ensuite.
 */
const HOMES = { PARENT: '/homeparent', EDUCATEUR: '/hometeacher', PSY: '/homepsy' }

export function getStoredUser() {
  try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
}

export function isPreview() {
  const u = getStoredUser()
  return !!(u && u.preview)
}

export function previewRole() {
  const u = getStoredUser()
  return u && u.preview ? u.role : null
}

export function viewAs(role) {
  const real = getStoredUser()
  if (!real) return
  if (!localStorage.getItem('adminReal')) {
    localStorage.setItem('adminReal', JSON.stringify(real))
  }
  const preview = { ...real, role, preview: true, realRole: real.role || 'ADMIN' }
  localStorage.setItem('user', JSON.stringify(preview))
  // Rechargement complet pour que les en-têtes/données se ré-initialisent
  window.location.href = HOMES[role] || '/'
}

export function stopViewing() {
  const real = localStorage.getItem('adminReal')
  if (real) {
    localStorage.setItem('user', real)
    localStorage.removeItem('adminReal')
  }
  window.location.href = '/admin'
}
