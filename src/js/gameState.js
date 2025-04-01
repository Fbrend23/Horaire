/* gameState.js - Version améliorée
Ce fichier centralise l’état global du jeu. 
Il maintient des informations essentielles telles que le score, le multiplicateur 
  et le temps d’intervalle pour l’auto-clicker. 
De plus, il est responsable de la persistance des données en chargeant 
  et sauvegardant l’état du jeu dans le stockage local. 
La mise à jour dynamique de l’affichage du score 
  et la gestion des intervalles d’auto-clicker y sont également gérées, 
  offrant ainsi une base robuste pour l’ensemble de l’application.
*/
import { renderShop, saveShopData } from "./shop.js";
import { saveUnlockedSkins } from "./skins.js";
import { updateShopScore } from "./shop.js";

export const gameState = {
  beerScore: 0,
  beerMultiplier: 1,
  autoClickerInterval: null,
  autoClickerIntervalTime: 5000, // Intervalle en ms pour l'auto-clicker
};

export function resetGameState() {
  gameState.beerScore = 0;
  gameState.beerMultiplier = 1;
  stopAutoClicker();
  gameState.autoClickerInterval = null;
  gameState.autoClickerIntervalTime = 5000;
}

export function loadBeerClickerData() {
  try {
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
  } catch (error) {
    console.error("Erreur lors du chargement des données du Beer Clicker:", error);
  }
}

export function saveBeerClickerData() {
  try {
    localStorage.setItem("beerScore", gameState.beerScore);
    localStorage.setItem("beerMultiplier", gameState.beerMultiplier);
    localStorage.setItem("autoClickerIntervalTime", gameState.autoClickerIntervalTime);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des données du Beer Clicker:", error);
  }
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
  const autoClickerDisplay = document.getElementById("autoClickerDisplay");
  if (autoClickerDisplay) {
    if (window.superAutoActive && window.superAutoActive.endTime) {
      autoClickerDisplay.textContent = (gameState.autoClickerIntervalTime / 2 / 1000).toFixed(2) + " sec";
    } else {
      autoClickerDisplay.textContent = (gameState.autoClickerIntervalTime / 1000).toFixed(2) + " sec";
    }
  }
  // Rafraîchissement de la boutique (possibilité d'optimisation pour éviter une reconstruction totale)
  updateShopScore();
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
  saveUnlockedSkins();
}

export function restartUpgradeIntervals() {
  shopUpgrades.forEach(upgrade => {
    if (upgrade.id === "beerFactoryUpgrade") {
      // Si la quantité est > 0 et qu'aucun intervalle n'est lancé, alors on redémarre
      if (upgrade.quantity > 0 && !window.beerFactoryInterval) {
        window.beerFactoryInterval = setInterval(() => {
          const bonus = Math.floor(gameState.beerScore * 0.05 * upgrade.quantity);
          gameState.beerScore += bonus;
          updateBeerScoreDisplay();
          saveBeerClickerData();
        }, 60000);
      }
    } else if (upgrade.id === "beerDrinkerUpgrade") {
      if (upgrade.quantity > 0 && !window.beerDrinkerInterval) {
        window.beerDrinkerInterval = setInterval(() => {
          const bonusClicks = 5 * upgrade.quantity;
          gameState.beerScore += bonusClicks;
          updateBeerScoreDisplay();
          saveBeerClickerData();
        }, 1000);
      }
    }
  });
}