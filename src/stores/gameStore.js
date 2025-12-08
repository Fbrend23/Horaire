import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const AVAILABLE_SKINS = [
  { id: 'default', name: 'Défaut', price: 0, image: 'blonde.png' },
  { id: 'blanche', name: 'Blanche', price: 100000, image: 'blanche.png' },
  { id: 'ambre', name: 'Ambrée', price: 100000, image: 'ambre.png' },
  { id: 'brune', name: 'Brune', price: 100000, image: 'brune.png' },
]

export const useGameStore = defineStore('game', () => {
  // --- ÉTAT (STATE) ---
  const beerScore = ref(0)
  const beerMultiplier = ref(1)
  const autoClickerIntervalTime = ref(5000)
  const autoClickerActive = ref(false)

  // Skins
  const unlockedSkins = ref(['default'])
  const selectedSkin = ref('default')

  const upgrades = ref([
    {
      id: 'multiplierUpgrade',
      name: 'Multiplicateur',
      baseCost: 10,
      costMultiplier: 2,
      quantity: 0,
    },
    {
      id: 'autoClickerUpgrade',
      name: 'Auto-clicker amélioré',
      baseCost: 50,
      costMultiplier: 1.8,
      quantity: 0,
    },
    {
      id: 'beerFactoryUpgrade',
      name: 'Brasserie',
      baseCost: 30000,
      costMultiplier: 1.5,
      quantity: 0,
    },
    {
      id: 'beerDrinkerUpgrade',
      name: 'Louer un Théo',
      baseCost: 4000,
      costMultiplier: 1.2,
      quantity: 0,
    },
    // TODO ajouter les autres upgrades
  ])

  // --- GETTERS ---
  const currentSkinImage = computed(() => {
    const skin = AVAILABLE_SKINS.find((s) => s.id === selectedSkin.value)

    return skin ? new URL(`../assets/BeerClicker/skins/${skin.image}`, import.meta.url).href : ''
  })

  // Calcul du coût dynamique d'une upgrade
  const getUpgradeCost = (upgradeId) => {
    const upg = upgrades.value.find((u) => u.id === upgradeId)
    if (!upg) return 0
    return Math.floor(upg.baseCost * Math.pow(upg.costMultiplier, upg.quantity))
  }

  // --- ACTIONS ---
  function incrementScore() {
    beerScore.value += beerMultiplier.value
  }

  function buyUpgrade(upgradeId) {
    const upg = upgrades.value.find((u) => u.id === upgradeId)
    if (!upg) return

    const cost = getUpgradeCost(upgradeId)
    if (beerScore.value >= cost) {
      beerScore.value -= cost
      upg.quantity++
      applyUpgradeEffect(upg.id)
    }
  }

  // Logique spécifique de chaque upgrade
  function applyUpgradeEffect(id) {
    switch (id) {
      case 'multiplierUpgrade':
        beerMultiplier.value += 2
        break
      case 'autoClickerUpgrade':
        autoClickerIntervalTime.value *= 0.95
        restartAutoClicker()
        break
      case 'beerFactoryUpgrade':
        break
    }
  }

  function purchaseSkin(skinId) {
    const skin = AVAILABLE_SKINS.find((s) => s.id === skinId)
    if (skin && !unlockedSkins.value.includes(skinId) && beerScore.value >= skin.price) {
      beerScore.value -= skin.price
      unlockedSkins.value.push(skinId)
    }
  }

  function equipSkin(skinId) {
    if (unlockedSkins.value.includes(skinId)) {
      selectedSkin.value = skinId
    }
  }

  // Gestion Auto-Clicker
  let autoClickerTimer = null
  function startAutoClicker() {
    if (autoClickerTimer) clearInterval(autoClickerTimer)
    autoClickerActive.value = true
    autoClickerTimer = setInterval(() => {
      incrementScore()
    }, autoClickerIntervalTime.value)
  }

  function stopAutoClicker() {
    if (autoClickerTimer) clearInterval(autoClickerTimer)
    autoClickerActive.value = false
    autoClickerTimer = null
  }

  function restartAutoClicker() {
    if (autoClickerActive.value) {
      stopAutoClicker()
      startAutoClicker()
    }
  }

  // --- PERSISTANCE (LocalStorage) ---
  // Chargement
  const savedState = localStorage.getItem('gameState_v2')
  if (savedState) {
    const parsed = JSON.parse(savedState)
    beerScore.value = parsed.beerScore || 0
    beerMultiplier.value = parsed.beerMultiplier || 1
    unlockedSkins.value = parsed.unlockedSkins || ['default']
    selectedSkin.value = parsed.selectedSkin || 'default'
    if (parsed.upgrades) {
      // On fusionne pour garder les propriétés statiques (costMultiplier) et récupérer les quantités
      parsed.upgrades.forEach((savedUpg) => {
        const upg = upgrades.value.find((u) => u.id === savedUpg.id)
        if (upg) upg.quantity = savedUpg.quantity
      })
    }
  }

  // Sauvegarde automatique
  watch(
    [beerScore, beerMultiplier, upgrades, unlockedSkins, selectedSkin],
    () => {
      localStorage.setItem(
        'gameState_v2',
        JSON.stringify({
          beerScore: beerScore.value,
          beerMultiplier: beerMultiplier.value,
          unlockedSkins: unlockedSkins.value,
          selectedSkin: selectedSkin.value,
          upgrades: upgrades.value.map((u) => ({ id: u.id, quantity: u.quantity })),
        }),
      )
    },
    { deep: true },
  )

  return {
    beerScore,
    beerMultiplier,
    autoClickerIntervalTime,
    upgrades,
    unlockedSkins,
    selectedSkin,
    AVAILABLE_SKINS,
    currentSkinImage,
    incrementScore,
    buyUpgrade,
    getUpgradeCost,
    purchaseSkin,
    equipSkin,
    startAutoClicker,
    stopAutoClicker,
  }
})
