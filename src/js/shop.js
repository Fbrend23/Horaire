// shop.js
import { gameState, updateBeerScoreDisplay, saveBeerClickerData, startAutoClicker, stopAutoClicker } from "./gameState.js";
import { triggerConfetti,launchFireworks } from "./effects.js";

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
    description: "Double votre multiplicateur pendant 10 secondes. Si activé à nouveau pendant l'effet, le timer est réinitialisé sans cumul supplémentaire.",
    baseCost: 100,
    costMultiplier: 3,
    quantity: 0,
    effect: function() {
      // On utilise une variable globale pour suivre l'effet Click Storm
      if (window.clickStormActive) {
        // L'effet est déjà actif : on réinitialise le timer
        clearTimeout(window.clickStormActive.timer);
        window.clickStormActive.timer = setTimeout(() => {
          gameState.beerMultiplier = window.clickStormActive.originalMultiplier;
          window.clickStormActive = null;
          updateBeerScoreDisplay();
        }, 10000);
        showUpgradeMessage("Click Storm prolongé !");
      } else {
        // Effet non actif : on le lance
        const originalMultiplier = gameState.beerMultiplier;
        gameState.beerMultiplier *= 2;
        updateBeerScoreDisplay();
        window.clickStormActive = {
          originalMultiplier: originalMultiplier,
          timer: setTimeout(() => {
            gameState.beerMultiplier = originalMultiplier;
            window.clickStormActive = null;
            updateBeerScoreDisplay();
          }, 10000)
        };
        showUpgradeMessage("Click Storm activé !");
      }
    }
  },
  
  {
    id: "superAutoClickerUpgrade",
    name: "Super Auto-clicker",
    description: "Double la fréquence de l'auto-clicker pendant 15 secondes. Si activé à nouveau pendant l'effet, le timer est réinitialisé sans cumul supplémentaire.",
    baseCost: 150,
    costMultiplier: 3,
    quantity: 0,
    effect: function() {
      if (window.superAutoActive) {
        // Si l'effet est déjà actif, on réinitialise le timer pour prolonger l'effet
        clearTimeout(window.superAutoActive.timer);
        window.superAutoActive.timer = setTimeout(() => {
          stopAutoClicker();
          startAutoClicker(gameState.autoClickerIntervalTime, window.incrementBeerScore || (() => {}));
          window.superAutoActive = null;
          updateBeerScoreDisplay();
        }, 15000);
        showUpgradeMessage("Super Auto-clicker prolongé !");
      } else {
        // Activation de l'effet pour la première fois
        stopAutoClicker();
        const boostedInterval = gameState.autoClickerIntervalTime / 2;
        startAutoClicker(boostedInterval, window.incrementBeerScore || (() => {}));
        window.superAutoActive = {
          timer: setTimeout(() => {
            stopAutoClicker();
            startAutoClicker(gameState.autoClickerIntervalTime, window.incrementBeerScore || (() => {}));
            window.superAutoActive = null;
            updateBeerScoreDisplay();
          }, 15000)
        };
        showUpgradeMessage("Super Auto-clicker activé !");
      }
    }
  },
  
  {
    id: "beerSacrificeUpgrade",
    name: "Sacrifice de Bière",
    description: "Sacrifiez une grosse quantité de bières pour déclencher une fête de la bière !",
    baseCost: 10000,
    costMultiplier: 2,
    quantity: 0,
    effect: function() {
      // Déclenche un effet festif (par exemple, des confettis)
      launchFireworks();
      // Optionnel : afficher un message amusant
      showUpgradeMessage("Sacrifice de Bière réussi ! Fête de la bière !", false);
      // Aucun bonus n'est appliqué ici, c'est juste pour dépenser vos points
    }
  },
  // Upgrade fixe pour la loterie de bière
{
    id: "beerLotteryUpgrade",
    name: "Loterie de Bière",
    description: "Mettez vos bières en jeu pour tenter de gagner gros... ou tout perdre ! (Effet aléatoire)",
    baseCost: 100000,
    costMultiplier: 1,  // coût fixe
    quantity: 0,
    effect: function() {
      // 50% de chances de doubler votre score, 50% de chances de le réduire de moitié
      if (Math.random() < 0.5) {
        gameState.beerScore *= 2;
        showUpgradeMessage("Chanceux ! Votre score est doublé !");
      } else {
        gameState.beerScore = Math.floor(gameState.beerScore / 2);
        showUpgradeMessage("Pas de chance ! Votre score est réduit de moitié !", true);
      }
      updateBeerScoreDisplay();
    }
  },
    {
      id: "beerFactoryUpgrade",
      name: "Brasserie",
      description: "Investissez dans une brasserie pour produire 5% supplémentaires de bières toutes les 60 secondes.",
      baseCost: 300,
      costMultiplier: 2,
      quantity: 0,
      effect: function() {
        // Par exemple, chaque Brasserie ajoute un bonus de 5% du score actuel toutes les 60 secondes
        // Vous pouvez mettre en place un setInterval qui s'active à l'achat, ou cumulativement selon le nombre d'unités
        if (!window.beerFactoryInterval) {
          window.beerFactoryInterval = setInterval(() => {
            // Bonus = 5% du score actuel multiplié par la quantité achetée
            const bonus = Math.floor(gameState.beerScore * 0.05 * this.quantity);
            gameState.beerScore += bonus;
            updateBeerScoreDisplay();
            saveBeerClickerData();
          }, 60000);
        }
      }
    },    
];

// Calcule le coût actuel d'une upgrade (coût exponentiel)
export function getUpgradeCost(upgrade) {
    if(upgrade.id === "beerSacrificeUpgrade" || upgrade.id === "beerLotteryUpgrade"){
        return upgrade.baseCost;
    }else{
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.quantity));
}
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
  
  export function resetShopData(){
    shopUpgrades.forEach(upgrade => {
        upgrade.quantity = 0;
      });
      saveShopData();
      renderShop();
  }
  