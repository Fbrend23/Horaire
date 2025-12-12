<script setup>
import { computed, ref } from 'vue' // Added ref
import { useGameStore } from '../../stores/gameStore'
import { getShopUpgrades } from '../../logic/gameData'

defineProps(['isOpen'])
const emit = defineEmits(['close'])
const gameStore = useGameStore()

const upgradesList = computed(() => getShopUpgrades(gameStore))

const revealedClue = ref(null) // State for the popup

function getCost(upgrade) {
    return gameStore.getUpgradeCost(upgrade.id)
}

// ... script ...
function buy(upgrade) {
    console.log('Buying upgrade:', upgrade.id)
    const result = gameStore.buyUpgrade(upgrade.id)

    // result is either boolean or the achievement object (if clue bought)
    // Simplify check: if it has a name, it's an achievement
    if (upgrade.id === 'achievementsClue') {
        if (result && result.name) {
            console.log('Clue revealed to UI:', result.name)
            revealedClue.value = result
        } else if (result) {
            // Purchase successful but no clue returned (weird state, or empty list?)
            // Check if money was deducted? gameStore.buyUpgrade returns result.
            // If return was just 'true', it means no clue was returned by effect.
            alert("Aucun indice disponible (tous les succès sont peut-être déjà révélés ou débloqués) !")
        } else {
            // Failed to buy (not enough money?) handled by button disabled state usually, but safe to log
            console.log('Purchase failed')
        }
    }
}
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 w-full h-full bg-black/70 flex justify-center items-center z-[1000]"
        @click.self="emit('close')">
        <div
            class="relative bg-surface overflow-y-auto p-8 rounded-xl w-[95%] max-w-6xl max-h-[90vh] text-white shadow-2xl border border-border">
            <span
                class="absolute top-4 right-6 text-4xl cursor-pointer text-gray-400 hover:text-white transition-colors leading-none"
                @click="emit('close')">&times;</span>
            <div class="text-center my-4">
                <h2 class="text-4xl font-extrabold m-0 uppercase tracking-widest text-primary drop-shadow-md">Shop
                </h2>
            </div>
            <p class="text-2xl text-primary mb-8 text-center font-bold">{{ Math.floor(gameStore.beerScore) }} 🍺</p>

            <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
                <div v-for="upgrade in upgradesList" :key="upgrade.id"
                    class="bg-slate-800/50 p-4 rounded-lg flex flex-col justify-between gap-2 text-center border border-slate-700 shadow-md">
                    <h3 class="m-0 text-lg font-bold text-gray-100">{{ upgrade.name }}</h3>
                    <p class="text-sm m-0 text-gray-300">{{ upgrade.description }}</p>
                    <p
                        :class="gameStore.beerScore >= getCost(upgrade) ? 'text-green-400 font-bold' : 'text-red-500 font-bold'">
                        Coût : {{ getCost(upgrade) }} 🍺
                    </p>
                    <p class="text-xs text-gray-400">Quantité : {{ gameStore.upgrades[upgrade.id] || 0 }}</p>
                    <button @click="buy(upgrade)" :disabled="gameStore.beerScore < getCost(upgrade)"
                        class="w-3/5 mx-auto mt-2 px-2 py-2 bg-secondary border-none rounded-md text-white cursor-pointer text-sm font-semibold transition-colors hover:bg-secondary-hover disabled:bg-gray-600 disabled:cursor-not-allowed">
                        Acheter
                    </button>
                </div>
            </div>
        </div>

        <!-- Clue Notification Modal - Teleported to Body to ensure it's on top -->
        <Teleport to="body">
            <div v-if="revealedClue"
                class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity"
                @click.self="revealedClue = null">
                <div
                    class="bg-surface p-8 rounded-xl border border-primary shadow-[0_0_20px_rgba(251,146,60,0.5)] max-w-lg w-[90%] text-center scale-100 transform transition-transform duration-300">
                    <h3 class="text-3xl font-bold text-primary mb-2">Indice Débloqué ! 🔍</h3>
                    <div class="my-6 p-4 bg-slate-800/50 rounded-lg border border-white/5">
                        <h4 class="text-xl font-bold text-gray-100 mb-2">{{ revealedClue.name }}</h4>
                        <p class="text-gray-300 italic">"{{ revealedClue.description }}"</p>
                    </div>
                    <button @click="revealedClue = null"
                        class="px-8 py-3 bg-secondary hover:bg-secondary-hover text-white font-bold rounded-full shadow-lg transition-all transform hover:scale-105 cursor-pointer">
                        Compris !
                    </button>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
/* No more custom CSS */
</style>
