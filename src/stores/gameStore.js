import { defineStore } from 'pinia'
import { getShopUpgrades, getAchievements, GAME_CONSTANTS } from '../logic/gameData.js'
import { STOCKS, getNextPrice } from '../logic/marketLogic.js'

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

    // Market
    marketShares: {}, // { 'yeast_coin': 0, ... }
    marketPrices: {}, // { 'yeast_coin': 100, ... }
    marketHistory: {}, // { 'yeast_coin': [100, 102, 98...], ... }
    // Intervals
    heartbeatIntervalId: null,
    marketIntervalId: null,
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

      // Market Data
      const savedShares = localStorage.getItem('marketShares')
      if (savedShares) this.marketShares = JSON.parse(savedShares)

      const savedPrices = localStorage.getItem('marketPrices')
      if (savedPrices) {
        this.marketPrices = JSON.parse(savedPrices)
      } else {
        // Init default prices
        STOCKS.forEach((stock) => {
          this.marketPrices[stock.id] = stock.basePrice
        })
      }
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

      // Market
      localStorage.setItem('marketShares', JSON.stringify(this.marketShares))
      localStorage.setItem('marketPrices', JSON.stringify(this.marketPrices))
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

    // --- Market ---
    initMarket() {
      // Ensure default state for new stocks
      STOCKS.forEach((stock) => {
        if (this.marketShares[stock.id] === undefined) this.marketShares[stock.id] = 0
        if (this.marketPrices[stock.id] === undefined) this.marketPrices[stock.id] = stock.basePrice
        if (!this.marketHistory[stock.id]) this.marketHistory[stock.id] = [stock.basePrice]
      })

      if (!this.marketIntervalId) {
        this.marketIntervalId = setInterval(() => {
          this.tickMarket()
        }, 5000) // Update every 5 seconds
      }
    },

    tickMarket() {
      STOCKS.forEach((stock) => {
        const current = this.marketPrices[stock.id]
        const next = getNextPrice(current, stock.basePrice, stock.volatility)
        this.marketPrices[stock.id] = next

        // Update History (keep last 20 points)
        if (!this.marketHistory[stock.id]) this.marketHistory[stock.id] = []
        this.marketHistory[stock.id].push(next)
        if (this.marketHistory[stock.id].length > 20) {
          this.marketHistory[stock.id].shift()
        }
      })
    },

    buyStock(stockId, amount) {
      const cost = this.marketPrices[stockId] * amount
      if (this.beerScore >= cost) {
        this.beerScore -= cost
        this.marketShares[stockId] += amount
        this.saveGameData()
        return true
      }
      return false
    },

    sellStock(stockId, amount) {
      if (this.marketShares[stockId] >= amount) {
        const revenue = this.marketPrices[stockId] * amount
        this.beerScore += revenue
        this.marketShares[stockId] -= amount
        this.saveGameData()
        return true
      }
      return false
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

      // Start Heartbeat (Smooth Counter)
      this.startHeartbeat()

      // Start Market
      this.initMarket()

      // Check achievements initially
      this.checkAchievements()
    },

    startHeartbeat() {
      if (this.heartbeatIntervalId) clearInterval(this.heartbeatIntervalId)
      this.heartbeatIntervalId = setInterval(() => {
        // Add 1/10th of BPS every 100ms
        const bps = this.beersPerSecond
        if (bps > 0) {
          this.beerScore += bps / 10
        }
      }, 100)
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

    // Legacy interval cleaners (now just for safety/empty)
    ensureFactoryInterval() {},
    ensureDrinkerInterval() {},
    ensureStartupInterval() {},
    ensurePipelineInterval() {},
    ensureAiBrewerInterval() {},
    ensureQuantumBreweryInterval() {},

    getUpgradeCost(upgradeId) {
      const list = getShopUpgrades(this)
      const upg = list.find((u) => u.id === upgradeId)
      if (!upg) return 0
      const qty = this.upgrades[upgradeId] || 0

      // Dynamic Booking Mapping
      const boosterMap = {
        theoBoosterUpgrade: 'beerDrinkerUpgrade',
        startupBoosterUpgrade: 'startupUpgrade',
        brasserieBoosterUpgrade: 'beerFactoryUpgrade',
        pipelineBoosterUpgrade: 'pipelineUpgrade',
      }

      if (upg.id === 'beerSacrificeUpgrade') {
        return Math.floor(this.beerScore * 0.5)
      } else if (upg.id === 'beerLotteryUpgrade') {
        return upg.baseCost
      } else if (boosterMap[upgradeId]) {
        // "Add unit cost as base price" logic
        // We get the cost of the *next* unit they would buy
        const parentUnitId = boosterMap[upgradeId]

        // Prevent infinite recursion by calling the basic formula manually for the parent,
        // OR trust that parent units don't map to anything in boosterMap (which they don't).
        const unitCost = this.getUpgradeCost(parentUnitId)

        // Formula: (BaseBoosterCost + CurrentUnitCost) * (BoosterScale ^ BooleanQty)
        const dynamicBase = upg.baseCost + unitCost

        return Math.floor(dynamicBase * Math.pow(upg.costMultiplier, qty))
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
      this.startAutoClicker()
      this.superAutoActive = null
    },

    resetGame(options) {
      const { keepSkins = false, keepAchievements = false } = options || {}
      // 1. Stop all intervals
      if (this.heartbeatIntervalId) clearInterval(this.heartbeatIntervalId)
      if (this.autoClickerIntervalId) clearInterval(this.autoClickerIntervalId)

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
      if (!keepSkins) {
        localStorage.removeItem('unlockedSkins')
        localStorage.removeItem('selectedSkin')
        localStorage.removeItem('unlockedAccessories')
        localStorage.removeItem('equippedAccessories')
        localStorage.removeItem('selectedAccessory') // Clear legacy key too
      }

      // Conditionally clear Achievements
      if (!keepAchievements) {
        localStorage.removeItem('achievements')
      }

      // 3. Reload page
      location.reload()
    },
  },
})
