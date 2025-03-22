// vacances.js

// Liste des vacances du canton de Vaud pour l'année scolaire 2025-2026
export const vacations = [
    {
        name: "Pâques",
        startDate: new Date(2025, 3, 12),  // 3 avril 2025
        endDate: new Date(2025, 3, 27)     // 19 avril 2025
    },
    {
        name: "Été",
        startDate: new Date(2025, 5, 28),  // 28 juin 2025
        endDate: new Date(2025, 8, 17)     // 17 août 2025
    },
    {
      name: "Automne",
      startDate: new Date(2025, 9, 6),  // 6 octobre 2025
      endDate: new Date(2025, 9, 10)    // 10 octobre 2025
    },
    {
      name: "Noël",
      startDate: new Date(2025, 11, 21), // 21 décembre 2025
      endDate: new Date(2026, 0, 6)      // 6 janvier 2026
    },
    {
      name: "Hiver",
      startDate: new Date(2026, 1, 11),  // 11 février 2026
      endDate: new Date(2026, 1, 13)     // 13 février 2026
    },
    {
      name: "Pâques",
      startDate: new Date(2026, 3, 13),  // 13 avril 2026
      endDate: new Date(2026, 3, 17)     // 17 avril 2026
    },
    {
      name: "Été",
      startDate: new Date(2026, 6, 3),  // 3 juillet 2026
      endDate: null
    }
  ];
  
  /**
   * Retourne la liste des vacations à venir.
   * Si la date de début d'une vacation est déjà passée, la date est recalculée pour l'année suivante.
   * @returns {Array} La liste des vacations à venir, triée par date croissante.
   */
  export function getUpcomingVacations() {
    const today = new Date();
    return vacations.map(vac => {
      let start = vac.startDate;
      if (start < today) {
        start = new Date(today.getFullYear() + 1, start.getMonth(), start.getDate());
      }
      return { name: vac.name, startDate: start, endDate: vac.endDate };
    }).sort((a, b) => a.startDate - b.startDate);
  }
  
  /**
   * Recherche une vacation par son nom dans la liste des vacations à venir.
   * @param {string} vacationName - Le nom de la vacation recherchée.
   * @returns {Object|undefined} L'objet vacation correspondant, ou undefined si non trouvé.
   */
  export function getVacationByName(vacationName) {
    const upcoming = getUpcomingVacations();
    return upcoming.find(vac => vac.name.toLowerCase() === vacationName.toLowerCase());
  }
  