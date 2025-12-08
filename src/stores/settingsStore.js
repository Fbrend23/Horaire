import { defineStore } from 'pinia'
import { ref, watch, onMounted } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // --- Thème ---
  const theme = ref('light') // 'light' ou 'dark'

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme()
  }

  function applyTheme() {
    document.body.classList.remove('dark-mode', 'light-mode')
    document.body.classList.add(`${theme.value}-mode`)

    // TODO changement de logo
  }

  // --- Affichage (Sections) ---
  const display = ref({
    agenda: true,
    beerClicker: true,
    clocks: true,
    vacances: true,
  })

  // --- Persistance ---
  onMounted(() => {
    // Charger thème
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
    }
    applyTheme()

    // Charger paramètres d'affichage
    const savedDisplay = localStorage.getItem('displaySettings')
    if (savedDisplay) {
      display.value = JSON.parse(savedDisplay)
    }
  })

  watch(theme, (val) => localStorage.setItem('theme', val))
  watch(display, (val) => localStorage.setItem('displaySettings', JSON.stringify(val)), {
    deep: true,
  })

  return {
    theme,
    display,
    toggleTheme,
  }
})
