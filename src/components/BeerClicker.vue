<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { skins } from '../logic/gameData'
import NotificationToast from './NotificationToast.vue'

const gameStore = useGameStore()
const emit = defineEmits(['openShop', 'openSkins', 'openAchievements', 'openSettings'])

const currentSkinImage = computed(() => {
    const skin = skins.find((s) => s.id === gameStore.selectedSkin)
    return skin ? skin.image : skins[0].image
})

function handleClick(event) {
    gameStore.incrementBeerScore()
    animateClick(event)
}

function animateClick(event) {
    const el = event.target
    el.classList.add('clicked')
    setTimeout(() => el.classList.remove('clicked'), 200)
}

function handleReset() {
    if (confirm('Voulez-vous vraiment réinitialiser toutes vos données de jeu ?')) {
        localStorage.clear()
        location.reload()
    }
}
</script>

<template>
    <div class="beer-clicker-card">
        <div class="beer-clicker-container">
            <div class="bonus-column">
                <h4>Bonus</h4>
                <div id="bonusDisplay">
                    <div v-if="gameStore.upgrades['beerFactoryUpgrade'] > 0" class="bonus-item">
                        <img src="@/assets/BeerClicker/brasserie.png" alt="brasserie" class="bonus-icon" />
                        <span>x {{ gameStore.upgrades['beerFactoryUpgrade'] }}</span>
                    </div>
                    <div v-if="gameStore.upgrades['beerDrinkerUpgrade'] > 0" class="bonus-item">
                        <img src="@/assets/BeerClicker/beerDrinker.png" alt="theo" class="bonus-icon" />
                        <span>x {{ gameStore.upgrades['beerDrinkerUpgrade'] }}</span>
                    </div>
                    <p v-if="gameStore.clickStormActive">Click Storm: {{ Math.ceil((gameStore.clickStormActive.endTime -
                        Date.now()) / 1000) }}s</p>
                    <p v-if="gameStore.superAutoActive">Super Auto: {{ Math.ceil((gameStore.superAutoActive.endTime -
                        Date.now()) / 1000) }}s</p>
                </div>
            </div>

            <div class="main-column">
                <h2>Beer Clicker</h2>
                <p>Score : <span class="score">{{ Math.floor(gameStore.beerScore) }}</span></p>
                <p>Multiplicateur : {{ gameStore.beerMultiplier }}</p>
                <p>Auto-Clicker: {{ (gameStore.autoClickerIntervalTime / 1000).toFixed(2) }} sec</p>

                <img :src="currentSkinImage" alt="beer" class="beer-image" @click="handleClick" />

                <div class="buttons">
                    <button @click="gameStore.toggleAutoClicker" :class="{ active: gameStore.autoClickerActive }">
                        {{ gameStore.autoClickerActive ? 'Arrêter Auto-Clicker' : 'Démarrer Auto-Clicker' }}
                    </button>
                    <button @click="handleReset">Reset le jeu</button>
                </div>
            </div>

            <div class="shop-column">
                <h4>Shop</h4>
                <div class="shop-buttons">
                    <img src="@/assets/BeerClicker/shop.png" alt="Ouvrir le Shop" @click="emit('openShop')"
                        class="nav-icon" />
                    <img src="@/assets/BeerClicker/skin.png" alt="Boutique de Skins" @click="emit('openSkins')"
                        class="nav-icon" />
                </div>
                <img src="@/assets/BeerClicker/achievements.png" alt="Succès" @click="emit('openAchievements')"
                    class="nav-icon achievements-icon" />
            </div>
        </div>

        <!-- Notification scoped to this card -->
        <NotificationToast />
    </div>
</template>

<style scoped>
.beer-clicker-card {
    position: relative;
    /* For absolute positioning of toast */
    background-color: rgba(30, 41, 59, 0.8);
    /* Slate-800 with opacity */
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem;
    overflow: hidden;
    height: 100%;
    /* Fill the column height */
    box-sizing: border-box;
    /* Ensure padding doesn't overflow */
}

.beer-clicker-container {
    display: flex;
    justify-content: space-between;
    text-align: center;
    gap: 1rem;
    height: 100%;
    /* Fill card height */
}

.bonus-column,
.shop-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.main-column {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.beer-image {
    width: 200px;
    cursor: pointer;
    transition: transform 0.1s;
    user-select: none;
    margin: 1rem 0 1rem 35px;
}

.beer-image.clicked {
    transform: scale(0.9);
}

.score {
    font-weight: bold;
    font-size: 1.2rem;
    color: #fbbf24;
    /* Amber-400 */
}

.buttons {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
}

button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    background-color: #3b82f6;
    color: white;
    cursor: pointer;
    font-weight: 600;
}

button:hover {
    background-color: #2563eb;
}

button.active {
    background-color: #ef4444;
}

button.active:hover {
    background-color: #dc2626;
}

.nav-icon {
    width: 50px;
    cursor: pointer;
    margin: 0.5rem;
    transition: transform 0.2s;
}

.nav-icon:hover {
    transform: scale(1.1);
}

.bonus-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.bonus-icon {
    width: 32px;
}
</style>
