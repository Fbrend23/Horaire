import { weeklySchedule, getTodaysModules, updateAgenda, updateNextPauseCountdown } from "./agenda.js";
import { getUpcomingVacations, getVacationByName,updateNextVacationDisplay,updateSummerVacationDisplay,updateWeekendCountdown } from "./vacances.js";
import { loadTheme, toggleTheme, fullscreen, updateDayProgressBar } from "./theme.js";
import { isDevMode, setupDevControls, setDevDay, advanceDevTime } from "./devmode.js";



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

document.addEventListener("DOMContentLoaded", () => {
// Récupération des éléments du DOM pour l'affichage
const currentLessonElement = document.getElementById("currentLesson");
const endTimeElement = document.getElementById("endTime");
const nextLessonElement = document.getElementById("nextLesson");
const nextRoomElement = document.getElementById("nextRoom");
const startTimeElement = document.getElementById("startTime");


fullscreen();
loadTheme();
const btn = document.getElementById("themeToggle");
if (btn) {
  btn.addEventListener("click", toggleTheme);
}

// Actualisation de l'affichage toutes les secondes
  setInterval(() => {
    updateAgenda(currentLessonElement, endTimeElement, nextLessonElement, nextRoomElement, startTimeElement);
    updateNextPauseCountdown();
    updateNextVacationDisplay();
    updateSummerVacationDisplay();
    updateDayProgressBar();
    updateWeekendCountdown()
  }, 1000);


// Mode Développeur
if (isDevMode) {
  setupDevControls();
}
});

