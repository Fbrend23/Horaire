import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // --- Theme ---
  // Theme: 'sunset' (default) or 'blue-night'
  const currentTheme = ref(localStorage.getItem('horaire_theme') || 'sunset')
  const weatherEnabled = ref(localStorage.getItem('horaire_weather') !== 'false') // Default true to show effects
  const effectsEnabled = ref(localStorage.getItem('horaire_effects') !== 'false') // Default true for particles/tilt

  // Helper for dark mode (still always active, but we toggle classes based on specific theme now)
  const isDark = ref(true)

  function setTheme(themeName) {
    if (themeName === 'sunset' || themeName === 'blue-night') {
      currentTheme.value = themeName
      localStorage.setItem('horaire_theme', themeName)
      updateThemeClass()
    }
  }

  function updateThemeClass() {
    const root = document.documentElement
    root.classList.remove('theme-blue-night', 'theme-sunset')
    root.classList.add(`theme-${currentTheme.value}`)

    // Ensure dark mode logic is preserved if needed for Tailwind dark: prefix
    root.classList.add('dark')
  }

  function toggleWeather() {
    weatherEnabled.value = !weatherEnabled.value
    localStorage.setItem('horaire_weather', weatherEnabled.value)
  }

  function toggleEffects() {
    effectsEnabled.value = !effectsEnabled.value
    localStorage.setItem('horaire_effects', effectsEnabled.value)
  }

  // --- Display Settings ---
  const defaultSettings = {
    agenda: true,
    beerClicker: true,
    clocks: true,
    vacances: true,
    matrixMode: false,
    showSeconds: true,
    showDate: true,
  }

  const savedSettings = localStorage.getItem('displaySettings')
  let initialSettings = defaultSettings

  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings)
      // Merge saved with default to ensure new keys exist
      initialSettings = { ...defaultSettings, ...parsed }

      if (parsed.vacances === undefined) initialSettings.vacances = true
      if (parsed.clocks === undefined) initialSettings.clocks = true
    } catch {
      // Failed to parse settings
    }
  }

  // --- Dashboard Order ---
  const savedOrderId = localStorage.getItem('dashboardOrder')
  let initialOrder = ['beerClicker', 'agenda', 'transport', 'vacations']

  if (savedOrderId) {
    try {
      const parsed = JSON.parse(savedOrderId)
      if (Array.isArray(parsed)) {
        initialOrder = parsed
        // Migration: Add transport if missing
        if (!initialOrder.includes('transport')) {
          // Insert transport after agenda if possible, or at end
          const agendaIdx = initialOrder.indexOf('agenda')
          if (agendaIdx !== -1) {
            initialOrder.splice(agendaIdx + 1, 0, 'transport')
          } else {
            initialOrder.push('transport')
          }
        }
      }
    } catch {
      // Failed to parse order
    }
  }

  const dashboardOrder = ref(initialOrder)

  const displaySettings = ref(initialSettings)

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
    currentTheme,
    () => {
      updateThemeClass()
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

  watch(
    dashboardOrder,
    (newVal) => {
      localStorage.setItem('dashboardOrder', JSON.stringify(newVal))
    },
    { deep: true },
  )

  return {
    theme: currentTheme, // Computed or direct ref? Using ref directly with new name is clearer but keeping back-compat if needed
    isDark, // Added back for compatibility if needed elsewhere
    currentTheme,
    weatherEnabled,
    effectsEnabled,
    setTheme,
    updateThemeClass,
    toggleWeather,
    toggleEffects,
    displaySettings,
    toggleDisplay,
    updateDisplaySettings,
    isRaveMode,
    toggleRaveMode,
    dashboardOrder,
  }
})
