// achievements.js


export const achievements = [
    {
      id: 'firstClick',
      name: 'Premier Clic',
      description: 'Effectuez votre premier clic !',
      condition: (gameState) => gameState.beerScore > 0,
      unlocked: false,
      revealed: false
    },
    {
      id: 'hundredBeers',
      name: '100 Bières',
      description: 'Atteignez un score de 100 bières.',
      condition: (gameState) => gameState.beerScore >= 100,
      unlocked: false,
      revealed: false
    },
    {
      id: 'fiftyUpgrades',
      name: '50 Améliorations',
      description: 'Achetez 50 améliorations dans le shop.',
      condition: (gameState) => {
        // On somme toutes les quantités des upgrades
        const totalUpgrades = Object.values(gameState.upgrades || {}).reduce((sum, qty) => sum + qty, 0);
        return totalUpgrades >= 50;
      },
      unlocked: false,
      revealed: false
    },
    {
      id: "thousandBeers",
      name: "1000 Bières",
      description: "Atteignez un score de 1000 bières.",
      condition: (state) => state.beerScore >= 1000,
      unlocked: false,
      revealed: false
    },
    {
      id: "multiplier10",
      name: "Multiplicateur 10",
      description: "Atteignez un multiplicateur de 10.",
      condition: (state) => state.beerMultiplier >= 10,
      unlocked: false,
      revealed: false
    },
    {
      id: "multiplier20",
      name: "Multiplicateur 20",
      description: "Atteignez un multiplicateur de 20.",
      condition: (state) => state.beerMultiplier >= 20,
      unlocked: false,
      revealed: false
    },
    {
      id: "fiveUpgrades",
      name: "5 Améliorations",
      description: "Achetez 5 améliorations dans le shop.",
      condition: (state) => {
        let total = 0;
        shopUpgrades.forEach(upg => total += upg.quantity);
        return total >= 5;
      },
      unlocked: false,
      revealed: false
    },
    {
      id: "fifteenUpgrades",
      name: "15 Améliorations",
      description: "Achetez 15 améliorations dans le shop.",
      condition: (state) => {
        let total = 0;
        shopUpgrades.forEach(upg => total += upg.quantity);
        return total >= 15;
      },
      unlocked: false,
      revealed: false
    },
    {
      id: "autoClickerActive",
      name: "Auto-clicker activé",
      description: "Activez l'auto-clicker pour la première fois.",
      condition: (state) => state.autoClickerInterval !== null,
      unlocked: false,
      revealed: false
    },
    {
      id: "clickStormUsed",
      name: "Click Storm",
      description: "Utilisez Click Storm pour la première fois.",
      condition: () => window.clickStormActive != null,
      unlocked: false,
      revealed: false
    },
    {
      id: "superAutoUsed",
      name: "Super Auto-clicker",
      description: "Utilisez le Super Auto-clicker pour la première fois.",
      condition: () => window.superAutoActive != null,
      unlocked: false,
      revealed: false
    },
    {
      id: "sacrificeUsed",
      name: "Sacrifice de Bière",
      description: "Utilisez l'upgrade Sacrifice de Bière au moins une fois.",
      condition: () => {
        const upgrade = shopUpgrades.find(u => u.id === "beerSacrificeUpgrade");
        return upgrade ? upgrade.quantity > 0 : false;
      },
      unlocked: false,
      revealed: false
    },
    {
      id: "lotteryTaker",
      name: "Loterie de Bière",
      description: "Jouez à la Loterie de Bière au moins une fois.",
      condition: () => {
        const upgrade = shopUpgrades.find(u => u.id === "beerLotteryUpgrade");
        return upgrade ? upgrade.quantity > 0 : false;
      },
      unlocked: false,
      revealed: false
    },
    {
      id: "factoryOwner",
      name: "Propriétaire de Brasserie",
      description: "Achetez votre première Brasserie.",
      condition: () => {
        const upgrade = shopUpgrades.find(u => u.id === "beerFactoryUpgrade");
        return upgrade ? upgrade.quantity > 0 : false;
      },
      unlocked: false,
      revealed: false
    },
    {
      id: "theoRenter",
      name: "Loueur de Théo",
      description: "Louez votre premier clone de Théo.",
      condition: () => {
        const upgrade = shopUpgrades.find(u => u.id === "beerDrinkerUpgrade");
        return upgrade ? upgrade.quantity > 0 : false;
      },
      unlocked: false,
      revealed: false
    },
    {
      id: "ultimateScore",
      name: "Score Ultime",
      description: "Atteignez un score de 1 000 000 de bières.",
      condition: (state) => state.beerScore >= 1000000,
      unlocked: false,
      revealed: false
    },
    
  ];
  
  /**
   * Vérifie, à partir de gameState, si des achievements doivent être débloqués.
   */
  export function checkAchievements(gameState) {
    achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition(gameState)) {
        achievement.unlocked = true;
        showAchievement(achievement);
        saveAchievements();
      }
    });
  }
  
  /**
   * Affiche le message d'achievement (par exemple, dans un toast ou une zone dédiée).
   */
  function showAchievement(achievement) {
    const achievementElement = document.getElementById('achievementMessage');
    if (achievementElement) {
      achievementElement.textContent = `Achievement débloqué : ${achievement.name} !`;
      achievementElement.classList.remove('hidden');
      // Optionnel : masquer après 3 secondes
      setTimeout(() => {
        achievementElement.classList.add('hidden');
      }, 3000);
    }
  }
  
  /**
   * Sauvegarde l'état des achievements dans le localStorage.
   */
  export function saveAchievements() {
    localStorage.setItem("achievements", JSON.stringify(achievements));
  }
  
  /**
   * Charge l'état des achievements depuis le localStorage.
   */
  export function loadAchievements() {
    try {
      const saved = localStorage.getItem("achievements");
      if (saved) {
        const loaded = JSON.parse(saved);
        achievements.forEach(achievement => {
          const savedAch = loaded.find(a => a.id === achievement.id);
          if (savedAch) {
            achievement.unlocked = savedAch.unlocked;
            achievement.revealed = savedAch.revealed;
          }
        });
      }
    } catch (e) {
      console.error("Erreur lors du chargement des achievements :", e);
    }
  }
  
  export function resetAchievements() {
    // Réinitialiser chaque achievement à false, sauf s'il y a des achievements "permanents"
    achievements.forEach(achievement => achievement.unlocked = false);
    saveAchievements();
  }

  function renderAchievements() {
    const container = document.getElementById("achievementsList");
    if (!container) return;
    
    // Vider le container
    container.innerHTML = "";
    countAchievements();
    // Parcourir les achievements et ajouter ceux débloqués
    achievements.forEach(achievement => {
      if (achievement.unlocked) {
        const item = document.createElement("div");
        item.className = "achievement-item";
        item.innerHTML = `<h4>${achievement.name}</h4>
                          <p>${achievement.description}</p>`;
        container.appendChild(item);
      }
    });
  }

  export function renderClues() {
    const container = document.getElementById("cluesContainer");
    if (!container) return;
    
    // On vide le container
    container.innerHTML = "";
    
    // Parcourir les achievements verrouillés avec indice révélé
    achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.revealed) {
        const item = document.createElement("div");
        item.className = "clue-item";
        item.innerHTML = `<h4>${achievement.name}</h4>
                          <p>${achievement.description}</p>`;
        container.appendChild(item);
      }
    });
  }
  

function countAchievements(){
  const totalAchiv = document.getElementById("totalAchievements");

  const total = achievements.length;
  const unlocked = achievements.filter(ach => ach.unlocked).length;
  
  totalAchiv.textContent = `${unlocked} / ${total}`

}

  export function initializeAchievementsModal() {
    const showBtn = document.getElementById("openAchievements");
    const achievementsContainer = document.getElementById("achievementsModal");
    const closeBtn = document.getElementById("closeAchievements");
  
    if (showBtn && achievementsContainer) {
      showBtn.addEventListener("click", () => {
        achievementsContainer.classList.remove("hidden");
        renderAchievements(); 
        renderClues();
      });
    }
  
    if (closeBtn && achievementsContainer) {
      closeBtn.addEventListener("click", () => {
        achievementsContainer.classList.add("hidden");
      });
    }

    window.addEventListener("click", (e) => {
      if (e.target === achievementsContainer) {
        achievementsContainer.classList.add("hidden");
      }
    });
  }