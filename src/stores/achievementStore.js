import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useGameStore } from './gameStore'

export const useAchievementStore = defineStore('achievements', () => {
  const gameStore = useGameStore()

  // Définition des succès
  const definitions = [
    {
      id: 'firstClick',
      name: 'Premier Clic',
      description: 'Effectuez votre premier clic !',
      condition: () => gameStore.beerScore > 0,
    },
    {
      id: 'hundredBeers',
      name: '100 Bières',
      description: 'Atteignez un score de 100 bières.',
      condition: () => gameStore.beerScore >= 100,
    },
    {
      id: 'fiftyUpgrades',
      name: '50 Améliorations',
      description: 'Achetez 50 améliorations dans le shop.',
      condition: () => {
        const total = gameStore.upgrades.reduce((acc, u) => acc + u.quantity, 0)
        return total >= 50
      },
    },
    // TODO ajouter tous les succès
  ]

  // État : on stocke l'ID des succès débloqués et ceux dont l'indice est révélé
  const unlockedIds = ref([])
  const revealedIds = ref([])

  // Action pour vérifier les succès
  function checkAchievements() {
    definitions.forEach((ach) => {
      if (!unlockedIds.value.includes(ach.id)) {
        if (ach.condition && ach.condition()) {
          unlock(ach.id)
        }
      }
    })
  }

  function unlock(id) {
    unlockedIds.value.push(id)
  }

  function revealClue(id) {
    if (!revealedIds.value.includes(id)) {
      revealedIds.value.push(id)
    }
  }

  // Persistance
  const saved = localStorage.getItem('achievements_v2')
  if (saved) {
    const parsed = JSON.parse(saved)
    unlockedIds.value = parsed.unlockedIds || []
    revealedIds.value = parsed.revealedIds || []
  }

  watch(
    [unlockedIds, revealedIds],
    () => {
      localStorage.setItem(
        'achievements_v2',
        JSON.stringify({
          unlockedIds: unlockedIds.value,
          revealedIds: revealedIds.value,
        }),
      )
    },
    { deep: true },
  )

  // Surveiller le score du gameStore pour vérifier automatiquement
  watch(() => gameStore.beerScore, checkAchievements)

  return {
    definitions,
    unlockedIds,
    revealedIds,
    checkAchievements,
    revealClue,
  }
})
