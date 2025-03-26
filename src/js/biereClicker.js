// =======================================
// Beer Clicker - Version Shop Amélioré
// =======================================

// Variables globales du jeu
let beerScore = 0;
let beerMultiplier = 1;
let autoClickerInterval = null;
let autoClickerIntervalTime = 1000;

// Fonction pour charger les données sauvegardées
function loadBeerClickerData() {
  const savedScore = localStorage.getItem("beerScore");
  const savedMultiplier = localStorage.getItem("beerMultiplier");
  if (savedScore !== null) {
    beerScore = parseInt(savedScore, 10);
  }
  if (savedMultiplier !== null) {
    beerMultiplier = parseInt(savedMultiplier, 10);
  }
}

// Fonction pour sauvegarder les données
function saveBeerClickerData() {
  localStorage.setItem("beerScore", beerScore);
  localStorage.setItem("beerMultiplier", beerMultiplier);
}

// Met à jour l'affichage du score et du multiplicateur, et rafraîchit le shop
function updateBeerScoreDisplay() {
  const scoreElement = document.getElementById("beerScore");
  if (scoreElement) {
    scoreElement.textContent = beerScore;
  }
  const multiplierDisplay = document.getElementById("beerMultiplierDisplay");
  if (multiplierDisplay) {
    multiplierDisplay.textContent = beerMultiplier;
  }
  // Met à jour le shop pour afficher le coût actuel et la quantité achetée
  renderShop();
}

// Incrémente le score et déclenche une animation et vérification d'achievements (le cas échéant)
function incrementBeerScore() {
  beerScore += beerMultiplier;
  updateBeerScoreDisplay();
  saveBeerClickerData();
  animateBeerClick();
  // Ici, vous pouvez appeler une fonction checkAchievements() si vous souhaitez ajouter ce système
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

// Démarre l'auto-clicker
function startAutoClicker(intervalMs) {
  if (!autoClickerInterval) {
    autoClickerInterval = setInterval(() => {
      incrementBeerScore();
    }, intervalMs);
  }
}

// Arrête l'auto-clicker
function stopAutoClicker() {
  if (autoClickerInterval) {
    clearInterval(autoClickerInterval);
    autoClickerInterval = null;
  }
}

// Réinitialise le jeu
function resetBeerClicker() {
  beerScore = 0;
  beerMultiplier = 1;
  updateBeerScoreDisplay();
  saveBeerClickerData();
  stopAutoClicker();
}

// ==============================
// Shop Amélioré
// ==============================

// Tableau des upgrades disponibles
const shopUpgrades = [
  {
    id: "multiplierUpgrade",
    name: "Multiplicateur",
    description: "Augmente le multiplicateur de clic de 1.",
    baseCost: 10,
    costMultiplier: 2,
    quantity: 0,
    effect: function() {
      beerMultiplier += 2;
    }
  },
  {
    id: "autoClickerUpgrade",
    name: "Auto-clicker amélioré",
    description: "Réduit l'intervalle de l'auto-clicker de 10%.",
    baseCost: 50,
    costMultiplier: 2,
    quantity: 0,
    effect: function() {
      autoClickerIntervalTime *= 0.9;
      if (autoClickerInterval) {
        stopAutoClicker();
        startAutoClicker(autoClickerIntervalTime);
      }
    }
  }
];

// Calcule le coût actuel d'une upgrade (coût exponentiel)
function getUpgradeCost(upgrade) {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.quantity));
}

// Tente d'acheter une upgrade dans le shop
function purchaseShopUpgrade(upgradeId) {
  const upgrade = shopUpgrades.find(u => u.id === upgradeId);
  if (!upgrade) return;
  const cost = getUpgradeCost(upgrade);
  if (beerScore >= cost) {
    beerScore -= cost;
    upgrade.quantity++;
    upgrade.effect();
    updateBeerScoreDisplay();
    saveBeerClickerData();
    showUpgradeMessage(`${upgrade.name} acheté !`);
  } else {
    showUpgradeMessage(`Score insuffisant pour ${upgrade.name} !`, true);
  }
}

// Affiche dynamiquement le shop dans le conteneur HTML
function renderShop() {
  const shopContainer = document.getElementById("shopContainer");
  if (!shopContainer) return;
  shopContainer.innerHTML = ""; // Réinitialise le contenu du shop

  shopUpgrades.forEach(upgrade => {
    const cost = getUpgradeCost(upgrade);
    // Création de l'élément upgrade
    const upgradeDiv = document.createElement("div");
    upgradeDiv.className = "shop-upgrade";
    upgradeDiv.innerHTML = `
      <h3>${upgrade.name}</h3>
      <p>${upgrade.description}</p>
      <p>Coût : ${cost} 🍺</p>
      <p>Quantité : ${upgrade.quantity}</p>
      <button id="buy-${upgrade.id}">Acheter</button>
    `;
    shopContainer.appendChild(upgradeDiv);

    // Ajout d'un écouteur sur le bouton d'achat
    const buyButton = document.getElementById(`buy-${upgrade.id}`);
    if (buyButton) {
      buyButton.addEventListener("click", () => {
        purchaseShopUpgrade(upgrade.id);
      });
    }
  });
}

// Affiche un message temporaire (toast) pour le shop
function showUpgradeMessage(message, isError = false) {
  const messageElement = document.getElementById("upgradeMessage");
  if (!messageElement) return;
  messageElement.textContent = message;
  messageElement.style.color = isError ? "#dc2626" : "#16a34a"; // rouge pour erreur, vert sinon
  messageElement.classList.remove("hidden");
  setTimeout(() => {
    messageElement.classList.add("hidden");
  }, 3000);
}

// ==============================
// Initialisation du Beer Clicker
// ==============================
export function initializeBeerClicker() {
  loadBeerClickerData();
  updateBeerScoreDisplay();
  renderShop(); // Affiche le shop dès le démarrage

  // Gestion du clic sur l'image du Beer Clicker
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
    startAutoButton.addEventListener("click", () => startAutoClicker(autoClickerIntervalTime));
  }
  if (stopAutoButton) {
    stopAutoButton.addEventListener("click", stopAutoClicker);
  }
}
