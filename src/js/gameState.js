import { renderShop, saveShopData } from "./shop.js";

// gameState.js
export const gameState = {
  beerScore: 0,
  beerMultiplier: 1,
  autoClickerInterval: null,
  autoClickerIntervalTime: 10000,
};

export function resetGameState() {
  gameState.beerScore = 0;
  gameState.beerMultiplier = 1;
  stopAutoClicker();
  gameState.autoClickerInterval = null;
  gameState.autoClickerIntervalTime = 10000;
}

export function loadBeerClickerData() {
  const savedScore = localStorage.getItem("beerScore");
  const savedMultiplier = localStorage.getItem("beerMultiplier");
  const savedInterval = localStorage.getItem("autoClickerIntervalTime");
  if (savedScore !== null) {
    gameState.beerScore = parseInt(savedScore, 10);
  }
  if (savedMultiplier !== null) {
    gameState.beerMultiplier = parseInt(savedMultiplier, 10);
  }
  if (savedInterval !== null) {
    gameState.autoClickerIntervalTime = parseFloat(savedInterval);
  }
}

export function saveBeerClickerData() {
  localStorage.setItem("beerScore", gameState.beerScore);
  localStorage.setItem("beerMultiplier", gameState.beerMultiplier);
  localStorage.setItem("autoClickerIntervalTime",gameState.autoClickerIntervalTime);
}

export function updateBeerScoreDisplay() {
  const scoreElement = document.getElementById("beerScore");
  if (scoreElement) {
    scoreElement.textContent = gameState.beerScore;
  }
  const multiplierDisplay = document.getElementById("beerMultiplierDisplay");
  if (multiplierDisplay) {
    multiplierDisplay.textContent = gameState.beerMultiplier;
  }
  // Mise à jour de l'affichage de l'intervalle de l'auto-clicker (en secondes)
  const autoClickerDisplay = document.getElementById("autoClickerDisplay");
  // Si l'effet Super Auto-clicker est actif, afficher l'intervalle boosté
  if (window.superAutoActive && window.superAutoActive.endTime) {
    autoClickerDisplay.textContent =
      (gameState.autoClickerIntervalTime / 2 / 1000).toFixed(2) + "sec";
  } else {
    autoClickerDisplay.textContent =
      (gameState.autoClickerIntervalTime / 1000).toFixed(2) + " sec";
  }
  renderShop();
}

export function startAutoClicker(intervalMs, callback) {
  if (!gameState.autoClickerInterval) {
    gameState.autoClickerInterval = setInterval(callback, intervalMs);
  }
}

export function stopAutoClicker() {
  if (gameState.autoClickerInterval) {
    clearInterval(gameState.autoClickerInterval);
    gameState.autoClickerInterval = null;
  }
}

export function saveGameState() {
  saveBeerClickerData();
  saveShopData();
}
