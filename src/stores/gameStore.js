import { defineStore } from 'pinia'
import { getShopUpgrades, getAchievements, GAME_CONSTANTS } from '../logic/gameData.js'

export const useGameStore = defineStore('game', {
  state: () => ({
    // Beer Clicker
    beerScore: 0,
    beerMultiplier: 1,
    autoClickerIntervalTime: 1000,
    autoClickerActive: false,
    autoClickerIntervalId: null,
    // Notification
    notification: null,
    notificationTimeout: null,

    // Golden Beer Stats
    goldenBeersClicked: 0,
    goldenBeerEarnings: 0,
    manualClicks: 0,

    // Boosters
    brasserieBoosterMultiplier: 1,
    beerDrinkerBoosterMultiplier: 1,
    startupBoosterMultiplier: 1,
    pipelineBoosterMultiplier: 1,
    globalMultiplier: 1,
    techSynergyActive: false,
    clickStormActive: null,
    superAutoActive: null,

    // Shop
    upgrades: {}, // Map of id -> quantity

    // Skins
    unlockedSkins: ['default'],

    selectedSkin: 'default',

    // Accessories
    unlockedAccessories: [],

    equippedAccessories: {}, // { eyes: 'id', head: 'id' }

    // Achievements
    achievements: [], // List of achievement objects with state

    // Intervals
    beerFactoryIntervalId: null,
    beerDrinkerIntervalId: null,
    beerStartupIntervalId: null,
    beerPipelineIntervalId: null,
    beerAiIntervalId: null,
    beerQuantumIntervalId: null,
  }),

  getters: {
    currentAutoClickerDelay: (state) => {
      // If super auto clicker is active, the delay is halved
      if (state.superAutoActive) {
        return (state.autoClickerIntervalTime || 5000) / 2
      }
      return state.autoClickerIntervalTime || 5000
    },

    beersPerSecond(state) {
      let total = 0
      const global = state.globalMultiplier || 1

      // 1. Drinkers (1/s)
      const drinkerQty = state.upgrades['beerDrinkerUpgrade'] || 0
      if (drinkerQty > 0) {
        total +=
          drinkerQty *
          GAME_CONSTANTS.BEER_DRINKER.BASE_PROD *
          state.beerDrinkerBoosterMultiplier *
          global
      }

      // 2. Factories (25/s)
      const factoryQty = state.upgrades['beerFactoryUpgrade'] || 0

      if (factoryQty > 0) {
        total +=
          factoryQty * GAME_CONSTANTS.FACTORY.BASE_PROD * state.brasserieBoosterMultiplier * global
      }

      // 3. Startups (5/s) + Tech Synergy
      const startupQty = state.upgrades['startupUpgrade'] || 0

      if (startupQty > 0) {
        let startupBonus =
          startupQty * GAME_CONSTANTS.STARTUP.BASE_PROD * state.startupBoosterMultiplier * global
        const techSynergyOwned = state.upgrades['techSynergyUpgrade'] > 0

        if (techSynergyOwned && factoryQty > 0) {
          const synergyFactor = 1 + factoryQty * 0.05
          startupBonus *= synergyFactor
        }
        total += startupBonus
      }

      // 4. Pipelines (500/s)
      const pipelineQty = state.upgrades['pipelineUpgrade'] || 0
      if (pipelineQty > 0) {
        total +=
          pipelineQty * GAME_CONSTANTS.PIPELINE.BASE_PROD * state.pipelineBoosterMultiplier * global
      }

      // 5. AI Brewers (5,000/s)
      const aiQty = state.upgrades['aiBrewerUpgrade'] || 0
      if (aiQty > 0) {
        total += aiQty * GAME_CONSTANTS.AI_BREWER.BASE_PROD * global
      }

      // 6. Quantum Breweries (250,000/s)
      const quantumQty = state.upgrades['quantumBreweryUpgrade'] || 0
      if (quantumQty > 0) {
        total += quantumQty * GAME_CONSTANTS.QUANTUM.BASE_PROD * global
      }

      // 7. Auto-Clicker
      if (state.autoClickerActive) {
        // Access getter via 'this'
        const delay = this.currentAutoClickerDelay || 3000
        const clicksPerSecond = 1000 / delay
        const botQty = state.upgrades['mouseBotUpgrade'] || 0

        // Logic: 10% of Click Power per bot
        const valuePerClick = this.beersPerClick * (1 + botQty * 0.1)
        total += valuePerClick * clicksPerSecond
      }

      return total
    },

    beersPerClick(state) {
      let value = state.beerMultiplier
      // Click Synergy: Add 1% of BPS per upgrade
      const synergyQty = state.upgrades['clickSynergyUpgrade'] || 0
      if (synergyQty > 0) {
        value += this.beersPerSecond * 0.01 * synergyQty
      }
      return value
    },
  },

  actions: {
    // --- Core Game Actions ---
    incrementBeerScore(amount = null) {
      let value = amount
      if (value === null) {
        value = this.beersPerClick
      }
      this.beerScore += value
      this.checkAchievements()
      this.saveGameData()
    },

    // --- Loading / Saving ---
    loadGameData() {
      // Beer Score & Multiplier
      this.beerScore = Number(localStorage.getItem('beerScore')) || 0
      this.beerMultiplier = Number(localStorage.getItem('beerMultiplier')) || 1
      this.brasserieBoosterMultiplier =
        Number(localStorage.getItem('brasserieBoosterMultiplier')) || 1
      this.beerDrinkerBoosterMultiplier =
        Number(localStorage.getItem('beerDrinkerBoosterMultiplier')) || 1
      this.startupBoosterMultiplier = Number(localStorage.getItem('startupBoosterMultiplier')) || 1
      this.pipelineBoosterMultiplier =
        Number(localStorage.getItem('pipelineBoosterMultiplier')) || 1
      this.globalMultiplier = Number(localStorage.getItem('globalMultiplier')) || 1
      this.techSynergyActive = localStorage.getItem('techSynergyActive') === 'true'
      // Base auto-clicker interval is 1000ms (1 second). Upgrades reduce this value.
      this.autoClickerIntervalTime = Number(localStorage.getItem('autoClickerIntervalTime')) || 1000

      // Migration: Heal old saves (3000ms) to new base (1000ms) if they haven't bought many upgrades
      // If interval is > 2000, it's definitely the old slow base.
      if (this.autoClickerIntervalTime > 2000) {
        this.autoClickerIntervalTime = 1000
      }

      // Shop Quantities
      const savedShop = localStorage.getItem('shopUpgrades')
      if (savedShop) {
        this.upgrades = JSON.parse(savedShop)
      }

      // Skins
      const savedSkins = localStorage.getItem('unlockedSkins')
      if (savedSkins) {
        this.unlockedSkins = JSON.parse(savedSkins)
      }
      this.selectedSkin = localStorage.getItem('selectedSkin') || 'default'

      // Accessories
      const savedAccessories = localStorage.getItem('unlockedAccessories')
      if (savedAccessories) {
        this.unlockedAccessories = JSON.parse(savedAccessories)
      }

      // Migration: Check for old 'selectedAccessory'
      const legacySelected = localStorage.getItem('selectedAccessory')
      const savedEquipped = localStorage.getItem('equippedAccessories')

      // If legacy selection exists, just reset accessories to avoid complex migration
      if (!savedEquipped && legacySelected && legacySelected !== 'null') {
        this.equippedAccessories = {}
      } else if (savedEquipped) {
        this.equippedAccessories = JSON.parse(savedEquipped)
      } else {
        this.equippedAccessories = {}
      }

      // Achievements
      const savedAchievements = localStorage.getItem('achievements')
      if (savedAchievements) {
        const loaded = JSON.parse(savedAchievements)
        // Merge loaded state with static definitions (handled in initialization)
        // For now just assume we have a list to merge into
        this.mergeAchievementsState(loaded)
      }

      // Golden Beer Stats
      this.goldenBeersClicked = Number(localStorage.getItem('goldenBeersClicked')) || 0
      this.goldenBeerEarnings = Number(localStorage.getItem('goldenBeerEarnings')) || 0
      this.manualClicks = Number(localStorage.getItem('manualClicks')) || 0
    },

    saveGameData() {
      localStorage.setItem('beerScore', this.beerScore)
      localStorage.setItem('beerMultiplier', this.beerMultiplier)
      localStorage.setItem('brasserieBoosterMultiplier', this.brasserieBoosterMultiplier)
      localStorage.setItem('beerDrinkerBoosterMultiplier', this.beerDrinkerBoosterMultiplier)
      localStorage.setItem('startupBoosterMultiplier', this.startupBoosterMultiplier)
      localStorage.setItem('pipelineBoosterMultiplier', this.pipelineBoosterMultiplier)
      localStorage.setItem('globalMultiplier', this.globalMultiplier)
      localStorage.setItem('techSynergyActive', this.techSynergyActive)
      localStorage.setItem('autoClickerIntervalTime', this.autoClickerIntervalTime)
      localStorage.setItem('shopUpgrades', JSON.stringify(this.upgrades))
      localStorage.setItem('unlockedSkins', JSON.stringify(this.unlockedSkins))
      localStorage.setItem('selectedSkin', this.selectedSkin)
      localStorage.setItem('unlockedAccessories', JSON.stringify(this.unlockedAccessories))
      localStorage.setItem('equippedAccessories', JSON.stringify(this.equippedAccessories))

      localStorage.setItem('achievements', JSON.stringify(this.achievements))

      // Golden Beer Stats
      localStorage.setItem('goldenBeersClicked', this.goldenBeersClicked)
      localStorage.setItem('goldenBeerEarnings', this.goldenBeerEarnings)
      localStorage.setItem('manualClicks', this.manualClicks)
    },

    trackGoldenBeer(reward) {
      this.goldenBeersClicked++
      this.goldenBeerEarnings += reward
      this.incrementBeerScore(reward)
      this.saveGameData()
      this.checkAchievements()
    },

    incrementManualClicks() {
      this.manualClicks++
    },

    // --- Auto Clicker ---
    startAutoClicker() {
      if (this.autoClickerIntervalId) clearInterval(this.autoClickerIntervalId)
      this.autoClickerActive = true
      this.autoClickerIntervalId = setInterval(() => {
        // Calculate clicks per cycle
        // MouseBot adds 10% of your current Click Power per bot
        const botQty = this.upgrades['mouseBotUpgrade'] || 0

        // Cycle Value = Base Click + (BotQty * 0.1 * Base Click)
        const totalValue = this.beersPerClick * (1 + botQty * 0.1)
        this.incrementBeerScore(totalValue)
      }, this.autoClickerIntervalTime)
    },

    stopAutoClicker() {
      if (this.autoClickerIntervalId) {
        clearInterval(this.autoClickerIntervalId)
        this.autoClickerIntervalId = null
      }
      this.autoClickerActive = false
    },

    toggleAutoClicker() {
      if (this.autoClickerActive) {
        this.stopAutoClicker()
      } else {
        this.startAutoClicker()
      }
    },

    // --- Skins ---
    buySkin(skinId, price) {
      if (this.unlockedSkins.includes(skinId)) return
      if (this.beerScore >= price) {
        this.beerScore -= price
        this.unlockedSkins.push(skinId)
        this.saveGameData()
      }
    },

    setSkin(skinId) {
      if (this.unlockedSkins.includes(skinId)) {
        this.selectedSkin = skinId
        this.saveGameData()
      }
    },

    // --- Accessories ---
    buyAccessory(accessoryId, price) {
      if (this.unlockedAccessories.includes(accessoryId)) return
      if (this.beerScore >= price) {
        this.beerScore -= price
        this.unlockedAccessories.push(accessoryId)
        this.saveGameData()
      }
    },

    setAccessory(accessory) {
      if (this.unlockedAccessories.includes(accessory.id)) {
        // Toggle logic: if clicking currently equipped in this slot, unequip
        const currentInSlot = this.equippedAccessories[accessory.type]
        if (currentInSlot === accessory.id) {
          // Unequip
          delete this.equippedAccessories[accessory.type]
        } else {
          // Equip (overwrite slot)
          this.equippedAccessories[accessory.type] = accessory.id
        }
        this.saveGameData()
      }
    },

    // --- Achievements ---
    initGame() {
      // Initialize achievements
      const staticAchievements = getAchievements(this)
      this.achievements = staticAchievements.map((a) => ({
        ...a,
        unlocked: false,
        revealed: false,
      }))

      this.loadGameData()

      // Start intervals if needed
      this.ensureFactoryInterval()
      this.ensureDrinkerInterval()
      this.ensureStartupInterval()
      this.ensurePipelineInterval()
      this.ensureAiBrewerInterval()
      this.ensureQuantumBreweryInterval()

      // Check achievements initially
      this.checkAchievements()
    },

    checkAchievements() {
      let changed = false
      this.achievements.forEach((achievement) => {
        if (!achievement.unlocked && achievement.condition()) {
          achievement.unlocked = true
          changed = true
          this.showNotification(achievement)
        }
      })
      if (changed) this.saveGameData()
    },

    mergeAchievementsState(loaded) {
      loaded.forEach((savedAch) => {
        const match = this.achievements.find((a) => a.id === savedAch.id)
        if (match) {
          match.unlocked = savedAch.unlocked
          match.revealed = savedAch.revealed
        }
      })
    },

    // --- Periodic Boosters ---
    ensureFactoryInterval() {
      const qty = this.upgrades['beerFactoryUpgrade'] || 0
      if (qty > 0 && !this.beerFactoryIntervalId) {
        this.beerFactoryIntervalId = setInterval(() => {
          const currentQty = this.upgrades['beerFactoryUpgrade'] || 0
          // 25 beers per second per factory
          const bonus =
            currentQty *
            GAME_CONSTANTS.FACTORY.BASE_PROD *
            this.brasserieBoosterMultiplier *
            this.globalMultiplier
          this.beerScore += bonus
        }, 1000)
      }
    },

    ensureDrinkerInterval() {
      const qty = this.upgrades['beerDrinkerUpgrade'] || 0
      if (qty > 0 && !this.beerDrinkerIntervalId) {
        this.beerDrinkerIntervalId = setInterval(() => {
          const currentQty = this.upgrades['beerDrinkerUpgrade'] || 0
          // 1 beer per second per drinker
          const bonus =
            currentQty *
            GAME_CONSTANTS.BEER_DRINKER.BASE_PROD *
            this.beerDrinkerBoosterMultiplier *
            this.globalMultiplier
          this.beerScore += bonus
        }, 1000)
      }
    },

    ensureStartupInterval() {
      const qty = this.upgrades['startupUpgrade'] || 0
      if (qty > 0 && !this.beerStartupIntervalId) {
        this.beerStartupIntervalId = setInterval(() => {
          const currentQty = this.upgrades['startupUpgrade'] || 0
          // 5 beers per second per startup
          let finalBonus =
            currentQty *
            GAME_CONSTANTS.STARTUP.BASE_PROD *
            this.startupBoosterMultiplier *
            this.globalMultiplier

          // Tech Synergy: +1% per Factory
          const techSynergyOwned = this.upgrades['techSynergyUpgrade'] > 0
          if (techSynergyOwned) {
            const factoryQty = this.upgrades['beerFactoryUpgrade'] || 0
            if (factoryQty > 0) {
              const synergyFactor = 1 + factoryQty * 0.05
              finalBonus *= synergyFactor
            }
          }

          this.beerScore += finalBonus
        }, 1000)
      }
    },

    ensurePipelineInterval() {
      const qty = this.upgrades['pipelineUpgrade'] || 0
      if (qty > 0 && !this.beerPipelineIntervalId) {
        this.beerPipelineIntervalId = setInterval(() => {
          const currentQty = this.upgrades['pipelineUpgrade'] || 0
          // 500 beers per second per pipeline
          const bonus =
            currentQty *
            GAME_CONSTANTS.PIPELINE.BASE_PROD *
            this.pipelineBoosterMultiplier *
            this.globalMultiplier
          this.beerScore += bonus
        }, 1000)
      }
    },

    ensureAiBrewerInterval() {
      const qty = this.upgrades['aiBrewerUpgrade'] || 0
      if (qty > 0 && !this.beerAiIntervalId) {
        this.beerAiIntervalId = setInterval(() => {
          const currentQty = this.upgrades['aiBrewerUpgrade'] || 0
          // 5,000 beers per second per AI
          const bonus = currentQty * GAME_CONSTANTS.AI_BREWER.BASE_PROD * this.globalMultiplier
          this.beerScore += bonus
        }, 1000)
      }
    },

    ensureQuantumBreweryInterval() {
      const qty = this.upgrades['quantumBreweryUpgrade'] || 0
      if (qty > 0 && !this.beerQuantumIntervalId) {
        this.beerQuantumIntervalId = setInterval(() => {
          const currentQty = this.upgrades['quantumBreweryUpgrade'] || 0
          // 250,000 beers per second per Quantum
          const bonus = currentQty * GAME_CONSTANTS.QUANTUM.BASE_PROD * this.globalMultiplier
          this.beerScore += bonus
        }, 1000)
      }
    },

    getUpgradeCost(upgradeId) {
      const list = getShopUpgrades(this)
      const upg = list.find((u) => u.id === upgradeId)
      if (!upg) return 0
      const qty = this.upgrades[upgradeId] || 0

      if (upg.id === 'beerSacrificeUpgrade') {
        return Math.floor(this.beerScore * 0.5)
      } else if (upg.id === 'beerLotteryUpgrade') {
        return upg.baseCost
      } else {
        return Math.floor(upg.baseCost * Math.pow(upg.costMultiplier, qty))
      }
    },

    // Overwriting buyUpgrade to use correct cost calc and effect
    buyUpgrade(upgradeId) {
      const list = getShopUpgrades(this)
      const upg = list.find((u) => u.id === upgradeId)
      if (!upg) return false

      // Check max purchases
      const currentQty = this.upgrades[upgradeId] || 0
      if (upg.maxPurchases && currentQty >= upg.maxPurchases) {
        return false
      }

      const cost = this.getUpgradeCost(upgradeId)

      if (this.beerScore >= cost) {
        this.beerScore -= cost
        if (!this.upgrades[upgradeId]) this.upgrades[upgradeId] = 0
        this.upgrades[upgradeId]++

        // Trigger effect
        let effectResult = null
        if (upg.effect) {
          effectResult = upg.effect()
        }

        this.saveGameData()
        this.checkAchievements()
        // Return true or the effect result if it exists (for clues)
        return effectResult || true
      }
      return false
    },
    showNotification(achievement) {
      this.notification = achievement
      if (this.notificationTimeout) clearTimeout(this.notificationTimeout)
      this.notificationTimeout = setTimeout(() => {
        this.notification = null
      }, 3000)
    },

    activateSuperAutoClicker(durationMs = 15000) {
      if (this.superAutoActive) {
        clearTimeout(this.superAutoActive.timer)
        this.superAutoActive.endTime += durationMs
        this.superAutoActive.timer = setTimeout(() => {
          this.endSuperAutoClicker()
        }, this.superAutoActive.endTime - Date.now())
      } else {
        // Force start with 2x speed
        this.stopAutoClicker()
        // If interval is 0 or NaN, default to 5000 / 2
        const base = this.autoClickerIntervalTime || 5000
        const boostedInterval = base / 2
        this.autoClickerActive = true
        this.autoClickerIntervalId = setInterval(() => {
          this.incrementBeerScore()
        }, boostedInterval)

        this.superAutoActive = {
          endTime: Date.now() + durationMs,
          timer: setTimeout(() => {
            this.endSuperAutoClicker()
          }, durationMs),
        }
      }
    },

    endSuperAutoClicker() {
      // Restore normal speed
      this.stopAutoClicker()
      // If we want it to persist the 'active' state, we just restart it.
      // Assuming user always wants auto-clicker back after super boost.
      this.startAutoClicker()
      this.superAutoActive = null
    },

    resetGame(options = { keepSkins: false, keepAchievements: false }) {
      // 1. Stop all intervals
      if (this.autoClickerIntervalId) clearInterval(this.autoClickerIntervalId)
      if (this.beerFactoryIntervalId) clearInterval(this.beerFactoryIntervalId)
      if (this.beerDrinkerIntervalId) clearInterval(this.beerDrinkerIntervalId)
      if (this.beerStartupIntervalId) clearInterval(this.beerStartupIntervalId)
      if (this.beerPipelineIntervalId) clearInterval(this.beerPipelineIntervalId)
      if (this.beerAiIntervalId) clearInterval(this.beerAiIntervalId)
      if (this.beerQuantumIntervalId) clearInterval(this.beerQuantumIntervalId)

      // Stop Booster timers
      if (this.superAutoActive) clearTimeout(this.superAutoActive.timer)
      if (this.clickStormActive) clearTimeout(this.clickStormActive.timer)

      this.autoClickerActive = false

      // 2. Clear Local Storage
      // Explicitly remove known keys to avoid nuking unrelated data if any
      localStorage.removeItem('beerScore')
      localStorage.removeItem('beerMultiplier')
      localStorage.removeItem('brasserieBoosterMultiplier')
      localStorage.removeItem('beerDrinkerBoosterMultiplier')
      localStorage.removeItem('startupBoosterMultiplier')
      localStorage.removeItem('pipelineBoosterMultiplier')
      localStorage.removeItem('globalMultiplier')
      localStorage.removeItem('techSynergyActive')
      localStorage.removeItem('autoClickerIntervalTime')
      localStorage.removeItem('shopUpgrades')

      // Conditionally clear Skins
      if (!options.keepSkins) {
        localStorage.removeItem('unlockedSkins')
        localStorage.removeItem('selectedSkin')
        localStorage.removeItem('unlockedAccessories')
        localStorage.removeItem('equippedAccessories')
        localStorage.removeItem('selectedAccessory') // Clear legacy key too
      }

      // Conditionally clear Achievements
      if (!options.keepAchievements) {
        localStorage.removeItem('achievements')
      }

      // 3. Reload page
      location.reload()
    },
  },
})
