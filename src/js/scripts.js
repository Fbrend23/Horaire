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
const currentRoomElement = document.getElementById('currentRoom');
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
    const daysUntil = (7 - nowDay) + targetDay;
    occurrence.setDate(occurrence.getDate() + daysUntil);
  } else if (targetDay > nowDay) {
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
 * Renvoie l'heure de fin de la session (matin ou après‑midi) pour le jour donné.
 * On considère que les modules dont l'heure de début est avant 12h font partie du matin,
 * et ceux à partir de 12h font partie de l'après‑midi.
 * @param {number} dayOfWeek - Le jour de la semaine (0 = dimanche, etc.).
 * @param {string} session - "morning" ou "afternoon".
 * @returns {Date|null} L'heure de fin du dernier module de la session, ou null si aucun.
 */
function getSessionEndTime(dayOfWeek, session) {
  const today = new Date();
  let dailyModules = weeklySchedule.filter(mod => mod.dayOfWeek === dayOfWeek);
  
  if (session === "morning") {
    dailyModules = dailyModules.filter(mod => mod.startHour < 12);
  } else if (session === "afternoon") {
    dailyModules = dailyModules.filter(mod => mod.startHour >= 12);
  }
  
  if (dailyModules.length === 0) return null;
  
  // Sélectionne le module dont l'heure de fin est la plus tardive
  let lastModule = dailyModules.reduce((prev, curr) => {
    return (curr.getEndDate(today) > prev.getEndDate(today)) ? curr : prev;
  });
  return lastModule.getEndDate(today);
}

/**
 * Met à jour l'affichage de l'agenda.
 * Pour le module en cours, affiche le décompte jusqu'à la fin de la session (matin ou après‑midi)
 * plutôt que la fin de la période individuelle.
 */
function updateAgenda() {
  const now = new Date();
  const todaysModules = getTodaysModules();
  let currentModule = null;
  
  // Détermine le module en cours (parmi ceux d'aujourd'hui)
  for (let mod of todaysModules) {
    const start = mod.getStartDate(now);
    const end = mod.getEndDate(now);
    if (now >= start && now < end) {
      currentModule = mod;
      break;
    }
  }
  
  // Mise à jour de l'affichage pour le module en cours
  if (currentModule) {
    currentLessonElement.textContent = currentModule.moduleName;
    currentRoomElement.textContent = currentModule.room;
    
    // Détermine la session en fonction de l'heure de début du module
    let session = (currentModule.startHour < 12) ? "morning" : "afternoon";
    const sessionEnd = getSessionEndTime(now.getDay(), session);
    
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
    currentRoomElement.textContent = "-";
    endTimeElement.textContent = "-";
  }
  
  // Mise à jour de l'affichage pour le prochain module de la semaine
  const nextModule = getNextModule();
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
}

// Actualisation de l'affichage toutes les secondes
setInterval(updateAgenda, 1000);