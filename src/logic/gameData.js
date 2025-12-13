import skinBlonde from '@/assets/BeerClicker/skins/blonde.png'
import skinBlanche from '@/assets/BeerClicker/skins/blanche.png'
import skinAmbre from '@/assets/BeerClicker/skins/ambre.png'
import skinRuby from '@/assets/BeerClicker/skins/ruby.png'
import skinRadioactive from '@/assets/BeerClicker/skins/radioactive.png'
import skinCosmic from '@/assets/BeerClicker/skins/cosmic.png'

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
  {
    id: 'ruby',
    name: 'Rubis',
    className: 'skin-ruby',
    price: 1000000,
    image: skinRuby,
  },
  {
    id: 'radioactive',
    name: 'Radioactive',
    className: 'skin-radioactive',
    price: 10000000,
    image: skinRadioactive,
  },
  {
    id: 'cosmic',
    name: 'Cosmique',
    className: 'skin-cosmic',
    price: 100000000,
    image: skinCosmic,
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
    image: multiplierImg,
    baseCost: 15,
    costMultiplier: 1.4,
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
      "Un robot qui clique pour vous. Ajoute +1 clic à chaque activation de l'Auto-Clicker.",
    baseCost: 2500,
    costMultiplier: 1.5,
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
    costMultiplier: 2.0,
    effect: function () {
      // Passive effect handled in store
    },
  },
  {
    id: 'clickStormUpgrade',
    name: 'Click Storm',
    category: 'click',
    image: clickStormImg,
    description: 'Double votre multiplicateur pendant 20 secondes.',
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
      'Sacrifiez 50% de vos bières pour 50% de chances de doubler votre multiplicateur (ou de le perdre).',
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
    description: 'Investissez dans une brasserie pour produire 25 bières toutes les secondes.',
    baseCost: 2500,
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
    description: 'Louez un clone de Théo pour générer 1 bière supplémentaire par seconde.',
    baseCost: 100,
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
    description: 'Installez des bras mécaniques. Augmente la production de vos brasseries de 50%.',
    baseCost: 10000,
    costMultiplier: 1.5,
    effect: function () {
      store.brasserieBoosterMultiplier *= 1.5
    },
  },
  {
    id: 'startupUpgrade',
    name: 'Startup Étudiante',
    category: 'auto',
    image: startupImg,
    description: 'Une équipe de stagiaires motivés. Produit 5 bières par seconde.',
    baseCost: 500,
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
    description: 'Un transport industriel ! Produit 500 bières par seconde.',
    baseCost: 50000,
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
    description: 'Ajoute +3 à votre multiplicateur de clic.',
    baseCost: 2500,
    costMultiplier: 1.5,
    effect: function () {
      store.beerMultiplier += 3
    },
  },
  {
    id: 'theoBoosterUpgrade',
    name: 'Paquet de clopes',
    category: 'bonus',
    image: cigarettesImg,
    description: 'Augmente la production de vos clones de Théo de 10% par achat.',
    baseCost: 6000,
    costMultiplier: 1.2,
    effect: function () {
      store.beerDrinkerBoosterMultiplier *= 1.1
    },
  },
  {
    id: 'startupBoosterUpgrade',
    name: 'Soirée Pizza',
    category: 'bonus',
    image: pizzaImg,
    description: 'Motivez vos stagiaires avec des pizzas ! (+50% production startups)',
    baseCost: 5000,
    costMultiplier: 1.5,
    effect: function () {
      store.startupBoosterMultiplier *= 1.5
    },
  },
  {
    id: 'pipelineBoosterUpgrade',
    name: 'Lubrifiant à Bière',
    category: 'bonus',
    image: beerLubeImg,
    description: 'Ça glisse mieux ! (+50% production oléoducs)',
    baseCost: 100000,
    costMultiplier: 1.5,
    effect: function () {
      store.pipelineBoosterMultiplier *= 1.5
    },
  },
  {
    id: 'goldGlassUpgrade',
    name: 'Verre en Or',
    category: 'click',
    image: goldGlassImg,
    description: 'La classe ultime. (+10 Multiplicateur de clic)',
    baseCost: 10000,
    costMultiplier: 1.5,
    effect: function () {
      store.beerMultiplier += 10
    },
  },
  {
    id: 'clonePartyUpgrade',
    name: 'Soirée Clones',
    category: 'bonus',
    image: clonePartyImg,
    description: "C'est la fête ! Vos clones de Théo produisent 2x plus.",
    baseCost: 25000,
    costMultiplier: 1.5,
    effect: function () {
      store.beerDrinkerBoosterMultiplier *= 2
    },
  },
  {
    id: 'techSynergyUpgrade',
    name: 'Synergie Tech',
    category: 'bonus',
    image: techSynergyImg,
    description: '+1% production par Startup pour chaque Brasserie possédée.',
    baseCost: 75000,
    costMultiplier: 2,
    effect: function () {
      store.techSynergyActive = true
    },
  },
  {
    id: 'globalExpansionUpgrade',
    name: 'Expansion Mondiale',
    category: 'bonus',
    image: globalExpansionImg,
    description: 'Exportez votre bière ! Production globale +20%.',
    baseCost: 250000,
    costMultiplier: 1.5,
    effect: function () {
      store.globalMultiplier *= 1.2
    },
  },
  {
    id: 'aiBrewerUpgrade',
    name: 'Brasseur IA',
    category: 'auto',
    image: aiImg,
    description: "L'intelligence artificielle au service de la soif. (5,000 bières/sec)",
    baseCost: 1000000,
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
    description:
      'Produit de la bière dans toutes les dimensions simultanément. (250,000 bières/sec)',
    baseCost: 50000000,
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
    description: "L'univers entier est fait de bière. Production globale DOUBLÉE !",
    baseCost: 500000000,
    costMultiplier: 2.5,
    effect: function () {
      store.globalMultiplier *= 2
    },
  },
]
