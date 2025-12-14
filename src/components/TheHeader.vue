<script setup>
import { useSettingsStore } from '../stores/settingsStore'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const settingsStore = useSettingsStore()
import { useWeather } from '../logic/weatherService'

const { weatherState, temperature, isNight } = useWeather()
const emit = defineEmits(['openSettings'])
const route = useRoute()

const isWeeklyView = computed(() => route.path === '/semaine')



function toggleRave() {
    settingsStore.toggleRaveMode()
}

const weatherIcon = computed(() => {
    if (weatherState.value === 'clear') return isNight.value ? '🌙' : '☀️'
    if (weatherState.value === 'cloudy') return '☁️'
    if (weatherState.value === 'rain') return '🌧️'
    if (weatherState.value === 'snow') return '❄️'
    if (weatherState.value === 'fog') return '🌫️'
    return '🌡️'
})
</script>

<template>
    <header
        class="flex relative justify-between items-center px-8 py-2 bg-black/5 backdrop-blur-md border-b border-amber-500/10 shadow-sm">
        <a href="https://brendanfleurdelys.ch">
            <img src="@/assets/logo/logo.png" alt="logo" id="logo"
                class="h-10 w-auto hover:brightness-110 transition-all drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
        </a>


        <!-- Centered Title -->
        <h1
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl md:text-4xl font-bold text-primary drop-shadow-md whitespace-nowrap pointer-events-none">
            Bienvenue jeune impatient
        </h1>

        <div class="flex gap-4 items-center">
            <!-- Weather Widget -->
            <div class="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs md:text-sm font-semibold text-gray-200 shadow-sm border border-white/10"
                v-if="temperature !== null">
                <span class="text-base">{{ weatherIcon }}</span>
                <span>{{ Math.round(temperature) }}°C</span>
            </div>

            <!-- If on Weekly View, show Home button only (plus theme) -->
            <template v-if="isWeeklyView">
                <router-link to="/"
                    class="text-2xl hover:scale-110 transition-transform p-2 cursor-pointer hover:text-amber-400">🏠</router-link>
            </template>

            <!-- Else (Home View), show full controls -->
            <template v-else>
                <router-link to="/semaine"
                    class="text-2xl hover:scale-110 transition-transform p-2 cursor-pointer hover:text-amber-400">🗓️</router-link>
                <button @click="toggleRave"
                    class="text-2xl hover:scale-110 transition-transform p-2 active:animate-ping cursor-pointer hover:text-amber-400">🕺</button>
            </template>



            <!-- Settings only on Home View -->
            <button v-if="!isWeeklyView" @click="emit('openSettings')"
                class="text-2xl hover:scale-110 transition-transform p-2 hover:rotate-90 duration-300 cursor-pointer hover:text-amber-400">⚙️</button>
        </div>
    </header>
</template>

<style scoped>
/* No more custom CSS */
</style>
