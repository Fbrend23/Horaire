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
          } else if (section.msRequestFullscreen) {
            section.msRequestFullscreen(); // IE
          }
        }
      });
    });
  }