<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
    getCurrentModule,
    getLastModuleInCurrentBlock,
    getNextDifferentModule,
    getNextPause,
    getNextModule,
    getNextOccurrence,
    isDuringVacation
} from '../logic/agenda'
import { getNow } from '../logic/time'
import { launchFireworks } from '../logic/effects'
import coffeeCroissantImg from '@/assets/Decoration/coffee_croissant.png'
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
    if (isDuringVacation(now)) {
        nextPauseTime.value = 'Vacances'
        isPauseImminent.value = false
    } else {
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
}

function getCardClass(courseName) {
    const defaultClass = 'bg-surface border-border text-white'

    if (!courseName || courseName === 'Aucun cours' || courseName === 'Fin de la journée' || courseName.startsWith('Week-end') || courseName === 'Vacances') {
        return defaultClass
    }

    const firstLetter = courseName.charAt(0).toUpperCase()
    if (firstLetter === 'I' || firstLetter === 'C') {
        // Lesson (Blue Glass)
        return 'bg-blue-600/20 border-blue-400/50 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]'
    } else {
        // Project (Green Glass)
        return 'bg-green-600/20 border-green-400/50 text-white shadow-[0_8px_32px_0_rgba(31,135,45,0.37)]'
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
    <div class="flex flex-col gap-2 md:gap-6 w-full flex-1 justify-between">
        <section
            class="backdrop-blur-sm rounded-xl shadow-lg border p-6 text-center transition-transform hover:-translate-y-0.5 tilt-card alive-breath relative overflow-hidden group/current"
            :class="[sectionsSwapped ? 'order-3' : 'order-1', { 'flash-pause': isModuleEnding }, getCardClass(currentCourse)]">
            <!-- Fake Coding Animation Watermark -->
            <div
                class="absolute top-0 bottom-0 right-2 w-32 opacity-80 pointer-events-none select-none overflow-hidden font-mono text-[10px] text-left text-blue-300 leading-tight mix-blend-overlay group-hover/current:scale-110 transition-transform origin-center fade-mask flex flex-col justify-center">
                <div class="animate-code-scroll">
                    <!-- Block 1 -->
                    <div class="pb-4">
                        <div class="text-blue-400">function learn() {</div>
                        <div class="pl-2">read(docs);</div>
                        <div class="pl-2 text-green-400">if (bug) {</div>
                        <div class="pl-4">fixIt();</div>
                        <div class="pl-2">} else {</div>
                        <div class="pl-4 text-yellow-400">shipIt();</div>
                        <div class="pl-2">}</div>
                        <div>}</div>
                        <div class="mt-2 text-purple-400">// Next task</div>
                        <div>await sleep(8h);</div>
                    </div>
                    <!-- Block 2 (Duplicate) -->
                    <div class="pb-4">
                        <div class="text-blue-400">function learn() {</div>
                        <div class="pl-2">read(docs);</div>
                        <div class="pl-2 text-green-400">if (bug) {</div>
                        <div class="pl-4">fixIt();</div>
                        <div class="pl-2">} else {</div>
                        <div class="pl-4 text-yellow-400">shipIt();</div>
                        <div class="pl-2">}</div>
                        <div>}</div>
                        <div class="mt-2 text-purple-400">// Loop</div>
                        <div>await sleep(8h);</div>
                    </div>
                    <!-- Block 3 (Duplicate) -->
                    <div class="pb-4">
                        <div class="text-blue-400">function learn() {</div>
                        <div class="pl-2">read(docs);</div>
                        <div class="pl-2 text-green-400">if (bug) {</div>
                        <div class="pl-4">fixIt();</div>
                        <div class="pl-2">} else {</div>
                        <div class="pl-4 text-yellow-400">shipIt();</div>
                        <div class="pl-2">}</div>
                        <div>}</div>
                        <div class="mt-2 text-purple-400">// Loop</div>
                        <div>await sleep(8h);</div>
                    </div>
                </div>
            </div>
            <h2 class="text-primary text-xl font-semibold mb-2 relative z-10">
                Cours actuel</h2>
            <h3 class="text-2xl font-bold my-2 text-inherit relative z-10">
                {{ currentCourse }}</h3>
            <p class="relative z-10">Fin dans: <span class="font-bold text-lg text-red-400">{{ endTime }}</span></p>
        </section>

        <section
            class="bg-surface backdrop-blur-sm rounded-xl shadow-lg border border-border p-6 text-center transition-transform hover:-translate-y-0.5 order-2 tilt-card alive-breath relative overflow-hidden group/pause"
            :class="{ 'flash-pause': isPauseImminent }">
            <img :src="coffeeCroissantImg" alt="Coffee Break"
                class="absolute bottom-0 right-[-10px] w-24 h-24 opacity-20 grayscale-0 pointer-events-none select-none mix-blend-overlay transition-transform duration-700 group-hover/pause:scale-110 group-hover/pause:rotate-12 object-contain origin-bottom-right" />
            <h2 class="text-primary text-xl font-semibold mb-2 relative z-10">Prochaine pause</h2>
            <p class="text-red-400 font-bold text-lg relative z-10">{{ nextPauseTime }}</p>
        </section>

        <section
            class="backdrop-blur-sm rounded-xl shadow-lg border p-6 text-center transition-transform hover:-translate-y-0.5 tilt-card alive-breath relative overflow-hidden group/next"
            :class="[sectionsSwapped ? 'order-1' : 'order-3', getCardClass(nextCourseName)]">
            <!-- Radio Spinner Watermark -->
            <!-- Radio Spinner Watermark -->
            <div
                class="absolute top-1/2 right-4 -translate-y-1/2 w-24 h-24 opacity-30 pointer-events-none select-none group-hover/next:scale-110 transition-transform mix-blend-overlay flex flex-col items-center justify-center">
                <!-- Spinner SVG -->
                <svg class="w-12 h-12 text-gray-200" viewBox="0 0 100 100">
                    <g fill="currentColor">
                        <rect x="47" y="15" width="6" height="20" rx="3" ry="3" transform="rotate(0 50 50)" opacity="1">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2s" begin="-2s"
                                repeatCount="indefinite" />
                        </rect>
                        <rect x="47" y="15" width="6" height="20" rx="3" ry="3" transform="rotate(30 50 50)"
                            opacity="0">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2s" begin="-1.833s"
                                repeatCount="indefinite" />
                        </rect>
                        <rect x="47" y="15" width="6" height="20" rx="3" ry="3" transform="rotate(60 50 50)"
                            opacity="0">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2s" begin="-1.666s"
                                repeatCount="indefinite" />
                        </rect>
                        <rect x="47" y="15" width="6" height="20" rx="3" ry="3" transform="rotate(90 50 50)"
                            opacity="0">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2s" begin="-1.5s"
                                repeatCount="indefinite" />
                        </rect>
                        <rect x="47" y="15" width="6" height="20" rx="3" ry="3" transform="rotate(120 50 50)"
                            opacity="0">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2s" begin="-1.333s"
                                repeatCount="indefinite" />
                        </rect>
                        <rect x="47" y="15" width="6" height="20" rx="3" ry="3" transform="rotate(150 50 50)"
                            opacity="0">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2s" begin="-1.166s"
                                repeatCount="indefinite" />
                        </rect>
                        <rect x="47" y="15" width="6" height="20" rx="3" ry="3" transform="rotate(180 50 50)"
                            opacity="0">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2s" begin="-1s"
                                repeatCount="indefinite" />
                        </rect>
                        <rect x="47" y="15" width="6" height="20" rx="3" ry="3" transform="rotate(210 50 50)"
                            opacity="0">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2s" begin="-0.833s"
                                repeatCount="indefinite" />
                        </rect>
                        <rect x="47" y="15" width="6" height="20" rx="3" ry="3" transform="rotate(240 50 50)"
                            opacity="0">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2s" begin="-0.666s"
                                repeatCount="indefinite" />
                        </rect>
                        <rect x="47" y="15" width="6" height="20" rx="3" ry="3" transform="rotate(270 50 50)"
                            opacity="0">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2s" begin="-0.5s"
                                repeatCount="indefinite" />
                        </rect>
                        <rect x="47" y="15" width="6" height="20" rx="3" ry="3" transform="rotate(300 50 50)"
                            opacity="0">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2s" begin="-0.333s"
                                repeatCount="indefinite" />
                        </rect>
                        <rect x="47" y="15" width="6" height="20" rx="3" ry="3" transform="rotate(330 50 50)"
                            opacity="0">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2s" begin="-0.166s"
                                repeatCount="indefinite" />
                        </rect>
                    </g>
                </svg>
                <div class="text-[10px] font-bold text-gray-200 mt-1 tracking-widest">LOADING...</div>
            </div>
            <h2 class="text-primary text-xl font-semibold mb-2 relative z-10">
                Prochain cours</h2>
            <h3 class="text-2xl font-bold my-2 text-inherit relative z-10">
                {{ nextCourseName }}</h3>
            <p v-if="nextRoom !== '-'" class="relative z-10">Salle: {{ nextRoom }}</p>
            <p v-if="nextStartIn && nextStartIn !== '-'" class="relative z-10">Début dans: <span
                    class="font-bold text-lg text-red-400">{{
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

@keyframes code-scroll {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-33.333%);
    }
}

.animate-code-scroll {
    animation: code-scroll 5s linear infinite;
}

.fade-mask {
    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
}
</style>
