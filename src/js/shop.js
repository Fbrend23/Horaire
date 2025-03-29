// shop.js
import {
  gameState,
  updateBeerScoreDisplay,
  saveBeerClickerData,
  startAutoClicker,
  stopAutoClicker,
} from "./gameState.js";
import { triggerConfetti, launchFireworks } from "./effects.js";

// Tableau des upgrades disponibles dans le shop
export const shopUpgrades = [
  {
    id: "multiplierUpgrade",
    name: "Multiplicateur",
    description: "Augmente le multiplicateur de clic de 1 de façon permanente.",
    baseCost: 10,
    costMultiplier: 2,
    quantity: 0,
    effect: function () {
      gameState.beerMultiplier += 2;
      showUpgradeMessage(`${this.name} acheté !`);
    },
  },
  {
    id: "autoClickerUpgrade",
    name: "Auto-clicker amélioré",
    description:
      "Réduit l'intervalle de l'auto-clicker de 10% de façon permanente.",
    baseCost: 50,
    costMultiplier: 2,
    quantity: 0,
    effect: function () {
      gameState.autoClickerIntervalTime *= 0.9;
      stopAutoClicker();
      startAutoClicker(
        gameState.autoClickerIntervalTime,
        window.incrementBeerScore || (() => {})
      );
      showUpgradeMessage(`${this.name} acheté !`);
    },
  },

  {
    id: "clickStormUpgrade",
    name: "Click Storm",
    // Définir la durée en secondes
    additionalDuration: 10,
    getDescription: function () {
      return `Double votre multiplicateur pendant ${this.additionalDuration} secondes. Si activé à nouveau pendant l'effet, la durée s'accumule.`;
    },
    baseCost: 100,
    costMultiplier: 3,
    quantity: 0,
    effect: function () {
      const durationMs = this.additionalDuration * 1000;
      if (window.clickStormActive) {
        // Si l'effet est déjà actif, accumule la durée
        const remaining = window.clickStormActive.endTime - Date.now();
        const total = remaining + durationMs;
        window.clickStormActive.endTime = Date.now() + total;
        clearTimeout(window.clickStormActive.timer);
        window.clickStormActive.timer = setTimeout(() => {
          gameState.beerMultiplier = window.clickStormActive.originalMultiplier;
          window.clickStormActive = null;
          updateBeerScoreDisplay();
        }, total);
        showUpgradeMessage("Click Storm prolongé !");
      } else {
        // Activation initiale de l'effet
        const originalMultiplier = gameState.beerMultiplier;
        gameState.beerMultiplier *= 2;
        updateBeerScoreDisplay();
        window.clickStormActive = {
          originalMultiplier: originalMultiplier,
          endTime: Date.now() + durationMs,
          timer: setTimeout(() => {
            gameState.beerMultiplier = originalMultiplier;
            window.clickStormActive = null;
            updateBeerScoreDisplay();
          }, durationMs),
        };
        showUpgradeMessage("Click Storm activé !");
      }
    },
  },

  {
    id: "superAutoClickerUpgrade",
    name: "Super Auto-clicker",
    additionalDuration: 15, // durée en secondes
    getDescription: function () {
      return `Double la fréquence de l'auto-clicker pendant ${this.additionalDuration} secondes. Si activé à nouveau pendant l'effet, le timer est réinitialisé (accumulé).`;
    },
    baseCost: 150,
    costMultiplier: 3,
    quantity: 0,
    effect: function () {
      const durationMs = this.additionalDuration * 1000;
      if (window.superAutoActive) {
        // Si l'effet est déjà actif, accumule la durée
        const remaining = window.superAutoActive.endTime - Date.now();
        const total = remaining + durationMs;
        window.superAutoActive.endTime = Date.now() + total;
        clearTimeout(window.superAutoActive.timer);
        window.superAutoActive.timer = setTimeout(() => {
          stopAutoClicker();
          startAutoClicker(
            gameState.autoClickerIntervalTime,
            window.incrementBeerScore || (() => {})
          );
          window.superAutoActive = null;
          updateBeerScoreDisplay();
        }, total);
        showUpgradeMessage("Super Auto-clicker prolongé !");
      } else {
        // Activation initiale de l'effet
        stopAutoClicker();
        const boostedInterval = gameState.autoClickerIntervalTime / 2;
        startAutoClicker(
          boostedInterval,
          window.incrementBeerScore || (() => {})
        );
        window.superAutoActive = {
          endTime: Date.now() + durationMs,
          timer: setTimeout(() => {
            stopAutoClicker();
            startAutoClicker(
              gameState.autoClickerIntervalTime,
              window.incrementBeerScore || (() => {})
            );
            window.superAutoActive = null;
            updateBeerScoreDisplay();
          }, durationMs),
        };
        showUpgradeMessage("Super Auto-clicker activé !");
      }
    },
  },

  {
    id: "beerSacrificeUpgrade",
    name: "Sacrifice de Bière",
    description:
      "Sacrifiez une grosse quantité de bières pour déclencher une fête de la bière !",
    baseCost: 10000,
    costMultiplier: 2,
    quantity: 0,
    effect: function () {
      // Déclenche un effet festif (par exemple, des confettis)
      launchFireworks();
      // Optionnel : afficher un message amusant
      showUpgradeMessage(
        "Sacrifice de Bière réussi ! Fête de la bière !",
        false
      );
      // Aucun bonus n'est appliqué ici, c'est juste pour dépenser vos points
    },
  },
  // Upgrade fixe pour la loterie de bière
  {
    id: "beerLotteryUpgrade",
    name: "Loterie de Bière",
    description:
      "Mettez vos bières en jeu pour tenter de gagner gros... ou tout perdre ! (Effet aléatoire)",
    baseCost: 100000,
    costMultiplier: 1, // coût fixe
    quantity: 0,
    effect: function () {
      // 50% de chances de doubler votre score, 50% de chances de le réduire de moitié
      if (Math.random() < 0.5) {
        gameState.beerScore *= 2;
        showUpgradeMessage("Chanceux ! Votre score est doublé !");
      } else {
        gameState.beerScore = Math.floor(gameState.beerScore / 2);
        showUpgradeMessage(
          "Pas de chance ! Votre score est réduit de moitié !",
          true
        );
      }
      updateBeerScoreDisplay();
    },
  },
  {
    id: "beerFactoryUpgrade",
    name: "Brasserie",
    description:
      "Investissez dans une brasserie pour produire 5% supplémentaires de bières toutes les 60 secondes.",
    baseCost: 300,
    costMultiplier: 2,
    quantity: 0,
    effect: function () {
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
      showUpgradeMessage(`${this.name} achetée !`);
    },
  },

  {
    id: "insultUpgrade",
    name: "Insulte Loufoque",
    description: "Achetez une insulte loufoque !",
    baseCost: 5000,
    costMultiplier: 1,  // Coût fixe
    quantity: 0,
    effect: function () {
      const insults = [
        "T'as la cervelle d'une huître !",
        "T'es aussi utile qu'une porte de prison !",
        "Tu fais du surplace comme un hamster dans sa roue !",
        "T'as une tête à faire fuir les oiseaux !",
        "T'es tellement nul que même les escargots te dépassent !",
        "T'as l'intelligence d'une cacahuète !",
        "Ton QI est en congé permanent !",
        "Gobeur de poils d’aisselle",
        "Espèce de cornichon radioactif",
        "Boulet cosmique de l'espace",
        "Tête de flan intergalactique",
        "Poney sous caféine",
        "Limace en smoking",
        "Canard philosophique en pleine crise",
        "Banane existentiellement confuse",
        "Éponge à idées vides",
        "Licorne en RTT",
        "Crevette insomniaque",
        "Chou-fleur du chaos",
        "Clown triste du lundi matin",
        "Tapis volant sans permis",
        "Mouette diplômée en hurlements",
        "Troll végétarien",
        "Brosse à dents anarchiste",
        "Fusée en grève",
        "Cactus sentimental",
        "Pixel dépressif",
        "Pigeon syndiqué",
        "Robot allergique au Wi-Fi",
        "Fromage en quête d'identité",
        "Koala hypersensible",
        "Avocat qui fait du slam",
        "Touillette engagée politiquement",
        "Griffon végétalien",
        "Nouille mélancolique",
        "Micro-ondes en burn-out",
        "Singe philosophe",
        "Baleine invisible"
      ];
      const spinDuration = 2000; // durée totale du spin en ms
  
      // Affiche un message générique pendant le spin
      showUpgradeMessage("Roulette en cours ...", false);
  
      // Après spinDuration, choisir et afficher l'insulte finale (persistante)
      setTimeout(() => {
        const finalInsult = insults[Math.floor(Math.random() * insults.length)];
        showUpgradeMessage(finalInsult, false, true);
      }, spinDuration);
    }
  },

  {
    id: "beerDrinkerUpgrade",
    name: "Louer un Théo",
    description: "Louez un clone de Théo pour boire vos bières et générer 5 clics supplémentaires par seconde par clone.",
    baseCost: 200,
    costMultiplier: 2,
    quantity: 0,
    effect: function () {
      // Si l'intervalle n'est pas déjà lancé, le lancer
      if (!window.beerDrinkerInterval) {
        window.beerDrinkerInterval = setInterval(() => {
          // Le bonus = 5 * nombre de buveurs loués
          const bonusClicks = 5 * shopUpgrades.find(u => u.id === "beerDrinkerUpgrade").quantity;
          gameState.beerScore += bonusClicks;
          updateBeerScoreDisplay();
          saveBeerClickerData();
        }, 1000);
      }
      showUpgradeMessage("Clone loué !");
    }
  },
];

// Calcule le coût actuel d'une upgrade (coût exponentiel)
export function getUpgradeCost(upgrade) {
  if (
    upgrade.id === "beerSacrificeUpgrade" ||
    upgrade.id === "beerLotteryUpgrade"
  ) {
    return upgrade.baseCost;
  } else {
    return Math.floor(
      upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.quantity)
    );
  }
}

// Tente d'acheter une upgrade dans le shop
export function purchaseShopUpgrade(upgradeId) {
  const upgrade = shopUpgrades.find((u) => u.id === upgradeId);
  if (!upgrade) return;
  const cost = getUpgradeCost(upgrade);
  if (gameState.beerScore >= cost) {
    gameState.beerScore -= cost;
    upgrade.quantity++;
    upgrade.effect(); // Cet appel affiche son message personnalisé.
    updateBeerScoreDisplay();
    saveBeerClickerData();
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

  // Met à jour le rappel de bières disponibles
  const reminder = document.getElementById("shopBeerReminder");
  if (reminder) {
    reminder.textContent = `Bières disponibles : ${gameState.beerScore} 🍺`;
  }

  shopUpgrades.forEach((upgrade) => {
    const cost = getUpgradeCost(upgrade);
    const isAffordable = gameState.beerScore >= cost;
    const priceColor = isAffordable ? "green" : "red";
    const description =
      typeof upgrade.getDescription === "function"
        ? upgrade.getDescription()
        : upgrade.description;

    const upgradeDiv = document.createElement("div");
    upgradeDiv.className = "shop-upgrade";
    upgradeDiv.innerHTML = `
      <h3>${upgrade.name}</h3>
      <p>${description}</p>
      <p style="color: ${priceColor};">Coût : ${cost} 🍺</p>
      <p>Quantité : ${upgrade.quantity}</p>
      <button id="buy-${upgrade.id}" ${!isAffordable ? "disabled" : ""} style="cursor: ${isAffordable ? "pointer" : "not-allowed"};">Acheter</button>
    `;
    shopContainer.appendChild(upgradeDiv);
  });
}


// Affiche un message temporaire (type toast) pour le shop
export function showUpgradeMessage(message, isError = false) {
  const messageElement = document.getElementById("upgradeMessage");
  if (!messageElement) return;
  messageElement.textContent = message;
  messageElement.style.color = isError ? "#dc2626" : "#16a34a";
  messageElement.classList.remove("hidden");
}

// Fonction d'initialisation du shop
export function initializeShop() {
  loadShopData();
  renderShop();

  const shopContainer = document.getElementById("shopContainer");
  if (shopContainer) {
    shopContainer.addEventListener("click", function(e) {
      // Vérifier si l'élément cliqué est un bouton d'achat
      const target = e.target;
      if (target && target.tagName === "BUTTON" && target.id.startsWith("buy-")) {
        const upgradeId = target.id.substring(4);
        purchaseShopUpgrade(upgradeId);
      }
    });
  }
}

// Charge les quantités d'upgrades sauvegardées
export function loadShopData() {
  const savedShop = localStorage.getItem("shopUpgrades");
  if (savedShop) {
    const savedData = JSON.parse(savedShop);
    shopUpgrades.forEach((upgrade) => {
      if (savedData[upgrade.id] !== undefined) {
        upgrade.quantity = savedData[upgrade.id];
      }
    });
  }
}

// Sauvegarde les quantités d'upgrades dans le localStorage
export function saveShopData() {
  const savedData = {};
  shopUpgrades.forEach((upgrade) => {
    savedData[upgrade.id] = upgrade.quantity;
  });
  localStorage.setItem("shopUpgrades", JSON.stringify(savedData));
}

export function resetShopData() {
  shopUpgrades.forEach((upgrade) => {
    upgrade.quantity = 0;
  });
  saveShopData();
  renderShop();
}

export function updateBonusDisplay() {
  const bonusDisplay = document.getElementById("bonusDisplay");
  if (!bonusDisplay) return;

  let html = "";
  // Afficher le nombre de Brasseries (Beer Factory Upgrade)
  if (window.shopUpgrades) {
    let brewery = window.shopUpgrades.find(
      (upg) => upg.id === "beerFactoryUpgrade"
    );
    if (brewery) {
      html += `<div id = "brasserieContainer"> <img id="brasserie" src="src/images/brasserie.png" alt="brasserie"><span> x ${brewery.quantity}</span> </div>`;
    }
  }

  if (window.shopUpgrades) {
    let beerDrinker = window.shopUpgrades.find(
      (upg) => upg.id === "beerDrinkerUpgrade"
    );
    if (beerDrinker) {
      html += `<div id = "beerDrinkerContainer"> <img id="beerDrinker" src="src/images/beerDrinker.png" alt="theo"><span> x ${beerDrinker.quantity}</span> </div>`;
    }
  }
  // Afficher le timer pour Click Storm s'il est actif
  if (window.clickStormActive && window.clickStormActive.endTime) {
    let remaining = Math.max(
      0,
      Math.floor((window.clickStormActive.endTime - Date.now()) / 1000)
    );
    html += `<p>Click Storm: ${remaining} sec</p>`;
  }
  // Afficher le timer pour Super Auto-clicker s'il est actif
  if (window.superAutoActive && window.superAutoActive.endTime) {
    let remaining = Math.max(
      0,
      Math.floor((window.superAutoActive.endTime - Date.now()) / 1000)
    );
    html += `<p>Super Auto-clicker: ${remaining} sec</p>`;
  }
  bonusDisplay.innerHTML = html;
}
window.shopUpgrades = shopUpgrades;
