import { launchFireworks } from './effects.js'
import skinBlonde from '@/assets/BeerClicker/skins/blonde.png'
import skinBlanche from '@/assets/BeerClicker/skins/blanche.png'
import skinAmbre from '@/assets/BeerClicker/skins/ambre.png'

export const skins = [
  {
    id: 'default',
    name: 'Défaut',
    className: 'skin-default',
    price: 0,
    image: skinBlonde,
  },
  {
    id: 'blanche',
    name: 'Blanche',
    className: 'skin-blanche',
    price: 100000,
    image: skinBlanche,
  },
  {
    id: 'ambre',
    name: 'Ambrée',
    className: 'skin-ambre',
    price: 100000,
    image: skinAmbre,
  },
]

export const getAchievements = (store) => [
  {
    id: 'firstClick',
    name: 'Premier Clic',
    description: 'Effectuez votre premier clic !',
    condition: () => store.beerScore > 0,
  },
  {
    id: 'hundredBeers',
    name: '100 Bières',
    description: 'Atteignez un score de 100 bières.',
    condition: () => store.beerScore >= 100,
  },
  {
    id: 'fiftyUpgrades',
    name: '50 Améliorations',
    description: 'Achetez 50 améliorations dans le shop.',
    condition: () => {
      let total = 0
      Object.values(store.upgrades).forEach((q) => (total += q))
      return total >= 50
    },
  },
  {
    id: 'thousandBeers',
    name: '1000 Bières',
    description: 'Atteignez un score de 1000 bières.',
    condition: () => store.beerScore >= 1000,
  },
  {
    id: 'multiplier10',
    name: 'Multiplicateur 10',
    description: 'Atteignez un multiplicateur de 10.',
    condition: () => store.beerMultiplier >= 10,
  },
  {
    id: 'multiplier20',
    name: 'Multiplicateur 20',
    description: 'Atteignez un multiplicateur de 20.',
    condition: () => store.beerMultiplier >= 20,
  },
  {
    id: 'fiveUpgrades',
    name: '5 Améliorations',
    description: 'Achetez 5 améliorations dans le shop.',
    condition: () => {
      let total = 0
      Object.values(store.upgrades).forEach((q) => (total += q))
      return total >= 5
    },
  },
  {
    id: 'fifteenUpgrades',
    name: '15 Améliorations',
    description: 'Achetez 15 améliorations dans le shop.',
    condition: () => {
      let total = 0
      Object.values(store.upgrades).forEach((q) => (total += q))
      return total >= 15
    },
  },
  {
    id: 'autoClickerActive',
    name: 'Auto-clicker activé',
    description: "Activez l'auto-clicker pour la première fois.",
    condition: () => store.autoClickerActive, // Simplified check
  },
  {
    id: 'clickStormUsed',
    name: 'Click Storm',
    description: 'Utilisez Click Storm pour la première fois.',
    condition: () => store.clickStormActive != null,
  },
  {
    id: 'superAutoUsed',
    name: 'Super Auto-clicker',
    description: 'Utilisez le Super Auto-clicker pour la première fois.',
    condition: () => store.superAutoActive != null,
  },
  {
    id: 'sacrificeUsed',
    name: 'Sacrifice de Bière',
    description: "Utilisez l'upgrade Sacrifice de Bière au moins une fois.",
    condition: () => (store.upgrades['beerSacrificeUpgrade'] || 0) > 0,
  },
  {
    id: 'lotteryTaker',
    name: 'Loterie de Bière',
    description: 'Jouez à la Loterie de Bière au moins une fois.',
    condition: () => (store.upgrades['beerLotteryUpgrade'] || 0) > 0,
  },
  {
    id: 'factoryOwner',
    name: 'Propriétaire de Brasserie',
    description: 'Achetez votre première Brasserie.',
    condition: () => (store.upgrades['beerFactoryUpgrade'] || 0) > 0,
  },
  {
    id: 'theoRenter',
    name: 'Loueur de Théo',
    description: 'Louez votre premier clone de Théo.',
    condition: () => (store.upgrades['beerDrinkerUpgrade'] || 0) > 0,
  },
  {
    id: 'ultimateScore',
    name: 'Score Ultime',
    description: 'Atteignez un score de 1 000 000 de bières.',
    condition: () => store.beerScore >= 1000000,
  },
]

export const getShopUpgrades = (store) => [
  {
    id: 'multiplierUpgrade',
    name: 'Multiplicateur',
    description: 'Augmente le multiplicateur de clic de 1 de façon permanente.',
    baseCost: 10,
    costMultiplier: 2,
    effect: function () {
      store.beerMultiplier += 2
    },
  },
  {
    id: 'autoClickerUpgrade',
    name: 'Auto-clicker amélioré',
    description: "Réduit l'intervalle de l'auto-clicker de 5% de façon permanente.",
    baseCost: 50,
    costMultiplier: 1.8,
    effect: function () {
      store.autoClickerIntervalTime *= 0.95
      if (store.autoClickerActive) {
        store.stopAutoClicker()
        store.startAutoClicker()
      }
    },
  },
  {
    id: 'clickStormUpgrade',
    name: 'Click Storm',
    description: 'Double votre multiplicateur pendant 10 secondes.',
    baseCost: 100,
    costMultiplier: 3,
    effect: function () {
      const durationMs = 10000
      if (store.clickStormActive) {
        clearTimeout(store.clickStormActive.timer)
        store.clickStormActive.endTime += durationMs
        store.clickStormActive.timer = setTimeout(() => {
          store.beerMultiplier = store.clickStormActive.originalMultiplier
          store.clickStormActive = null
        }, store.clickStormActive.endTime - Date.now())
      } else {
        const originalMultiplier = store.beerMultiplier
        store.beerMultiplier *= 2
        store.clickStormActive = {
          originalMultiplier,
          endTime: Date.now() + durationMs,
          timer: setTimeout(() => {
            store.beerMultiplier = originalMultiplier
            store.clickStormActive = null
          }, durationMs),
        }
      }
    },
  },
  {
    id: 'superAutoClickerUpgrade',
    name: 'Super Auto-clicker',
    description: "Double la fréquence de l'auto-clicker pendant 15 secondes.",
    baseCost: 150,
    costMultiplier: 3,
    effect: function () {
      const durationMs = 15000
      if (store.superAutoActive) {
        clearTimeout(store.superAutoActive.timer)
        store.superAutoActive.endTime += durationMs
        store.superAutoActive.timer = setTimeout(() => {
          store.stopAutoClicker()
          store.startAutoClicker()
          store.superAutoActive = null
        }, store.superAutoActive.endTime - Date.now())
      } else {
        store.stopAutoClicker()
        const boostedInterval = store.autoClickerIntervalTime / 2
        // Manually start with boosted interval
        store.autoClickerActive = true
        store.autoClickerIntervalId = setInterval(() => store.incrementBeerScore(), boostedInterval)

        store.superAutoActive = {
          endTime: Date.now() + durationMs,
          timer: setTimeout(() => {
            store.stopAutoClicker()
            store.startAutoClicker() // restart with normal time
            store.superAutoActive = null
          }, durationMs),
        }
      }
    },
  },
  {
    id: 'beerSacrificeUpgrade',
    name: 'Sacrifice de Bière',
    description: 'Sacrifiez une grosse quantité de bières pour déclencher une fête de la bière !',
    baseCost: 10000,
    costMultiplier: 2,
    effect: function () {
      launchFireworks()
    },
  },
  {
    id: 'beerLotteryUpgrade',
    name: 'Loterie de Bière',
    description:
      'Mettez vos bières en jeu pour tenter de gagner gros... ou tout perdre ! (Effet aléatoire)',
    baseCost: 100000,
    costMultiplier: 1,
    effect: function () {
      if (Math.random() < 0.5) {
        store.beerScore *= 2
      } else {
        store.beerScore = Math.floor(store.beerScore / 2)
      }
    },
  },
  {
    id: 'beerFactoryUpgrade',
    name: 'Brasserie',
    description:
      'Investissez dans une brasserie pour produire 500 bières supplémentaires toutes les 5 secondes.',
    baseCost: 30000,
    costMultiplier: 1.5,
    effect: function () {
      // This effect just initiates logic that should run periodically.
      // In Vue store, we can have a global interval checking for this.
      // Or just ensure the `beerFactoryInterval` is running if quantity > 0
      store.ensureFactoryInterval()
    },
  },
  {
    id: 'insultUpgrade',
    name: 'Insulte Loufoque',
    description: 'Achetez une insulte loufoque !',
    baseCost: 500000,
    costMultiplier: 1,
    effect: function () {
      // Logic for insult can be a callback or event bus
      // For now we might just set a state "currentInsult"
      const insults = [
        "T'as la cervelle d'une huître !",
        // ... (shortened for brevity, fill later if needed or load from file)
        "T'es aussi utile qu'une porte de prison !",
      ]
      const finalInsult = insults[Math.floor(Math.random() * insults.length)]
      alert(finalInsult) // Simple placeholder
    },
  },
  {
    id: 'beerDrinkerUpgrade',
    name: 'Louer un Théo',
    description:
      'Louez un clone de Théo pour générer 2 bières supplémentaires par seconde par clone.',
    baseCost: 4000,
    costMultiplier: 1.2,
    effect: function () {
      store.ensureDrinkerInterval()
    },
  },
  {
    id: 'achievementsClue',
    name: 'Succès manquant',
    description: 'Découvrez un succès manquant dans votre liste',
    baseCost: 50,
    costMultiplier: 1,
    effect: function () {
      const locked = store.achievements.filter((a) => !a.unlocked && !a.revealed)
      if (locked.length > 0) {
        const random = locked[Math.floor(Math.random() * locked.length)]
        random.revealed = true
        store.saveGameData()
      }
    },
  },
  {
    id: 'brasserieBoosterUpgrade',
    name: 'Achat de robots',
    description: 'Augmente la production de vos brasseries de 50% par achat.',
    baseCost: 10000,
    costMultiplier: 1.5,
    effect: function () {
      store.brasserieBoosterMultiplier *= 1.5
    },
  },
  {
    id: 'theoBoosterUpgrade',
    name: 'Paquet de clopes',
    description: 'Augmente la production de vos clones de Théo de 10% par achat.',
    baseCost: 6000,
    costMultiplier: 1.2,
    effect: function () {
      store.beerDrinkerBoosterMultiplier *= 1.1
    },
  },
]
