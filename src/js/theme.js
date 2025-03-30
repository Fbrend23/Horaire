/* theme.js - Gestion du thème et de l'affichage en plein écran
   - Applique le thème en fonction des préférences sauvegardées ou du thème système.
   - Permet de basculer entre le mode clair et sombre.
   - Offre des fonctionnalités de plein écran et d'actualisation de la barre de progression journalière.
*/

/**
 * Applique le thème spécifié en ajustant les classes CSS du body.
 * @param {string} theme - "dark" ou "light".
 */
export function applyTheme(theme) {
  document.body.classList.remove("dark-mode", "light-mode");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else if (theme === "light") {
    document.body.classList.add("light-mode");
  }
}

/**
 * Détecte le thème système préféré.
 * @returns {string} "dark" si le mode sombre est préféré, sinon "light".
 */
export function detectSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Charge et applique le thème sauvegardé ou celui du système par défaut.
 */
export function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    applyTheme(saved);
  } else {
    applyTheme(detectSystemTheme());
  }
}

/**
 * Bascule le thème et sauvegarde la préférence.
 */
export function toggleTheme() {
  const current = document.body.classList.contains("dark-mode") ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme(next);
}

/**
 * Active le mode plein écran pour les sections identifiées par la classe "fullscreen".
 */
export function fullscreen() {
  document.querySelectorAll(".fullscreen").forEach(section => {
    section.addEventListener("click", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (section.requestFullscreen) {
        section.requestFullscreen();
      } else if (section.webkitRequestFullscreen) {
        // Support pour Safari
        section.webkitRequestFullscreen();
      }
    });
  });
}

