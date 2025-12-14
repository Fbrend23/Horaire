<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { getUpcomingVacations, getVacationByName } from '../logic/vacances'
import { getLastModuleOfDay } from '../logic/agenda'
import { getNow } from '../logic/time'
import { useSettingsStore } from '../stores/settingsStore'
import sunRaysImg from '@/assets/Weather/sun_rays.png'
import newYorkImg from '@/assets/Locations/new_york.png'
import lausanneImg from '@/assets/Locations/lausanne.png'
import tokyoBranchImg from '@/assets/Locations/tokyo_branch.png'

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

const currentTheme = computed(() => {
    const name = nextVacName.value.toLowerCase()
    if (name.includes('noël')) return 'theme-noel'
    if (name.includes('pâques')) return 'theme-paques'
    if (name.includes('été')) return 'theme-ete'
    if (name.includes('automne')) return 'theme-automne'
    if (name.includes('hiver')) return 'theme-hiver'
    return ''
})

const currentIcon = computed(() => {
    const name = nextVacName.value.toLowerCase()
    if (name.includes('noël')) return '🎄'
    if (name.includes('pâques')) return '🐰'
    if (name.includes('été')) return '☀️'
    if (name.includes('automne')) return '🍂'
    if (name.includes('hiver')) return '⛷️'
    return ''
})

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
        <div v-if="settingsStore.displaySettings.clocks" class="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            <!-- New York -->
            <div
                class="flex flex-col items-center justify-center p-3 rounded-xl border shadow-lg relative overflow-hidden transition-transform hover:-translate-y-1 tilt-card alive-breath theme-newyork group">
                <img :src="newYorkImg" alt="New York"
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 opacity-20 grayscale-0 group-hover:scale-110 transition-transform duration-500 pointer-events-none select-none mix-blend-overlay" />
                <div class="flex flex-col items-center z-10 relative">
                    <h3 class="text-xs font-bold uppercase tracking-wider mb-1 opacity-90 text-blue-100">New York</h3>
                    <span class="font-mono text-lg font-bold text-white drop-shadow-md">{{ newYorkTime }}</span>
                </div>
            </div>

            <!-- Lausanne -->
            <div
                class="flex flex-col items-center justify-center p-3 rounded-xl border shadow-lg relative overflow-hidden transition-transform hover:-translate-y-1 tilt-card alive-breath theme-lausanne group">
                <img :src="lausanneImg" alt="Lausanne"
                    class="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 object-contain opacity-20 grayscale-0 group-hover:scale-110 transition-transform duration-500 pointer-events-none select-none mix-blend-overlay origin-bottom" />
                <div class="flex flex-col items-center z-10 relative">
                    <h3 class="text-xs font-bold uppercase tracking-wider mb-1 opacity-90 text-red-50">Lausanne</h3>
                    <span class="font-mono text-lg font-bold text-white drop-shadow-md">{{ lausanneTime }}</span>
                </div>
            </div>

            <!-- Tokyo -->
            <div
                class="flex flex-col items-center justify-center p-3 rounded-xl border shadow-lg relative overflow-hidden transition-transform hover:-translate-y-1 tilt-card alive-breath theme-tokyo group">
                <img :src="tokyoBranchImg" alt="Tokyo"
                    class="absolute top-0 right-0 w-32 h-32 opacity-30 grayscale-0 group-hover:scale-110 transition-transform duration-500 pointer-events-none select-none mix-blend-overlay origin-top-right" />
                <div class="flex flex-col items-center z-10 relative">
                    <h3 class="text-xs font-bold uppercase tracking-wider mb-1 opacity-90 text-pink-50">Tokyo</h3>
                    <span class="font-mono text-lg font-bold text-white drop-shadow-md">{{ tokyoTime }}</span>
                </div>
            </div>
        </div>

        <div v-if="settingsStore.displaySettings.vacances"
            class="flex flex-col gap-2 md:gap-4 flex-grow justify-between">
            <section
                class="bg-surface backdrop-blur-sm p-4 rounded-lg text-center shadow-md border border-border transition-transform hover:-translate-y-0.5 tilt-card alive-breath">
                <h2 class="text-primary text-lg font-semibold mb-2">Week-end</h2>
                <p class="text-xl font-bold text-gray-100">{{ weekendTime }}</p>
            </section>

            <section
                class="bg-surface backdrop-blur-sm p-4 rounded-lg text-center shadow-md border border-border transition-transform hover:-translate-y-0.5 tilt-card alive-breath relative overflow-hidden"
                :class="currentTheme">

                <!-- Snowflakes for Winter and Christmas -->
                <div v-if="currentTheme === 'theme-noel' || currentTheme === 'theme-hiver'"
                    class="snow-container pointer-events-none">
                    <div v-for="n in 12" :key="n" class="snowflake">❄</div>
                </div>

                <!-- Sakura for Pâques (Easter) -->
                <div v-if="currentTheme === 'theme-paques'" class="snow-container pointer-events-none">
                    <div v-for="n in 12" :key="n" class="sakura">🌸</div>
                </div>

                <!-- Sun Rays for Été (Summer) -->
                <div v-if="currentTheme === 'theme-ete'"
                    class="snow-container pointer-events-none flex justify-center items-center">
                    <img :src="sunRaysImg" class="sun-rays" />
                </div>

                <!-- Leaves for Automne -->
                <div v-if="currentTheme === 'theme-automne'" class="snow-container pointer-events-none">
                    <div v-for="n in 12" :key="n" class="leaf">🍁</div>
                </div>

                <h2 class="text-primary text-lg font-semibold mb-2 relative z-10"
                    :class="{ 'theme-text': currentTheme }">
                    Prochaines vacances <span v-if="currentIcon">{{ currentIcon }}</span>
                </h2>
                <h3 class="text-xl font-bold text-white my-1 relative z-10">{{ nextVacName }}</h3>
                <p class="text-gray-300 transition-colors duration-300 relative z-10"
                    :class="{ 'text-white': currentTheme }">{{ nextVacTime }}</p>
            </section>

            <section
                class="bg-surface backdrop-blur-sm p-4 rounded-lg text-center shadow-md border border-border transition-transform hover:-translate-y-0.5 tilt-card alive-breath">
                <h2 class="text-primary text-lg font-semibold mb-2">Fin de l'année</h2>
                <p class="text-gray-300">{{ summerVacTime }}</p>
            </section>
        </div>
    </div>
</template>

<style scoped>
/* Theme Base Animation */
@keyframes theme-pulse {

    0%,
    100% {
        box-shadow: 0 0 15px currentColor;
        border-color: currentColor;
    }

    50% {
        box-shadow: 0 0 25px currentColor;
        filter: brightness(1.2);
    }
}

/* --- Noël (Christmas) --- */
.theme-noel {
    background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(22, 163, 74, 0.2), rgba(220, 38, 38, 0.2));
    border-color: rgba(220, 38, 38, 0.5);
    color: rgba(220, 38, 38, 0.8);
    /* For current color in animation */
    animation: theme-pulse 4s ease-in-out infinite;
}

.theme-noel .theme-text {
    color: #fca5a5;
    text-shadow: 0 0 5px rgba(252, 165, 165, 0.5);
}

/* --- Pâques (Easter) --- */
.theme-paques {
    background: linear-gradient(135deg, rgba(244, 114, 182, 0.2), rgba(250, 204, 21, 0.2), rgba(74, 222, 128, 0.2));
    border-color: rgba(244, 114, 182, 0.5);
    color: rgba(244, 114, 182, 0.8);
    animation: theme-pulse 5s ease-in-out infinite;
}

.theme-paques .theme-text {
    color: #f9a8d4;
    text-shadow: 0 0 5px rgba(249, 168, 212, 0.5);
}

/* --- Été (Summer) --- */
.theme-ete {
    background: linear-gradient(135deg, rgba(250, 204, 21, 0.2), rgba(249, 115, 22, 0.2), rgba(56, 189, 248, 0.2));
    border-color: rgba(250, 204, 21, 0.5);
    color: rgba(250, 204, 21, 0.8);
    animation: theme-pulse 6s ease-in-out infinite;
}

.theme-ete .theme-text {
    color: #fde047;
    text-shadow: 0 0 5px rgba(253, 224, 71, 0.5);
}

/* --- Automne (Autumn) --- */
.theme-automne {
    background: linear-gradient(135deg, rgba(234, 88, 12, 0.2), rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2));
    border-color: rgba(234, 88, 12, 0.5);
    color: rgba(234, 88, 12, 0.8);
    animation: theme-pulse 5s ease-in-out infinite;
}

.theme-automne .theme-text {
    color: #fbbf24;
    text-shadow: 0 0 5px rgba(251, 191, 36, 0.5);
}

/* --- Hiver (Winter) --- */
.theme-hiver {
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(255, 255, 255, 0.1), rgba(147, 197, 253, 0.2));
    border-color: rgba(56, 189, 248, 0.5);
    color: rgba(56, 189, 248, 0.8);
    animation: theme-pulse 4s ease-in-out infinite;
}

.theme-hiver .theme-text {
    color: #bae6fd;
    text-shadow: 0 0 5px rgba(186, 230, 253, 0.5);
}


/* Particle Effects (Shared Container) */
.snow-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 1;
}

/* Sun Rays */
.sun-rays {
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    opacity: 0.2;
    animation: rotate-sun 20s linear infinite;
    user-select: none;
    pointer-events: none;
    mix-blend-mode: overlay;
}

/* Snowflake */
.snowflake {
    position: absolute;
    top: -20px;
    color: white;
    font-size: 1.2em;
    opacity: 0.8;
    user-select: none;
    animation: fall linear infinite;
}

/* Sakura (Cherry Blossom) */
.sakura {
    position: absolute;
    top: -20px;
    color: #fca5a5;
    /* Pink */
    font-size: 1.2em;
    opacity: 0.9;
    user-select: none;
    animation: fall-sway 6s linear infinite;
}

/* Autumn Leaf */
.leaf {
    position: absolute;
    top: -20px;
    color: #f59e0b;
    /* Amber-500 */
    font-size: 1.2em;
    opacity: 0.9;
    user-select: none;
    animation: fall-rotate 5s linear infinite;
    /* Shift standard red maple leaf emoji towards orange/yellow */
    filter: hue-rotate(45deg) brightness(1.2);
}

/* Animation Delays & Positions (Reused for all particles) */
.snowflake:nth-child(1),
.sakura:nth-child(1),
.leaf:nth-child(1) {
    left: 5%;
    animation-duration: 4s;
    animation-delay: 0s;
}

.snowflake:nth-child(2),
.sakura:nth-child(2),
.leaf:nth-child(2) {
    left: 12%;
    animation-duration: 6s;
    animation-delay: -2s;
    font-size: 0.8em;
}

.snowflake:nth-child(3),
.sakura:nth-child(3),
.leaf:nth-child(3) {
    left: 25%;
    animation-duration: 5s;
    animation-delay: -1s;
}

.snowflake:nth-child(4),
.sakura:nth-child(4),
.leaf:nth-child(4) {
    left: 35%;
    animation-duration: 7s;
    animation-delay: -3s;
    font-size: 0.9em;
}

.snowflake:nth-child(5),
.sakura:nth-child(5),
.leaf:nth-child(5) {
    left: 45%;
    animation-duration: 4.5s;
    animation-delay: -0.5s;
}

.snowflake:nth-child(6),
.sakura:nth-child(6),
.leaf:nth-child(6) {
    left: 55%;
    animation-duration: 6.5s;
    animation-delay: -4s;
    font-size: 0.7em;
}

.snowflake:nth-child(7),
.sakura:nth-child(7),
.leaf:nth-child(7) {
    left: 65%;
    animation-duration: 5.5s;
    animation-delay: -1.5s;
}

.snowflake:nth-child(8),
.sakura:nth-child(8),
.leaf:nth-child(8) {
    left: 75%;
    animation-duration: 8s;
    animation-delay: -2.5s;
    font-size: 1em;
}

.snowflake:nth-child(9),
.sakura:nth-child(9),
.leaf:nth-child(9) {
    left: 85%;
    animation-duration: 4.8s;
    animation-delay: -3.5s;
}

.snowflake:nth-child(10),
.sakura:nth-child(10),
.leaf:nth-child(10) {
    left: 95%;
    animation-duration: 6.2s;
    animation-delay: -1.2s;
    font-size: 0.8em;
}

.snowflake:nth-child(11),
.sakura:nth-child(11),
.leaf:nth-child(11) {
    left: 18%;
    animation-duration: 5.8s;
    animation-delay: -0.8s;
}

.snowflake:nth-child(12),
.sakura:nth-child(12),
.leaf:nth-child(12) {
    left: 82%;
    animation-duration: 7.2s;
    animation-delay: -2.2s;
}

@keyframes fall {
    0% {
        transform: translateY(-20px) rotate(0deg);
        opacity: 0.8;
    }

    100% {
        transform: translateY(200px) rotate(360deg);
        opacity: 0.2;
    }
}

@keyframes fall-sway {
    0% {
        transform: translateY(-20px) translateX(0px) rotate(0deg);
        opacity: 0.8;
    }

    25% {
        transform: translateY(35px) translateX(15px) rotate(45deg);
    }

    50% {
        transform: translateY(90px) translateX(-15px) rotate(90deg);
    }

    75% {
        transform: translateY(145px) translateX(15px) rotate(135deg);
    }

    100% {
        transform: translateY(200px) translateX(0px) rotate(180deg);
        opacity: 0.2;
    }
}

@keyframes fall-rotate {
    0% {
        transform: translateY(-20px) rotate(0deg);
        opacity: 0.8;
    }

    100% {
        transform: translateY(200px) rotate(720deg);
        opacity: 0.2;
    }
}

@keyframes rotate-sun {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* --- Clock Themes --- */
.theme-newyork {
    background: linear-gradient(135deg, rgba(30, 58, 138, 0.6), rgba(185, 28, 28, 0.4));
    border-color: rgba(96, 165, 250, 0.5);
    box-shadow: 0 4px 6px -1px rgba(30, 58, 138, 0.3);
}

.theme-lausanne {
    background: linear-gradient(135deg, rgba(220, 38, 38, 0.5), rgba(255, 255, 255, 0.1));
    border-color: rgba(252, 165, 165, 0.5);
    box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.3);
}

.theme-tokyo {
    background: linear-gradient(135deg, rgba(190, 24, 93, 0.5), rgba(88, 28, 135, 0.3));
    border-color: rgba(244, 114, 182, 0.5);
    box-shadow: 0 4px 6px -1px rgba(190, 24, 93, 0.3);
}
</style>
