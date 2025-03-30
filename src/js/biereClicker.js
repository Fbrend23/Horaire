/* biereClicker.js - Version optimisée
Ce module constitue l’interface principale du Beer Clicker. 
Il gère les interactions utilisateur, notamment l’incrémentation du score lors des clics sur l’image
  et la gestion des événements comme la réinitialisation du jeu ou l’activation de l’auto-clicker. 
Il assure également l’initiation des autres composants (par exemple, la boutique)
  et l’attachement des écouteurs d’événements indispensables au bon fonctionnement de l’application.
*/
import { gameState, resetGameState, loadBeerClickerData, saveBeerClickerData, updateBeerScoreDisplay, startAutoClicker, stopAutoClicker } from "./gameState.js";
import { initializeShop, resetShopData } from "./shop.js";
import { resetSkins, saveUnlockedSkins } from "./skins.js";

// Variable locale pour gérer l'état de l'auto-clicker
let autoClickerActive = false;

// Incrémentation du score en appliquant le multiplicateur
export function incrementBeerScore() {
  gameState.beerScore += gameState.beerMultiplier;
  updateBeerScoreDisplay();
  saveBeerClickerData();
  animateBeerClick();
}

// Animation de l'image lors d'un clic
function animateBeerClick() {
  const beerImage = document.getElementById("beerClicker");
  if (beerImage) {
    beerImage.classList.add("clicked");
    setTimeout(() => {
      beerImage.classList.remove("clicked");
    }, 200);
  }
}

// Réinitialisation complète de l'état du jeu et de l'interface
export function resetBeerClicker() {
  resetGameState();
  updateBeerScoreDisplay();
  resetShopData();
  saveBeerClickerData();
  resetSkins();
  saveUnlockedSkins();
  const toggleButton = document.getElementById("toggleAutoButton");
  if (toggleButton) {
    toggleButton.textContent = "Démarrer Auto-Clicker";
    toggleButton.classList.remove("active");
  }
}

// Mise à jour de l'affichage du bouton d'activation/désactivation de l'auto-clicker
function updateToggleAutoButton(isActive) {
  const toggleButton = document.getElementById("toggleAutoButton");
  if (toggleButton) {
    toggleButton.textContent = isActive ? "Arrêter Auto-Clicker" : "Démarrer Auto-Clicker";
    toggleButton.classList.toggle("active", isActive);
  }
}

// Basculement de l'état de l'auto-clicker
function toggleAutoClicker() {
  if (!autoClickerActive) {
    startAutoClicker(gameState.autoClickerIntervalTime, incrementBeerScore);
    autoClickerActive = true;
    updateToggleAutoButton(true);
  } else {
    stopAutoClicker();
    autoClickerActive = false;
    updateToggleAutoButton(false);
  }
}

// Initialisation du Beer Clicker et attachement des événements
export function initializeBeerClicker() {
  loadBeerClickerData();
  updateBeerScoreDisplay();
  initializeShop();
  const beerImage = document.getElementById("beerClicker");
  if (beerImage) {
    beerImage.addEventListener("click", incrementBeerScore);
  }
  const resetButton = document.getElementById("resetButton");
  if (resetButton) {
    resetButton.addEventListener("click", resetBeerClicker);
  }
  const toggleAutoButton = document.getElementById("toggleAutoButton");
  if (toggleAutoButton) {
    toggleAutoButton.addEventListener("click", toggleAutoClicker);
  }
  // Exposition de la fonction pour d'éventuels appels externes
  window.incrementBeerScore = incrementBeerScore;
}


