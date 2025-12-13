<script setup>
import { RouterView } from 'vue-router'
import { useGameStore } from './stores/gameStore'
import { useSettingsStore } from './stores/settingsStore'
import { useWeather } from './logic/weatherService'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const gameStore = useGameStore()
const settingsStore = useSettingsStore()

// MERGE: Destructure all props from both branches + import cloudImg
const { weatherState, isNight, weatherIntensity, windSpeed } = useWeather()
import cloudImg from '@/assets/Weather/cloud.png'

gameStore.initGame()

// --- Alive Logic: Weather & 3D Tilt ---
const canvasRef = ref(null)
let animationId = null
let particles = []

// Cloud Logic (Restored from feat/weather)
const clouds = ref([])

function generateClouds() {
    clouds.value = []

    // Default Cloudy Settings
    let cloudCount = 5 + Math.floor(Math.random() * 4)
    let topMax = 70
    let widthBase = 150
    let opacityBase = 0.3
    let durationBase = 120

    // Fog Settings
    let isFog = false
    if (weatherState.value === 'fog') {
        isFog = true
        cloudCount = 20 // Maintain count
        topMax = 120
        widthBase = 2000
        opacityBase = 0.04
        durationBase = 10
    }

    for (let i = 0; i < cloudCount; i++) {
        let top

        if (isFog) {
            // Even distribution: Slice screen into segments
            // Start EVEN HIGHER (-150%)
            const span = 300 // -150 to 150
            const segment = span / cloudCount
            const base = -150 + (i * segment)
            // Add jitter (+/- 10%)
            top = base + (Math.random() * 20 - 10)
        } else {
            top = Math.random() * topMax
        }

        // Center the massive fog sheets
        const finalWidth = isFog ? 4000 : (widthBase + Math.random() * 400)

        clouds.value.push({
            id: i,
            wrapperStyle: {
                top: `${top}%`,
                // Fog: Center it (Left 50% - Half Width). Clouds: Random drift start.
                left: isFog ? `calc(50% - ${finalWidth / 2}px)` : `${Math.random() * 100 - 20}%`,
                width: `${finalWidth}px`,
                animationDuration: `${durationBase + Math.random() * (isFog ? 20 : 120)}s`,
                animationDelay: `-${Math.random() * 120}s`
            },
            imgStyle: {
                opacity: opacityBase + Math.random() * 0.05
            },
            // Use breathe for fog, drift for clouds. Add mix-blend-screen for fog.
            class: `absolute z-10 pointer-events-none ${isFog ? 'blur-3xl animate-breathe mix-blend-screen' : 'animate-drift'}`
        })
    }
}

// Particle System
class Particle {
    constructor(w, h, type) {
        this.reset(w, h, type)
    }

    reset(w, h, type) {
        this.x = Math.random() * w
        this.y = Math.random() * h
        this.type = type
        this.alpha = Math.random() // Initialize for all types
        const intensity = weatherIntensity.value || 0.5
        const wind = windSpeed.value || 0

        if (type === 'rain') {
            // MERGE: Keep feat/weather depth logic
            this.z = Math.random() // Depth: 0 (Far) to 1 (Near)

            // Speed logic
            const speedBase = 4 + Math.random() * 3
            this.vy = (speedBase + this.z * 6) * (0.8 + intensity * 0.4)

            // Size logic
            this.length = (15 + Math.random() * 10) * (0.5 + this.z)
            this.width = 0.5 + this.z * 1.5 // 0.5px to 2px width

            // Init lateral velocity from wind (slight tilt start)
            this.vx = (wind * 0.1) * (0.5 + this.z)
        } else if (type === 'snow') {
            // MERGE: Light snow logic
            this.vy = (0.5 + Math.random() * 1.5) * (0.8 + intensity * 0.5)
            this.size = (3 + Math.random() * 4) * (0.5 + intensity)
            this.angle = Math.random() * Math.PI * 2
            this.vx = 0
        } else { // fireflies / dust
            this.vx = (Math.random() - 0.5) * 0.5
            this.vy = (Math.random() - 0.5) * 0.5
            this.size = 1 + Math.random() * 2
            this.alpha = Math.random()
            this.fadeSpd = 0.01 + Math.random() * 0.02
        }
    }

    update(w, h) {
        if (this.type === 'rain') {
            this.y += this.vy
            // MERGE: Sideways movement with wind (feat/weather logic)
            const wx = (windSpeed.value || 0) * 0.2
            this.x += wx

            // Wrap around logic
            if (this.y > h) {
                this.y = -20
                this.x = Math.random() * w // Random x reset
            }
            if (this.x > w + 20) this.x = -20
            if (this.x < -20) this.x = w + 20
        } else if (this.type === 'snow') {
            this.y += this.vy
            this.x += Math.sin(this.y * 0.01) * 0.5
            if (this.y > h) this.y = -5
        } else {
            this.x += this.vx
            this.y += this.vy
            this.alpha += this.fadeSpd
            if (this.alpha > 1 || this.alpha < 0) this.fadeSpd *= -1
            if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset(w, h, this.type)
        }
    }

    draw(ctx) {
        if (this.type === 'rain') {
            // MERGE: Use feat/weather Gradient Tail logic (better visuals)
            const wx = (windSpeed.value || 0) * 0.5
            const endX = this.x + wx
            const endY = this.y + this.length

            const grad = ctx.createLinearGradient(this.x, this.y, endX, endY)
            grad.addColorStop(0, `rgba(173, 216, 230, 0)`) // Tail
            grad.addColorStop(1, `rgba(173, 216, 230, ${0.3 + this.z * 0.7})`) // Head

            ctx.strokeStyle = grad
            ctx.lineWidth = this.width
            ctx.lineCap = 'round'

            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(endX, endY)
            ctx.stroke()
        } else if (this.type === 'snow') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
            ctx.lineWidth = 1.5
            ctx.save()
            ctx.translate(this.x, this.y)
            // Rotate snowflake
            this.angle = (this.angle || 0) + 0.01
            ctx.rotate(this.angle)

            // Draw 6 branches
            for (let i = 0; i < 6; i++) {
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.lineTo(0, this.size)
                // Add details
                ctx.moveTo(0, this.size * 0.6)
                ctx.lineTo(this.size * 0.3, this.size * 0.8)
                ctx.moveTo(0, this.size * 0.6)
                ctx.lineTo(-this.size * 0.3, this.size * 0.8)
                ctx.stroke()
                ctx.rotate(Math.PI / 3)
            }
            ctx.restore()
        } else {
            ctx.fillStyle = `rgba(251, 146, 60, ${this.alpha * 0.5})` // Orange tint
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.fill()
        }
    }
}

function initParticles() {
    if (!canvasRef.value) return
    const w = window.innerWidth
    const h = window.innerHeight
    canvasRef.value.width = w
    canvasRef.value.height = h

    particles = []

    // MERGE: Use main branch structure but feat/weather Fog check
    if (settingsStore.weatherEnabled) {
        const type = weatherState.value === 'rain' ? 'rain' :
            weatherState.value === 'snow' ? 'snow' : null

        // Critical: No falling particles for Fog
        if (weatherState.value === 'fog') {
            // Pass
        } else if (type) {
            const intensity = weatherIntensity.value || 0.5
            let count = 50
            if (type === 'rain') count = 50 + intensity * 200
            if (type === 'snow') count = 20 + intensity * 100

            for (let i = 0; i < count; i++) {
                particles.push(new Particle(w, h, type))
            }
        }
    }

    // Ambient Effects
    if (settingsStore.effectsEnabled) {
        if (weatherState.value !== 'rain' && weatherState.value !== 'snow' && weatherState.value !== 'fog') {
            const count = 30
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(w, h, 'dust'))
            }
        }
    }

    // Cloud/Fog Check
    if ((weatherState.value === 'cloudy' || weatherState.value === 'fog') && settingsStore.weatherEnabled) {
        if (clouds.value.length === 0) generateClouds()
    } else {
        if (clouds.value.length > 0) clouds.value = []
    }
}

function updateWeatherSystem() {
    initParticles()
    // Control loop based on settings
    const shouldRun = settingsStore.weatherEnabled || settingsStore.effectsEnabled

    if (shouldRun) {
        if (!animationId) animate()
    } else {
        if (animationId) {
            cancelAnimationFrame(animationId)
            animationId = null
        }
        const ctx = canvasRef.value?.getContext('2d')
        if (ctx && canvasRef.value) ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    }
}

function animate() {
    if (!canvasRef.value) return

    // Double check settings
    if (!settingsStore.weatherEnabled && !settingsStore.effectsEnabled) {
        cancelAnimationFrame(animationId)
        animationId = null
        const ctx = canvasRef.value?.getContext('2d')
        if (ctx) ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
        return
    }

    const ctx = canvasRef.value.getContext('2d')
    const w = canvasRef.value.width
    const h = canvasRef.value.height

    ctx.clearRect(0, 0, w, h)

    particles.forEach(p => {
        p.update(w, h)
        p.draw(ctx)
    })

    animationId = requestAnimationFrame(animate)
}

// Watchers (from main)
watch(
    [() => settingsStore.weatherEnabled, () => settingsStore.effectsEnabled],
    updateWeatherSystem
)

watch([weatherState, weatherIntensity], () => {
    updateWeatherSystem()
})

onMounted(() => {
    updateWeatherSystem()
    window.addEventListener('resize', initParticles)
})

onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', initParticles)
})
</script>

<template>
    <canvas ref="canvasRef" class="fixed inset-0 pointer-events-none z-0 opacity-60"></canvas>

    <div class="relative z-10">
        <!-- Sun Rays (Clear) -->
        <div v-if="weatherState === 'clear' && !isNight && settingsStore.weatherEnabled"
            class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <img src="@/assets/Weather/sun_rays.png" alt="Sun Rays"
                class="absolute -top-[50px] -left-[50px] w-[600px] h-[600px] max-w-none animate-sun-flash opacity-60">
        </div>

        <!-- Clouds/Fog Layer -->
        <div v-if="(weatherState === 'cloudy' || weatherState === 'fog') && settingsStore.weatherEnabled"
            class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div v-for="cloud in clouds" :key="cloud.id" :class="cloud.class" :style="cloud.wrapperStyle">
                <img :src="cloudImg" class="w-full h-auto block" :style="cloud.imgStyle" />
            </div>
        </div>

        <RouterView />
    </div>

    <a href="https://contact.brendanfleurdelys.ch/index.php?origin=beer" class="contact-btn" title="Contact"
        target="_blank">
        💬
    </a>
</template>

<style>
/* Global styles are now in src/assets/main.css */
@keyframes sun-flash {

    0%,
    100% {
        opacity: 0.3;
        transform: scale(1);
    }

    50% {
        opacity: 0.6;
        transform: scale(1.05);
    }
}

.animate-sun-flash {
    animation: sun-flash 8s ease-in-out infinite;
}

@keyframes spin-slow {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-slow-spin {
    animation: spin-slow 60s linear infinite;
}

@keyframes drift {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(120vw);
    }
}

.animate-drift {
    animation-name: drift;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}

@keyframes breathe {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.04;
    }

    50% {
        transform: scale(1.05);
        opacity: 0.06;
    }
}

.animate-breathe {
    animation: breathe 15s ease-in-out infinite;
}
</style>
