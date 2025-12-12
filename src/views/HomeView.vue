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
    <div class="min-h-screen text-white">
        <TheHeader @openSettings="showSettings = true" />

        <h1 class="text-center text-4xl font-extrabold my-4 text-primary drop-shadow-md">Bienvenue jeune impatient
        </h1>

        <div class="w-3/5 max-w-2xl h-5 bg-gray-700 rounded-full mx-auto mb-6 relative overflow-hidden shadow-sm">
            <div class="h-full bg-emerald-500 transition-all duration-1000 ease-linear relative overflow-hidden"
                :style="{ width: dayProgress + '%' }">
                <!-- Striped Animation Overlay -->
                <div
                    class="absolute inset-0 w-full h-full animate-progress-stripes bg-[length:40px_40px] 
                    bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)]">
                </div>
            </div>
            <span
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-white drop-shadow-sm">{{
                    Math.floor(dayProgress) }}%</span>
        </div>

        <div class="flex flex-wrap justify-center items-stretch gap-8 px-8 py-4">
            <!-- Left Column: Beer Clicker -->
            <div v-if="settingsStore.displaySettings.beerClicker"
                class="flex-1 min-w-[300px] max-w-[500px] flex flex-col">
                <BeerClicker @openShop="showShop = true" @openSkins="showSkins = true"
                    @openAchievements="showAchievements = true" />
            </div>

            <!-- Middle Column: Info -->
            <div v-if="settingsStore.displaySettings.agenda"
                class="flex-[1.2] min-w-[300px] max-w-[500px] flex flex-col">
                <InfoColumn />
            </div>

            <!-- Right Column: Vacations/Clocks -->
            <div v-if="settingsStore.displaySettings.vacances || settingsStore.displaySettings.clocks"
                class="flex-1 min-w-[300px] max-w-[500px] flex flex-col">
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
/* No more custom CSS needed here */
</style>
