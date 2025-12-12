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
    <div class="vacation-column">
        <div v-if="settingsStore.displaySettings.clocks" class="clocks-container">
            <div class="clock">
                <h3>New York</h3>
                <span>{{ newYorkTime }}</span>
            </div>
            <div class="clock">
                <h3>Lausanne</h3>
                <span>{{ lausanneTime }}</span>
            </div>
            <div class="clock">
                <h3>Tokyo</h3>
                <span>{{ tokyoTime }}</span>
            </div>
        </div>

        <div v-if="settingsStore.displaySettings.vacances" class="vacations-list">
            <section class="small-card">
                <h2>Week-end</h2>
                <p>{{ weekendTime }}</p>
            </section>

            <section class="small-card">
                <h2>Prochaines vacances</h2>
                <h3>{{ nextVacName }}</h3>
                <p>{{ nextVacTime }}</p>
            </section>

            <section class="small-card summer">
                <h2>Fin de l'année</h2>
                <p>{{ summerVacTime }}</p>
            </section>
        </div>
    </div>
</template>

<style scoped>
.vacation-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
    /* Fill the column height */
    justify-content: flex-start;

}

.clocks-container {
    display: flex;
    justify-content: space-around;
    background-color: rgba(30, 41, 59, 0.8);
    padding: 1rem;
    border-radius: 12px;
    text-align: center;
}

.clock h3 {
    font-size: 0.9rem;
    color: #9ca3af;
    margin-bottom: 0.2rem;
}

.clock span {
    font-weight: bold;
    color: #f3f4f6;
}

.vacations-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex-grow: 1;
    justify-content: space-between;
    /* Stretch to fill remaining space */
}

.small-card {
    background-color: rgba(30, 41, 59, 0.8);
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
}

.small-card h2 {
    color: #60a5fa;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.summer {
    /* background-gradient or specialized style */
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(59, 130, 246, 0.2));
}
</style>
