import { getNow } from './time.js'

// Liste des vacations avec dates de début et de fin
export const vacations = [
  {
    name: 'Pâques',
    startDate: new Date(2025, 3, 12), // 12 avril 2025
    endDate: new Date(2025, 3, 27), // 27 avril 2025
  },
  {
    name: 'Été',
    startDate: new Date(2025, 5, 28), // 28 juin 2025
    endDate: new Date(2025, 7, 17), // 17 août 2025
  },
  {
    name: 'Automne',
    startDate: new Date(2025, 9, 11), // 6 octobre 2025
    endDate: new Date(2025, 9, 26), // 10 octobre 2025
  },
  {
    name: 'Noël',
    startDate: new Date(2025, 11, 20), // 21 décembre 2025
    endDate: new Date(2026, 0, 4), // 6 janvier 2026
  },
  {
    name: 'Hiver',
    startDate: new Date(2026, 1, 14), // 13 février 2026
    endDate: new Date(2026, 1, 22), // 22 février 2026
  },
  {
    name: 'Pâques',
    startDate: new Date(2026, 3, 3), // 13 avril 2026
    endDate: new Date(2026, 3, 19), // 17 avril 2026
  },
  {
    name: 'Été',
    startDate: new Date(2026, 5, 27), // 3 juillet 2026
    endDate: null,
  },
]

/**
 * Retourne la liste des vacations à venir.
 * Si la date de début d'une vacation est passée, celle-ci est recalculée pour l'année suivante.
 * @returns {Array} Liste triée par date croissante.
 */
export function getUpcomingVacations() {
  const today = getNow()
  return vacations
    .map((vac) => {
      let start = vac.startDate
      if (start < today) {
        // Recalcule la date pour l'année suivante
        start = new Date(today.getFullYear() + 1, start.getMonth(), start.getDate())
      }
      return { name: vac.name, startDate: start, endDate: vac.endDate }
    })
    .sort((a, b) => a.startDate - b.startDate)
}

/**
 * Recherche une vacation par son nom dans la liste des vacations à venir.
 * @param {string} vacationName - Nom de la vacation recherchée.
 * @returns {Object|undefined} Vacation correspondante ou undefined si non trouvée.
 */
export function getVacationByName(vacationName) {
  const upcoming = getUpcomingVacations()
  return upcoming.find((vac) => vac.name.toLowerCase() === vacationName.toLowerCase())
}
