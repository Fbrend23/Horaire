// achievements.js


export const achievements = [
    {
      id: 'firstClick',
      name: 'Premier Clic',
      description: 'Effectuez votre premier clic !',
      condition: (gameState) => gameState.beerScore > 0,
      unlocked: false
    },
    {
      id: 'hundredBeers',
      name: '100 Bières',
      description: 'Atteignez un score de 100 bières.',
      condition: (gameState) => gameState.beerScore >= 100,
      unlocked: false
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
      unlocked: false
    }
    // wip
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
    // Optionnel : rafraîchir l'affichage des achievements (si vous avez un élément dédié)
  }