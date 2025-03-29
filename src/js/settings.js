// Fonction pour appliquer les paramètres d'affichage aux sections
function applyDisplaySettings(settings) {
  const agenda = document.getElementById("agendaContainer");
  const beerClicker = document.getElementById("beerClickerContainer");
  const clocks = document.getElementById("clocksContainer");
  const vacances = document.getElementById("vacancesContainer");

  // Masque ou affiche les sections individuelles
  if (agenda) agenda.style.display = settings.agenda ? "" : "none";
  if (beerClicker) beerClicker.style.display = settings.beerClicker ? "" : "none";
  if (clocks) clocks.style.display = settings.clocks ? "" : "none";
  if (vacances) vacances.style.display = settings.vacances ? "" : "none";

  // Masquer la colonne gauche si le Beer Clicker est désactivé
  const leftColumn = document.getElementById("left-column");
  if (leftColumn) {
    leftColumn.style.display = settings.beerClicker ? "" : "none";
  }

  // Masquer la colonne du milieu si l'agenda est désactivé
  if (agenda) {
    agenda.style.display = settings.agenda ? "" : "none";
  }

  // Pour la colonne de droite (horloges et vacances)
  const rightColumn = document.querySelector(".vac-column");
  if (rightColumn) {
    // Si aucune des deux sections n'est affichée, masque la colonne entière
    if (!settings.clocks && !settings.vacances) {
      rightColumn.style.display = "none";
    } else {
      rightColumn.style.display = "";
    }
  }
  updateGridTemplate();
}

  
  
  // Charge les paramètres depuis le localStorage (ou définit des valeurs par défaut)
  function loadDisplaySettings() {
    const settings = localStorage.getItem("displaySettings");
    if (settings) {
      return JSON.parse(settings);
    }
    return { agenda: true, beerClicker: true, clocks: true, vacances: true };
  }
  
  // Sauvegarde les paramètres dans le localStorage
  function saveDisplaySettings(settings) {
    localStorage.setItem("displaySettings", JSON.stringify(settings));
  }
  
  // Initialisation de la modale de paramètres
  document.addEventListener("DOMContentLoaded", () => {
    const settingsModal = document.getElementById("settingsModal");
    const openSettingsBtn = document.getElementById("openSettings");
    const closeSettingsBtn = document.getElementById("closeSettings");
    const saveSettingsBtn = document.getElementById("saveSettings");
  
    // Charger les paramètres et appliquer
    const settings = loadDisplaySettings();
    applyDisplaySettings(settings);
  
    // Mettre à jour l'état des cases à cocher selon les paramètres sauvegardés
    document.getElementById("toggleAgenda").checked = settings.agenda;
    document.getElementById("toggleBeerClicker").checked = settings.beerClicker;
    document.getElementById("toggleClocks").checked = settings.clocks;
    document.getElementById("toggleVacances").checked = settings.vacances;
  
    // Ouvre la modale quand on clique sur le bouton
    openSettingsBtn.addEventListener("click", () => {
      settingsModal.classList.remove("hidden");
    });
  
    // Ferme la modale quand on clique sur le bouton de fermeture (X)
    closeSettingsBtn.addEventListener("click", () => {
      settingsModal.classList.add("hidden");
    });
  
    // Sauvegarde les paramètres et ferme la modale
    saveSettingsBtn.addEventListener("click", () => {
      settings.agenda = document.getElementById("toggleAgenda").checked;
      settings.beerClicker = document.getElementById("toggleBeerClicker").checked;
      settings.clocks = document.getElementById("toggleClocks").checked;
      settings.vacances = document.getElementById("toggleVacances").checked;
      saveDisplaySettings(settings);
      applyDisplaySettings(settings);
      settingsModal.classList.add("hidden");
    });
  
    // Facultatif : Fermer la modale en cliquant à l'extérieur du contenu
    window.addEventListener("click", (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.add("hidden");
      }
    });
  });
  
  export function initializeDisplaySettings() {
    // Charge et applique les préférences sauvegardées
    const settings = loadDisplaySettings();
    applyDisplaySettings(settings);
  
    // Met à jour l'état des cases à cocher selon les paramètres sauvegardés
    document.getElementById("toggleAgenda").checked = settings.agenda;
    document.getElementById("toggleBeerClicker").checked = settings.beerClicker;
    document.getElementById("toggleClocks").checked = settings.clocks;
    document.getElementById("toggleVacances").checked = settings.vacances;
  
    // Gestion de l'ouverture et fermeture de la modale
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
  
    // Optionnel : Ferme la modale en cliquant à l'extérieur
    window.addEventListener("click", (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.add("hidden");
      }
    });
  }
  
  function updateGridTemplate() {
    const gridContainer = document.querySelector(".grid-container");
    const left = document.getElementById("left-column");
    const agenda = document.getElementById("agendaContainer");
    const right = document.querySelector(".vac-column");
  
    // On considère un élément visible si son style.display n'est pas "none"
    const leftVisible = left && left.style.display !== "none";
    const agendaVisible = agenda && agenda.style.display !== "none";
    const rightVisible = right && right.style.display !== "none";
  
    if (agendaVisible) {
      if (leftVisible && rightVisible) {
        gridContainer.style.gridTemplateColumns = "1fr 2fr 1fr";
      } else if (leftVisible && !rightVisible) {
        gridContainer.style.gridTemplateColumns = "2fr 1fr";
      } else if (!leftVisible && rightVisible) {
        gridContainer.style.gridTemplateColumns = "2fr 1fr";
      } else {
        gridContainer.style.gridTemplateColumns = "1fr";
      }
    } else {
      // Si l'agenda n'est pas visible, répartir également l'espace entre les colonnes visibles
      let count = 0;
      if (leftVisible) count++;
      if (rightVisible) count++;
      gridContainer.style.gridTemplateColumns = count > 0 ? `repeat(${count}, 1fr)` : "";
    }
  }
  
  // shopModal.js (ou dans settings.js si vous préférez centraliser les modales)
export function initializeShopModal() {
  const openShopBtn = document.getElementById("openShop");
  const shopModal = document.getElementById("shopModal");
  const closeShopBtn = document.getElementById("closeShop");

  if (openShopBtn && shopModal) {
    openShopBtn.addEventListener("click", () => {
      shopModal.classList.remove("hidden");
      // On peut appeler renderShop() ici si besoin
      // renderShop();
    });
  }

  if (closeShopBtn && shopModal) {
    closeShopBtn.addEventListener("click", () => {
      shopModal.classList.add("hidden");
    });
  }

  // Optionnel : Fermer la modale en cliquant en dehors du contenu
  window.addEventListener("click", (e) => {
    if (e.target === shopModal) {
      shopModal.classList.add("hidden");
    }
  });
}
