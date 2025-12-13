<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { skins, getShopUpgrades } from '../logic/gameData'
import NotificationToast from './NotificationToast.vue'
import { formatNumber } from '@/utils/format'

const gameStore = useGameStore()
const emit = defineEmits(['openShop', 'openSkins', 'openAchievements', 'openSettings'])

const beerImgRef = ref(null)

const currentSkinImage = computed(() => {
    const skin = skins.find((s) => s.id === gameStore.selectedSkin)
    return skin ? skin.image : skins[0].image
})

const bonusIds = [
    'startupUpgrade',
    'beerFactoryUpgrade',
    'pipelineUpgrade',
    'aiBrewerUpgrade',
    'quantumBreweryUpgrade',
    'mouseBotUpgrade',
    'clickSynergyUpgrade',
    'beerDrinkerUpgrade'
]

const activeBonuses = computed(() => {
    const allUpgrades = getShopUpgrades(gameStore)
    return bonusIds
        .map(id => {
            const upgrade = allUpgrades.find(u => u.id === id)
            return {
                ...upgrade,
                count: gameStore.upgrades[id] || 0
            }
        })
        .filter(item => item.count > 0)
})

// Watch for score changes to animate the beer (covers both manual clicks and auto-clickers)
watch(() => gameStore.beerScore, (newVal, oldVal) => {
    if (newVal > oldVal) {
        triggerAnimation()
    }
})

async function triggerAnimation() {
    if (!beerImgRef.value) return

    // Reset animation
    beerImgRef.value.classList.remove('clicked')
    await nextTick()

    // Force reflow to allow restarting CSS transition
    void beerImgRef.value.offsetWidth

    beerImgRef.value.classList.add('clicked')

    // Remove class after animation duration
    setTimeout(() => {
        if (beerImgRef.value) beerImgRef.value.classList.remove('clicked')
    }, 150)
}

function handleClick() {
    gameStore.incrementBeerScore()
    // Animation is now handled by the watcher
}

const isResetModalOpen = ref(false)
const keepSkins = ref(true)
const keepAchievements = ref(true)

function handleReset() {
    isResetModalOpen.value = true
}

function confirmReset() {
    gameStore.resetGame({
        keepSkins: keepSkins.value,
        keepAchievements: keepAchievements.value
    })
}

</script>

<template>
    <div
        class="relative h-full bg-surface backdrop-blur-sm rounded-xl shadow-lg border border-border p-4 box-border overflow-hidden tilt-card alive-breath">
        <div class="flex justify-between text-center gap-4 h-full">
            <!-- existing content -->
            <div class="w-32 flex-none flex flex-col items-center">
                <h4 class="text-lg font-semibold mb-2 text-gray-300">Bonus</h4>
                <div id="bonusDisplay" class="flex flex-col w-32 gap-1">
                    <div v-for="bonus in activeBonuses" :key="bonus.id"
                        class="flex items-center justify-between w-full bg-black/20 p-1 rounded px-2">
                        <img :src="bonus.image" :alt="bonus.name" class="w-6 h-6 object-contain" />
                        <span class="font-bold text-right ml-auto text-xs">x {{ bonus.count }}</span>
                    </div>
                    <p v-if="gameStore.clickStormActive">Click Storm: {{ Math.ceil((gameStore.clickStormActive.endTime -
                        Date.now()) / 1000) }}s</p>
                    <p v-if="gameStore.superAutoActive">Super Auto: {{ Math.ceil((gameStore.superAutoActive.endTime -
                        Date.now()) / 1000) }}s</p>
                </div>
            </div>

            <div class="flex-1 min-w-0 flex flex-col items-center justify-center text-center px-2">
                <h2 class="text-xl font-bold mb-2 text-primary">Beer Clicker</h2>
                <p>Score : <span class="font-bold text-xl text-primary">{{ formatNumber(gameStore.beerScore) }}</span>
                </p>
                <p class="text-green-400 font-semibold">{{ formatNumber(gameStore.beersPerSecond) }} bières / sec</p>
                <p>Multiplicateur : {{ formatNumber(gameStore.beerMultiplier) }}</p>
                <p>Auto-Clicker: {{ (gameStore.currentAutoClickerDelay / 1000).toFixed(2) }} sec</p>

                <img :src="currentSkinImage" alt="beer" ref="beerImgRef"
                    class="w-full max-w-[450px] h-auto object-contain cursor-pointer transition-transform duration-100 select-none ml-6"
                    @click="handleClick" />

                <div class="mt-4 flex flex-col gap-2 w-full max-w-[450px]">
                    <button @click="gameStore.toggleAutoClicker"
                        class="px-3 py-1 rounded bg-secondary text-white text-sm font-semibold hover:bg-secondary-hover transition-colors cursor-pointer"
                        :class="{ '!bg-red-500 hover:!bg-red-600': gameStore.autoClickerActive }">
                        {{ gameStore.autoClickerActive ? 'Arrêter Auto-Clicker' : 'Démarrer Auto-Clicker' }}
                    </button>
                    <button @click="handleReset"
                        class="px-3 py-1 rounded bg-secondary text-white text-sm font-semibold hover:bg-secondary-hover transition-colors cursor-pointer">
                        Reset le jeu
                    </button>
                </div>
            </div>

            <div class="w-32 flex-none flex flex-col items-center">
                <h4 class="text-lg font-semibold mb-2 text-gray-300">Shop</h4>
                <div class="flex flex-col items-center">
                    <img src="@/assets/BeerClicker/shop.png" alt="Ouvrir le Shop" @click="emit('openShop')"
                        class="w-[50px] cursor-pointer m-2 transition-transform duration-200 hover:scale-110" />
                    <img src="@/assets/BeerClicker/skin.png" alt="Boutique de Skins" @click="emit('openSkins')"
                        class="w-[50px] cursor-pointer m-2 transition-transform duration-200 hover:scale-110" />
                </div>
                <img src="@/assets/BeerClicker/achievements.png" alt="Succès" @click="emit('openAchievements')"
                    class="w-[50px] cursor-pointer m-2 transition-transform duration-200 hover:scale-110" />
            </div>
        </div>

        <!--Notification scoped to this card-->
        <NotificationToast />

        <!--Reset Confirmation Modal-->
        <div v-if="isResetModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            @click.self="isResetModalOpen = false">
            <div class="bg-gray-800 p-8 rounded-xl border border-border shadow-2xl max-w-md w-full text-center">
                <h3 class="text-2xl font-bold text-red-500 mb-4">Attention !</h3>
                <p class="text-gray-200 mb-6 text-lg">Voulez-vous vraiment réinitialiser toutes vos données de jeu ?
                    Cette action est irréversible.</p>

                <div class="flex flex-col gap-3 mb-8 text-left max-w-xs mx-auto bg-gray-700/50 p-4 rounded-lg">
                    <label
                        class="flex items-center gap-3 text-gray-200 cursor-pointer hover:text-white transition-colors">
                        <input type="checkbox" v-model="keepSkins"
                            class="w-5 h-5 text-primary rounded focus:ring-primary bg-gray-700 border-gray-500" />
                        <span>Garder mes Skins</span>
                    </label>
                    <label
                        class="flex items-center gap-3 text-gray-200 cursor-pointer hover:text-white transition-colors">
                        <input type="checkbox" v-model="keepAchievements"
                            class="w-5 h-5 text-primary rounded focus:ring-primary bg-gray-700 border-gray-500" />
                        <span>Garder mes Succès</span>
                    </label>
                </div>
                <div class="flex justify-center gap-4">
                    <button @click="isResetModalOpen = false"
                        class="px-6 py-2 rounded bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors cursor-pointer">
                        Annuler
                    </button>
                    <button @click="confirmReset"
                        class="px-6 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors cursor-pointer">
                        Oui, tout effacer
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Target the image when it has the clicked class added by JS */
img.clicked {
    transform: scale(0.9);
}
</style>
