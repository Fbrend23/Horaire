import skinBlonde from '@/assets/BeerClicker/skins/blonde.png'
import skinBlanche from '@/assets/BeerClicker/skins/blanche.png'
import skinAmbre from '@/assets/BeerClicker/skins/ambre.png'
import skinRuby from '@/assets/BeerClicker/skins/ruby.png'
import skinRadioactive from '@/assets/BeerClicker/skins/radioactive.png'
import skinCosmic from '@/assets/BeerClicker/skins/cosmic.png'
import skinGold from '@/assets/BeerClicker/skins/gold.png'
import skinEmerald from '@/assets/BeerClicker/skins/emerald.png'
import skinSapphire from '@/assets/BeerClicker/skins/sapphire.png'
import skinObsidian from '@/assets/BeerClicker/skins/obsidian.png'
import skinRainbow from '@/assets/BeerClicker/skins/rainbow.png'
import skinGlitch from '@/assets/BeerClicker/skins/glitch.png'
import skinDiamond from '@/assets/BeerClicker/skins/diamond.png'
import skinVoid from '@/assets/BeerClicker/skins/void.png'
import skinAntimatter from '@/assets/BeerClicker/skins/antimatter.png'
import skinDivine from '@/assets/BeerClicker/skins/divine.png'

// Auto Perk Images
import startupImg from '@/assets/BeerClicker/startup.png'
import pipelineImg from '@/assets/BeerClicker/pipeline.png'
import theoImg from '@/assets/BeerClicker/beerDrinker.png'
import factoryImg from '@/assets/BeerClicker/brasserie.png'
import aiImg from '@/assets/BeerClicker/ai_brewer.png'
import quantumImg from '@/assets/BeerClicker/quantum_brewery.png'
import galaxyImg from '@/assets/BeerClicker/galaxy.png'
import sacrificeImg from '@/assets/BeerClicker/sacrifice.png'
import lotteryImg from '@/assets/BeerClicker/lottery.png'

// New Assets
import multiplierImg from '@/assets/BeerClicker/multiplier.png'
import autoClickerImg from '@/assets/BeerClicker/auto_clicker_improved.png'
import mouseBotImg from '@/assets/BeerClicker/mouse_bot.png'
import clickSynergyImg from '@/assets/BeerClicker/click_synergy.png'
import clickStormImg from '@/assets/BeerClicker/click_storm.png'
import superAutoImg from '@/assets/BeerClicker/super_auto_clicker.png'
import insultImg from '@/assets/BeerClicker/insult.png'
import achievementClueImg from '@/assets/BeerClicker/achievement_clue.png'
import mechanicalArmImg from '@/assets/BeerClicker/mechanical_arm.png'
import yeastImg from '@/assets/BeerClicker/yeast.png'
import cigarettesImg from '@/assets/BeerClicker/cigarettes.png'
import pizzaImg from '@/assets/BeerClicker/pizza.png'
import beerLubeImg from '@/assets/BeerClicker/beer_lube.png'
import goldGlassImg from '@/assets/BeerClicker/gold_glass.png'
import clonePartyImg from '@/assets/BeerClicker/clone_party.png'
import techSynergyImg from '@/assets/BeerClicker/tech_synergy.png'
import globalExpansionImg from '@/assets/BeerClicker/global_expansion.png'
import marketLicenseImg from '@/assets/BeerClicker/market_license.png'

// Accessories
import sunglassesImg from '@/assets/BeerClicker/accessories/sunglasses.png'
import partyHatImg from '@/assets/BeerClicker/accessories/party_hat.png'
import crownImg from '@/assets/BeerClicker/accessories/crown.png'
import mustacheImg from '@/assets/BeerClicker/accessories/mustache.png'
import bowtieImg from '@/assets/BeerClicker/accessories/bowtie.png'
import pipeImg from '@/assets/BeerClicker/accessories/pipe.png'
import monocleImg from '@/assets/BeerClicker/accessories/monocle.png'
import goldMedalImg from '@/assets/BeerClicker/accessories/gold_medal.png'
import angelHaloImg from '@/assets/BeerClicker/accessories/angel_halo.png'
import eyePatchImg from '@/assets/BeerClicker/accessories/eye_patch.png'
import vikingHelmetImg from '@/assets/BeerClicker/accessories/viking_helmet.png'
import vrHeadsetImg from '@/assets/BeerClicker/accessories/vr_headset.png'

import { formatNumber } from '@/utils/format'

export const skins = [
  {
    id: 'default',
    name: 'Défaut',
    description: "L'originale. Simple et efficace.",
    className: 'skin-default',
    price: 0,
    image: skinBlonde,
  },
  {
    id: 'blanche',
    name: 'Blanche',
    description: 'Une bière de blé légère et rafraîchissante.',
    className: 'skin-blanche',
    price: 100000,
    image: skinBlanche,
  },
  {
    id: 'ambre',
    name: 'Ambrée',
    description: 'Rousse aux douces notes de caramel.',
    className: 'skin-ambre',
    price: 100000,
    image: skinAmbre,
  },
  {
    id: 'ruby',
    name: 'Rubis',
    description: 'Une bière rouge intense et fruitée.',
    className: 'skin-ruby',
    price: 1000000,
    image: skinRuby,
  },
  {
    id: 'radioactive',
    name: 'Radioactive',
    description: 'Attention, elle brille dans le noir !',
    className: 'skin-radioactive',
    price: 10000000,
    image: skinRadioactive,
  },
  {
    id: 'cosmic',
    name: 'Cosmique',
    description: "Brassée avec de la poussière d'étoiles.",
    className: 'skin-cosmic',
    price: 100000000,
    image: skinCosmic,
  },
  {
    id: 'emerald',
    name: 'Émeraude',
    description: 'Taillée dans une pierre précieuse brute.',
    className: 'skin-emerald',
    price: 500000000,
    image: skinEmerald,
  },
  {
    id: 'sapphire',
    name: 'Saphir',
    description: "Bleue et profonde comme l'océan.",
    className: 'skin-sapphire',
    price: 1000000000,
    image: skinSapphire,
  },
  {
    id: 'obsidian',
    name: 'Obsidienne',
    description: 'Aussi sombre et tranchante que la nuit.',
    className: 'skin-obsidian',
    price: 5000000000,
    image: skinObsidian,
  },
  {
    id: 'gold',
    name: 'Or',
    description: 'Le luxe absolu pour les palais raffinés.',
    className: 'skin-gold',
    price: 10000000000,
    image: skinGold,
  },
  {
    id: 'rainbow',
    name: 'Arc-en-ciel',
    description: 'Toutes les saveurs en une seule gorgée.',
    className: 'skin-rainbow',
    price: 50000000000,
    image: skinRainbow,
  },
  {
    id: 'glitch',
    name: 'Glitch',
    description: 'Erreur 404 : Bière not found.',
    className: 'skin-glitch',
    price: 10000000000000,
    image: skinGlitch,
  },
  {
    id: 'diamond',
    name: 'Diamant',
    description: 'Incassable et éclatante.',
    className: 'skin-diamond',
    price: 1000000000000, // 1 Trillion
    image: skinDiamond,
  },
  {
    id: 'void',
    name: 'Néant',
    description: "Elle absorbe toute la lumière autour d'elle.",
    className: 'skin-void',
    price: 100000000000000, // 100 Trillion
    image: skinVoid,
  },
  {
    id: 'antimatter',
    name: 'Antimatière',
    description: 'Ne la laissez surtout pas toucher de la matière !',
    className: 'skin-antimatter',
    price: 1000000000000000, // 1 Quadrillion
    image: skinAntimatter,
  },
  {
    id: 'divine',
    name: 'Divin',
    description: 'La boisson des dieux, enfin accessible.',
    className: 'skin-divine',
    price: 10000000000000000, // 10 Quadrillion
    image: skinDivine,
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
  {
    id: 'score10k',
    name: '10 000 Bières',
    description: 'Atteignez un score de 10 000 bières.',
    condition: () => store.beerScore >= 10000,
  },
  {
    id: 'score100k',
    name: '100 000 Bières',
    description: 'Atteignez un score de 100 000 bières.',
    condition: () => store.beerScore >= 100000,
  },
  {
    id: 'score10m',
    name: '10 Millions',
    description: 'Atteignez un score de 10 Millions de bières.',
    condition: () => store.beerScore >= 10000000,
  },
  {
    id: 'score100m',
    name: '100 Millions',
    description: 'Atteignez un score de 100 Millions de bières.',
    condition: () => store.beerScore >= 100000000,
  },
  {
    id: 'score1b',
    name: '1 Milliard',
    description: 'Atteignez un score de 1 Milliard de bières.',
    condition: () => store.beerScore >= 1000000000,
  },
  {
    id: 'startupOwner',
    name: 'Startup Nation',
    description: 'Possédez au moins une Startup Étudiante.',
    condition: () => (store.upgrades['startupUpgrade'] || 0) > 0,
  },
  {
    id: 'pipelineOwner',
    name: 'Roi du Pétrole',
    description: 'Possédez au moins un Oléoduc de Bière.',
    condition: () => (store.upgrades['pipelineUpgrade'] || 0) > 0,
  },
  {
    id: 'aiOwner',
    name: 'Skynet Approves',
    description: 'Possédez au moins un Brasseur IA.',
    condition: () => (store.upgrades['aiBrewerUpgrade'] || 0) > 0,
  },
  {
    id: 'quantumOwner',
    name: "Schrödinger's Beer",
    description: 'Possédez au moins une Brasserie Quantique.',
    condition: () => (store.upgrades['quantumBreweryUpgrade'] || 0) > 0,
  },
  {
    id: 'multiplier50',
    name: 'Multiplicateur 50',
    description: 'Atteignez un multiplicateur de 50.',
    condition: () => store.beerMultiplier >= 50,
  },
  {
    id: 'multiplier100',
    name: 'Multiplicateur 100',
    description: 'Atteignez un multiplicateur de 100.',
    condition: () => store.beerMultiplier >= 100,
  },
  {
    id: 'hundredUpgrades',
    name: 'Collectionneur',
    description: 'Achetez 100 améliorations au total.',
    condition: () => {
      let total = 0
      Object.values(store.upgrades).forEach((q) => (total += q))
      return total >= 100
    },
  },
  {
    id: 'firstGoldenBeer',
    name: 'Première Pépite',
    description: 'Cliquez sur votre première Golden Beer.',
    condition: () => store.goldenBeersClicked >= 1,
  },
  {
    id: 'tenGoldenBeers',
    name: "Chercheur d'Or",
    description: 'Cliquez sur 10 Golden Beers.',
    condition: () => store.goldenBeersClicked >= 10,
  },
  {
    id: 'fiftyGoldenBeers',
    name: "Ruée vers l'Or",
    description: 'Cliquez sur 50 Golden Beers.',
    condition: () => store.goldenBeersClicked >= 50,
  },
]

export const GAME_CONSTANTS = {
  BEER_DRINKER: { BASE_PROD: 1 },
  FACTORY: { BASE_PROD: 60 },
  STARTUP: { BASE_PROD: 5 },
  PIPELINE: { BASE_PROD: 500 },
  AI_BREWER: { BASE_PROD: 5000 },
  QUANTUM: { BASE_PROD: 250000 },
}

export const getShopUpgrades = (store) => [
  {
    id: 'multiplierUpgrade',
    name: 'Puissance du Clic',
    category: 'click',
    description: 'Augmente la puissance de clic de 1 de façon permanente.',
    image: multiplierImg,
    baseCost: 15,
    costMultiplier: 1.2,
    effect: function () {
      store.beerMultiplier += 1
    },
  },
  {
    id: 'autoClickerUpgrade',
    name: 'Auto-clicker amélioré',
    category: 'auto',
    image: autoClickerImg,
    description: "Réduit l'intervalle de l'auto-clicker de 10% de façon permanente.",
    baseCost: 500,
    costMultiplier: 1.6,
    maxPurchases: 10,
    effect: function () {
      store.autoClickerIntervalTime *= 0.9
      if (store.autoClickerActive) {
        store.stopAutoClicker()
        store.startAutoClicker()
      }
    },
  },
  {
    id: 'mouseBotUpgrade',
    name: 'Robot Cliqueur',
    category: 'click',
    image: mouseBotImg,
    description:
      "Un robot qui clique pour vous. Ajoute +10% de votre puissance de clic à chaque activation de l'Auto-Clicker.",
    baseCost: 2500,
    costMultiplier: 1.5,
    maxPurchases: 10,
    effect: function () {
      if (store.autoClickerActive) {
        // Restart to apply new click quantity immediately
        store.stopAutoClicker()
        store.startAutoClicker()
      }
    },
  },
  {
    id: 'clickSynergyUpgrade',
    name: 'Coup de Poing Assisté',
    category: 'bonus',
    image: clickSynergyImg,
    description:
      'Vos clics deviennent redoutables. Ajoute 1% de votre production (Bières/sec) à chaque clic.',
    baseCost: 100000,
    costMultiplier: 2,
    maxPurchases: 5,
    effect: function () {
      // Passive effect handled in store
    },
  },
  {
    id: 'clickStormUpgrade',
    name: 'Click Storm',
    category: 'click',
    image: clickStormImg,
    description: 'Double votre puissance de clic pendant 20 secondes.',
    baseCost: 1000,
    costMultiplier: 2.5,
    effect: function () {
      const durationMs = 20000
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
    category: 'auto',
    image: superAutoImg,
    description: "Double la fréquence de l'auto-clicker pendant 15 secondes.",
    baseCost: 150,
    costMultiplier: 3,
    effect: function () {
      store.activateSuperAutoClicker()
    },
  },
  {
    id: 'beerSacrificeUpgrade',
    name: 'Sacrifice de Bière',
    category: 'fun',
    image: sacrificeImg,
    description:
      'Sacrifiez 50% de vos bières pour 50% de chances de doubler votre puissance de clic (ou de la perdre).',
    baseCost: 0,
    costMultiplier: 1,
    effect: function () {
      if (Math.random() < 0.5) {
        store.beerMultiplier *= 2
      } else {
        store.beerMultiplier = Math.max(1, Math.floor(store.beerMultiplier / 2))
      }
    },
  },
  {
    id: 'beerLotteryUpgrade',
    name: 'Loterie de Bière',
    category: 'fun',
    image: lotteryImg,
    description:
      'Mettez vos bières en jeu pour tenter de gagner gros... ou tout perdre ! (Effet aléatoire)',
    baseCost: 10000,
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
    category: 'auto',
    image: factoryImg,
    get description() {
      const actualProd =
        GAME_CONSTANTS.FACTORY.BASE_PROD *
        store.brasserieBoosterMultiplier *
        (store.globalMultiplier || 1)
      return `Investissez dans une brasserie pour produire ${formatNumber(actualProd)} b/s.`
    },
    get totalDisplay() {
      const actualProd =
        GAME_CONSTANTS.FACTORY.BASE_PROD *
        store.brasserieBoosterMultiplier *
        (store.globalMultiplier || 1)
      const qty = store.upgrades['beerFactoryUpgrade'] || 0
      const total = actualProd * qty
      return `Total : ${formatNumber(total)} b/s`
    },
    baseCost: 1200,
    costMultiplier: 1.2,
    effect: function () {
      store.ensureFactoryInterval()
    },
  },
  {
    id: 'insultUpgrade',
    name: 'Insulte Loufoque',
    category: 'fun',
    image: insultImg,
    description: 'Achetez une insulte loufoque !',
    baseCost: 50000,
    costMultiplier: 1,
    maxPurchases: 1,
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
    category: 'auto',
    image: theoImg,
    get description() {
      const actualProd =
        GAME_CONSTANTS.BEER_DRINKER.BASE_PROD *
        store.beerDrinkerBoosterMultiplier *
        (store.globalMultiplier || 1)
      return `Louez un clone de Théo pour générer ${formatNumber(actualProd)} b/s.`
    },
    get totalDisplay() {
      const actualProd =
        GAME_CONSTANTS.BEER_DRINKER.BASE_PROD *
        store.beerDrinkerBoosterMultiplier *
        (store.globalMultiplier || 1)
      const qty = store.upgrades['beerDrinkerUpgrade'] || 0
      const total = actualProd * qty
      return `Total : ${formatNumber(total)} b/s`
    },
    baseCost: 15,
    costMultiplier: 1.15,
    effect: function () {
      store.ensureDrinkerInterval()
    },
  },
  {
    id: 'achievementsClue',
    name: 'Succès manquant',
    category: 'fun',
    image: achievementClueImg,
    description: 'Découvrez un succès manquant dans votre liste',
    baseCost: 50,
    costMultiplier: 1,
    effect: function () {
      const locked = store.achievements.filter((a) => !a.unlocked && !a.revealed)
      if (locked.length > 0) {
        const random = locked[Math.floor(Math.random() * locked.length)]
        random.revealed = true
        store.saveGameData()
        return random // Return the achievement so it can be displayed
      }
      return null
    },
  },
  {
    id: 'brasserieBoosterUpgrade',
    name: 'Bras Mécaniques',
    category: 'bonus',
    image: mechanicalArmImg,
    description: 'Installez des bras mécaniques. Double la production de vos brasseries.',
    baseCost: 10000,
    costMultiplier: 1.5,
    effect: function () {
      store.brasserieBoosterMultiplier *= 2
    },
    // Requirement: 10 factories per existing booster level + 10
    unlockCondition: (store) =>
      (store.upgrades['beerFactoryUpgrade'] || 0) >=
      ((store.upgrades['brasserieBoosterUpgrade'] || 0) + 1) * 10,
    unlockText: (store) => {
      const level = store.upgrades['brasserieBoosterUpgrade'] || 0
      const req = (level + 1) * 10
      return `Requiert ${req} Brasserie(s)`
    },
  },
  {
    id: 'startupUpgrade',
    name: 'Startup Étudiante',
    category: 'auto',
    image: startupImg,
    get description() {
      // Tech Synergy check
      let synergyFactor = 1
      if (store.upgrades['techSynergyUpgrade'] > 0 && store.upgrades['beerFactoryUpgrade'] > 0) {
        synergyFactor = 1 + store.upgrades['beerFactoryUpgrade'] * 0.05
      }
      const actualProd =
        GAME_CONSTANTS.STARTUP.BASE_PROD *
        store.startupBoosterMultiplier *
        (store.globalMultiplier || 1) *
        synergyFactor
      return `Une équipe de stagiaires motivés. Produit ${formatNumber(actualProd)} b/s.`
    },
    get totalDisplay() {
      // Tech Synergy check
      let synergyFactor = 1
      if (store.upgrades['techSynergyUpgrade'] > 0 && store.upgrades['beerFactoryUpgrade'] > 0) {
        synergyFactor = 1 + store.upgrades['beerFactoryUpgrade'] * 0.05
      }
      const actualProd =
        GAME_CONSTANTS.STARTUP.BASE_PROD *
        store.startupBoosterMultiplier *
        (store.globalMultiplier || 1) *
        synergyFactor
      const qty = store.upgrades['startupUpgrade'] || 0
      const total = actualProd * qty
      return `Total : ${formatNumber(total)} b/s`
    },
    baseCost: 100,
    costMultiplier: 1.4,
    effect: function () {
      store.ensureStartupInterval()
    },
  },
  {
    id: 'pipelineUpgrade',
    name: 'Oléoduc de Bière',
    category: 'auto',
    image: pipelineImg,
    get description() {
      const actualProd =
        GAME_CONSTANTS.PIPELINE.BASE_PROD *
        store.pipelineBoosterMultiplier *
        (store.globalMultiplier || 1)
      return `Un transport industriel ! Produit ${formatNumber(actualProd)} b/s.`
    },
    get totalDisplay() {
      const actualProd =
        GAME_CONSTANTS.PIPELINE.BASE_PROD *
        store.pipelineBoosterMultiplier *
        (store.globalMultiplier || 1)
      const qty = store.upgrades['pipelineUpgrade'] || 0
      const total = actualProd * qty
      return `Total : ${formatNumber(total)} b/s`
    },
    baseCost: 15000,
    costMultiplier: 1.5,
    effect: function () {
      store.ensurePipelineInterval()
    },
  },
  {
    id: 'yeastUpgrade',
    name: 'Levure Magique',
    category: 'click',
    image: yeastImg,
    description: 'Ajoute +5 à votre puissance de clic.',
    baseCost: 5000,
    costMultiplier: 1.5,
    effect: function () {
      store.beerMultiplier += 5
    },
  },
  {
    id: 'theoBoosterUpgrade',
    name: 'Paquet de clopes',
    category: 'bonus',
    image: cigarettesImg,
    description: 'Augmente la production de vos clones de Théo de 100% par achat (Double !).',
    baseCost: 750,
    costMultiplier: 1.2,
    effect: function () {
      store.beerDrinkerBoosterMultiplier *= 2
    },
    unlockCondition: (store) =>
      (store.upgrades['beerDrinkerUpgrade'] || 0) >=
      ((store.upgrades['theoBoosterUpgrade'] || 0) + 1) * 10,
    unlockText: (store) => {
      const level = store.upgrades['theoBoosterUpgrade'] || 0
      const req = (level + 1) * 10
      return `Requiert ${req} Théo(s)`
    },
  },
  {
    id: 'startupBoosterUpgrade',
    name: 'Soirée Pizza',
    category: 'bonus',
    image: pizzaImg,
    description: 'Motivez vos stagiaires avec des pizzas ! (Double la production)',
    baseCost: 5000,
    costMultiplier: 1.5,
    effect: function () {
      store.startupBoosterMultiplier *= 2
    },
    unlockCondition: (store) =>
      (store.upgrades['startupUpgrade'] || 0) >=
      ((store.upgrades['startupBoosterUpgrade'] || 0) + 1) * 10,
    unlockText: (store) => {
      const level = store.upgrades['startupBoosterUpgrade'] || 0
      const req = (level + 1) * 10
      return `Requiert ${req} Startup(s)`
    },
  },
  {
    id: 'pipelineBoosterUpgrade',
    name: 'Lubrifiant à Bière',
    category: 'bonus',
    image: beerLubeImg,
    description: 'Ça glisse mieux ! (Double la production des oléoducs)',
    baseCost: 100000,
    costMultiplier: 1.5,
    effect: function () {
      store.pipelineBoosterMultiplier *= 2
    },
    unlockCondition: (store) =>
      (store.upgrades['pipelineUpgrade'] || 0) >=
      ((store.upgrades['pipelineBoosterUpgrade'] || 0) + 1) * 10,
    unlockText: (store) => {
      const level = store.upgrades['pipelineBoosterUpgrade'] || 0
      const req = (level + 1) * 10
      return `Requiert ${req} Oléoduc(s)`
    },
  },
  {
    id: 'marketLicenseUpgrade',
    name: 'Licence de Courtier',
    category: 'bonus',
    image: marketLicenseImg,
    description: "Débloque l'accès à la Bourse de la Bière.",
    baseCost: 50000,
    costMultiplier: 1,
    maxPurchases: 1,
    effect: function () {
      // Unlocks UI via state check
    },
  },
  {
    id: 'goldGlassUpgrade',
    name: 'Verre en Or',
    category: 'click',
    image: goldGlassImg,
    description: 'La classe ultime. (+50 Puissance de clic)',
    baseCost: 500000,
    costMultiplier: 1.5,
    effect: function () {
      store.beerMultiplier += 50
    },
  },
  {
    id: 'clonePartyUpgrade',
    name: 'Soirée Clones',
    category: 'bonus',
    image: clonePartyImg,
    description: "C'est la fête ! Vos clones de Théo produisent 2x plus.",
    baseCost: 10000,
    costMultiplier: 1.5,
    maxPurchases: 1,
    effect: function () {
      store.beerDrinkerBoosterMultiplier *= 2
    },
    unlockCondition: (store) => (store.upgrades['beerDrinkerUpgrade'] || 0) > 0,
    unlockText: () => `Requiert au moins 1 Théo`,
  },
  {
    id: 'techSynergyUpgrade',
    name: 'Synergie Tech',
    category: 'bonus',
    image: techSynergyImg,
    description: '+5% production par Startup pour chaque Brasserie possédée.',
    baseCost: 15000,
    costMultiplier: 2,
    effect: function () {
      store.techSynergyActive = true
    },
    unlockCondition: (store) =>
      (store.upgrades['startupUpgrade'] || 0) >= 10 &&
      (store.upgrades['beerFactoryUpgrade'] || 0) >= 10,
    unlockText: () => `Requiert 10 Startups et 10 Brasseries`,
  },
  {
    id: 'globalExpansionUpgrade',
    name: 'Expansion Mondiale',
    category: 'bonus',
    image: globalExpansionImg,
    description: 'Exportez votre bière ! Production globale +50%.',
    baseCost: 500000,
    costMultiplier: 1.5,
    effect: function () {
      store.globalMultiplier *= 1.5
    },
    unlockCondition: (store) =>
      (store.upgrades['beerFactoryUpgrade'] || 0) >=
      ((store.upgrades['globalExpansionUpgrade'] || 0) + 1) * 30,
    unlockText: (store) => {
      const level = store.upgrades['globalExpansionUpgrade'] || 0
      const req = (level + 1) * 30
      return `Requiert ${req} Brasseries`
    },
  },
  {
    id: 'aiBrewerUpgrade',
    name: 'Brasseur IA',
    category: 'auto',
    image: aiImg,
    get description() {
      const actualProd = GAME_CONSTANTS.AI_BREWER.BASE_PROD * (store.globalMultiplier || 1)
      return `L'intelligence artificielle au service de la soif. (${formatNumber(actualProd)} b/s)`
    },
    get totalDisplay() {
      const actualProd = GAME_CONSTANTS.AI_BREWER.BASE_PROD * (store.globalMultiplier || 1)
      const qty = store.upgrades['aiBrewerUpgrade'] || 0
      const total = actualProd * qty
      return `Total : ${formatNumber(total)} b/s`
    },
    baseCost: 250000,
    costMultiplier: 1.5,
    effect: function () {
      store.ensureAiBrewerInterval()
    },
  },
  {
    id: 'quantumBreweryUpgrade',
    name: 'Brasserie Quantique',
    category: 'auto',
    image: quantumImg,
    get description() {
      const actualProd = GAME_CONSTANTS.QUANTUM.BASE_PROD * (store.globalMultiplier || 1)
      return `Produit de la bière dans toutes les dimensions simultanément. (${formatNumber(actualProd)} b/s)`
    },
    get totalDisplay() {
      const actualProd = GAME_CONSTANTS.QUANTUM.BASE_PROD * (store.globalMultiplier || 1)
      const qty = store.upgrades['quantumBreweryUpgrade'] || 0
      const total = actualProd * qty
      return `Total : ${formatNumber(total)} b/s`
    },
    baseCost: 10000000,
    costMultiplier: 1.6,
    effect: function () {
      store.ensureQuantumBreweryInterval()
    },
  },
  {
    id: 'beerGalaxyUpgrade',
    name: 'Galaxie de Bière',
    category: 'bonus',
    image: galaxyImg,
    description: "L'univers entier est fait de bière. Production globale TRIPLÉE !",
    baseCost: 5000000000,
    costMultiplier: 2.5,
    maxPurchases: 5,
    effect: function () {
      store.globalMultiplier *= 3
    },
    unlockCondition: (store) =>
      (store.upgrades['quantumBreweryUpgrade'] || 0) >=
      ((store.upgrades['beerGalaxyUpgrade'] || 0) + 1) * 10,
    unlockText: (store) => {
      const level = store.upgrades['beerGalaxyUpgrade'] || 0
      const req = (level + 1) * 10
      return `Requiert ${req} Brasserie(s) Quantique(s)`
    },
  },
]

export const accessories = [
  {
    id: 'sunglasses',
    name: 'Lunettes de Soleil',
    type: 'eyes',
    price: 5000,
    image: sunglassesImg,
    style: {
      top: '45%',
      left: '50%',
      width: '55%',
      transform: 'translate(-50%, -50%)',
    },
  },
  {
    id: 'monocle',
    name: 'Monocle',
    type: 'eyes',
    price: 5000000,
    image: monocleImg,
    style: {
      top: '38%',
      left: '55%',
      width: '40%',
      transform: 'translate(-50%, -50%)',
    },
  },
  {
    id: 'party_hat',
    name: 'Chapeau de Fête',
    type: 'head',
    price: 2500,
    image: partyHatImg,
    style: {
      top: '-35%',
      left: '52%',
      width: '60%',
      transform: 'translate(-50%, 0)',
    },
  },
  {
    id: 'crown',
    name: 'Couronne Royale',
    type: 'head',
    price: 150000,
    image: crownImg,
    style: {
      top: '-35%',
      left: '50%',
      width: '70%',
      transform: 'translate(-50%, 0)',
    },
  },
  {
    id: 'angel_halo',
    name: 'Auréole',
    type: 'head',
    price: 1000000000, // 1B
    image: angelHaloImg,
    style: {
      top: '-50%',
      left: '50%',
      width: '60%',
      transform: 'translate(-50%, 0)',
    },
  },
  {
    id: 'eye_patch',
    name: 'Cache-œil',
    type: 'eyes',
    price: 25000000, // 25M
    image: eyePatchImg,
    style: {
      top: '42%',
      left: '38%',
      width: '40%',
      transform: 'translate(-50%, -50%)',
    },
  },
  {
    id: 'viking_helmet',
    name: 'Casque Viking',
    type: 'eyes',
    price: 250000000, // 250M
    image: vikingHelmetImg,
    style: {
      top: '-20%',
      left: '50%',
      width: '75%',
      transform: 'translate(-50%, 0)',
    },
  },
  {
    id: 'vr_headset',
    name: 'Casque VR',
    type: 'eyes',
    price: 5000000000, // 5B
    image: vrHeadsetImg,
    style: {
      top: '38%',
      left: '50%',
      width: '55%',
      transform: 'translate(-50%, -50%)',
    },
  },
  {
    id: 'mustache',
    name: 'Moustache',
    type: 'face',
    price: 10000,
    image: mustacheImg,
    style: {
      top: '55%',
      left: '50%',
      width: '45%',
      transform: 'translate(-50%, -50%)',
    },
  },
  {
    id: 'bowtie',
    name: 'Noeud Papillon',
    type: 'neck',
    price: 50000,
    image: bowtieImg,
    style: {
      top: '68%',
      left: '50%',
      width: '40%',
      transform: 'translate(-50%, 0)',
    },
  },
  {
    id: 'gold_medal',
    name: 'Médaille en Or',
    type: 'neck',
    price: 50000000, // 50M
    image: goldMedalImg,
    style: {
      top: '75%',
      left: '50%',
      width: '30%',
      transform: 'translate(-50%, 0)',
    },
  },
  {
    id: 'pipe',
    name: 'Pipe en Bois',
    type: 'mouth',
    price: 10000000,
    image: pipeImg,
    style: {
      top: '55%',
      left: '65%',
      width: '40%',
      transform: 'translate(-50%, -50%) rotate(-15deg)',
    },
  },
]
