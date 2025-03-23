import { getTodaysModules } from './agenda.js';

export function applyTheme(theme) {
    document.body.classList.remove("dark-mode", "light-mode");
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else if (theme === "light") {
      document.body.classList.add("light-mode");
    }
  }
  
  export function detectSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  
  export function loadTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
    } else {
      applyTheme(detectSystemTheme());
    }
  }
  
  export function toggleTheme() {
    const current = document.body.classList.contains("dark-mode") ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  }
  ///Plein écran
  export function fullscreen(){
    document.querySelectorAll(".fullscreen").forEach(section => {
      section.addEventListener("click", () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          if (section.requestFullscreen) {
            section.requestFullscreen();
          } else if (section.webkitRequestFullscreen) {
            section.webkitRequestFullscreen(); // Safari
          }
        }
      });
    });
  }

  ///Barre de progression de la journée
  export function updateDayProgressBar() {
    const progressBar = document.getElementById("dayProgressBar");
    const now = new Date();
    const todaysModules = getTodaysModules();
    if (todaysModules.length === 0) {
      progressBar.style.width = "0%";
      return;
    }
  
    // Trouver les heures extrêmes
    const firstModuleStart = todaysModules.reduce((earliest, mod) =>
      mod.getStartDate(now) < earliest.getStartDate(now) ? mod : earliest
    ).getStartDate(now);
  
    const lastModuleEnd = todaysModules.reduce((latest, mod) =>
      mod.getEndDate(now) > latest.getEndDate(now) ? mod : latest
    ).getEndDate(now);
  
    const totalDuration = lastModuleEnd - firstModuleStart;
    const elapsed = now - firstModuleStart;
  
    if (elapsed <= 0) {
      progressBar.style.width = "0%";
    } else if (elapsed >= totalDuration) {
      progressBar.style.width = "100%";
    } else {
      const progressPercent = (elapsed / totalDuration) * 100;
      progressBar.style.width = `${progressPercent.toFixed(1)}%`;
    }
  }
  