<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
    getCurrentModule,
    getLastModuleInCurrentBlock,
    getNextDifferentModule,
    getNextPause,
    getNextModule,
    getNextOccurrence // Import added
} from '../logic/agenda'
import { getNow } from '../logic/time'

const currentCourse = ref(null)
const endTime = ref('')
const nextCourseName = ref('')
const nextRoom = ref('')
const nextStartIn = ref('')

const nextPauseTime = ref('')
const isPauseImminent = ref(false)
const isWeekend = ref(false)
const sectionsSwapped = ref(false) // Added ref

let intervalId = null

function update() {
    const now = getNow()
    const day = now.getDay()
    isWeekend.value = (day === 0 || day === 6)

    const mod = getCurrentModule(now)

    // Current Course
    if (mod) {
        sectionsSwapped.value = false // Reset swap
        currentCourse.value = mod.moduleName
        const lastInBlock = getLastModuleInCurrentBlock(mod, now)
        const end = lastInBlock.getEndDate(now)
        const diff = Math.floor((end - now) / 1000)

        if (diff > 0) {
            const h = Math.floor(diff / 3600)
            const m = Math.floor((diff % 3600) / 60)
            const s = diff % 60
            endTime.value = `${h} h ${m} min ${s} sec`
        } else {
            endTime.value = 'Terminé'
        }

        // Next Course
        const next = getNextDifferentModule(lastInBlock)
        if (next) {
            nextCourseName.value = next.moduleName
            nextRoom.value = next.room

            // Calculate start in
            const nextDate = getNextOccurrence(next, now)
            const diffNext = Math.floor((nextDate - now) / 1000)
            if (diffNext > 0) {
                const h = Math.floor(diffNext / 3600)
                const m = Math.floor((diffNext % 3600) / 60)
                const s = diffNext % 60
                nextStartIn.value = `${h} h ${m} min ${s} sec`
            } else {
                nextStartIn.value = 'Maintenant'
            }

        } else {
            nextCourseName.value = 'Fin de la journée'
            nextRoom.value = '-'
            nextStartIn.value = '-'
        }
    } else {
        currentCourse.value = 'Aucun cours'
        endTime.value = '-'
        sectionsSwapped.value = true // Swap when no course

        const next = getNextModule()
        if (next) {
            nextCourseName.value = next.moduleName
            nextRoom.value = next.room

            // Calculate start in for next module when no current cours
            const nextDate = getNextOccurrence(next, now)
            const diffNext = Math.floor((nextDate - now) / 1000)
            if (diffNext > 0) {
                const h = Math.floor(diffNext / 3600)
                const m = Math.floor((diffNext % 3600) / 60)
                const s = diffNext % 60
                nextStartIn.value = `${h} h ${m} min ${s} sec`
            } else {
                nextStartIn.value = 'Maintenant'
            }
        } else {
            nextCourseName.value = 'Aucun cours'
            nextRoom.value = '-'
            nextStartIn.value = '-'
        }
    }

    // Next Pause
    // If it's the weekend (or Friday afternoon > last break), show "Lundi"
    // We can detecting this by checking if the next pause is > 12 hours away (simple heuristic since breaks are daily)
    // Or strictly check if nextPause day is Monday and today is Friday/Sat/Sun.
    const pause = getNextPause(now)
    if (pause) {
        const diff = Math.floor((pause - now) / 1000)

        // If the next pause is more than 18 hours away, it's likely next week (or tomorrow morning if early)
        // Actually, simple check: if next pause is Monday and today is Fri/Sat/Sun
        const pauseDay = pause.getDay()
        const currentDay = now.getDay()

        if (pauseDay === 1 && (currentDay === 5 || currentDay === 6 || currentDay === 0)) {
            nextPauseTime.value = 'Lundi'
            isPauseImminent.value = false
        } else if (diff > 0) {
            const h = Math.floor(diff / 3600)
            const m = Math.floor((diff % 3600) / 60)
            const s = diff % 60
            nextPauseTime.value = `${h} h ${m} min ${s} sec`
            isPauseImminent.value = diff <= 30
        } else {
            nextPauseTime.value = 'Maintenant'
            isPauseImminent.value = false
        }
    } else {
        nextPauseTime.value = '-'
        isPauseImminent.value = false
    }
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
    <div class="info-column" :class="{ 'swap-sections': sectionsSwapped }">
        <section class="main-card course-current">
            <h2>Cours actuel</h2>
            <h3 class="highlight">{{ currentCourse }}</h3>
            <p>Fin dans: <span class="timer">{{ endTime }}</span></p>
        </section>



        <section class="main-card pause-card" :class="{ 'flash-pause': isPauseImminent }">
            <h2>Prochaine pause</h2>
            <p class="timer">{{ nextPauseTime }}</p>
        </section>

        <section class="main-card course-next">
            <h2>Prochain cours</h2>
            <h3 class="highlight">{{ nextCourseName }}</h3>
            <p v-if="nextRoom !== '-'">Salle: {{ nextRoom }}</p>
            <p v-if="nextStartIn && nextStartIn !== '-'">Début dans: <span class="timer">{{ nextStartIn }}</span></p>
        </section>
    </div>
</template>

<style scoped>
.info-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    flex: 1;
    /* Match parent column height */
    justify-content: space-between;
    /* Space out cards evenly */
}

/* Default Order */
.course-current {
    order: 0;
}

.pause-card {
    order: 1;
}

.course-next {
    order: 2;
}

/* Swap Order when no current course */
.swap-sections .course-current {
    order: 2;
}

.swap-sections .pause-card {
    order: 1;
}

.swap-sections .course-next {
    order: 0;
}

.main-card {
    background-color: rgba(30, 41, 59, 0.8);
    /* Slate-800 with opacity */
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.2s;
}

.main-card:hover {
    transform: translateY(-2px);
}

h2 {
    color: #60a5fa;
    /* Blue-400 */
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.highlight {
    font-size: 1.5rem;
    color: #f3f4f6;
    /* Gray-100 */
    margin: 0.5rem 0;
}

.timer {
    color: #f87171;
    /* Red-400 */
    font-weight: bold;
    font-size: 1.1rem;
}

.flash-pause {
    animation: flash 1s infinite;
    border-color: #10b981;
    /* Green-500 */
}

@keyframes flash {

    0%,
    100% {
        background-color: rgba(30, 41, 59, 0.8);
    }

    50% {
        background-color: rgba(6, 95, 70, 0.8);
        /* Darker green */
    }
}

.progress-bar-container {
    width: 100%;
    height: 10px;
    background-color: #374151;
    border-radius: 5px;
    margin: 1rem 0 0.5rem 0;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background-color: #10b981;
    /* Green progress */
    transition: width 0.5s linear;
}
</style>
