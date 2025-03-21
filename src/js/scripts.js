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
 * Filtre le tableau weeklySchedule pour ne conserver que les modules programmés
 * pour le jour courant.
 * @returns {Array<Module>} Les modules d'aujourd'hui.
 */
function getTodaysModules() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = dimanche, 1 = lundi, etc.
  return weeklySchedule.filter(mod => mod.dayOfWeek === dayOfWeek);
}

/**
 * Calcule la prochaine occurrence d'un module par rapport à la date et l'heure actuelle.
 * @param {Object} mod - Une instance de Module.
 * @param {Date} now - La date et l'heure actuelles.
 * @returns {Date} La date de la prochaine occurrence du module.
 */
function getNextOccurrence(mod, now) {
  // Crée une date pour aujourd'hui avec l'heure de début du module
  let occurrence = new Date(now);
  occurrence.setHours(mod.startHour, mod.startMinute, 0, 0);
  const nowDay = now.getDay();
  const targetDay = mod.dayOfWeek;
  
  // Si le jour cible est antérieur à aujourd'hui ou si c'est aujourd'hui et l'heure est passée
  if (targetDay < nowDay || (targetDay === nowDay && occurrence <= now)) {
    // Le module se déroulera la semaine prochaine : on calcule le décalage en jours
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
 * Parcourt l'ensemble des modules de la semaine et retourne celui dont la prochaine
 * occurrence est la plus proche dans le futur par rapport à maintenant.
 * @returns {Object|null} L'instance du module le plus proche ou null si aucun trouvé.
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
 * Met à jour l'affichage de l'agenda :
 *   - Affiche le module en cours (parmi ceux d'aujourd'hui)
 *   - Affiche le prochain module de la semaine, ainsi que le temps avant son début
 */
function updateAgenda() {
  const now = new Date();
  const todaysModules = getTodaysModules();
  let currentModule = null;
  
  // Identification du module en cours parmi les modules d'aujourd'hui
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
    const end = currentModule.getEndDate(now);
    const diffSec = Math.floor((end - now) / 1000);
    const minutes = Math.floor(diffSec / 60);
    const seconds = diffSec % 60;
    endTimeElement.textContent = `${minutes} min ${seconds} sec`;
  } else {
    currentLessonElement.textContent = "Aucun module en cours";
    currentRoomElement.textContent = "-";
    endTimeElement.textContent = "-";
  }
  
  // Récupération du prochain module parmi l'ensemble de la semaine
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