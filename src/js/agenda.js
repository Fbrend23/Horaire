import { Module } from "./module.js";
import { getNow } from "./time.js";
import { triggerConfetti,launchFireworks } from "./effects.js";

// =================================================================================
// Agenda Hebdomadaire
// ---------------------------------------------------------------------------------
// Ce module exporte un tableau contenant l'ensemble des modules programmés pour
// la semaine. Chaque module est défini par une instance de la classe Module,
// qui précise le jour de la semaine ainsi que les horaires.
// ---------------------------------------------------------------------------------
// Les jours de la semaine sont numérotés de 0 (dimanche) à 6 (samedi).
// ---------------------------------------------------------------------------------
// Exemple :
//   - Pour le lundi (dayOfWeek = 1)
//   - Pour le mardi (dayOfWeek = 2) etc...
// =================================================================================


export const weeklySchedule = [
// --------------------------
// Modules du lundi (dayOfWeek = 1)
// --------------------------
  new Module("C106", "A02", 1, 8, 0, 8, 45),
  new Module("C106", "A02", 1, 8, 50, 9, 35),
  new Module("C106", "A02", 1, 9, 50, 10, 35),
  new Module("C106", "A02", 1, 10, 40, 11, 25),
  new Module("Séance de classe", "A02", 1, 11, 30, 12, 15),

  new Module("I122", "A02", 1, 13, 10, 13, 55),
  new Module("I122", "A02", 1, 14, 0, 14, 45),
  new Module("I122", "A02", 1, 15, 0, 15, 45),

// --------------------------
// Modules du mardi (dayOfWeek = 2)
// --------------------------
  new Module("I322", "B11", 2, 8, 0, 8, 45),
  new Module("I322", "B11", 2, 8, 50, 9, 35),
  new Module("I322", "B11", 2, 9, 50, 10, 35),
  new Module("I322", "B11", 2, 10, 40, 11, 25),

  new Module("I122", "A11", 2, 13, 10, 13, 55),
  new Module("I122", "A11", 2, 14, 0, 14, 45),
  new Module("I122", "A11", 2, 15, 0, 15, 45),
  new Module("I122", "A11", 2, 15, 50, 16, 35),
  
// --------------------------
// Modules du mercredi (dayOfWeek = 3)
// --------------------------
new Module("Sport", "Dojo", 3, 9, 50, 10, 35),
new Module("Sport", "Dojo", 3, 10, 40, 11, 25),

new Module("P_Prod", "N509", 3, 12, 20, 13, 5),
new Module("P_Prod", "N509", 3, 13, 10, 13, 55),
new Module("P_Prod", "N509", 3, 14, 0, 14, 45),
new Module("P_Prod", "N509", 3, 15, 0, 15, 45),

// --------------------------
// Modules du jeudi (dayOfWeek = 4)
// --------------------------
new Module("I254", "A21", 4, 8, 0, 8, 45),
new Module("I254", "A21", 4, 8, 50, 9, 35),
new Module("I254", "A21", 4, 9, 50, 10, 35),
new Module("I254", "A21", 4, 10, 40, 11, 25),

new Module("I322", "B11", 4, 12, 20, 13, 5),
new Module("I322", "B11", 4, 13, 10, 13, 55),
new Module("I322", "B11", 4, 14, 0, 14, 45),
new Module("I322", "B11", 4, 15, 0, 15, 45),

// --------------------------
// Modules du Vendredi (dayOfWeek = 5)
// --------------------------
new Module("C107", "A02", 5, 8, 0, 8, 45),
new Module("C107", "A02", 5, 8, 50, 9, 35),
new Module("C107", "A02", 5, 9, 50, 10, 35),
new Module("C107", "A02", 5, 10, 40, 11, 25),
new Module("C107", "A02", 5, 11, 30, 12, 15),

new Module("I254", "A21", 5, 13, 10, 13, 55),
new Module("I254", "A21", 5, 14, 0, 14, 45),
new Module("I254", "A21", 5, 15, 0, 15, 45),
new Module("I254", "A21", 5, 15, 50, 16, 35),
];

/**
 * Filtre weeklySchedule pour récupérer les modules du jour courant.
 * @returns {Array} Les modules programmés pour aujourd'hui.
 */
export function getTodaysModules() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = dimanche, 1 = lundi, etc.
  return weeklySchedule.filter((mod) => mod.dayOfWeek === dayOfWeek);
}

/**
 * Met à jour l'affichage de l'agenda.
 * Pour le module en cours, affiche le décompte jusqu'à la fin de la session (matin ou après‑midi).
 * Pour le prochain module, affiche le décompte jusqu'à la fin de la session correspondante.
 */
export function updateAgenda(currentLessonElement, endTimeElement, nextLessonElement, nextRoomElement, startTimeElement) {
  const now = getNow();
  const todaysModules = getTodaysModules();
  let currentModule = null;

  // Détermination du module en cours (parmi ceux d'aujourd'hui)
  for (let mod of todaysModules) {
    const start = mod.getStartDate(now);
    const end = mod.getEndDate(now);
    if (now >= start && now < end) {
      currentModule = mod;
      break;
    }
  }

  // Affichage pour le module en cours
  if (currentModule) {
    currentLessonElement.textContent = currentModule.moduleName;
  
    // Récupère le dernier module de la suite (même nom)
    const lastModuleInBlock = getLastModuleInCurrentBlock(currentModule, now);
  
    // Calcule l’heure de fin de ce dernier module
    const blockEnd = lastModuleInBlock.getEndDate(now);
  
    // Calcule le temps restant en secondes
    const diffSec = Math.floor((blockEnd - now) / 1000);
    const hours = Math.floor(diffSec / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;
  
    // Affiche le compte à rebours jusqu'à la fin du "bloc" de cours
    endTimeElement.textContent = `${hours} h ${minutes} min ${seconds} sec`;
  } else {
    currentLessonElement.textContent = "Aucun module en cours";
    endTimeElement.textContent = "-";
  }
  
  
  
  

  // Pour le prochain module, on utilise getNextDifferentModule si un module est en cours
  let nextModule = currentModule
    ? getNextDifferentModule(currentModule)
    : getNextModule();

  if (nextModule) {
    const nextOccurrence = getNextOccurrence(nextModule, now);
    const diffSec = Math.floor((nextOccurrence - now) / 1000);
    const hours = Math.floor(diffSec / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;
    nextLessonElement.textContent = nextModule.moduleName;
    nextRoomElement.textContent = nextModule.room;
    startTimeElement.textContent = `${hours} h ${minutes} min ${seconds} sec`;
  } else {
    nextLessonElement.textContent = "Aucun module à venir";
    nextRoomElement.textContent = "-";
    startTimeElement.textContent = "-";
  }
  if (!currentModule && !getNextModule()) {
    // Plus de cours !
    launchFireworks();
  }
}

/**
 * Renvoie l'heure de fin de la session pour une date de référence donnée.
 * Cette fonction utilise la date passée en paramètre pour filtrer les modules du jour,
 * et selon la session ("morning" ou "afternoon") retourne l'heure de fin du dernier
 * module de cette session.
 * @param {Date} referenceDate - La date de référence (correspondant à la prochaine occurrence).
 * @param {string} session - "morning" ou "afternoon".
 * @returns {Date|null} L'heure de fin du dernier module de la session, ou null si aucun.
 */
export function getSessionEndTimeForDate(referenceDate, session) {
  // Utilise la date de référence pour déterminer le jour
  const ref = new Date(referenceDate);
  const dayOfWeek = ref.getDay();
  let dailyModules = weeklySchedule.filter(
    (mod) => mod.dayOfWeek === dayOfWeek
  );

  if (session === "morning") {
    dailyModules = dailyModules.filter((mod) => mod.startHour < 12);
  } else if (session === "afternoon") {
    dailyModules = dailyModules.filter((mod) => mod.startHour >= 12);
  }

  if (dailyModules.length === 0) return null;

  // Sélectionne le module dont l'heure de fin est la plus tardive dans la session
  let lastModule = dailyModules.reduce((prev, curr) => {
    return curr.getEndDate(ref) > prev.getEndDate(ref) ? curr : prev;
  });
  return lastModule.getEndDate(ref);
}

/**
 * Parcourt weeklySchedule pour trouver le prochain module dont le nom est différent
 * de celui du module en cours.
 * @param {Object} currentModule - Le module actuellement en cours.
 * @returns {Object|null} Le module différent le plus proche dans le futur, ou null.
 */
export function getNextDifferentModule(currentModule) {
  const now = getNow();
  let nextModule = null;
  let nextOccurrenceTime = Infinity;

  for (let mod of weeklySchedule) {
    // Exclure les modules ayant le même nom que le module en cours
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
 * Parcourt weeklySchedule pour trouver le module dont la prochaine occurrence
 * est la plus proche dans le futur.
 * @returns {Object|null} Le module le plus proche ou null si aucun trouvé.
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
 * @param {Object} mod - Une instance de Module.
 * @param {Date} now - La date et l'heure actuelles.
 * @returns {Date} La date de la prochaine occurrence du module.
 */
export function getNextOccurrence(mod, now) {
  // Construire une date pour aujourd'hui en heure locale
  let occurrence = new Date(now.getFullYear(), now.getMonth(), now.getDate(), mod.startHour, mod.startMinute, 0, 0);
  const nowDay = now.getDay();
  const targetDay = mod.dayOfWeek;
  
  if (targetDay < nowDay || (targetDay === nowDay && occurrence <= now)) {
    const daysUntil = 7 - nowDay + targetDay;
    occurrence.setDate(occurrence.getDate() + daysUntil);
  } else if (targetDay > nowDay) {
    const daysUntil = targetDay - nowDay;
    occurrence.setDate(occurrence.getDate() + daysUntil);
  }
  return occurrence;
}

/**
 * Calcule et affiche le temps restant avant la prochaine pause.
 * Deux pauses fixes chaque jour : 09h35 (matin) et 14h45 (après-midi).
 * Si les deux sont passées, affiche la pause du lendemain matin.
 */
export function updateNextPauseCountdown() {
  const now = getNow();
  const pauseElement = document.getElementById("pause");
  const pauseSection = pauseElement.closest("section");

  const day = now.getDay();
  let nextPause;

  if (day === 0 || day === 6) {
    let nextMonday = new Date(now);
    const daysToMonday = day === 6 ? 2 : 1;
    nextMonday.setDate(now.getDate() + daysToMonday);
    nextMonday.setHours(9, 35, 0, 0);
    nextPause = nextMonday;
  } else {
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
  // Si aucun créneau n'est trouvé (tous les créneaux de la journée sont passés)
  if (!nextPause) {
    let tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(9, 35, 0, 0);
    nextPause = tomorrow;
  }


  // Affichage du compte à rebours
  displayCountdown(nextPause, pauseElement);

  // Calcul de la différence en secondes
  const timeLeft = Math.floor((nextPause - now) / 1000);

  // Ajout ou retrait de la classe de clignotement
  if (timeLeft <= 30) {
    pauseSection.classList.add("flash-pause");
    console.log("Clignotement ON")
  } else {
    pauseSection.classList.remove("flash-pause");
  }

  if (timeLeft <= 5) {
    triggerConfetti(); // 🎉 
  }
}

function displayCountdown(targetDate, element) {
  const now = getNow();
  const diffSec = Math.floor((targetDate - now) / 1000);
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;
  element.textContent = `${hours} h ${minutes} min ${seconds} sec`;
}

export function getSessionModules(currentModule, now) {
  const session = currentModule.startHour < 12 ? "morning" : "afternoon";
  const todaysModules = getTodaysModules();
  if (session === "morning") {
    return todaysModules.filter(mod => mod.startHour < 12);
  } else {
    return todaysModules.filter(mod => mod.startHour >= 12);
  }
}

/**
 * Retourne le dernier module (le plus tardif) du même "bloc" que currentModule,
 * c'est-à-dire avec le même nom et sur la même journée.
 */
function getLastModuleInCurrentBlock(currentModule, now) {
  const dayOfWeek = now.getDay();

  // Récupère tous les modules du jour, triés par heure de début
  let dailyModules = weeklySchedule.filter(m => m.dayOfWeek === dayOfWeek);
  dailyModules.sort((a, b) => {
    if (a.startHour === b.startHour) {
      return a.startMinute - b.startMinute;
    }
    return a.startHour - b.startHour;
  });

  // Trouve l'index du module actuel (par nom et heure de début)
  let currentIndex = dailyModules.findIndex(m =>
    m.moduleName === currentModule.moduleName &&
    m.startHour === currentModule.startHour &&
    m.startMinute === currentModule.startMinute
  );

  // Si on ne le trouve pas, renvoie le module actuel par défaut
  if (currentIndex === -1) {
    return currentModule;
  }

  // Parcourt les modules suivants tant qu'ils ont le même nom
  let lastIndex = currentIndex;
  for (let i = currentIndex + 1; i < dailyModules.length; i++) {
    if (dailyModules[i].moduleName === currentModule.moduleName) {
      lastIndex = i;
    } else {
      break;
    }
  }

  // Renvoie le module le plus tardif de la "chaîne" de modules de même nom
  return dailyModules[lastIndex];
}
