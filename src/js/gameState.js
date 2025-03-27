import { renderShop, saveShopData} from "./shop.js";

// gameState.js
export const gameState = {
    beerScore: 0,
    beerMultiplier: 1,
    autoClickerInterval: null,
    autoClickerIntervalTime: 1000,
  };
  
  export function loadBeerClickerData() {
    const savedScore = localStorage.getItem("beerScore");
    const savedMultiplier = localStorage.getItem("beerMultiplier");
    if (savedScore !== null) {
      gameState.beerScore = parseInt(savedScore, 10);
    }
    if (savedMultiplier !== null) {
      gameState.beerMultiplier = parseInt(savedMultiplier, 10);
    }
  }
  
  export function saveBeerClickerData() {
    localStorage.setItem("beerScore", gameState.beerScore);
    localStorage.setItem("beerMultiplier", gameState.beerMultiplier);
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
  