import { useScheduleStore } from '../stores/scheduleStore'

/**
 * Retourne la liste des vacations depuis le store.
 * @returns {Array} Liste triée par date croissante.
 */
export function getUpcomingVacations() {
  const store = useScheduleStore()

  if (!store.vacations) return []

  return store.vacations
    .map((vac) => {
      // Convert to Date object if string
      const start = new Date(vac.start_date)
      const end = vac.end_date ? new Date(vac.end_date) : null

      return { name: vac.name, startDate: start, endDate: end, id: vac.id }
    })
    .sort((a, b) => a.startDate - b.startDate)
}

/**
 * Recherche une vacation par son nom.
 */
export function getVacationByName(vacationName) {
  const upcoming = getUpcomingVacations()
  return upcoming.find((vac) => vac.name.toLowerCase() === vacationName.toLowerCase())
}

// Compatibilité pour import { vacations }
export const vacations = [] // Deprecated but kept to prevent instant crash before full reload?
// Actually, imports are live bindings, but 'vacations' was an array export.
// It is better to remove it and fix callers.
