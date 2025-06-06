/* scripts.js - Point d'entrée de l'application
   - Initialise et configure les différents modules et composants (agenda, vacances, thème, Beer Clicker…).
   - Met en place un intervalle pour actualiser l'affichage en temps réel.
*/
import { weeklySchedule, getTodaysModules, updateAgenda, updateNextPauseCountdown,updateDayProgressBar } from "./agenda.js";
import { getUpcomingVacations, getVacationByName, updateNextVacationDisplay, updateSummerVacationDisplay, updateWeekendCountdown } from "./vacances.js";
import { loadTheme, toggleTheme, fullscreen, initializeContactModal } from "./theme.js";
import { startRave, stopRave } from "./effects.js";
import { initializeBeerClicker, clearGameData } from "./biereClicker.js";
import { updateClocks } from "./time.js";
import { initializeDisplaySettings} from "./settings.js";
import { saveGameState, restartUpgradeIntervals, gameState } from "./gameState.js";
import { updateBonusDisplay,skinShopToggle,initializeShopModal } from "./shop.js";
import { loadSkin } from "./skins.js";
import { loadAchievements,checkAchievements, initializeAchievementsModal  } from "./achievements.js";

// Délai d'actualisation (en ms)
const REFRESH_INTERVAL = 1000;

document.addEventListener("DOMContentLoaded", () => {
  // Récupération des éléments du DOM pour l'affichage de l'agenda
  const currentLessonElement = document.getElementById("currentLesson");
  const endTimeElement = document.getElementById("endTime");
  const nextLessonElement = document.getElementById("nextLesson");
  const nextRoomElement = document.getElementById("nextRoom");
  const startTimeElement = document.getElementById("startTime");
  const raveButton = document.getElementById("raveButton");
  const CURRENT_VERSION = "2.0";

  function checkVersionAndClear() {
    const storedVersion = localStorage.getItem("siteVersion");
    if (storedVersion !== CURRENT_VERSION) {
      // Si la version a changé, on efface les données du jeu
      clearGameData();
      localStorage.setItem("siteVersion", CURRENT_VERSION);
    }
  }
  
  // Sauvegarde de l'état du jeu avant la fermeture de la page
  window.addEventListener("beforeunload", () => {
    saveGameState();
  });

  // Configuration du mode "rave" via un bouton dédié
  if (raveButton) {
    let raveActive = false;
    raveButton.addEventListener("click", () => {
      if (raveActive) {
        stopRave();
      } else {
        startRave();
      }
      raveActive = !raveActive;
    });
  }

  // Initialisation des différents modules et paramètres de l'interface
  checkVersionAndClear();
  initializeShopModal();
  initializeDisplaySettings();
  initializeBeerClicker();
  fullscreen();
  updateNextVacationDisplay();
  updateSummerVacationDisplay();
  loadTheme();
  skinShopToggle();
  loadSkin();
  restartUpgradeIntervals();
  loadAchievements();
  initializeAchievementsModal();
  initializeContactModal()

  // Gestion du basculement du thème via un bouton
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.addEventListener("click", toggleTheme);
  }

  // Actualisation périodique de l'affichage (agenda, compte à rebours, horloges, etc.)
  setInterval(() => {
    updateBonusDisplay();
    updateAgenda(currentLessonElement, endTimeElement, nextLessonElement, nextRoomElement, startTimeElement);
    updateNextPauseCountdown();
    updateDayProgressBar();
    updateWeekendCountdown();
    updateClocks();
    checkAchievements(gameState);
  }, REFRESH_INTERVAL);

  // Optionnel : Mode Développeur (désactivé par défaut)
  // if (isDevMode) {
  //   setupDevControls();
  // }
});
