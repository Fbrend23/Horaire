<script setup>
import { ref } from 'vue'
import TheHeader from '../components/TheHeader.vue'
import BeerClicker from '../components/BeerClicker.vue'
import InfoColumn from '../components/InfoColumn.vue'
import VacationColumn from '../components/VacationColumn.vue'
import ShopModal from '../components/modals/ShopModal.vue'
import SkinsModal from '../components/modals/SkinsModal.vue'
import AchievementsModal from '../components/modals/AchievementsModal.vue'
import SettingsModal from '../components/modals/SettingsModal.vue'

import { useSettingsStore } from '../stores/settingsStore'


const settingsStore = useSettingsStore()


const showShop = ref(false)
const showSkins = ref(false)
const showAchievements = ref(false)
const showSettings = ref(false)

import { getNow } from '../logic/time'
import { getLastModuleOfDay } from '../logic/agenda'
import { onMounted, onUnmounted } from 'vue'

const dayProgress = ref(0)
let intervalId = null

function updateProgress() {
    const now = getNow()

    // Default: 07:45 to 17:00 if no classes
    const dayStart = new Date(now)
    dayStart.setHours(7, 45, 0, 0)

    let dayEnd = new Date(now)

    const lastMod = getLastModuleOfDay(now)
    if (lastMod) {
        dayEnd = lastMod.getEndDate(now)
    } else {
        dayEnd.setHours(17, 0, 0, 0)
    }

    const totalDay = dayEnd - dayStart
    const elapsed = now - dayStart

    if (totalDay <= 0) {
        dayProgress.value = 100
        return
    }

    let pct = (elapsed / totalDay) * 100
    if (pct < 0) pct = 0
    if (pct > 100) pct = 100
    dayProgress.value = pct
}

onMounted(() => {
    updateProgress()
    intervalId = setInterval(updateProgress, 1000)
})

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
})
</script>

<template>
    <div class="home-container">
        <TheHeader @openSettings="showSettings = true" />

        <h1 class="main-title">Bienvenue jeune impatient</h1>

        <div class="main-progress-container">
            <div class="main-progress-bar" :style="{ width: dayProgress + '%' }"></div>
            <span class="progress-text">{{ Math.floor(dayProgress) }}%</span>
        </div>

        <div class="content-grid">
            <!-- Left Column: Beer Clicker -->
            <div v-if="settingsStore.displaySettings.beerClicker" class="column clicker-col">
                <BeerClicker @openShop="showShop = true" @openSkins="showSkins = true"
                    @openAchievements="showAchievements = true" />
            </div>

            <!-- Middle Column: Info -->
            <div v-if="settingsStore.displaySettings.agenda" class="column info-col">
                <InfoColumn />
            </div>

            <!-- Right Column: Vacations/Clocks -->
            <div v-if="settingsStore.displaySettings.vacances || settingsStore.displaySettings.clocks"
                class="column vac-col">
                <VacationColumn />
            </div>
        </div>

        <!-- Modals -->
        <ShopModal :isOpen="showShop" @close="showShop = false" />
        <SkinsModal :isOpen="showSkins" @close="showSkins = false" />
        <AchievementsModal :isOpen="showAchievements" @close="showAchievements = false" />
        <SettingsModal :isOpen="showSettings" @close="showSettings = false" />

    </div>
</template>

<style scoped>
.home-container {
    min-height: 100vh;
    /* Background logic handled by body class in settingsStore, 
     but we can add container styling here */
    color: white;
    /* default text color */
}

.content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    /* Default 3 columns */
    gap: 2rem;
    padding: 1rem 2rem;
    align-items: start;
}

/* Adjust grid based on visible columns is tricky in CSS Grid with v-if.
   Ideally we should let the grid auto-flow or bind style.
   But pure CSS Grid with 1fr will stretch if elements are missing? 
   Yes, if we use repeat(auto-fit, minmax(...)) or just let Vue remove the DOM node.
   However, if we hardcode 3 columns, and one is missing, it might leave a gap.
   Let's use a computed style or flexbox for simpler responsiveness.
*/

.content-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
    /* Stretch columns to same height */
}

.column {
    flex: 1;
    min-width: 300px;
    max-width: 500px;
    display: flex;
    flex-direction: column;
}

.info-col {
    flex: 1.2;
    /* Make center column slightly wider preference */
}

.main-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 800;
    margin: 1rem 0;
    color: #60a5fa;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Override for specific legacy layouts logic if needed: 
   Legacy used JS to change grid-template-columns. 
   Here flexbox handles it gracefully.
*/

.main-progress-container {
    width: 60%;
    max-width: 600px;
    height: 20px;
    background-color: #374151;
    border-radius: 10px;
    margin: 0 auto 1.5rem auto;
    /* Center and add gap below */
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.main-progress-bar {
    height: 100%;
    background-color: #10b981;
    transition: width 0.5s linear;
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.85rem;
    font-weight: bold;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
</style>
