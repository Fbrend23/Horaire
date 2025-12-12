/* time.js - Gestion du temps */

let simulatedNow = null

/**
 * Retourne la date actuelle simulée si définie, sinon la date réelle.
 * @returns {Date}
 */
export function getNow() {
  return simulatedNow || new Date()
}

/**
 * Définit une date simulée.
 * @param {Date} date - La date à simuler.
 */
export function setSimulatedTime(date) {
  simulatedNow = date
}

/**
 * Réinitialise la simulation de temps pour revenir à l’heure réelle.
 */
export function resetTime() {
  simulatedNow = null
}
