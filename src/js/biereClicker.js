import { gameState, loadBeerClickerData, saveBeerClickerData, updateBeerScoreDisplay, startAutoClicker, stopAutoClicker } from "./gameState.js";
import { initializeShop } from "./shop.js";
// ==============================
// Initialisation du Beer Clicker
// ==============================

// Incrémente le score en fonction du multiplicateur
export function incrementBeerScore() {
  gameState.beerScore += gameState.beerMultiplier;
  updateBeerScoreDisplay();
  saveBeerClickerData();
  animateBeerClick();
}

// Animation simple lors du clic sur l'image
function animateBeerClick() {
  const beerImage = document.getElementById("beerClicker");
  if (beerImage) {
    beerImage.classList.add("clicked");
    setTimeout(() => {
      beerImage.classList.remove("clicked");
    }, 200);
  }
}

// Réinitialise le jeu
export function resetBeerClicker() {
  gameState.beerScore = 0;
  gameState.beerMultiplier = 1;
  updateBeerScoreDisplay();
  saveBeerClickerData();
  stopAutoClicker();
}

// Fonction d'initialisation du Beer Clicker
export function initializeBeerClicker() {
  loadBeerClickerData();
  updateBeerScoreDisplay();
  initializeShop();

  // Attache l'événement sur l'image
  const beerImage = document.getElementById("beerClicker");
  if (beerImage) {
    beerImage.addEventListener("click", incrementBeerScore);
  }

  // Bouton de réinitialisation
  const resetButton = document.getElementById("resetButton");
  if (resetButton) {
    resetButton.addEventListener("click", resetBeerClicker);
  }

  // Boutons pour démarrer/arrêter l'auto-clicker
  const startAutoButton = document.getElementById("startAutoButton");
  const stopAutoButton = document.getElementById("stopAutoButton");
  if (startAutoButton) {
    startAutoButton.addEventListener("click", () => startAutoClicker(gameState.autoClickerIntervalTime, incrementBeerScore));
  }
  if (stopAutoButton) {
    stopAutoButton.addEventListener("click", stopAutoClicker);
  }
  
  // Expose la fonction pour que shop.js puisse l'utiliser
  window.incrementBeerScore = incrementBeerScore;
}