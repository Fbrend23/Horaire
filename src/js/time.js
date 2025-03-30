/* time.js - Gestion du temps et affichage des horloges
   - Possibilité de simuler une date (utile pour les tests)
   - Fonction updateClocks() met à jour les horloges pour New York, Lausanne et Tokyo
*/
let simulatedNow = null;

/**
 * Retourne la date actuelle simulée si définie, sinon la date réelle.
 * @returns {Date}
 */
export function getNow() {
  return simulatedNow || new Date();
}

/**
 * Définit une date simulée.
 * @param {Date} date - La date à simuler.
 */
export function setSimulatedTime(date) {
  simulatedNow = date;
}

/**
 * Réinitialise la simulation de temps pour revenir à l’heure réelle.
 */
export function resetTime() {
  simulatedNow = null;
}

/**
 * Met à jour l'affichage des horloges pour plusieurs zones horaires.
 * Utilise getNow() afin de tenir compte d'une éventuelle date simulée.
 */
export function updateClocks() {
  const now = getNow();
  const options = { hour: 'numeric', minute: 'numeric' };

  // Formatage pour chaque zone géographique grâce à Intl.DateTimeFormat
  const timeNewYork = new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'America/New_York' }).format(now);
  const timeLausanne = new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'Europe/Zurich' }).format(now);
  const timeTokyo = new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'Asia/Tokyo' }).format(now);

  // Mise à jour des éléments du DOM si présents
  document.getElementById('time-newyork').textContent = timeNewYork;
  document.getElementById('time-lausanne').textContent = timeLausanne;
  document.getElementById('time-tokyo').textContent = timeTokyo;
}
