import { weeklySchedule } from "./agenda.js";


// =================================================================================
// Logique Principale de l'Agenda Hebdomadaire
// ---------------------------------------------------------------------------------
// Ce script se charge de mettre à jour l'affichage de l'agenda en temps réel.
// Il effectue les opérations suivantes :
//   1. Récupérer les modules programmés pour la journée actuelle.
//   2. Déterminer quel module est en cours et lequel est le prochain.
//   3. Mettre à jour les éléments du DOM pour afficher les informations du
//      module en cours et du prochain module.
// La mise à jour se fait toutes les secondes.
// =================================================================================

// Récupération des éléments du DOM pour l'affichage
const currentLessonElement = document.getElementById('currentLesson');
// const currentRoomElement = document.getElementById('currentRoom');
const endTimeElement = document.getElementById('endTime');

const nextLessonElement = document.getElementById('nextLesson');
const nextRoomElement = document.getElementById('nextRoom');
const startTimeElement = document.getElementById('startTime');

/**
 * Filtre weeklySchedule pour récupérer les modules du jour courant.
 * @returns {Array} Les modules programmés pour aujourd'hui.
 */
function getTodaysModules() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = dimanche, 1 = lundi, etc.
  return weeklySchedule.filter(mod => mod.dayOfWeek === dayOfWeek);
}

/**
 * Calcule la prochaine occurrence d'un module par rapport à maintenant.
 * @param {Object} mod - Une instance de Module.
 * @param {Date} now - La date et l'heure actuelles.
 * @returns {Date} La date de la prochaine occurrence du module.
 */
function getNextOccurrence(mod, now) {
  let occurrence = new Date(now);
  occurrence.setHours(mod.startHour, mod.startMinute, 0, 0);
  const nowDay = now.getDay();
  const targetDay = mod.dayOfWeek;
  
  if (targetDay < nowDay || (targetDay === nowDay && occurrence <= now)) {
    // Le module se déroulera la semaine prochaine
    const daysUntil = (7 - nowDay) + targetDay;
    occurrence.setDate(occurrence.getDate() + daysUntil);
  } else if (targetDay > nowDay) {
    // Le module se déroulera plus tard dans la semaine
    const daysUntil = targetDay - nowDay;
    occurrence.setDate(occurrence.getDate() + daysUntil);
  }
  return occurrence;
}

/**
 * Parcourt weeklySchedule pour trouver le module dont la prochaine occurrence
 * est la plus proche dans le futur.
 * @returns {Object|null} Le module le plus proche ou null si aucun trouvé.
 */
function getNextModule() {
  const now = new Date();
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
 * Parcourt weeklySchedule pour trouver le prochain module dont le nom est différent
 * de celui du module en cours.
 * @param {Object} currentModule - Le module actuellement en cours.
 * @returns {Object|null} Le module différent le plus proche dans le futur, ou null.
 */
function getNextDifferentModule(currentModule) {
    const now = new Date();
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
 * Renvoie l'heure de fin de la session pour une date de référence donnée.
 * Cette fonction utilise la date passée en paramètre pour filtrer les modules du jour,
 * et selon la session ("morning" ou "afternoon") retourne l'heure de fin du dernier
 * module de cette session.
 * @param {Date} referenceDate - La date de référence (correspondant à la prochaine occurrence).
 * @param {string} session - "morning" ou "afternoon".
 * @returns {Date|null} L'heure de fin du dernier module de la session, ou null si aucun.
 */
function getSessionEndTimeForDate(referenceDate, session) {
  // Utilise la date de référence pour déterminer le jour
  const ref = new Date(referenceDate);
  const dayOfWeek = ref.getDay();
  let dailyModules = weeklySchedule.filter(mod => mod.dayOfWeek === dayOfWeek);
  
  if (session === "morning") {
    dailyModules = dailyModules.filter(mod => mod.startHour < 12);
  } else if (session === "afternoon") {
    dailyModules = dailyModules.filter(mod => mod.startHour >= 12);
  }
  
  if (dailyModules.length === 0) return null;
  
  // Sélectionne le module dont l'heure de fin est la plus tardive dans la session
  let lastModule = dailyModules.reduce((prev, curr) => {
    return (curr.getEndDate(ref) > prev.getEndDate(ref)) ? curr : prev;
  });
  return lastModule.getEndDate(ref);
}

/**
 * Met à jour l'affichage de l'agenda.
 * Pour le module en cours, affiche le décompte jusqu'à la fin de la session (matin ou après‑midi).
 * Pour le prochain module, affiche le décompte jusqu'à la fin de la session correspondante.
 */
function updateAgenda() {
    const now = new Date();
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
    //   currentRoomElement.textContent = currentModule.room;
      
      let session = (currentModule.startHour < 12) ? "morning" : "afternoon";
      const sessionEnd = getSessionEndTimeForDate(now, session);
      
      if (sessionEnd) {
        const diffSec = Math.floor((sessionEnd - now) / 1000);
        const hours = Math.floor(diffSec / 3600);
        const minutes = Math.floor((diffSec % 3600) / 60);
        const seconds = diffSec % 60;
        endTimeElement.textContent = `${hours} h ${minutes} min ${seconds} sec`;
      } else {
        endTimeElement.textContent = "-";
      }
    } else {
      currentLessonElement.textContent = "Aucun module en cours";
    //   currentRoomElement.textContent = "-";
      endTimeElement.textContent = "-";
    }
    
    // Pour le prochain module, on utilise getNextDifferentModule si un module est en cours
    let nextModule = currentModule ? getNextDifferentModule(currentModule) : getNextModule();
    
    if (nextModule) {
      const nextOccurrence = getNextOccurrence(nextModule, now);
      let session = (nextModule.startHour < 12) ? "morning" : "afternoon";
      const nextSessionEnd = getSessionEndTimeForDate(nextOccurrence, session);
      const diffSec = Math.floor((nextSessionEnd - now) / 1000);
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

    /**
 * Calcule et affiche le temps restant avant la prochaine pause.
 * Deux pauses fixes chaque jour : 09h35 (matin) et 14h45 (après-midi).
 * Si les deux sont passées, affiche la pause du lendemain matin.
 */
function updateNextPauseCountdown() {
    const now = new Date();
    const pauseElement = document.getElementById('pause');
  
    // Liste des pauses quotidiennes
    const pauseTimes = [
      { hour: 9, minute: 35 },
      { hour: 14, minute: 45 }
    ];
  
    let nextPause = null;
  
    for (let pause of pauseTimes) {
      let candidate = new Date(now);
      candidate.setHours(pause.hour, pause.minute, 0, 0);
      if (candidate > now) {
        nextPause = candidate;
        break;
      }
    }
  
    // Si aucune pause n'est trouvée aujourd'hui, on prend celle du lendemain matin
    if (!nextPause) {
      nextPause = new Date(now);
      nextPause.setDate(now.getDate() + 1);
      nextPause.setHours(9, 35, 0, 0);
    }
  
    // Calcul du temps restant
    const diffSec = Math.floor((nextPause - now) / 1000);
    const hours = Math.floor(diffSec / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;
  
    pauseElement.textContent = `${hours} h ${minutes} min ${seconds} sec`;
  }
  
  }

// Actualisation de l'affichage toutes les secondes
setInterval(() => {
    updateAgenda();
    updateNextPauseCountdown();
  }, 1000);
  