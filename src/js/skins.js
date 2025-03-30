// skin.js
import { gameState, updateBeerScoreDisplay } from "./gameState.js";

// Définition des skins disponibles avec leur coût (en bières)
export const skins = [
    {
      id: "default",
      name: "Défaut",
      className: "skin-default",
      price: 0,  // Skin gratuit
      image: "src/images/skins/blonde.png"
    },
    {
      id: "blanche",
      name: "Blanche",
      className: "skin-blanche",
      price: 100000,
      image: "src/images/skins/blanche.png"
    },
    {
      id: "ambre",
      name: "Ambrée",
      className: "skin-ambre",
      price: 100000,
      image: "src/images/skins/ambre.png"
    }
  ];
  
  /**
   * Charge la liste des skins débloqués depuis le localStorage.
   * Par défaut, le skin "default" est débloqué.
   * @returns {Array} Liste des IDs de skins débloqués.
   */
  export function loadUnlockedSkins() {
    try {
      const data = localStorage.getItem("unlockedSkins");
      if (!data) return ["default"];
      return JSON.parse(data);
    } catch (e) {
      console.error("Erreur lors du parsing de unlockedSkins :", e);
      // En cas d'erreur, on retourne la valeur par défaut et on réinitialise le stockage
      localStorage.setItem("unlockedSkins", '["default"]');
      return ["default"];
    }
  }
  
  
  /**
   * Sauvegarde la liste des skins débloqués dans le localStorage.
   * @param {Array} unlockedSkins - Liste des IDs de skins débloqués.
   */
  export function saveUnlockedSkins(unlockedSkins = loadUnlockedSkins()) {
    localStorage.setItem("unlockedSkins", JSON.stringify(unlockedSkins));
  }
  
  /**
   * Vérifie si un skin est débloqué.
   * @param {string} skinId - L'identifiant du skin.
   * @returns {boolean} True si débloqué.
   */
  export function isSkinUnlocked(skinId) {
    const unlockedSkins = loadUnlockedSkins();
    return unlockedSkins.includes(skinId);
  }
  
  /**
   * Tente d'acheter un skin en vérifiant que le joueur dispose d'assez de bières.
   * Le score et l'affichage sont mis à jour.
   * @param {string} skinId - L'identifiant du skin.
   */
  export function purchaseSkin(skinId) {
    const skin = skins.find(s => s.id === skinId);
    if (!skin) return;
  
    if (isSkinUnlocked(skinId)) {
      showSkinMessage("Ce skin est déjà débloqué.", true);
      return;
    }
  
    if (gameState.beerScore >= skin.price) {
      gameState.beerScore -= skin.price;
      updateBeerScoreDisplay();
      const unlockedSkins = loadUnlockedSkins();
      unlockedSkins.push(skinId);
      saveUnlockedSkins(unlockedSkins);
      showSkinMessage(`Skin "${skin.name}" acheté avec succès !`);
    } else {
      showSkinMessage("Bières insuffisantes pour acheter ce skin.", true);
    }
  }
  
  export function showSkinMessage(message, isError = false) {
    const messageElement = document.getElementById("skinMessage");
    if (!messageElement) return;
    
    messageElement.textContent = message;
    messageElement.style.color = isError ? "#dc2626" : "#16a34a";
    messageElement.classList.remove("hidden");
  }
  

  /**
   * Applique le skin sélectionné (si débloqué) en modifiant la classe du body.
   * @param {string} skinId - L'identifiant du skin.
   */
  export function applySkin(skinId) {
    if (!isSkinUnlocked(skinId)) {
      alert("Ce skin n'est pas encore débloqué.");
      return;
    }
    // Retirer les classes de skin du body
    skins.forEach(skin => document.body.classList.remove(skin.className));
    // Trouver et appliquer le skin sélectionné
    const selectedSkin = skins.find(skin => skin.id === skinId);
    document.body.classList.add(selectedSkin.className);
    localStorage.setItem("selectedSkin", skinId);
  
  // Mettre à jour l'image du Beer Clicker (ou tout autre élément cliquable)
  const clickableImg = document.getElementById("beerClicker");
  if (clickableImg) {
    clickableImg.src = selectedSkin.image;
    }
  }
  
  
  /**
   * Charge et applique le skin sauvegardé, ou le skin par défaut.
   */
  export function loadSkin() {
    const skinId = localStorage.getItem("selectedSkin") || "default";
    applySkin(skinId);
  }
  
  /**
   * Affiche l'interface de sélection des skins dans un conteneur identifié par "skinShopContainer".
   * Si le skin est débloqué, le bouton affiche "Utiliser", sinon "Acheter".
   */
  export function renderSkinShop() {
    const container = document.getElementById("skinShopContainer");
    if (!container) return;
    
    container.innerHTML = "";
    const currentSkin = localStorage.getItem("selectedSkin") || "default";
    
    skins.forEach(skin => {
      const skinDiv = document.createElement("div");
      skinDiv.className = "skin-item";
      
      // Création et ajout de l'image du skin
      const img = document.createElement("img");
      img.src = skin.image;
      img.alt = skin.name;
      img.className = "skin-image";
      skinDiv.appendChild(img);
      
      // Ajout du titre et du prix
      const title = document.createElement("h3");
      title.textContent = skin.name;
      skinDiv.appendChild(title);
      
      const priceP = document.createElement("p");
      priceP.textContent = isSkinUnlocked(skin.id) ? "-" : `Prix : ${skin.price} 🍺`;
      skinDiv.appendChild(priceP);
      
      // Création du bouton d'action
      const button = document.createElement("button");
      if (isSkinUnlocked(skin.id)) {
        if (skin.id === currentSkin) {
          // Ce skin est actuellement utilisé
          button.textContent = "Utilisé";
          button.disabled = true;
          button.classList.add("active-skin-button");
        } else {
          button.textContent = "Utiliser";
          button.addEventListener("click", () => {
            applySkin(skin.id);
            renderSkinShop(); // Actualiser pour mettre à jour l'affichage
          });
        }
      } else {
        button.textContent = "Acheter";
        button.addEventListener("click", () => {
          purchaseSkin(skin.id);
          renderSkinShop(); // Actualiser après l'achat
        });
      }
      skinDiv.appendChild(button);
      
      container.appendChild(skinDiv);
    });
  }
  
  
  export function resetSkins() {
    // Réinitialise la liste des skins débloqués à seulement "default"
    saveUnlockedSkins(["default"]);
    // Réinitialise le skin sélectionné à "default"
    localStorage.setItem("selectedSkin", "default");
    // Applique le skin par défaut
    applySkin("default");
  }