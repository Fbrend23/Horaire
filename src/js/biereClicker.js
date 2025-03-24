// =======================================
// Beer Clicker Minimal
// =======================================


// Variables globales pour le jeu (elles persistent entre les appels)
let beerScore = 0;
let beerMultiplier = 1;
let autoClickerInterval = null;

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

// Met à jour l'affichage du score et du multiplicateur
function updateBeerScoreDisplay() {
  const scoreElement = document.getElementById("beerScore");
  if (scoreElement) {
    scoreElement.textContent = beerScore;
  }

  const multiplierDisplay = document.getElementById("beerMultiplierDisplay");
  if (multiplierDisplay) {
    multiplierDisplay.textContent = beerMultiplier;
  }

  const upgradeCostSpan = document.getElementById("upgradeCost");
  if (upgradeCostSpan) {
    upgradeCostSpan.textContent = getUpgradeCost();
  }
}

// Incrémente le score en fonction du multiplicateur et déclenche une animation
function incrementBeerScore() {
  beerScore += beerMultiplier;
  updateBeerScoreDisplay();
  saveBeerClickerData();
  animateBeerClick();
}

// Réinitialise le score et le multiplicateur
function resetBeerClicker() {
  beerScore = 0;
  beerMultiplier = 1;
  updateBeerScoreDisplay();
  saveBeerClickerData();
  // Vous pouvez aussi stopper l'auto-clicker si besoin
  stopAutoClicker();
}

// Permet d'acheter une upgrade qui augmente le multiplicateur
// Coût arbitraire : par exemple, multiplicateur * 10
function purchaseUpgrade() {
  const upgradeCost = beerMultiplier * 10;
  if (beerScore >= upgradeCost) {
    beerScore -= upgradeCost;
    beerMultiplier++;
    updateBeerScoreDisplay();
    saveBeerClickerData();
    alert("Upgrade acheté ! Nouveau multiplicateur : " + beerMultiplier);
  } else {
    alert("Score insuffisant pour acheter une upgrade !");
  }
}

// Démarre un auto-clicker qui incrémente le score automatiquement
function startAutoClicker(intervalMs = 1000) {
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

// Ajoute une animation simple lors du clic sur l'image
function animateBeerClick() {
  const beerImage = document.getElementById("beerClicker");
  if (beerImage) {
    beerImage.classList.add("clicked");
    setTimeout(() => {
      beerImage.classList.remove("clicked");
    }, 200);
  }
}

function getUpgradeCost() {
  const baseCost = 10;
  return baseCost * Math.pow(2, beerMultiplier - 1);
}


// Fonction d'initialisation à appeler au chargement de la page
export function initializeBeerClicker() {
    loadBeerClickerData();
    updateBeerScoreDisplay();

    // Gestion du clic sur l'image
    const beerImage = document.getElementById("beerClicker");
    if (beerImage) {
      beerImage.addEventListener("click", incrementBeerScore);
    }

    // Bouton pour acheter une upgrade
    const upgradeButton = document.getElementById("upgradeButton");
    if (upgradeButton) {
      upgradeButton.addEventListener("click", purchaseUpgrade);
    }

    // Boutons pour démarrer/arrêter l'auto-clicker
    const startAutoButton = document.getElementById("startAutoButton");
    const stopAutoButton = document.getElementById("stopAutoButton");
    if (startAutoButton) {
      startAutoButton.addEventListener("click", () => startAutoClicker(1000));
    }
    if (stopAutoButton) {
      stopAutoButton.addEventListener("click", stopAutoClicker);
    }

    // Bouton de réinitialisation
    const resetButton = document.getElementById("resetButton");
    if (resetButton) {
      resetButton.addEventListener("click", resetBeerClicker);
    }
}

  