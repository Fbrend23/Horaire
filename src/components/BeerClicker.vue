```
<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { skins, getShopUpgrades } from '../logic/gameData'
import NotificationToast from './NotificationToast.vue'
import { formatNumber } from '@/utils/format'
import clickStormImg from '@/assets/BeerClicker/click_storm.png'

const gameStore = useGameStore()
const emit = defineEmits(['openShop', 'openAchievements', 'openSkins'])

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
        .filter(item => item.count > 0)
})

watch(() => gameStore.beerScore, (newVal, oldVal) => {
    if (newVal > oldVal) {
        triggerAnimation()
    }
})



const isAnimating = ref(false)

async function triggerAnimation() {
    if (!beerImgRef.value || isAnimating.value) return

    isAnimating.value = true

    const animation = beerImgRef.value.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(0.95)' },
        { transform: 'scale(1)' }
    ], {
        duration: 80,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        iterations: 1
    })

    animation.onfinish = () => {
        setTimeout(() => {
            isAnimating.value = false
        }, 50)
    }
}

const floatingTexts = ref([])
const particles = ref([])
let textIdCounter = 0
let particleIdCounter = 0

function handleClick(event) {
    gameStore.incrementBeerScore()

    // Spawn floating text
    // Get click position relative to the image or container
    const rect = event.target.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Add a bit of randomness
    const randomX = (Math.random() - 0.5) * 20
    const randomY = (Math.random() - 0.5) * 20

    spawnFloatingText(x + randomX, y + randomY, `+${formatNumber(gameStore.beersPerClick)}`)
    spawnParticles(rect.width)
}

function spawnParticles(width) {
    // Hard limit to prevent DOM explosion
    if (particles.value.length > 50) {
        particles.value.splice(0, particles.value.length - 50)
    }

    // Spawn 5-8 particles
    const count = 5 + Math.floor(Math.random() * 4)
    for (let i = 0; i < count; i++) {
        const id = particleIdCounter++
        // Random X centered on foam (skip 20% on each side) + 10px offset
        const randomX = (width * 0.1) + Math.random() * (width * 0.6) + 10

        const size = 5 + Math.random() * 10
        const delay = Math.random() * 0.2

        // Spawn bubbles at the top (foam area), roughly 10-40px from top
        const foamY = 10 + Math.random() * 30

        particles.value.push({
            id,
            x: randomX,
            y: foamY,
            size,
            createdAt: Date.now(),
            style: {
                left: randomX + 'px',
                top: foamY + 'px',
                width: size + 'px',
                height: size + 'px',
                animationDelay: delay + 's'
            }
        })
    }
}

function spawnFloatingText(x, y, text) {
    // Hard limit
    if (floatingTexts.value.length > 20) {
        floatingTexts.value.shift()
    }

    const id = textIdCounter++
    floatingTexts.value.push({
        id,
        x,
        y,
        text,
        createdAt: Date.now()
    })
}

// Optimization: Single interval
const cleanupInterval = setInterval(() => {
    const now = Date.now()

    if (particles.value.length > 0) {
        particles.value = particles.value.filter(p => now - p.createdAt < 1000)
    }

    if (floatingTexts.value.length > 0) {
        floatingTexts.value = floatingTexts.value.filter(t => now - t.createdAt < 1500)
    }

    // Passive Particle Spawning (Auto-Brewing Effect)
    // Only spawn if BPS > 0 and not too many particles
    if (gameStore.beersPerSecond > 0 && particles.value.length < 10) {
        // approx 20% chance per 100ms tick = ~2 particles/sec
        if (Math.random() < 0.2) {
            const id = particleIdCounter++
            const randomX = (200 * 0.2) + Math.random() * (200 * 0.6) // Assuming roughly 200px width
            const size = 3 + Math.random() * 5 // Smaller bubbles for passive
            const foamY = 20 + Math.random() * 20

            particles.value.push({
                id,
                x: randomX,
                y: foamY,
                size,
                createdAt: Date.now(),
                style: {
                    left: randomX + 'px',
                    top: foamY + 'px',
                    width: size + 'px',
                    height: size + 'px',
                    animationDelay: '0s',
                    opacity: 0.6
                }
            })
        }
    }
}, 100)

onUnmounted(() => {
    clearInterval(cleanupInterval)
})

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
        class="relative h-full bg-surface backdrop-blur-sm rounded-xl shadow-lg border border-border p-4 box-border overflow-hidden tilt-card">
        <div class="flex justify-between text-center gap-4 h-full">
            <!-- existing content -->
            <div class="flex-1 min-w-0 flex flex-col items-center">
                <h4 class="text-lg font-semibold mb-2 text-gray-300">Bonus</h4>
                <div id="bonusDisplay" class="flex flex-col w-full gap-1 px-2">
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

            <div class="flex-[2_1_0%] min-w-0 flex flex-col items-center justify-start text-center px-2">
                <h2 class="text-xl font-bold mb-2 text-primary">Beer Clicker</h2>
                <div class="mt-auto flex flex-col items-center w-full">
                    <div class="relative inline-block">
                        <!-- Floating Texts Overlay -->
                        <div v-for="ft in floatingTexts" :key="ft.id"
                            class="absolute pointer-events-none text-amber-400 font-bold text-xl z-50 animate-float-up whitespace-nowrap"
                            :style="{ left: ft.x + 'px', top: ft.y + 'px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }">
                            {{ ft.text }}
                        </div>

                        <!-- Foam Particles -->
                        <div v-for="p in particles" :key="p.id"
                            class="absolute pointer-events-none rounded-full bg-white z-40 animate-bubble-pop"
                            :style="p.style">
                        </div>

                        <img :src="currentSkinImage" alt="beer" ref="beerImgRef"
                            class="h-[200px] w-auto max-w-full object-contain cursor-pointer transition-transform duration-100 select-none"
                            draggable="false" @click="handleClick" />
                    </div>
                    <p>Score : <span class="font-bold text-xl text-primary">{{ formatNumber(gameStore.beerScore)
                    }}</span>
                    </p>
                    <p class="text-green-400 font-semibold">{{ gameStore.beersPerSecond < 10 &&
                        gameStore.beersPerSecond > 0 ? gameStore.beersPerSecond.toFixed(1) :
                        formatNumber(gameStore.beersPerSecond) }} bières / sec
                    </p>
                    <p>Multiplicateur : <span class="font-bold text-primary">{{ formatNumber(gameStore.beerMultiplier)
                    }}</span></p>
                    <p>Auto-Clicker: <span class="font-bold text-primary">{{ (gameStore.currentAutoClickerDelay /
                        1000).toFixed(2) }} sec</span> </p>


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
            </div>

            <div class="flex-1 min-w-0 flex flex-col items-center">
                <h4 class="text-lg font-semibold mb-2 text-gray-300">Shop</h4>
                <div class="flex flex-col items-center">
                    <img src="@/assets/BeerClicker/shop.png" alt="Ouvrir le Shop" @click="emit('openShop')"
                        class="w-[50px] cursor-pointer m-2 transition-transform duration-200 hover:scale-110" />
                    <img src="@/assets/BeerClicker/skin.png" alt="Boutique de Skins" @click="emit('openSkins')"
                        class="w-[50px] cursor-pointer m-2 transition-transform duration-200 hover:scale-110" />
                </div>
                <img src="@/assets/BeerClicker/achievements.png" alt="Succès" @click="emit('openAchievements')"
                    class="w-[50px] cursor-pointer m-2 transition-transform duration-200 hover:scale-110" />

                <!-- Quick Buy Click Storm Square -->
                <div class="mt-auto flex flex-col items-center justify-center w-[60px]">
                    <span class="text-[10px] font-semibold text-center leading-tight mb-1">Click Storm</span>
                    <button @click="gameStore.buyUpgrade('clickStormUpgrade')"
                        :disabled="gameStore.beerScore < gameStore.getUpgradeCost('clickStormUpgrade')"
                        class="w-[60px] h-[60px] flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:grayscale relative bg-transparent border-none p-0"
                        title="Acheter Click Storm">
                        <img :src="clickStormImg" class="w-[60px] h-[60px] object-contain" />
                    </button>
                    <span class="text-[10px] font-bold text-amber-400 mt-1 text-center w-full block">{{
                        formatNumber(gameStore.getUpgradeCost('clickStormUpgrade')) }}</span>
                </div>
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
img.clicked {
    animation: pop 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(0.95);
    }

    100% {
        transform: scale(1);
    }
}

.animate-float-up {
    animation: floatUp 1s ease-out forwards;
}

@keyframes floatUp {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }

    100% {
        transform: translateY(-50px) scale(1.2);
        opacity: 0;
    }
}

.animate-bubble-pop {
    animation: bubblePop 0.6s ease-out forwards;
}

@keyframes bubblePop {
    0% {
        transform: scale(0.5);
        opacity: 0.8;
    }

    50% {
        transform: scale(1.1) translateY(-10px);
        opacity: 1;
    }

    100% {
        transform: scale(1.5) translateY(-30px);
        opacity: 0;
    }
}
</style>
