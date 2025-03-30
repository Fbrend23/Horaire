/* vacances.js - Gestion des vacations scolaires
   - Définit la liste des vacations pour l'année scolaire 2025-2026
   - Fournit des fonctions pour obtenir les vacations à venir et mettre à jour l'affichage associé
*/
import { getNow } from "./time.js";

// Liste des vacations avec dates de début et de fin
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
    startDate: new Date(2025, 9, 6),   // 6 octobre 2025
    endDate: new Date(2025, 9, 10)     // 10 octobre 2025
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
    startDate: new Date(2026, 6, 3),   // 3 juillet 2026
    endDate: null
  }
];

/**
 * Retourne la liste des vacations à venir.
 * Si la date de début d'une vacation est passée, celle-ci est recalculée pour l'année suivante.
 * @returns {Array} Liste triée par date croissante.
 */
export function getUpcomingVacations() {
  const today = getNow();
  return vacations
    .map(vac => {
      let start = vac.startDate;
      if (start < today) {
        // Recalcule la date pour l'année suivante
        start = new Date(today.getFullYear() + 1, start.getMonth(), start.getDate());
      }
      return { name: vac.name, startDate: start, endDate: vac.endDate };
    })
    .sort((a, b) => a.startDate - b.startDate);
}

/**
 * Recherche une vacation par son nom dans la liste des vacations à venir.
 * @param {string} vacationName - Nom de la vacation recherchée.
 * @returns {Object|undefined} Vacation correspondante ou undefined si non trouvée.
 */
export function getVacationByName(vacationName) {
  const upcoming = getUpcomingVacations();
  return upcoming.find(vac => vac.name.toLowerCase() === vacationName.toLowerCase());
}

/**
 * Met à jour l'affichage des prochaines vacances dans le DOM.
 * Affiche le nom, la date formatée et le nombre de jours restants.
 */
export function updateNextVacationDisplay() {
  const nextVacationNameElement = document.getElementById("nextVacName");
  const nextVacationElement = document.getElementById("nextVac");

  if (!nextVacationNameElement || !nextVacationElement) {
    console.error("Les éléments 'nextVacName' ou 'nextVac' sont introuvables.");
    return;
  }

  const upcomingVacations = getUpcomingVacations();

  if (upcomingVacations.length > 0) {
    const nextVac = upcomingVacations[0];
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = nextVac.startDate.toLocaleDateString("fr-FR", options);
    const diffMs = nextVac.startDate - getNow();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    nextVacationNameElement.innerHTML = `${nextVac.name}`;
    nextVacationElement.innerHTML = `${dateStr} (${diffDays} jour${diffDays > 1 ? "s" : ""})`;
  } else {
    nextVacationNameElement.textContent = "Aucune vacation à venir";
    nextVacationElement.textContent = "";
  }
}

/**
 * Met à jour l'affichage de la vacation d'été.
 * Affiche la date de début formatée et le compte à rebours en jours.
 */
export function updateSummerVacationDisplay() {
  const summerVacationElement = document.getElementById("summerVacation");
  const summerVacation = getVacationByName("Été");
  if (summerVacation) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = summerVacation.startDate.toLocaleDateString("fr-FR", options);
    const diffDays = Math.ceil((summerVacation.startDate - getNow()) / (1000 * 60 * 60 * 24));
    summerVacationElement.innerHTML = `${dateStr} (${diffDays} jour${diffDays > 1 ? "s" : ""})`;
  }
}

/**
 * Affiche le temps restant avant le week-end (vendredi à 16:35).
 */
export function updateWeekendCountdown() {
  const now = getNow();
  const countdownElement = document.getElementById("weekendCountdown");
  if (!countdownElement) return;

  let target = new Date(now);
  const day = now.getDay();

  if (day > 5 || (day === 5 && now.getHours() >= 17)) {
    // Si déjà en week-end, cible vendredi de la semaine prochaine
    const daysUntilNextFriday = 7 - day + 5;
    target.setDate(now.getDate() + daysUntilNextFriday);
  } else {
    // Sinon, cible le vendredi de la semaine en cours
    const daysUntilFriday = 5 - day;
    target.setDate(now.getDate() + daysUntilFriday);
  }

  // Réglage de l'heure cible à 16h35
  target.setHours(16, 35, 0, 0);

  const diffSec = Math.floor((target - now) / 1000);
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;

  countdownElement.textContent = `${hours} h ${minutes} min ${seconds} sec`;
}
