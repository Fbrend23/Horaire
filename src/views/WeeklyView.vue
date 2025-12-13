<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { weeklySchedule } from '../logic/agenda'
import { getNow } from '../logic/time'
import TheHeader from '../components/TheHeader.vue'

// Constants
const DAY_START = "08:00"
const DAY_END = "17:25"
const PX_PER_MIN = 80 / 60
const BIG_BREAKS = [
    { time: "09:35", length: 15 },
    { time: "14:45", length: 15 },
]
const DAYS = [
    { label: "Lun", value: 1 },
    { label: "Mar", value: 2 },
    { label: "Mer", value: 3 },
    { label: "Jeu", value: 4 },
    { label: "Ven", value: 5 },
]

function parseHHMM(s) {
    const [h, m] = s.split(":").map(Number)
    return h * 60 + m
}

const DAY_START_MIN = parseHHMM(DAY_START)
const DAY_END_MIN = parseHHMM(DAY_END)
const totalHeight = (DAY_END_MIN - DAY_START_MIN) * PX_PER_MIN

// Time ticks
const ticks = computed(() => {
    const starts = []
    let t = DAY_START_MIN
    while (t < DAY_END_MIN) {
        starts.push(t)
        const periodEnd = t + 45
        const breakAtEnd = BIG_BREAKS.find(b => parseHHMM(b.time) === periodEnd)
        if (breakAtEnd) {
            t = periodEnd + breakAtEnd.length
            continue
        }
        const breakBefore = BIG_BREAKS.find(b => periodEnd === parseHHMM(b.time) + b.length)
        if (breakBefore) {
            t = periodEnd
            continue
        }
        t = periodEnd + 5
    }
    return starts.filter(s => s < DAY_END_MIN).map(min => {
        return {
            label: formatTime(min),
            top: (min - DAY_START_MIN) * PX_PER_MIN,
            height: ((starts[starts.indexOf(min) + 1] || DAY_END_MIN) - min) * PX_PER_MIN
        }
    })
})

function formatTime(min) {
    const h = Math.floor(min / 60)
    const m = min % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function getEventStyle(ev) {
    const startMin = ev.startHour * 60 + ev.startMinute
    const endMin = ev.endHour * 60 + ev.endMinute
    const top = Math.max(0, startMin - DAY_START_MIN) * PX_PER_MIN
    const height = Math.max(24, (endMin - startMin) * PX_PER_MIN)

    const firstLetter = ev.moduleName.charAt(0).toUpperCase()
    let style = {
        top: `${top}px`,
        height: `${height}px`,
        position: 'absolute',
        width: '100%'
    }

    if (firstLetter !== 'I' && firstLetter !== 'C') {
        style.backgroundColor = "hsl(130, 55%, 45%)"
        style.borderLeft = "3px solid hsl(130, 55%, 45%)"
        style.color = "#1a2e1a"
    }

    return style
}

function getEventClass(ev) {
    const firstLetter = ev.moduleName.charAt(0).toUpperCase()
    if (firstLetter === 'I' || firstLetter === 'C') return 'event default-event'
    return 'event green-event'
}

// Now Indicator
const nowTop = ref(-100)
const nowDayIndex = ref(-1)

function updateNow() {
    const now = getNow()
    const wd = now.getDay()
    nowDayIndex.value = DAYS.findIndex(d => d.value === wd)

    if (nowDayIndex.value !== -1) {
        const min = now.getHours() * 60 + now.getMinutes()
        nowTop.value = Math.max(0, Math.min(totalHeight, (min - DAY_START_MIN) * PX_PER_MIN))
    }
}

let interval = null
onMounted(() => {
    updateNow()
    interval = setInterval(updateNow, 1000)
})
onUnmounted(() => {
    if (interval) clearInterval(interval)
})

const bigBreaksStyles = BIG_BREAKS.map(b => {
    const start = parseHHMM(b.time)
    return {
        top: (start - DAY_START_MIN) * PX_PER_MIN + 'px',
        height: b.length * PX_PER_MIN + 'px'
    }
})

</script>

<template>
    <div class="weekly-view">
        <TheHeader />

        <div class="timetable-container">
            <div class="time-col">
                <div v-for="(tick, i) in ticks" :key="i" class="tick" :style="{ height: tick.height + 'px' }">
                    {{ tick.label }}
                </div>
            </div>

            <div v-for="(day, idx) in DAYS" :key="day.value" class="day-col">
                <div class="day-header">{{ day.label }}</div>
                <div class="slot-grid" :style="{ height: totalHeight + 'px' }">
                    <!-- Big Breaks -->
                    <div v-for="(bps, bIdx) in bigBreaksStyles" :key="bIdx" class="big-break" :style="bps"></div>

                    <!-- Events -->
                    <div v-for="(ev, eIdx) in weeklySchedule.filter(e => e.dayOfWeek === day.value)" :key="eIdx"
                        :class="getEventClass(ev)" :style="getEventStyle(ev)">
                        <strong>{{ ev.moduleName }}</strong>
                        <small>{{ ev.room }}</small>
                        <small>{{ String(ev.startHour).padStart(2, '0') }}:{{ String(ev.startMinute).padStart(2, '0')
                        }} – {{ String(ev.endHour).padStart(2, '0') }}:{{ String(ev.endMinute).padStart(2, '0')
                            }}</small>
                    </div>

                    <!-- Now Indicator -->
                    <div v-if="idx === nowDayIndex" class="now-indicator" :style="{ top: nowTop + 'px' }">
                        <div class="now-bubble">maintenant</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.weekly-view {
    color: #e2e8f0;
    font-family: 'Inter', sans-serif;
}

.timetable-container {
    display: flex;
    justify-content: center;
    padding: 2rem;
    gap: 10px;
}

.time-col {
    width: 50px;
    display: flex;
    flex-direction: column;
    padding-top: 30px;
    /* offset for header */
}

.tick {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.8rem;
    color: #94a3b8;
    text-align: right;
    padding-right: 5px;
    box-sizing: border-box;
}

.day-col {
    flex: 1;
    max-width: 200px;
    display: flex;
    flex-direction: column;
}

.day-header {
    text-align: center;
    font-weight: bold;
    margin-bottom: 10px;
    color: #f1f5f9;
}

.slot-grid {
    position: relative;
    background-color: rgba(30, 41, 59, 0.5);
    border-radius: 8px;
    /* background grid lines could be added */
}

.big-break {
    position: absolute;
    width: 100%;
    /* Stronger visibility: Red Striped pattern */
    background: repeating-linear-gradient(45deg,
            rgba(239, 68, 68, 0.2),
            /* Red-500 low opacity */
            rgba(239, 68, 68, 0.2) 10px,
            rgba(239, 68, 68, 0.4) 10px,
            /* Darker red */
            rgba(239, 68, 68, 0.4) 20px);
    z-index: 50;
    /* Significantly higher z-index to ensure visibility */
    pointer-events: none;
    /* Allow clicking through */
    box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
    /* Red shadow */
}

.event {
    position: absolute;
    width: 100%;
    /* filled width */
    left: 0;
    border-radius: 4px;
    padding: 4px;
    overflow: hidden;
    font-size: 0.95rem;
    /* Increased from 0.8rem */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    /* Align to top */
    align-items: center;
    /* Center horizontal */
    text-align: center;
    padding-top: 8px;
    /* Slightly more padding at top to not be too jammed */
    box-sizing: border-box;
}

.default-event {
    background-color: #6366f1;
    /* Indigo-500 */
    border-left: 3px solid #4338ca;
    /* Indigo-700 */
    color: white;
}

.green-event {
    background-color: #22c55e;
    border-left: 3px solid #15803d;
}

.now-indicator {
    position: absolute;
    width: 100%;
    border-top: 2px solid #ef4444;
    z-index: 10;
}

.now-bubble {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    top: 0;
    /* Center vertically on the line */
    background-color: #ef4444;
    color: white;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 0.7rem;
}
</style>
