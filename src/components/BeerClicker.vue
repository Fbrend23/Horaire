<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { skins } from '../logic/gameData'
import NotificationToast from './NotificationToast.vue'

const gameStore = useGameStore()
const emit = defineEmits(['openShop', 'openSkins', 'openAchievements', 'openSettings'])

const beerImgRef = ref(null)

const currentSkinImage = computed(() => {
    const skin = skins.find((s) => s.id === gameStore.selectedSkin)
    return skin ? skin.image : skins[0].image
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

// ... inside <script setup>
const isResetModalOpen = ref(false)

function handleReset() {
    isResetModalOpen.value = true
}

function confirmReset() {
    gameStore.resetGame()
}
</script>

<template>
    <div
        class="relative h-full bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/10 p-4 box-border overflow-hidden">
        <div class="flex justify-between text-center gap-4 h-full">
            <!-- existing content -->
            <div class="flex-1 flex flex-col items-center">
                <h4 class="text-lg font-semibold mb-2 text-gray-300">Bonus</h4>
                <div id="bonusDisplay" class="flex flex-col items-center">
                    <div v-if="gameStore.upgrades['beerFactoryUpgrade'] > 0"
                        class="flex items-center gap-2 mb-2 text-sm">
                        <img src="@/assets/BeerClicker/brasserie.png" alt="brasserie" class="w-8" />
                        <span>x {{ gameStore.upgrades['beerFactoryUpgrade'] }}</span>
                    </div>
                    <div v-if="gameStore.upgrades['beerDrinkerUpgrade'] > 0"
                        class="flex items-center gap-2 mb-2 text-sm">
                        <img src="@/assets/BeerClicker/beerDrinker.png" alt="theo" class="w-8" />
                        <span>x {{ gameStore.upgrades['beerDrinkerUpgrade'] }}</span>
                    </div>
                    <p v-if="gameStore.clickStormActive">Click Storm: {{ Math.ceil((gameStore.clickStormActive.endTime -
                        Date.now()) / 1000) }}s</p>
                    <p v-if="gameStore.superAutoActive">Super Auto: {{ Math.ceil((gameStore.superAutoActive.endTime -
                        Date.now()) / 1000) }}s</p>
                </div>
            </div>

            <div class="flex-[2] flex flex-col items-center">
                <h2 class="text-xl font-bold mb-2 text-blue-400">Beer Clicker</h2>
                <p>Score : <span class="font-bold text-xl text-amber-400">{{ Math.floor(gameStore.beerScore) }}</span>
                </p>
                <p>Multiplicateur : {{ gameStore.beerMultiplier }}</p>
                <p>Auto-Clicker: {{ (gameStore.autoClickerIntervalTime / 1000).toFixed(2) }} sec</p>

                <img :src="currentSkinImage" alt="beer" ref="beerImgRef"
                    class="w-[200px] cursor-pointer transition-transform duration-100 select-none my-4 ml-8"
                    @click="handleClick" />

                <div class="mt-4 flex flex-col gap-2 w-full max-w-xs">
                    <button @click="gameStore.toggleAutoClicker"
                        class="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
                        :class="{ 'bg-red-500 hover:bg-red-600': gameStore.autoClickerActive }">
                        {{ gameStore.autoClickerActive ? 'Arrêter Auto-Clicker' : 'Démarrer Auto-Clicker' }}
                    </button>
                    <button @click="handleReset"
                        class="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors cursor-pointer">
                        Reset le jeu
                    </button>
                </div>
            </div>

            <div class="flex-1 flex flex-col items-center">
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

        <!-- Notification scoped to this card -->
        <NotificationToast />

        <!-- Reset Confirmation Modal -->
        <div v-if="isResetModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            @click.self="isResetModalOpen = false">
            <div class="bg-slate-800 p-8 rounded-xl border border-white/10 shadow-2xl max-w-md w-full text-center">
                <h3 class="text-2xl font-bold text-red-500 mb-4">Attention !</h3>
                <p class="text-gray-200 mb-8 text-lg">Voulez-vous vraiment réinitialiser toutes vos données de jeu ?
                    Cette action est irréversible.</p>
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
