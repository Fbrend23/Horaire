import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // --- Theme ---
  const theme = ref(localStorage.getItem('theme') || 'dark') // Default to dark as per screenshot

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(newTheme) {
    if (newTheme === 'dark' || newTheme === 'light') {
      theme.value = newTheme
    }
  }

  // --- Display Settings ---
  const displaySettings = ref(
    JSON.parse(
      localStorage.getItem('displaySettings') ||
        JSON.stringify({
          agenda: true,
          beerClicker: true,
          clocks: true,
          vacances: true,
        }),
    ),
  )

  function toggleDisplay(key) {
    if (key in displaySettings.value) {
      displaySettings.value[key] = !displaySettings.value[key]
    }
  }

  function updateDisplaySettings(newSettings) {
    displaySettings.value = { ...displaySettings.value, ...newSettings }
  }

  // --- Rave Mode ---
  const isRaveMode = ref(false)
  const raveInterval = ref(null)

  function toggleRaveMode() {
    isRaveMode.value = !isRaveMode.value
    if (isRaveMode.value) {
      startRave()
    } else {
      stopRave()
    }
  }

  function startRave() {
    if (raveInterval.value) return
    document.body.classList.add('rave-mode')
    // Faster beat (300ms) and text-only targeting via CSS var
    raveInterval.value = setInterval(() => {
      const hue = Math.floor(Math.random() * 360)
      document.body.style.setProperty('--rave-hue', `${hue}deg`)
    }, 300)
  }

  function stopRave() {
    if (raveInterval.value) {
      clearInterval(raveInterval.value)
      raveInterval.value = null
    }
    document.body.classList.remove('rave-mode')
    document.body.style.removeProperty('--rave-hue')
    document.body.style.filter = '' // cleanup legacy
    document.body.style.transform = ''
  }

  // --- Persistence ---
  watch(
    theme,
    (newVal) => {
      localStorage.setItem('theme', newVal)
      // Apply class to body
      document.body.classList.remove('dark-mode', 'light-mode')
      document.body.classList.add(`${newVal}-mode`)
    },
    { immediate: true },
  )

  watch(
    displaySettings,
    (newVal) => {
      localStorage.setItem('displaySettings', JSON.stringify(newVal))
    },
    { deep: true },
  )

  return {
    theme,
    toggleTheme,
    setTheme,
    displaySettings,
    toggleDisplay,
    updateDisplaySettings,
    isRaveMode,
    toggleRaveMode,
  }
})
