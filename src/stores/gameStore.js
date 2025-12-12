import { defineStore } from 'pinia'
import { getShopUpgrades, getAchievements } from '../logic/gameData.js'

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

    // Boosters
    brasserieBoosterMultiplier: 1,
    beerDrinkerBoosterMultiplier: 1,
    clickStormActive: null,
    superAutoActive: null,

    // Shop
    upgrades: {}, // Map of id -> quantity

    // Skins
    unlockedSkins: ['default'],
    selectedSkin: 'default',

    // Achievements
    achievements: [], // List of achievement objects with state

    // Intervals
    beerFactoryIntervalId: null,
    beerDrinkerIntervalId: null,
  }),

  getters: {
    currentAutoClickerDelay: (state) => {
      // If super auto clicker is active, the delay is halved
      if (state.superAutoActive) {
        return (state.autoClickerIntervalTime || 5000) / 2
      }
      return state.autoClickerIntervalTime || 5000
    },
  },

  actions: {
    // --- Core Game Actions ---
    incrementBeerScore(amount = null) {
      const value = amount !== null ? amount : this.beerMultiplier
      this.beerScore += value
      this.checkAchievements()
      this.saveGameData()
    },

    // --- Loading / Saving ---
    loadGameData() {
      // Beer Score & Multiplier
      this.beerScore = Number(localStorage.getItem('beerScore')) || 0
      this.beerMultiplier = Number(localStorage.getItem('beerMultiplier')) || 1
      // Base auto-clicker interval is 5000ms (5 seconds). Upgrades reduce this value.
      this.autoClickerIntervalTime = Number(localStorage.getItem('autoClickerIntervalTime')) || 5000

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

      // Achievements
      const savedAchievements = localStorage.getItem('achievements')
      if (savedAchievements) {
        const loaded = JSON.parse(savedAchievements)
        // Merge loaded state with static definitions (handled in initialization)
        // For now just assume we have a list to merge into
        this.mergeAchievementsState(loaded)
      }
    },

    saveGameData() {
      localStorage.setItem('beerScore', this.beerScore)
      localStorage.setItem('beerMultiplier', this.beerMultiplier)
      localStorage.setItem('autoClickerIntervalTime', this.autoClickerIntervalTime)
      localStorage.setItem('shopUpgrades', JSON.stringify(this.upgrades))
      localStorage.setItem('unlockedSkins', JSON.stringify(this.unlockedSkins))
      localStorage.setItem('selectedSkin', this.selectedSkin)
      localStorage.setItem('achievements', JSON.stringify(this.achievements))
    },

    // --- Shop Actions ---

    // --- Auto Clicker ---
    startAutoClicker() {
      if (this.autoClickerIntervalId) clearInterval(this.autoClickerIntervalId)
      this.autoClickerActive = true
      this.autoClickerIntervalId = setInterval(() => {
        this.incrementBeerScore()
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
          const bonus = 500 * currentQty * this.brasserieBoosterMultiplier
          this.beerScore += bonus
        }, 5000)
      }
    },

    ensureDrinkerInterval() {
      const qty = this.upgrades['beerDrinkerUpgrade'] || 0
      if (qty > 0 && !this.beerDrinkerIntervalId) {
        this.beerDrinkerIntervalId = setInterval(() => {
          const currentQty = this.upgrades['beerDrinkerUpgrade'] || 0
          const bonus = 2 * currentQty * this.beerDrinkerBoosterMultiplier
          // Math.floor logic from legacy?
          this.beerScore += bonus
        }, 1000)
      }
    },

    getUpgradeCost(upgradeId) {
      const list = getShopUpgrades(this)
      const upg = list.find((u) => u.id === upgradeId)
      if (!upg) return 0
      const qty = this.upgrades[upgradeId] || 0

      if (upg.id === 'beerSacrificeUpgrade' || upg.id === 'beerLotteryUpgrade') {
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

    resetGame() {
      // 1. Stop all intervals
      if (this.autoClickerIntervalId) clearInterval(this.autoClickerIntervalId)
      if (this.beerFactoryIntervalId) clearInterval(this.beerFactoryIntervalId)
      if (this.beerDrinkerIntervalId) clearInterval(this.beerDrinkerIntervalId)

      // Stop Booster timers
      if (this.superAutoActive) clearTimeout(this.superAutoActive.timer)
      if (this.clickStormActive) clearTimeout(this.clickStormActive.timer)

      this.autoClickerActive = false

      // 2. Clear Local Storage
      // Explicitly remove known keys to avoid nuking unrelated data if any
      localStorage.removeItem('beerScore')
      localStorage.removeItem('beerMultiplier')
      localStorage.removeItem('autoClickerIntervalTime')
      localStorage.removeItem('shopUpgrades')
      localStorage.removeItem('unlockedSkins')
      localStorage.removeItem('selectedSkin')
      localStorage.removeItem('achievements')

      // Or just clear all if we own the domain mostly
      localStorage.clear()

      // 3. Reload page
      location.reload()
    },
  },
})
