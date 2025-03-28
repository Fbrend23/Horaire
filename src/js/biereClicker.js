import { gameState, loadBeerClickerData, saveBeerClickerData, updateBeerScoreDisplay, startAutoClicker, stopAutoClicker } from "./gameState.js";
import { initializeShop } from "./shop.js";
// ==============================
// Initialisation du Beer Clicker
// ==============================

let autoClickerActive = false;

export function incrementBeerScore() {
  gameState.beerScore += gameState.beerMultiplier;
  updateBeerScoreDisplay();
  saveBeerClickerData();
  animateBeerClick();
}

function animateBeerClick() {
  const beerImage = document.getElementById("beerClicker");
  if (beerImage) {
    beerImage.classList.add("clicked");
    setTimeout(() => {
      beerImage.classList.remove("clicked");
    }, 200);
  }
}

export function resetBeerClicker() {
  gameState.beerScore = 0;
  gameState.beerMultiplier = 1;
  updateBeerScoreDisplay();
  saveBeerClickerData();
  stopAutoClicker();
  autoClickerActive = false;
  // Mise à jour du bouton de toggle si nécessaire
  const toggleButton = document.getElementById("toggleAutoButton");
  if (toggleButton) {
    toggleButton.textContent = "Démarrer Auto-Clicker";
    toggleButton.classList.remove("active");
  }
}

function toggleAutoClicker() {
  const toggleButton = document.getElementById("toggleAutoButton");
  if (!autoClickerActive) {
    // Démarrer l'auto-clicker
    startAutoClicker(gameState.autoClickerIntervalTime, incrementBeerScore);
    autoClickerActive = true;
    toggleButton.textContent = "Arrêter Auto-Clicker";
    toggleButton.classList.add("active");
  } else {
    // Arrêter l'auto-clicker
    stopAutoClicker();
    autoClickerActive = false;
    toggleButton.textContent = "Démarrer Auto-Clicker";
    toggleButton.classList.remove("active");
  }
}

export function initializeBeerClicker() {
  loadBeerClickerData();
  updateBeerScoreDisplay();
  initializeShop();

  // Attacher l'événement sur l'image du Beer Clicker
  const beerImage = document.getElementById("beerClicker");
  if (beerImage) {
    beerImage.addEventListener("click", incrementBeerScore);
  }

  // Bouton de réinitialisation
  const resetButton = document.getElementById("resetButton");
  if (resetButton) {
    resetButton.addEventListener("click", resetBeerClicker);
  }

  // Attacher l'événement sur le bouton toggle de l'auto-clicker
  const toggleAutoButton = document.getElementById("toggleAutoButton");
  if (toggleAutoButton) {
    toggleAutoButton.addEventListener("click", toggleAutoClicker);
  }
  
  // Exposer la fonction incrementBeerScore pour d'autres modules, si nécessaire
  window.incrementBeerScore = incrementBeerScore;
}
