// shop.js
import { gameState, updateBeerScoreDisplay, saveBeerClickerData, startAutoClicker, stopAutoClicker } from "./gameState.js";

// Tableau des upgrades disponibles dans le shop
export const shopUpgrades = [
  {
    id: "multiplierUpgrade",
    name: "Multiplicateur",
    description: "Augmente le multiplicateur de clic de 1 de façon permanente.",
    baseCost: 10,
    costMultiplier: 2,
    quantity: 0,
    effect: function() {
      gameState.beerMultiplier += 2;
    }
  },
  {
    id: "autoClickerUpgrade",
    name: "Auto-clicker amélioré",
    description: "Réduit l'intervalle de l'auto-clicker de 10% de façon permanente.",
    baseCost: 50,
    costMultiplier: 2,
    quantity: 0,
    effect: function() {
      gameState.autoClickerIntervalTime *= 0.9;
      stopAutoClicker();
      startAutoClicker(gameState.autoClickerIntervalTime, window.incrementBeerScore || (() => {}));
    }
  },
  {
    id: "clickStormUpgrade",
    name: "Click Storm",
    description: "Double votre multiplicateur pendant 10 secondes.",
    baseCost: 100,
    costMultiplier: 3,
    quantity: 0,
    effect: function() {
      const originalMultiplier = gameState.beerMultiplier;
      gameState.beerMultiplier *= 2;
      updateBeerScoreDisplay();
      setTimeout(() => {
        gameState.beerMultiplier = originalMultiplier;
        updateBeerScoreDisplay();
      }, 10000);
    }
  },
  {
    id: "superAutoClickerUpgrade",
    name: "Super Auto-clicker",
    description: "Double la fréquence de l'auto-clicker pendant 15 secondes (si actif).",
    baseCost: 150,
    costMultiplier: 3,
    quantity: 0,
    effect: function() {
      if (gameState.autoClickerInterval) {
        stopAutoClicker();
        const boostedInterval = gameState.autoClickerIntervalTime / 2;
        startAutoClicker(boostedInterval, window.incrementBeerScore || (() => {}));
        setTimeout(() => {
          stopAutoClicker();
          startAutoClicker(gameState.autoClickerIntervalTime, window.incrementBeerScore || (() => {}));
        }, 15000);
      }
    }
  }
];

// Calcule le coût actuel d'une upgrade (coût exponentiel)
export function getUpgradeCost(upgrade) {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.quantity));
}

// Tente d'acheter une upgrade dans le shop
export function purchaseShopUpgrade(upgradeId) {
  const upgrade = shopUpgrades.find(u => u.id === upgradeId);
  if (!upgrade) return;
  const cost = getUpgradeCost(upgrade);
  if (gameState.beerScore >= cost) {
    gameState.beerScore -= cost;
    upgrade.quantity++;
    upgrade.effect();
    updateBeerScoreDisplay();
    saveBeerClickerData();
    showUpgradeMessage(`${upgrade.name} acheté !`);
    renderShop();
    saveShopData();
  } else {
    showUpgradeMessage(`Score insuffisant pour ${upgrade.name} !`, true);
  }
}

// Affiche dynamiquement le shop dans le conteneur HTML
export function renderShop() {
    const shopContainer = document.getElementById("shopContainer");
    
    if (!shopContainer) return;
    shopContainer.innerHTML = "";
    
    shopUpgrades.forEach(upgrade => {
        const cost = getUpgradeCost(upgrade);
        const upgradeDiv = document.createElement("div");
        const isAffordable = gameState.beerScore >= cost;
        const priceColor = isAffordable ? "green" : "red";
    upgradeDiv.className = "shop-upgrade";
    upgradeDiv.innerHTML = `
      <h3>${upgrade.name}</h3>
      <p>${upgrade.description}</p>
      <p style="color: ${priceColor}">Coût : ${cost} 🍺</p>
      <p>Quantité : ${upgrade.quantity}</p>
      <button id="buy-${upgrade.id}" ${!isAffordable ? "disabled" : ""} style="cursor: ${isAffordable ? "pointer" : "not-allowed"};">Acheter</button>
    `;
    shopContainer.appendChild(upgradeDiv);

    const buyButton = document.getElementById(`buy-${upgrade.id}`);
    if (buyButton) {
      buyButton.addEventListener("click", () => {
        purchaseShopUpgrade(upgrade.id);
      });
    }
  });
}

// Affiche un message temporaire (type toast) pour le shop
export function showUpgradeMessage(message, isError = false) {
  const messageElement = document.getElementById("upgradeMessage");
  if (!messageElement) return;
  messageElement.textContent = message;
  messageElement.style.color = isError ? "#dc2626" : "#16a34a";
  messageElement.classList.remove("hidden");
  setTimeout(() => {
    messageElement.classList.add("hidden");
  }, 3000);
}

// Fonction d'initialisation du shop
export function initializeShop() {
    loadShopData();
    renderShop();
}

// Charge les quantités d'upgrades sauvegardées
export function loadShopData() {
    const savedShop = localStorage.getItem("shopUpgrades");
    if (savedShop) {
      const savedData = JSON.parse(savedShop);
      shopUpgrades.forEach(upgrade => {
        if (savedData[upgrade.id] !== undefined) {
          upgrade.quantity = savedData[upgrade.id];
        }
      });
    }
  }
  
  // Sauvegarde les quantités d'upgrades dans le localStorage
  export function saveShopData() {
    const savedData = {};
    shopUpgrades.forEach(upgrade => {
      savedData[upgrade.id] = upgrade.quantity;
    });
    localStorage.setItem("shopUpgrades", JSON.stringify(savedData));
  }
  