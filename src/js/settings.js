/* settings.js - Gestion des paramètres d'affichage et des modales
   - Permet d'activer ou masquer certaines sections de l'interface.
   - Sauvegarde et charge les préférences utilisateur via localStorage.
   - Gère l'ouverture et la fermeture de la modale de paramètres.
*/

/**
 * Applique les paramètres d'affichage aux sections de l'interface.
 * @param {Object} settings - Paramètres avec booléens pour chaque section.
 */
function applyDisplaySettings(settings) {
  const agenda = document.getElementById("agendaContainer");
  const beerClicker = document.getElementById("beerClickerContainer");
  const clocks = document.getElementById("clocksContainer");
  const vacances = document.getElementById("vacancesContainer");

  // Affichage conditionnel des sections
  if (agenda) agenda.style.display = settings.agenda ? "" : "none";
  if (beerClicker) beerClicker.style.display = settings.beerClicker ? "" : "none";
  if (clocks) clocks.style.display = settings.clocks ? "" : "none";
  if (vacances) vacances.style.display = settings.vacances ? "" : "none";

  // Mise à jour de la visibilité de la colonne gauche (Beer Clicker)
  const leftColumn = document.getElementById("left-column");
  if (leftColumn) {
    leftColumn.style.display = settings.beerClicker ? "" : "none";
  }

  // Mise à jour de la colonne de droite (horloges et vacances)
  const rightColumn = document.querySelector(".vac-column");
  if (rightColumn) {
    rightColumn.style.display = settings.clocks || settings.vacances ? "" : "none";
  }
  updateGridTemplate();
}

/**
 * Charge les paramètres d'affichage depuis localStorage ou retourne des valeurs par défaut.
 * @returns {Object} Paramètres d'affichage.
 */
function loadDisplaySettings() {
  const settings = localStorage.getItem("displaySettings");
  return settings ? JSON.parse(settings) : { agenda: true, beerClicker: true, clocks: true, vacances: true };
}

/**
 * Sauvegarde les paramètres d'affichage dans localStorage.
 * @param {Object} settings - Paramètres à sauvegarder.
 */
function saveDisplaySettings(settings) {
  localStorage.setItem("displaySettings", JSON.stringify(settings));
}

// Initialisation de la modale des paramètres lors du chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  const settingsModal = document.getElementById("settingsModal");
  const openSettingsBtn = document.getElementById("openSettings");
  const closeSettingsBtn = document.getElementById("closeSettings");
  const saveSettingsBtn = document.getElementById("saveSettings");

  // Charger et appliquer les paramètres sauvegardés
  const settings = loadDisplaySettings();
  applyDisplaySettings(settings);

  // Mise à jour des cases à cocher en fonction des paramètres
  document.getElementById("toggleAgenda").checked = settings.agenda;
  document.getElementById("toggleBeerClicker").checked = settings.beerClicker;
  document.getElementById("toggleClocks").checked = settings.clocks;
  document.getElementById("toggleVacances").checked = settings.vacances;

  // Ouvrir la modale des paramètres
  openSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.remove("hidden");
  });

  // Fermer la modale via le bouton de fermeture
  closeSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.add("hidden");
  });

  // Sauvegarder les paramètres et fermer la modale
  saveSettingsBtn.addEventListener("click", () => {
    settings.agenda = document.getElementById("toggleAgenda").checked;
    settings.beerClicker = document.getElementById("toggleBeerClicker").checked;
    settings.clocks = document.getElementById("toggleClocks").checked;
    settings.vacances = document.getElementById("toggleVacances").checked;
    saveDisplaySettings(settings);
    applyDisplaySettings(settings);
    settingsModal.classList.add("hidden");
  });

  // Fermer la modale si l'utilisateur clique en dehors du contenu
  window.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.add("hidden");
    }
  });
});

/**
 * Initialise les paramètres d'affichage et la modale correspondante.
 */
export function initializeDisplaySettings() {
  const settings = loadDisplaySettings();
  applyDisplaySettings(settings);
  document.getElementById("toggleAgenda").checked = settings.agenda;
  document.getElementById("toggleBeerClicker").checked = settings.beerClicker;
  document.getElementById("toggleClocks").checked = settings.clocks;
  document.getElementById("toggleVacances").checked = settings.vacances;

  const settingsModal = document.getElementById("settingsModal");
  const openSettingsBtn = document.getElementById("openSettings");
  const closeSettingsBtn = document.getElementById("closeSettings");
  const saveSettingsBtn = document.getElementById("saveSettings");

  openSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.remove("hidden");
  });

  closeSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.add("hidden");
  });

  saveSettingsBtn.addEventListener("click", () => {
    settings.agenda = document.getElementById("toggleAgenda").checked;
    settings.beerClicker = document.getElementById("toggleBeerClicker").checked;
    settings.clocks = document.getElementById("toggleClocks").checked;
    settings.vacances = document.getElementById("toggleVacances").checked;
    saveDisplaySettings(settings);
    applyDisplaySettings(settings);
    settingsModal.classList.add("hidden");
  });

  window.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.add("hidden");
    }
  });
}

/**
 * Met à jour la grille en fonction de la visibilité des colonnes.
 */
function updateGridTemplate() {
  const gridContainer = document.querySelector(".grid-container");
  const left = document.getElementById("left-column");
  const agenda = document.getElementById("agendaContainer");
  const right = document.querySelector(".vac-column");

  // Vérifier la visibilité des colonnes
  const leftVisible = left && left.style.display !== "none";
  const agendaVisible = agenda && agenda.style.display !== "none";
  const rightVisible = right && right.style.display !== "none";

  if (agendaVisible) {
    if (leftVisible && rightVisible) {
      gridContainer.style.gridTemplateColumns = "1fr 2fr 1fr";
    } else if (leftVisible && !rightVisible) {
      gridContainer.style.gridTemplateColumns = "1fr 1fr";
    } else if (!leftVisible && rightVisible) {
      gridContainer.style.gridTemplateColumns = "2fr 1fr";
    } else {
      gridContainer.style.gridTemplateColumns = "1fr";
    }
  } else {
    let count = 0;
    if (leftVisible) count++;
    if (rightVisible) count++;
    gridContainer.style.gridTemplateColumns = count > 0 ? `repeat(${count}, 1fr)` : "";
  }
}

/**
 * Initialise la modale de la boutique pour l'affichage des upgrades.
 */
export function initializeShopModal() {
  const openShopBtn = document.getElementById("openShop");
  const shopModal = document.getElementById("shopModal");
  const closeShopBtn = document.getElementById("closeShop");

  if (openShopBtn && shopModal) {
    openShopBtn.addEventListener("click", () => {
      shopModal.classList.remove("hidden");
      // Possibilité d'appeler renderShop() ici pour actualiser le contenu
    });
  }

  if (closeShopBtn && shopModal) {
    closeShopBtn.addEventListener("click", () => {
      shopModal.classList.add("hidden");
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === shopModal) {
      shopModal.classList.add("hidden");
    }
  });
}
