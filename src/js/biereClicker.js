// =======================================
// biere Clicker Minimal
// =======================================


export function biereClicker(){
    let biereScore = 0; 
    if (localStorage.getItem("biereScore")) {
      biereScore = parseInt(localStorage.getItem("biereScore"), 10);
    }
    
    const initClicker = () => {
      const biereScoreElement = document.getElementById("biereScore");
      const biereImage = document.getElementById("biereClicker");
      
      if (!biereScoreElement || !biereImage) {
        console.error("Les éléments biereScore ou biereImage sont introuvables dans le DOM.");
        return;
      }
      
      // Met à jour l'affichage initial
      biereScoreElement.textContent = biereScore;
    
      // Gestion du clic sur l'image
      biereImage.addEventListener("click", () => {
        biereScore++;
        biereScoreElement.textContent = biereScore;
        localStorage.setItem("biereScore", biereScore);
        console.log("Clic détecté : nouveau score =", biereScore);
      });
    };
    
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initClicker);
    } else {
      initClicker();
    }
  }
  