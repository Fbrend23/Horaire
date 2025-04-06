/* shop.js
    Ce fichier se charge de toute la logique liée à la boutique du jeu. 
    Il définit les différentes améliorations disponibles, calcule leur coût dynamique, gère les achats 
    et met à jour l’interface utilisateur pour refléter l’état du magasin. 
    En autre, il inclut des effets visuels et temporisés associés à certaines améliorations, ce qui enrichit l’expérience de jeu.
*/
import { gameState, updateBeerScoreDisplay, saveBeerClickerData, startAutoClicker, stopAutoClicker } from "./gameState.js";
import { triggerConfetti, launchFireworks } from "./effects.js";
import { renderSkinShop } from "./skins.js";
import { achievements, renderClues,saveAchievements } from "./achievements.js";

// Constantes utilisées pour améliorer la lisibilité
const CLICK_STORM_MULTIPLIER = 2;
const SUPER_AUTO_DURATION_FACTOR = 15 * 1000; // 15 secondes en ms
const BEERS_PER_CLONE = 2; // Nombre de bières générées par clone par seconde

// Configuration des upgrades disponibles dans le shop
export const shopUpgrades = [
  {
    id: "multiplierUpgrade",
    name: "Multiplicateur",
    description: "Augmente le multiplicateur de clic de 1 de façon permanente.",
    baseCost: 10,
    costMultiplier: 2,
    quantity: 0,
    effect: function () {
      // L'effet augmente le multiplicateur de 2 (cohérent avec la description améliorée)
      gameState.beerMultiplier += 2;
      showUpgradeMessage(`${this.name} acheté !`);
    },
  },
  {
    id: "autoClickerUpgrade",
    name: "Auto-clicker amélioré",
    description: "Réduit l'intervalle de l'auto-clicker de 5% de façon permanente.",
    baseCost: 50,
    costMultiplier: 1.8,
    quantity: 0,
    effect: function () {
      gameState.autoClickerIntervalTime *= 0.95;
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
    additionalDuration: 10, // Durée en secondes pour l'effet
    getDescription: function () {
      return `Double votre multiplicateur pendant ${this.additionalDuration} secondes. Si activé à nouveau pendant l'effet, la durée s'accumule.`;
    },
    baseCost: 100,
    costMultiplier: 3,
    quantity: 0,
    effect: function () {
      const durationMs = this.additionalDuration * 1000;
      // Gestion de l'accumulation du timer pour Click Storm
      if (window.clickStormActive) {
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
        const originalMultiplier = gameState.beerMultiplier;
        gameState.beerMultiplier *= CLICK_STORM_MULTIPLIER;
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
    additionalDuration: 15, // Durée en secondes
    getDescription: function () {
      return `Double la fréquence de l'auto-clicker pendant ${this.additionalDuration} secondes. Si activé à nouveau pendant l'effet, le timer est réinitialisé (accumulé).`;
    },
    baseCost: 150,
    costMultiplier: 3,
    quantity: 0,
    effect: function () {
      const durationMs = this.additionalDuration * 1000;
      // Gestion similaire pour accumuler ou réinitialiser le timer de l'effet
      if (window.superAutoActive) {
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
    description: "Sacrifiez une grosse quantité de bières pour déclencher une fête de la bière !",
    baseCost: 10000,
    costMultiplier: 2,
    quantity: 0,
    effect: function () {
      launchFireworks();
      showUpgradeMessage("Sacrifice de Bière réussi ! Fête de la bière !", false);
      // Effet purement visuel, aucune logique supplémentaire.
    },
  },
  {
    id: "beerLotteryUpgrade",
    name: "Loterie de Bière",
    description: "Mettez vos bières en jeu pour tenter de gagner gros... ou tout perdre ! (Effet aléatoire)",
    baseCost: 100000,
    costMultiplier: 1, // Coût fixe
    quantity: 0,
    effect: function () {
      if (Math.random() < 0.5) {
        gameState.beerScore *= 2;
        showUpgradeMessage("Chanceux ! Votre score est doublé !");
      } else {
        gameState.beerScore = Math.floor(gameState.beerScore / 2);
        showUpgradeMessage("Pas de chance ! Votre score est réduit de moitié !", true);
      }
      updateBeerScoreDisplay();
    },
  },
  {
    id: "beerFactoryUpgrade",
    name: "Brasserie",
    description: "Investissez dans une brasserie pour produire 500 bières supplémentaires de bières toutes les 5 secondes.",
    baseCost: 30000,
    costMultiplier: 1.5,
    quantity: 0,
    effect: function () {
      // Utilisation d'un setInterval unique pour éviter des appels multiples
      if (!window.beerFactoryInterval) {
        window.beerFactoryInterval = setInterval(() => {
          // Bonus fixe : 100 bières par upgrade acheté
          const bonusPerFactory = 500;
          const bonus = bonusPerFactory * this.quantity;
          gameState.beerScore += bonus;
          updateBeerScoreDisplay();
          saveBeerClickerData();
        }, 5000);
      }
      showUpgradeMessage(`${this.name} achetée !`);
    },
  },
  {
    id: "insultUpgrade",
    name: "Insulte Loufoque",
    description: "Achetez une insulte loufoque !",
    baseCost: 500000,
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
      const spinDuration = 2000; // Durée du spin en ms
      showUpgradeMessage("Roulette en cours ...", false);
      setTimeout(() => {
        const finalInsult = insults[Math.floor(Math.random() * insults.length)];
        showUpgradeMessage(finalInsult, false, true);
      }, spinDuration);
    }
  },

  
  
  {
    id: "beerDrinkerUpgrade",
    name: "Louer un Théo",
    description: `Louez un clone de Théo pour générer ${BEERS_PER_CLONE} bière${BEERS_PER_CLONE > 1 ? "s" : ""} supplémentaire${BEERS_PER_CLONE > 1 ? "s" : ""} par seconde par clone.`,
    baseCost: 4000,
    costMultiplier: 1.2,
    quantity: 0,
    effect: function () {
      if (!window.beerDrinkerInterval) {
        window.beerDrinkerInterval = setInterval(() => {
          // Utilisation de la constante pour le calcul
          const bonusClicks = BEERS_PER_CLONE * shopUpgrades.find(u => u.id === "beerDrinkerUpgrade").quantity;
          gameState.beerScore += bonusClicks;
          updateBeerScoreDisplay();
          saveBeerClickerData();
        }, 1000);
      }
      showUpgradeMessage("Clone loué !");
    }
  },
  
  {
    id: "achievementsClue",
    name: "Succès manquant",
    description: "Découvrez un succès manquant dans votre liste",
    baseCost: 50,
    costMultiplier: 1,  // Coût fixe
    quantity: 0,
    effect: function() {
    // Récupérer les achievements verrouillés dont l'indice n'est pas encore révélé
    const lockedAchievements = achievements.filter(achievement => !achievement.unlocked && !achievement.revealed);
    
    if (lockedAchievements.length === 0) {
      showUpgradeMessage("Tous les indices sont déjà révélés !");
      return;
    }
    
    // Choisir un achievement au hasard (ou selon un critère) parmi ceux verrouillés
    const achievementToReveal = lockedAchievements[Math.floor(Math.random() * lockedAchievements.length)];
    achievementToReveal.revealed = true;
        
    showUpgradeMessage(`Indice débloqué pour ${achievementToReveal.name} !`);
    saveAchievements();
    renderClues(); // Met à jour l'affichage des indices dans le modal achievements
    }
    },

];

// Calcul du coût actuel d'une upgrade selon sa quantité et son multiplicateur
export function getUpgradeCost(upgrade) {
  if (upgrade.id === "beerSacrificeUpgrade" || upgrade.id === "beerLotteryUpgrade") {
    return upgrade.baseCost;
  } else {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.quantity));
  }
}

// Tentative d'achat d'une upgrade avec vérification de la disponibilité des bières
export function purchaseShopUpgrade(upgradeId) {
  const upgrade = shopUpgrades.find((u) => u.id === upgradeId);
  if (!upgrade) return;
  const cost = getUpgradeCost(upgrade);
  if (gameState.beerScore >= cost) {
    gameState.beerScore -= cost;
    upgrade.quantity++;
    upgrade.effect();
    updateBeerScoreDisplay();
    saveBeerClickerData();
    renderShop();
    saveShopData();
  } else {
    showUpgradeMessage(`Score insuffisant pour ${upgrade.name} !`, true);
  }
}

// Rendu dynamique du shop
export function renderShop() {
  const shopContainer = document.getElementById("shopContainer");
  if (!shopContainer) return;
  shopContainer.innerHTML = "";
  const reminder = document.getElementsByClassName("beer-reminder");
  for (let i = 0; i < reminder.length; i++) {
    reminder[i].textContent = `Bières disponibles : ${gameState.beerScore} 🍺`;
  }
  shopUpgrades.forEach((upgrade) => {
    const cost = getUpgradeCost(upgrade);
    const isAffordable = gameState.beerScore >= cost;
    const priceColor = isAffordable ? "green" : "red";
    const description = typeof upgrade.getDescription === "function" ? upgrade.getDescription() : upgrade.description;
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

// Affichage d'un message temporaire (type toast) pour signaler l'achat ou une erreur
export function showUpgradeMessage(message, isError = false) {
  const messageElement = document.getElementById("upgradeMessage");
  if (!messageElement) return;
  messageElement.textContent = message;
  messageElement.style.color = isError ? "#dc2626" : "#16a34a";
  messageElement.classList.remove("hidden");
}

// Initialisation du shop et attachement des événements d'achat
export function initializeShop() {
  loadShopData();
  renderShop();
  const shopContainer = document.getElementById("shopContainer");
  if (shopContainer) {
    shopContainer.addEventListener("click", function(e) {
      const target = e.target;
      if (target && target.tagName === "BUTTON" && target.id.startsWith("buy-")) {
        const upgradeId = target.id.substring(4);
        purchaseShopUpgrade(upgradeId);
      }
    });
  }
}

// Chargement des données sauvegardées avec gestion d'erreurs
export function loadShopData() {
  try {
    const savedShop = localStorage.getItem("shopUpgrades");
    if (savedShop) {
      const savedData = JSON.parse(savedShop);
      shopUpgrades.forEach((upgrade) => {
        if (savedData[upgrade.id] !== undefined) {
          upgrade.quantity = savedData[upgrade.id];
        }
      });
    }
  } catch (error) {
    console.error("Erreur lors du chargement des données du shop:", error);
  }
}

// Sauvegarde des données du shop avec gestion d'erreurs
export function saveShopData() {
  try {
    const savedData = {};
    shopUpgrades.forEach((upgrade) => {
      savedData[upgrade.id] = upgrade.quantity;
    });
    localStorage.setItem("shopUpgrades", JSON.stringify(savedData));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des données du shop:", error);
  }
}

// Réinitialisation des données du shop
export function resetShopData() {
  shopUpgrades.forEach((upgrade) => {
    upgrade.quantity = 0;
  });
  saveShopData();
  renderShop();
}

// Mise à jour de l'affichage des bonus et des timers d'effets temporaires
export function updateBonusDisplay() {
  const bonusDisplay = document.getElementById("bonusDisplay");
  if (!bonusDisplay) return;
  let html = "";
  if (window.shopUpgrades) {
    let brewery = window.shopUpgrades.find((upg) => upg.id === "beerFactoryUpgrade");
    if (brewery.quantity > 0) {
      html += `<div id="brasserieContainer"><img id="brasserie" src="src/images/brasserie.png" alt="brasserie"><span> x ${brewery.quantity}</span></div>`;
    }
  }
  if (window.shopUpgrades) {
    let beerDrinker = window.shopUpgrades.find((upg) => upg.id === "beerDrinkerUpgrade");
    if (beerDrinker.quantity > 0) {
      html += `<div id="beerDrinkerContainer"><img id="beerDrinker" src="src/images/beerDrinker.png" alt="theo"><span> x ${beerDrinker.quantity}</span></div>`;
    }
  }
  if (window.clickStormActive && window.clickStormActive.endTime) {
    let remaining = Math.max(0, Math.floor((window.clickStormActive.endTime - Date.now()) / 1000));
    html += `<p>Click Storm: ${remaining} sec</p>`;
  }
  if (window.superAutoActive && window.superAutoActive.endTime) {
    let remaining = Math.max(0, Math.floor((window.superAutoActive.endTime - Date.now()) / 1000));
    html += `<p>Super Auto-clicker: ${remaining} sec</p>`;
  }
  bonusDisplay.innerHTML = html;
}
/**
 * Gère l'ouverture et la fermeture du modal de la boutique de skins.
 * Quand l'utilisateur clique sur le bouton "Boutique de Skins", la classe "visible" est ajoutée
 * à l'élément #skinShop pour l'afficher ; le bouton de fermeture fait l'inverse.
 */
export function skinShopToggle() {
  const openSkinBtn = document.getElementById("openSkinShopButton");
  const closeSkinBtn = document.getElementById("closeSkinShop");
  const skinShopModal = document.getElementById("skinShopModal");

  if (openSkinBtn && skinShopModal) {
    openSkinBtn.addEventListener("click", function () {
      skinShopModal.classList.remove("hidden");
      renderSkinShop();
    });
  }

  if (closeSkinBtn && skinShopModal) {
    closeSkinBtn.addEventListener("click", function () {
      skinShopModal.classList.add("hidden");
    });
  }

  window.addEventListener("click", function(e) {
  if (e.target === skinShopModal) {
    skinShopModal.classList.add("hidden");
  }
});
}


/**
 * Initialise la modale principale du shop.
 * Gère l'ouverture lorsque l'utilisateur clique sur le bouton "Ouvrir le Shop"
 * et la fermeture quand il clique sur le bouton de fermeture ou en dehors du contenu.
 */
export function initializeShopModal() {
  const openShopBtn = document.getElementById("openShop");
  const shopModal = document.getElementById("shopModal");
  const closeShopBtn = document.getElementById("closeShop");
  let shopRefreshInterval;

  if (openShopBtn && shopModal) {
    openShopBtn.addEventListener("click", () => {
      shopModal.classList.remove("hidden");
      renderShop(); // Premier rendu à l'ouverture
      // Démarrer l'intervalle de rafraîchissement toutes les 1 seconde
      shopRefreshInterval = setInterval(() => {
        renderShop();
      }, 1000);
    });
  }

  if (closeShopBtn && shopModal) {
    closeShopBtn.addEventListener("click", () => {
      shopModal.classList.add("hidden");
      clearInterval(shopRefreshInterval);
    });
  }

  // Ferme le modal si l'utilisateur clique à l'extérieur du contenu et arrête l'intervalle
  window.addEventListener("click", (e) => {
    if (e.target === shopModal) {
      shopModal.classList.add("hidden");
      clearInterval(shopRefreshInterval);
    }
  });
}


export function updateShopScore() {
  const reminders = document.getElementsByClassName("beer-reminder");
  for (let i = 0; i < reminders.length; i++) {
    reminders[i].textContent = `Bières disponibles : ${gameState.beerScore} 🍺`;
  }
}


window.shopUpgrades = shopUpgrades;
