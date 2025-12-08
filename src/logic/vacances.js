export const vacations = [
  {
    name: 'Pâques',
    startDate: new Date(2025, 3, 12),
    endDate: new Date(2025, 3, 27),
  },
  {
    name: 'Été',
    startDate: new Date(2025, 5, 28),
    endDate: new Date(2025, 7, 17),
  },
  // TODO
]

export function getUpcomingVacations() {
  const today = new Date()
  return vacations
    .map((vac) => {
      let start = new Date(vac.startDate)
      // Si la date est passée, on regarde l'année suivante
      if (start < today) {
        start.setFullYear(today.getFullYear() + 1)
      }
      return { ...vac, startDate: start }
    })
    .sort((a, b) => a.startDate - b.startDate)
}
