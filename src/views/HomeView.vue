<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TheHeader from '../components/TheHeader.vue'
import BeerClicker from '../components/BeerClicker.vue'
import InfoColumn from '../components/InfoColumn.vue'
import VacationColumn from '../components/VacationColumn.vue'
import ShopModal from '../components/modals/ShopModal.vue'
import SkinsModal from '../components/modals/SkinsModal.vue'
import LoginModal from '../components/modals/LoginModal.vue'

import SettingsModal from '../components/modals/SettingsModal.vue'
import UpcomingTests from '../components/UpcomingTests.vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import M2Widget from '../components/M2Widget.vue'

import { useSettingsStore } from '../stores/settingsStore'


const settingsStore = useSettingsStore()

const currentDate = computed(() => {
    return new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }).format(new Date())
})


const showShop = ref(false)
const showSkins = ref(false)
const showLogin = ref(false)

const showSettings = ref(false)

import { getNow } from '../logic/time'
import { getLastModuleOfDay, getFirstModuleOfDay, isDuringVacation } from '../logic/agenda'

const dayProgress = ref(0)
let intervalId = null

function updateProgress() {
    const now = getNow()
    const lastMod = getLastModuleOfDay(now)
    const firstMod = getFirstModuleOfDay(now)

    // If no modules today (weekend/holiday), progress is 100%
    if (!lastMod || !firstMod || isDuringVacation(now)) {
        dayProgress.value = 100
        return
    }

    const dayStart = firstMod.getStartDate(now)
    const dayEnd = lastMod.getEndDate(now)

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

// Filter out Transport and Tests from draggable list
const draggableItems = computed({
    get() {
        return settingsStore.dashboardOrder.filter(item => item !== 'transport' && item !== 'tests')
    },
    set(value) {
        updateOrder(value)
    }
})

function updateOrder(newOrder) {
    if (!newOrder || !Array.isArray(newOrder)) return
    const fullOrder = [...newOrder, 'transport', 'tests']
    settingsStore.dashboardOrder = fullOrder
}
</script>

<template>
    <div class="min-h-screen text-white">
        <TheHeader @openSettings="showSettings = true" />

        <h2
            class="text-center mt-4 mb-2 text-xl md:text-3xl font-bold text-primary drop-shadow-md whitespace-nowrap pointer-events-none capitalize">
            {{ currentDate }}
        </h2>

        <h2 class="text-sm font-semibold m-2 text-center text-gray-300 w-3/5 max-w-2xl mx-auto">Progression de ta
            journée</h2>
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

        <!-- Draggable Dashboard (Top Modules Only) -->
        <draggable v-model="draggableItems"
            class="flex flex-wrap justify-center items-stretch gap-x-8 gap-y-2 px-8 max-w-[1600px] mx-auto mb-2"
            :animation="200" handle=".drag-handle">

            <div v-for="(element, index) in draggableItems" :key="element"
                class="flex flex-col relative group transition-all duration-300"
                v-show="settingsStore.displaySettings[element === 'vacations' ? 'vacances' : element]" :class="{
                    'flex-1 lg:flex-[3_1_0%] min-w-[300px]': index !== 1,
                    'flex-1 lg:flex-[4_1_0%] min-w-[350px]': index === 1,
                    'order-last lg:order-0': element === 'beerClicker',
                    'order-1 lg:order-0': element === 'agenda',
                    'order-3 lg:order-0': element === 'vacations'
                }">

                <!-- Drag Handle (visible on hover) -->
                <div v-if="element !== 'transport' && element !== 'tests'"
                    class="drag-handle absolute -top-3 left-1/2 -translate-x-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded px-2 text-xs z-50">
                    ⋮⋮ Drag
                </div>

                <div v-if="element === 'beerClicker' && settingsStore.displaySettings.beerClicker" class="h-full">
                    <BeerClicker @openShop="showShop = true" @openSkins="showSkins = true" />
                </div>

                <div v-else-if="element === 'agenda' && settingsStore.displaySettings.agenda" class="h-full flex flex-col gap-4">
                    <InfoColumn class="h-full" />
                    <UpcomingTests v-if="settingsStore.displaySettings.tests" class="md:hidden shrink-0" />
                </div>

                <div v-else-if="element === 'vacations' && (settingsStore.displaySettings.vacances || settingsStore.displaySettings.clocks)"
                    class="h-full">
                    <VacationColumn class="h-full" />
                </div>
            </div>

        </draggable>

        <!-- Static Bottom Modules (Transport & Tests) -->
        <div class="flex flex-wrap justify-center items-stretch gap-x-8 gap-y-2 px-8 max-w-[1600px] mx-auto mt-2 pb-8">
            <!-- Transport (M2) -> Always Left/First on Desktop -->
            <div class="flex flex-col flex-[2_1_0%] min-w-full md:min-w-[500px]">
                <M2Widget />
            </div>

            <!-- Tests (Examens) -> Always Right/Second on Desktop -->
            <div class="hidden md:flex flex-col flex-[1_1_0%] min-w-[300px]" v-if="settingsStore.displaySettings.tests">
                <UpcomingTests />
            </div>
        </div>

        <!-- Modals -->
        <ShopModal :isOpen="showShop" @close="showShop = false" />
        <SkinsModal :isOpen="showSkins" @close="showSkins = false" />
        <LoginModal :isOpen="showLogin" @close="showLogin = false" />

        <SettingsModal :isOpen="showSettings" @close="showSettings = false" @openLogin="showLogin = true" />

    </div>
</template>

<style scoped>
/* No more custom CSS needed here */
</style>
