<script setup>
import { useSettingsStore } from '../stores/settingsStore'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const settingsStore = useSettingsStore()
const emit = defineEmits(['openSettings'])
const route = useRoute()

const isWeeklyView = computed(() => route.path === '/semaine')



function toggleRave() {
    settingsStore.toggleRaveMode()
}
</script>

<template>
    <header
        class="flex justify-between items-center px-8 py-2 bg-transparent border-b border-amber-500/10 backdrop-blur-sm shadow-sm">
        <a href="https://brendanfleurdelys.ch">
            <img src="@/assets/logo/logo.png" alt="logo" id="logo"
                class="h-10 w-auto hover:brightness-110 transition-all drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
        </a>
        <div class="flex gap-4 items-center">
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
