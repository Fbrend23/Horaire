<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getUpcomingVacations, getVacationByName } from '../logic/vacances'
import { getLastModuleOfDay } from '../logic/agenda' // Import added
import { getNow } from '../logic/time'
import { useSettingsStore } from '../stores/settingsStore'

const settingsStore = useSettingsStore()

const nextVacName = ref('')
const nextVacTime = ref('')
const summerVacTime = ref('')
const weekendTime = ref('')

// Clocks
const newYorkTime = ref('')
const lausanneTime = ref('')
const tokyoTime = ref('')

let intervalId = null

function update() {
    const now = getNow()

    // Weekend
    const day = now.getDay()

    // If it's Saturday (6) or Sunday (0), show '-'
    if (day === 6 || day === 0) {
        weekendTime.value = '-'
    } else {
        // Monday (1) to Friday (5)
        let target = new Date(now)

        // Calculate days until confirmed Friday
        const daysUntilFriday = 5 - day
        target.setDate(now.getDate() + daysUntilFriday)

        // Determine end time of that Friday
        const lastModFriday = getLastModuleOfDay(target)
        if (lastModFriday) {
            target.setHours(lastModFriday.endHour, lastModFriday.endMinute, 0, 0)
        } else {
            target.setHours(17, 0, 0, 0)
        }

        const diffSec = Math.floor((target - now) / 1000)

        if (diffSec < 0) {
            // It's Friday and passed the time -> It's the weekend
            weekendTime.value = '-'
        } else {
            const h = Math.floor(diffSec / 3600)
            const m = Math.floor((diffSec % 3600) / 60)
            const s = diffSec % 60
            weekendTime.value = `${h} h ${m} min ${s} sec`
        }
    }

    // Vacations
    const upcoming = getUpcomingVacations()
    if (upcoming.length > 0) {
        const next = upcoming[0]
        const diffDays = Math.ceil((next.startDate - now) / (1000 * 60 * 60 * 24))
        nextVacName.value = next.name
        nextVacTime.value = `${next.startDate.toLocaleDateString('fr-FR')} (${diffDays} jours)`
    } else {
        nextVacName.value = 'Aucune'
        nextVacTime.value = ''
    }

    const summer = getVacationByName('Été') || getVacationByName('Été 2026')
    if (summer) {
        const diffDays = Math.ceil((summer.startDate - now) / (1000 * 60 * 60 * 24))
        summerVacTime.value = `${summer.startDate.toLocaleDateString('fr-FR')} (${diffDays} jours)`
    }

    // Clocks
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' }
    newYorkTime.value = new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'America/New_York' }).format(now)
    lausanneTime.value = new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'Europe/Zurich' }).format(now)
    tokyoTime.value = new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'Asia/Tokyo' }).format(now)
}

onMounted(() => {
    update()
    intervalId = setInterval(update, 1000)
})

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
})
</script>

<template>
    <div class="flex flex-col gap-6 h-full justify-start">
        <div v-if="settingsStore.displaySettings.clocks"
            class="flex justify-around items-center bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl text-center shadow-lg border border-white/10">
            <div class="flex flex-col items-center">
                <h3 class="text-sm text-gray-400 mb-1">New York</h3>
                <span class="font-bold text-gray-100 text-lg">{{ newYorkTime }}</span>
            </div>
            <div class="flex flex-col items-center">
                <h3 class="text-sm text-gray-400 mb-1">Lausanne</h3>
                <span class="font-bold text-gray-100 text-lg">{{ lausanneTime }}</span>
            </div>
            <div class="flex flex-col items-center">
                <h3 class="text-sm text-gray-400 mb-1">Tokyo</h3>
                <span class="font-bold text-gray-100 text-lg">{{ tokyoTime }}</span>
            </div>
        </div>

        <div v-if="settingsStore.displaySettings.vacances" class="flex flex-col gap-4 flex-grow justify-between">
            <section
                class="bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg text-center shadow-md border border-white/10 transition-transform hover:-translate-y-0.5">
                <h2 class="text-blue-400 text-lg font-semibold mb-2">Week-end</h2>
                <p class="text-xl font-bold text-gray-100">{{ weekendTime }}</p>
            </section>

            <section
                class="bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg text-center shadow-md border border-white/10 transition-transform hover:-translate-y-0.5">
                <h2 class="text-blue-400 text-lg font-semibold mb-2">Prochaines vacances</h2>
                <h3 class="text-xl font-bold text-white my-1">{{ nextVacName }}</h3>
                <p class="text-gray-300">{{ nextVacTime }}</p>
            </section>

            <section
                class="bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg text-center shadow-md border border-white/10 transition-transform hover:-translate-y-0.5 bg-gradient-to-br from-slate-800/90 to-blue-500/20">
                <h2 class="text-blue-400 text-lg font-semibold mb-2">Fin de l'année</h2>
                <p class="text-xl font-bold text-gray-100">{{ summerVacTime }}</p>
            </section>
        </div>
    </div>
</template>

<style scoped>
/* No more custom CSS needed */
</style>
