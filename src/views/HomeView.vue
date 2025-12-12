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
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import M2Widget from '../components/M2Widget.vue'

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

        <!-- Draggable Dashboard -->
        <draggable v-model="settingsStore.dashboardOrder"
            class="flex flex-wrap justify-center items-stretch gap-8 px-8 py-4" :animation="200" handle=".drag-handle">

            <div v-for="element in settingsStore.dashboardOrder" :key="element"
                class="flex-1 min-w-[300px] max-w-[500px] flex flex-col relative group"
                :class="{ 'order-last lg:order-0': element === 'beerClicker' }">

                <!-- Drag Handle (visible on hover) -->
                <div
                    class="drag-handle absolute -top-3 left-1/2 -translate-x-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded px-2 text-xs z-50">
                    ⋮⋮ Drag
                </div>

                <div v-if="element === 'beerClicker' && settingsStore.displaySettings.beerClicker" class="h-full">
                    <BeerClicker @openShop="showShop = true" @openSkins="showSkins = true"
                        @openAchievements="showAchievements = true" />
                </div>

                <div v-else-if="element === 'agenda' && settingsStore.displaySettings.agenda" class="h-full">
                    <InfoColumn class="h-full" />
                </div>

                <div v-else-if="element === 'vacations' && (settingsStore.displaySettings.vacances || settingsStore.displaySettings.clocks)"
                    class="h-full">
                    <VacationColumn class="h-full" />
                </div>
            </div>

        </draggable>

        <!-- Transport Widget (Full Width Container) -->
        <div class="px-8 pb-8 max-w-[1000px] mx-auto">
            <M2Widget />
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
