<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
    getCurrentModule,
    getLastModuleInCurrentBlock,
    getNextDifferentModule,
    getNextPause,
    getNextModule,
    getNextOccurrence
} from '../logic/agenda'
import { getNow } from '../logic/time'
import { launchFireworks } from '../logic/effects'

const currentCourse = ref(null)
const endTime = ref('')
const nextCourseName = ref('')
const nextRoom = ref('')
const nextStartIn = ref('')

const nextPauseTime = ref('')
const isPauseImminent = ref(false)
const isModuleEnding = ref(false) // Blinking state
const isWeekend = ref(false)
const sectionsSwapped = ref(false)

let intervalId = null

function update() {
    const now = getNow()
    const day = now.getDay()
    isWeekend.value = (day === 0 || day === 6)

    const mod = getCurrentModule(now)

    // Current Course
    if (mod) {
        sectionsSwapped.value = false
        currentCourse.value = mod.moduleName
        const lastInBlock = getLastModuleInCurrentBlock(mod, now)
        const end = lastInBlock.getEndDate(now)
        const diff = Math.floor((end - now) / 1000)

        if (diff > 0) {
            const h = Math.floor(diff / 3600)
            const m = Math.floor((diff % 3600) / 60)
            const s = diff % 60
            endTime.value = `${h} h ${m} min ${s} sec`

            // Blink green when <= 5 mins (300s)
            isModuleEnding.value = diff <= 300

            // Firework warning 30 seconds before end
            if (diff === 30) {
                launchFireworks()
            }
        } else {
            endTime.value = 'Terminé'
            isModuleEnding.value = false
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
        isModuleEnding.value = false

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
    const pause = getNextPause(now)
    if (pause) {
        const diff = Math.floor((pause - now) / 1000)

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
    <div class="flex flex-col gap-6 w-full flex-1 justify-between">
        <section
            class="bg-surface backdrop-blur-sm rounded-xl shadow-lg border border-border p-6 text-center transition-transform hover:-translate-y-0.5 tilt-card alive-breath"
            :class="[sectionsSwapped ? 'order-3' : 'order-1', { 'flash-pause': isModuleEnding }]">
            <h2 class="text-primary text-xl font-semibold mb-2">Cours actuel</h2>
            <h3 class="text-2xl text-gray-100 font-bold my-2">{{ currentCourse }}</h3>
            <p>Fin dans: <span class="text-red-400 font-bold text-lg">{{ endTime }}</span></p>
        </section>

        <section
            class="bg-surface backdrop-blur-sm rounded-xl shadow-lg border border-border p-6 text-center transition-transform hover:-translate-y-0.5 order-2 tilt-card alive-breath"
            :class="{ 'flash-pause': isPauseImminent }">
            <h2 class="text-primary text-xl font-semibold mb-2">Prochaine pause</h2>
            <p class="text-red-400 font-bold text-lg">{{ nextPauseTime }}</p>
        </section>

        <section
            class="bg-surface backdrop-blur-sm rounded-xl shadow-lg border border-border p-6 text-center transition-transform hover:-translate-y-0.5 tilt-card alive-breath"
            :class="sectionsSwapped ? 'order-1' : 'order-3'">
            <h2 class="text-primary text-xl font-semibold mb-2">Prochain cours</h2>
            <h3 class="text-2xl text-gray-100 font-bold my-2">{{ nextCourseName }}</h3>
            <p v-if="nextRoom !== '-'">Salle: {{ nextRoom }}</p>
            <p v-if="nextStartIn && nextStartIn !== '-'">Début dans: <span class="text-red-400 font-bold text-lg">{{
                nextStartIn }}</span></p>
        </section>
    </div>
</template>

<style scoped>
.flash-pause {
    animation: flash 1s infinite;
    border-color: #10b981;
    /* emerald-500 */
}

@keyframes flash {

    0%,
    100% {
        background-color: rgba(30, 41, 59, 0.8);
        /* bg-slate-800/80 */
    }

    50% {
        background-color: rgba(6, 95, 70, 0.8);
        /* bg-emerald-800/80 */
    }
}
</style>
