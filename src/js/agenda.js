/* agenda.js - Gestion de l'agenda hebdomadaire
   - Définit le planning de la semaine sous forme de tableau d'instances de Module.
   - Fournit des fonctions pour récupérer les modules du jour, le module actuel et le prochain module.
   - Met à jour l'affichage de l'agenda et déclenche des effets (ex : fireworks) en fin de session.
*/
import { Module } from "./module.js";
import { getNow } from "./time.js";
import { triggerConfetti, launchFireworks } from "./effects.js";
import { vacations } from "./vacances.js";

// Définition du planning hebdomadaire (0 = dimanche, 1 = lundi, …, 6 = samedi)
export const weeklySchedule = [
  // Modules du lundi (dayOfWeek = 1)
  new Module("P_Bulle", "B13", 1, 8, 0, 11, 25),
  new Module("Projet 183", "A21", 1, 12, 15, 14, 45),
  new Module("Séance de classe", "A21", 1, 15, 0, 15, 45),

  // Modules du mardi (dayOfWeek = 2)
  new Module("I426", "B22", 2, 8, 0, 11, 25),
  new Module("C294", "A01", 2, 13, 10, 16, 35),

  // Modules du mercredi (dayOfWeek = 3)
  new Module("C294", "A01", 3, 8, 50, 12, 15),
  new Module("Projet 324", "A11", 3, 13, 10, 15, 45),

  // Modules du jeudi (dayOfWeek = 4)
  new Module("I183", "A21", 4, 8, 0, 12, 15),
  new Module("I165", "B11", 4, 13, 10, 16, 35),

  // Modules du vendredi (dayOfWeek = 5)
  new Module("I324", "A11", 5, 8, 0, 12, 15),
  new Module("P_Prod", "A01", 5, 13, 10, 15, 45),
];

/**
 * Retourne les modules prévus pour aujourd'hui.
 * @returns {Array} Modules du jour courant.
 */
export function getTodaysModules() {
  const today = getNow();
  const dayOfWeek = today.getDay(); // 0 = dimanche, 1 = lundi, etc.
  return weeklySchedule.filter((mod) => mod.dayOfWeek === dayOfWeek);
}

/**
 * Met à jour l'affichage de l'agenda.
 * Affiche le module en cours (avec compte à rebours jusqu'à la fin) et le prochain module.
 * Déclenche des effets visuels selon l'avancement du cours.
 *
 * @param {HTMLElement} currentLessonElement - Élément pour afficher le cours actuel.
 * @param {HTMLElement} endTimeElement - Élément pour afficher le compte à rebours de fin de session.
 * @param {HTMLElement} nextLessonElement - Élément pour afficher le prochain cours.
 * @param {HTMLElement} nextRoomElement - Élément pour afficher la salle du prochain cours.
 * @param {HTMLElement} startTimeElement - Élément pour afficher le compte à rebours jusqu'au prochain cours.
 */
let fireworksLaunched = false;
export function updateAgenda(
  currentLessonElement,
  endTimeElement,
  nextLessonElement,
  nextRoomElement,
  startTimeElement
) {
  const now = getNow();
  const todaysModules = getTodaysModules();
  let currentModule = null;

  // Recherche le module actuellement en cours
  for (let mod of todaysModules) {
    const start = mod.getStartDate(now);
    const end = mod.getEndDate(now);
    if (now >= start && now < end) {
      currentModule = mod;
      break;
    }
  }

  // Sélecteur principal pour appliquer un éventuel swap de section
  const mainColumn = document.querySelector(".main-column");

  if (currentModule) {
    // Si un module est en cours, réinitialiser l'animation du swap
    if (mainColumn) mainColumn.classList.remove("swap-sections");

    // Afficher le module actuel
    currentLessonElement.textContent = currentModule.moduleName;

    // Recherche le dernier module consécutif du même bloc (même nom) pour le calcul du compte à rebours
    const lastModuleInBlock = getLastModuleInCurrentBlock(currentModule, now);
    const blockEnd = lastModuleInBlock.getEndDate(now);
    const diffSecBlock = Math.floor((blockEnd - now) / 1000);
    const hours = Math.floor(diffSecBlock / 3600);
    const minutes = Math.floor((diffSecBlock % 3600) / 60);
    const seconds = diffSecBlock % 60;
    endTimeElement.textContent = `${hours} h ${minutes} min ${seconds} sec`;

    // Déclenchement du feu d'artifice 5 minutes avant la fin du bloc
    if (diffSecBlock <= 300 && diffSecBlock > 0 && !fireworksLaunched) {
      launchFireworks();
      fireworksLaunched = true;
    }

    // Recherche et affichage du prochain module différent
    let nextModule = getNextDifferentModule(lastModuleInBlock);
    if (nextModule) {
      const nextOccurrence = getNextOccurrence(nextModule, now);
      const diffSecNext = Math.floor((nextOccurrence - now) / 1000);
      const hoursNext = Math.floor(diffSecNext / 3600);
      const minutesNext = Math.floor((diffSecNext % 3600) / 60);
      const secondsNext = diffSecNext % 60;
      nextLessonElement.textContent = nextModule.moduleName;
      nextRoomElement.textContent = nextModule.room;
      startTimeElement.textContent = `${hoursNext} h ${minutesNext} min ${secondsNext} sec`;
    } else {
      nextLessonElement.textContent = "Aucun module à venir";
      nextRoomElement.textContent = "-";
      startTimeElement.textContent = "-";
    }
  } else {
    // Aucun module en cours : activer le swap pour l'affichage
    if (mainColumn) mainColumn.classList.add("swap-sections");

    currentLessonElement.textContent = "Aucun module en cours";
    endTimeElement.textContent = "-";
    fireworksLaunched = false;

    // Recherche et affichage du prochain module prévu
    let nextModule = getNextModule();
    if (nextModule) {
      const nextOccurrence = getNextOccurrence(nextModule, now);
      const diffSecNext = Math.floor((nextOccurrence - now) / 1000);
      const hoursNext = Math.floor(diffSecNext / 3600);
      const minutesNext = Math.floor((diffSecNext % 3600) / 60);
      const secondsNext = diffSecNext % 60;
      nextLessonElement.textContent = nextModule.moduleName;
      nextRoomElement.textContent = nextModule.room;
      startTimeElement.textContent = `${hoursNext} h ${minutesNext} min ${secondsNext} sec`;
    } else {
      nextLessonElement.textContent = "Aucun module à venir";
      nextRoomElement.textContent = "-";
      startTimeElement.textContent = "-";
    }
  }

  // Si aucun cours n'est prévu pour la journée, déclencher les fireworks
  if (!currentModule && !getNextModule()) {
    launchFireworks();
  }
}

/**
 * Retourne le prochain module dont le nom est différent de celui du module en cours.
 * @param {Object} currentModule - Module en cours.
 * @returns {Object|null} Le prochain module différent ou null.
 */
export function getNextDifferentModule(currentModule) {
  const now = getNow();
  let nextModule = null;
  let nextOccurrenceTime = Infinity;

  for (let mod of weeklySchedule) {
    if (mod.moduleName === currentModule.moduleName) continue;
    const occurrence = getNextOccurrence(mod, now);
    const diff = occurrence - now;
    if (diff > 0 && diff < nextOccurrenceTime) {
      nextOccurrenceTime = diff;
      nextModule = mod;
    }
  }
  return nextModule;
}

/**
 * Retourne le module dont la prochaine occurrence est la plus proche.
 * @returns {Object|null} Le module le plus proche ou null.
 */
export function getNextModule() {
  const now = getNow();
  let nextModule = null;
  let nextOccurrenceTime = Infinity;

  for (let mod of weeklySchedule) {
    const occurrence = getNextOccurrence(mod, now);
    const diff = occurrence - now;
    if (diff > 0 && diff < nextOccurrenceTime) {
      nextOccurrenceTime = diff;
      nextModule = mod;
    }
  }
  return nextModule;
}

/**
 * Calcule la prochaine occurrence d'un module par rapport à maintenant.
 * @param {Object} mod - Instance de Module.
 * @param {Date} now - Date et heure actuelles.
 * @returns {Date} La date de la prochaine occurrence du module.
 */
export function getNextOccurrence(mod, now) {
  let occurrence = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    mod.startHour,
    mod.startMinute,
    0,
    0
  );
  const nowDay = now.getDay();
  const targetDay = mod.dayOfWeek;

  if (targetDay < nowDay || (targetDay === nowDay && occurrence <= now)) {
    const daysUntil = 7 - nowDay + targetDay;
    occurrence.setDate(occurrence.getDate() + daysUntil);
  } else if (targetDay > nowDay) {
    const daysUntil = targetDay - nowDay;
    occurrence.setDate(occurrence.getDate() + daysUntil);
  }

  // Si la date de l'occurrence tombe pendant des vacances, on avance d'une semaine jusqu'à être en dehors de la période
  while (isDuringVacation(occurrence)) {
    occurrence.setDate(occurrence.getDate() + 7);
  }
  return occurrence;
}

/**
 * Met à jour le compte à rebours de la prochaine pause.
 * Deux pauses quotidiennes : 09h35 (matin) et 14h45 (après‑midi).
 */
export function updateNextPauseCountdown() {
  const now = getNow();
  const pauseElement = document.getElementById("pause");
  const pauseSection = pauseElement?.closest("section");

  let nextPause;
  const day = now.getDay();

  // Si c'est le weekend, on cible le lundi matin
  if (day === 0 || day === 6) {
    let nextMonday = new Date(now);
    const daysToMonday = day === 6 ? 2 : 1;
    nextMonday.setDate(now.getDate() + daysToMonday);
    nextMonday.setHours(9, 35, 0, 0);
    nextPause = nextMonday;
  } else {
    // Horaires de pause pour les jours ouvrés
    const pauseTimes = [
      { hour: 9, minute: 35 },
      { hour: 14, minute: 45 },
    ];
    for (let pause of pauseTimes) {
      let candidate = new Date(now);
      candidate.setHours(pause.hour, pause.minute, 0, 0);
      if (candidate > now) {
        nextPause = candidate;
        break;
      }
    }
  }

  // Si toutes les pauses de la journée sont passées, définir la pause du lendemain matin
  if (!nextPause) {
    let tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(9, 35, 0, 0);
    nextPause = tomorrow;
  }

  // Boucle pour exclure les dates qui tombent en vacances ou sur un weekend (au cas où)
  while (
    isDuringVacation(nextPause) ||
    nextPause.getDay() === 0 ||
    nextPause.getDay() === 6
  ) {
    let next = new Date(nextPause);
    next.setDate(next.getDate() + 1);
    next.setHours(9, 35, 0, 0);
    nextPause = next;
  }

  // Mise à jour de l'affichage du compte à rebours
  displayCountdown(nextPause, pauseElement);

  const timeLeft = Math.floor((nextPause - now) / 1000);

  // Appliquer un effet de clignotement si la pause approche
  if (pauseSection) {
    if (timeLeft <= 30) {
      pauseSection.classList.add("flash-pause");
    } else {
      pauseSection.classList.remove("flash-pause");
    }
  }

  // Déclenchement de confettis si la pause est imminente (moins de 5 secondes)
  if (timeLeft <= 5) {
    triggerConfetti();
  }
}

/**
 * Affiche le compte à rebours jusqu'à une date cible dans l'élément spécifié.
 * Si le temps restant est compris entre 6 et 24 heures, affiche "Demain".
 * @param {Date} targetDate - Date cible.
 * @param {HTMLElement} element - Élément d'affichage.
 */
function displayCountdown(targetDate, element) {
  const now = getNow();
  const diffSec = Math.floor((targetDate - now) / 1000);
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;

  // Affichage personnalisé pour certains intervalles
  if (hours > 24) {
    element.textContent = "-";
  } else {
    element.textContent = `${hours} h ${minutes} min ${seconds} sec`;
  }
}

/**
 * Retourne le dernier module du même bloc (même nom) pour la journée courante.
 * Permet de calculer la fin de la session pour un cours regroupé.
 * @param {Object} currentModule - Module courant.
 * @param {Date} now - Date de référence.
 * @returns {Object} Le dernier module du bloc.
 */
function getLastModuleInCurrentBlock(currentModule, now) {
  const dayOfWeek = now.getDay();
  // Récupère et trie les modules du jour par heure de début
  let dailyModules = weeklySchedule
    .filter((m) => m.dayOfWeek === dayOfWeek)
    .sort((a, b) => {
      if (a.startHour === b.startHour) {
        return a.startMinute - b.startMinute;
      }
      return a.startHour - b.startHour;
    });

  // Recherche l'index du module courant
  let currentIndex = dailyModules.findIndex(
    (m) =>
      m.moduleName === currentModule.moduleName &&
      m.startHour === currentModule.startHour &&
      m.startMinute === currentModule.startMinute
  );

  if (currentIndex === -1) return currentModule;

  let lastIndex = currentIndex;
  // Parcourt les modules suivants avec le même nom
  for (let i = currentIndex + 1; i < dailyModules.length; i++) {
    if (dailyModules[i].moduleName === currentModule.moduleName) {
      lastIndex = i;
    } else {
      break;
    }
  }
  return dailyModules[lastIndex];
}

/**
 * Retourne les modules de la session (matin ou après‑midi) en fonction du module courant.
 * @param {Object} currentModule - Module courant.
 * @param {Date} now - Date actuelle.
 * @returns {Array} Liste des modules de la session.
 */
export function getSessionModules(currentModule, now) {
  const session = currentModule.startHour < 12 ? "morning" : "afternoon";
  const todaysModules = getTodaysModules();
  return todaysModules.filter((mod) =>
    session === "morning" ? mod.startHour < 12 : mod.startHour >= 12
  );
}

/**
 * Met à jour la barre de progression de la journée en fonction de l'avancement entre le premier module et le dernier.
 */
export function updateDayProgressBar() {
  const progressBar = document.getElementById("dayProgressBar");
  const progressText = document.getElementById("dayProgressPourcentage");
  const container = document.getElementById("dayProgressContainer");
  const now = new Date();
  const todaysModules = getTodaysModules();

  if (todaysModules.length === 0) {
    progressBar.style.width = "0%";
    progressText.textContent = "0 %";
    return;
  }

  // Calcul des horaires extrêmes de la journée
  const firstModuleStart = todaysModules
    .reduce((earliest, mod) =>
      mod.getStartDate(now) < earliest.getStartDate(now) ? mod : earliest
    )
    .getStartDate(now);

  const lastModuleEnd = todaysModules
    .reduce((latest, mod) =>
      mod.getEndDate(now) > latest.getEndDate(now) ? mod : latest
    )
    .getEndDate(now);

  const totalDuration = lastModuleEnd - firstModuleStart;
  const elapsed = now - firstModuleStart;

  let progressPercent = 0;
  if (elapsed <= 0) {
    progressPercent = 0;
    progressBar.style.width = "0%";
  } else if (elapsed >= totalDuration) {
    progressPercent = 100;
    progressBar.style.width = "100%";
  } else {
    progressPercent = (elapsed / totalDuration) * 100;
    progressBar.style.width = `${progressPercent.toFixed(1)}%`;
  }

  // Affichage du pourcentage sans décimale
  progressText.textContent = `${progressPercent.toFixed(0)} %`;
}

function isDuringVacation(date) {
  // On parcourt la liste des vacances
  return vacations.some((vac) => {
    return date >= vac.startDate && date <= vac.endDate;
  });
}
